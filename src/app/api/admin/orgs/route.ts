import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export interface OrgHealthRow {
  id: string;
  name: string;
  plan_tier: string;
  mrr: number | null;
  contract_start: string | null;
  contract_end: string | null;
  status: string | null;
  created_at: string;
  userCount: number;
  customerCount: number;
  invoiceCount: number;
  totalOutstanding: number;
  overdueCount: number;
  overdueAmount: number;
  emailsSentThisMonth: number;
}

export async function GET(req: NextRequest) {
  // Basic admin guard — only allow from server; caller must pass admin secret
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orgs } = await db.from("organizations").select("id, name, plan_tier, mrr, contract_start, contract_end, created_at").order("created_at", { ascending: false });
  if (!orgs) return NextResponse.json({ orgs: [] });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const results: OrgHealthRow[] = await Promise.all(
    orgs.map(async (org: { id: string; name: string; plan_tier: string; mrr: number | null; contract_start: string | null; contract_end: string | null; created_at: string }) => {
      const [usersRes, customersRes, invoicesRes, commsRes] = await Promise.all([
        db.from("users").select("id", { count: "exact", head: true }).eq("org_id", org.id),
        db.from("customers").select("id", { count: "exact", head: true }).eq("org_id", org.id),
        db.from("invoices").select("amount, days_overdue, status").eq("org_id", org.id).in("status", ["open", "reminded", "overdue"]),
        db.from("communications").select("id", { count: "exact", head: true }).eq("org_id", org.id).gte("sent_at", startOfMonth),
      ]);

      const invoices: Array<{ amount: number; days_overdue: number; status: string }> = invoicesRes.data ?? [];
      const overdue = invoices.filter(i => i.days_overdue > 0);

      return {
        id: org.id,
        name: org.name,
        plan_tier: org.plan_tier,
        mrr: org.mrr,
        contract_start: org.contract_start,
        contract_end: org.contract_end,
        status: null,
        created_at: org.created_at,
        userCount: usersRes.count ?? 0,
        customerCount: customersRes.count ?? 0,
        invoiceCount: invoices.length,
        totalOutstanding: invoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0),
        overdueCount: overdue.length,
        overdueAmount: overdue.reduce((s: number, i: { amount: number }) => s + i.amount, 0),
        emailsSentThisMonth: commsRes.count ?? 0,
      };
    })
  );

  return NextResponse.json({ orgs: results });
}
