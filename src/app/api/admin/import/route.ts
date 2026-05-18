import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export interface ImportRow {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  invoiceNumber: string;
  amount: number;
  issueDate: string;
  dueDate: string;
}

export interface ImportResult {
  imported: number;
  customersCreated: number;
  segmentsUpdated: number;
  errors: string[];
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId, rows }: { orgId: string; rows: ImportRow[] } = await req.json();
  if (!orgId || !rows?.length) {
    return NextResponse.json({ error: "orgId and rows required" }, { status: 400 });
  }

  const result: ImportResult = { imported: 0, customersCreated: 0, segmentsUpdated: 0, errors: [] };

  // Fetch existing customers for this org (avoid duplicates)
  const { data: existing } = await db
    .from("customers")
    .select("id, name")
    .eq("org_id", orgId);

  const customerMap = new Map<string, string>(
    (existing ?? []).map((c: { id: string; name: string }) => [c.name.toLowerCase().trim(), c.id])
  );

  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixMonthsAgoStr = sixMonthsAgo.toISOString().split("T")[0];

  // Track total revenue per customer in this batch (for strategic classification)
  const customerRevenue = new Map<string, number>();

  for (const row of rows) {
    try {
      const nameKey = row.customerName.toLowerCase().trim();
      let customerId = customerMap.get(nameKey);

      if (!customerId) {
        const { data: newCust, error: custErr } = await db
          .from("customers")
          .insert({
            org_id: orgId,
            name: row.customerName.trim(),
            email: row.customerEmail?.trim() || null,
            phone: row.customerPhone?.trim() || null,
            payment_terms: 30,
            segment: "standard",
          })
          .select("id")
          .single();

        if (custErr) throw new Error(`Customer create failed for ${row.customerName}: ${custErr.message}`);
        customerId = newCust.id;
        customerMap.set(nameKey, customerId!);
        result.customersCreated++;
      }

      const dueDate = new Date(row.dueDate);
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / 86_400_000));
      const status = daysOverdue > 0 ? "overdue" : "open";

      const { error: invErr } = await db
        .from("invoices")
        .insert({
          org_id: orgId,
          customer_id: customerId,
          invoice_number: row.invoiceNumber.trim(),
          amount: row.amount,
          currency: "USD",
          issue_date: row.issueDate,
          due_date: row.dueDate,
          status,
          days_overdue: daysOverdue,
          priority_score: daysOverdue * row.amount / 1000,
        });

      if (invErr) throw new Error(`Invoice ${row.invoiceNumber}: ${invErr.message}`);
      result.imported++;

      // Accumulate revenue per customer for strategic classification
      customerRevenue.set(customerId!, (customerRevenue.get(customerId!) ?? 0) + row.amount);
    } catch (e) {
      result.errors.push((e as Error).message);
    }
  }

  // Classify customer segments after all rows are processed
  try {
    const customerIds = [...customerRevenue.keys()];

    // at_risk: 2+ overdue/reminded invoices in last 6 months
    const { data: lateHistory } = await db
      .from("invoices")
      .select("customer_id")
      .eq("org_id", orgId)
      .in("customer_id", customerIds)
      .in("status", ["overdue", "reminded"])
      .gte("due_date", sixMonthsAgoStr);

    const lateCount = new Map<string, number>();
    for (const inv of lateHistory ?? []) {
      lateCount.set(inv.customer_id, (lateCount.get(inv.customer_id) ?? 0) + 1);
    }
    const atRiskIds = new Set(
      [...lateCount.entries()].filter(([, c]) => c >= 2).map(([id]) => id)
    );

    // strategic: top 20% by total revenue in this batch
    const sorted = [...customerRevenue.entries()].sort((a, b) => b[1] - a[1]);
    const topN = Math.max(1, Math.ceil(sorted.length * 0.2));
    const strategicIds = new Set(sorted.slice(0, topN).map(([id]) => id));

    for (const custId of customerIds) {
      const segment = atRiskIds.has(custId) ? "at_risk"
        : strategicIds.has(custId) ? "strategic"
        : "standard";
      await db.from("customers").update({ segment }).eq("id", custId).eq("org_id", orgId);
      result.segmentsUpdated++;
    }
  } catch (e) {
    result.errors.push(`Segment classification failed: ${(e as Error).message}`);
  }

  return NextResponse.json(result);
}
