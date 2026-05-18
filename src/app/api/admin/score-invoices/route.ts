import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

interface RawInvoice {
  id: string;
  customer_id: string;
  amount: number;
  due_date: string;
  status: string;
}

interface PaidInvoice {
  customer_id: string;
  due_date: string;
  payment_received_date: string;
}

interface ScoreResult {
  orgId: string;
  orgName: string;
  invoicesScored: number;
  statusUpdated: number;
  error?: string;
}

function calcDaysOverdue(dueDateStr: string, today: Date): number {
  const due = new Date(dueDateStr);
  // Zero out time component to compare dates only
  due.setHours(0, 0, 0, 0);
  const todayMidnight = new Date(today);
  todayMidnight.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((todayMidnight.getTime() - due.getTime()) / 86_400_000));
}

function buildCustomerHistoryScores(paidInvoices: PaidInvoice[]): Map<string, number> {
  // Group paid invoices by customer
  const customerDaysLate = new Map<string, number[]>();
  for (const inv of paidInvoices) {
    const due = new Date(inv.due_date);
    const paid = new Date(inv.payment_received_date);
    const daysLate = Math.max(0, Math.floor((paid.getTime() - due.getTime()) / 86_400_000));
    const existing = customerDaysLate.get(inv.customer_id) ?? [];
    existing.push(daysLate);
    customerDaysLate.set(inv.customer_id, existing);
  }

  // Convert to score: 100 - avg_days_late, clamped [0, 100]
  const scores = new Map<string, number>();
  for (const [customerId, lateArr] of customerDaysLate) {
    const avg = lateArr.reduce((s, d) => s + d, 0) / lateArr.length;
    scores.set(customerId, Math.max(0, Math.min(100, 100 - avg)));
  }
  return scores;
}

async function scoreOrg(orgId: string, today: Date): Promise<Omit<ScoreResult, "orgName">> {
  // Fetch all scoreable invoices (not paid / written_off)
  const { data: rawInvoices, error: invErr } = await db
    .from("invoices")
    .select("id, customer_id, amount, due_date, status")
    .eq("org_id", orgId)
    .in("status", ["open", "reminded", "overdue"]);

  if (invErr) throw new Error(invErr.message);
  const invoices: RawInvoice[] = rawInvoices ?? [];
  if (invoices.length === 0) return { orgId, invoicesScored: 0, statusUpdated: 0 };

  // Fetch payment history for all customers in this org
  const { data: paidRaw } = await db
    .from("invoices")
    .select("customer_id, due_date, payment_received_date")
    .eq("org_id", orgId)
    .eq("status", "paid")
    .not("payment_received_date", "is", null);

  const historyScores = buildCustomerHistoryScores(paidRaw ?? []);

  // Max amount across all scoreable invoices for normalization
  const maxAmount = Math.max(...invoices.map(i => i.amount), 1);

  // Build upsert payload
  let statusUpdated = 0;
  const upsertRows = invoices.map(inv => {
    const daysOverdue = calcDaysOverdue(inv.due_date, today);

    // Escalate 'open' → 'overdue' when past due; don't de-escalate reminded/overdue
    let newStatus = inv.status;
    if (inv.status === "open" && daysOverdue > 0) {
      newStatus = "overdue";
      statusUpdated++;
    }

    // Score components (each 0–100)
    const normalizedAmount = (inv.amount / maxAmount) * 100;
    const daysNormalized = (Math.min(daysOverdue, 90) / 90) * 100;
    const historyScore = historyScores.get(inv.customer_id) ?? 50; // default 50 if no history

    const score =
      normalizedAmount * 0.4 +
      daysNormalized   * 0.3 +
      historyScore     * 0.3;

    return {
      id: inv.id,
      days_overdue: daysOverdue,
      status: newStatus,
      priority_score: Math.round(score * 100) / 100,
    };
  });

  // Single batch upsert — much faster than N individual updates
  const { error: upsertErr } = await db.from("invoices").upsert(upsertRows);
  if (upsertErr) throw new Error(upsertErr.message);

  return { orgId, invoicesScored: upsertRows.length, statusUpdated };
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const orgIdOverride: string | undefined = body.orgId;

  // Fetch orgs to score
  let query = db.from("organizations").select("id, name");
  if (orgIdOverride) {
    query = query.eq("id", orgIdOverride);
  } else {
    query = query.eq("status", "active");
  }
  const { data: orgs } = await query;

  if (!orgs?.length) {
    return NextResponse.json({ scored: 0, message: "No orgs found" });
  }

  const today = new Date();
  const results: ScoreResult[] = [];

  for (const org of orgs) {
    try {
      const result = await scoreOrg(org.id, today);
      results.push({ ...result, orgName: org.name });
    } catch (e) {
      results.push({
        orgId: org.id,
        orgName: org.name,
        invoicesScored: 0,
        statusUpdated: 0,
        error: (e as Error).message,
      });
    }
  }

  const totalScored = results.reduce((s, r) => s + r.invoicesScored, 0);
  const totalStatusUpdated = results.reduce((s, r) => s + r.statusUpdated, 0);

  return NextResponse.json({
    ranAt: today.toISOString(),
    orgsProcessed: results.length,
    invoicesScored: totalScored,
    statusUpdated: totalStatusUpdated,
    results,
  });
}
