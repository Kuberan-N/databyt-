import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

interface ClassifyResult {
  orgId: string;
  orgName: string;
  strategic: number;
  at_risk: number;
  standard: number;
  error?: string;
}

async function classifyOrg(orgId: string): Promise<Omit<ClassifyResult, "orgId" | "orgName">> {
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixMonthsAgoStr = sixMonthsAgo.toISOString().split("T")[0];

  // Total revenue per customer (sum of all invoice amounts)
  const { data: invoiceTotals } = await db
    .from("invoices")
    .select("customer_id, amount")
    .eq("org_id", orgId);

  const revenueMap = new Map<string, number>();
  for (const inv of invoiceTotals ?? []) {
    revenueMap.set(inv.customer_id, (revenueMap.get(inv.customer_id) ?? 0) + inv.amount);
  }

  if (revenueMap.size === 0) return { strategic: 0, at_risk: 0, standard: 0 };

  // at_risk: 2+ late invoices in last 6 months
  const { data: lateHistory } = await db
    .from("invoices")
    .select("customer_id")
    .eq("org_id", orgId)
    .in("status", ["overdue", "reminded"])
    .gte("due_date", sixMonthsAgoStr);

  const lateCount = new Map<string, number>();
  for (const inv of lateHistory ?? []) {
    lateCount.set(inv.customer_id, (lateCount.get(inv.customer_id) ?? 0) + 1);
  }
  const atRiskIds = new Set(
    [...lateCount.entries()].filter(([, c]) => c >= 2).map(([id]) => id)
  );

  // strategic: top 20% by total revenue
  const sorted = [...revenueMap.entries()].sort((a, b) => b[1] - a[1]);
  const topN = Math.max(1, Math.ceil(sorted.length * 0.2));
  const strategicIds = new Set(sorted.slice(0, topN).map(([id]) => id));

  let strategic = 0, at_risk = 0, standard = 0;

  // Batch upsert by segment group (3 updates instead of N)
  const strategicList = [...strategicIds].filter(id => !atRiskIds.has(id));
  const atRiskList = [...atRiskIds];
  const standardList = sorted.slice(topN).map(([id]) => id).filter(id => !atRiskIds.has(id));

  if (strategicList.length) {
    await db.from("customers").update({ segment: "strategic" }).eq("org_id", orgId).in("id", strategicList);
    strategic = strategicList.length;
  }
  if (atRiskList.length) {
    await db.from("customers").update({ segment: "at_risk" }).eq("org_id", orgId).in("id", atRiskList);
    at_risk = atRiskList.length;
  }
  if (standardList.length) {
    await db.from("customers").update({ segment: "standard" }).eq("org_id", orgId).in("id", standardList);
    standard = standardList.length;
  }

  return { strategic, at_risk, standard };
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const orgIdOverride: string | undefined = body.orgId;

  let query = db.from("organizations").select("id, name");
  if (orgIdOverride) {
    query = query.eq("id", orgIdOverride);
  } else {
    query = query.eq("status", "active");
  }
  const { data: orgs } = await query;

  if (!orgs?.length) {
    return NextResponse.json({ classified: 0, message: "No orgs found" });
  }

  const results: ClassifyResult[] = [];
  for (const org of orgs) {
    try {
      const r = await classifyOrg(org.id);
      results.push({ orgId: org.id, orgName: org.name, ...r });
    } catch (e) {
      results.push({ orgId: org.id, orgName: org.name, strategic: 0, at_risk: 0, standard: 0, error: (e as Error).message });
    }
  }

  const total = results.reduce((s, r) => s + r.strategic + r.at_risk + r.standard, 0);
  return NextResponse.json({ classified: total, orgsProcessed: results.length, results });
}
