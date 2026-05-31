import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { createClient } from "@supabase/supabase-js";
import { CFOReport, ReportData } from "@/lib/pdf-report";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function POST(req: NextRequest) {
  try {
    let body: { orgId?: string };
    try { body = await req.json(); } catch { return NextResponse.json({ error: "orgId required" }, { status: 400 }); }
    const { orgId } = body;
    if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];

    const [orgRes, settingsRes, openInvRes, paymentsThisRes, paymentsLastRes, custCountRes, overdueInvRes, recentPayRes] = await Promise.all([
      db.from("organizations").select("name").eq("id", orgId).single(),
      db.from("org_settings").select("currency").eq("org_id", orgId).single(),
      db.from("invoices").select("amount, days_overdue, status").eq("org_id", orgId).in("status", ["open", "reminded", "overdue"]),
      db.from("payments").select("amount").eq("org_id", orgId).gte("payment_date", startOfMonth),
      db.from("payments").select("amount").eq("org_id", orgId).gte("payment_date", startOfLastMonth).lte("payment_date", endOfLastMonth),
      db.from("customers").select("id", { count: "exact", head: true }).eq("org_id", orgId),
      db.from("invoices").select("customer_id, amount, days_overdue, customers(name, segment)").eq("org_id", orgId).gt("days_overdue", 0).in("status", ["open", "reminded", "overdue"]),
      db.from("payments").select("amount, payment_date, invoices(customers(name))").eq("org_id", orgId).gte("payment_date", startOfMonth).order("payment_date", { ascending: false }).limit(5),
    ]);

    const openInvoices: Array<{ amount: number; days_overdue: number }> = openInvRes.data ?? [];
    const totalOutstanding = openInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
    const collectedThisMonth = (paymentsThisRes.data ?? []).reduce((s: number, p: { amount: number }) => s + p.amount, 0);
    const collectedLastMonth = (paymentsLastRes.data ?? []).reduce((s: number, p: { amount: number }) => s + p.amount, 0);
    const overdueInvoices = openInvoices.filter((i: { days_overdue: number }) => i.days_overdue > 0);
    const overdueAmount = overdueInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
    const dso = openInvoices.length > 0
      ? Math.round(openInvoices.reduce((s: number, i: { days_overdue: number }) => s + i.days_overdue, 0) / openInvoices.length)
      : 0;

    const bucketDefs = [
      { label: "Current",    min: -Infinity, max: 0,        color: "#22c55e" },
      { label: "1-30 days",  min: 1,         max: 30,       color: "#facc15" },
      { label: "31-60 days", min: 31,        max: 60,       color: "#f97316" },
      { label: "61-90 days", min: 61,        max: 90,       color: "#ef4444" },
      { label: "90+ days",   min: 91,        max: Infinity,  color: "#991b1b" },
    ];
    const agingBuckets = bucketDefs.map(b => {
      const matching = openInvoices.filter((i: { days_overdue: number }) => i.days_overdue >= b.min && i.days_overdue <= b.max);
      return { label: b.label, amount: matching.reduce((s: number, i: { amount: number }) => s + i.amount, 0), count: matching.length, color: b.color };
    });

    // Top overdue customers
    const overdueMap = new Map<string, { name: string; totalOwed: number; maxDaysOverdue: number; invoiceCount: number; segment: string }>();
    for (const row of overdueInvRes.data ?? []) {
      const cust = row.customers;
      if (!cust) continue;
      const e = overdueMap.get(row.customer_id) ?? { name: cust.name, totalOwed: 0, maxDaysOverdue: 0, invoiceCount: 0, segment: cust.segment ?? "standard" };
      e.totalOwed += row.amount;
      e.invoiceCount++;
      e.maxDaysOverdue = Math.max(e.maxDaysOverdue, row.days_overdue);
      overdueMap.set(row.customer_id, e);
    }
    const topOverdue = Array.from(overdueMap.values()).sort((a, b) => b.totalOwed - a.totalOwed).slice(0, 8);

    // Recent collected
    const recentCollected = (recentPayRes.data ?? []).map((p: { amount: number; payment_date: string; invoices?: { customers?: { name: string } } }) => ({
      customerName: p.invoices?.customers?.name ?? "Unknown",
      amount: p.amount,
      date: p.payment_date,
    }));

    const reportData: ReportData = {
      orgName: orgRes.data?.name ?? "Your Company",
      generatedAt: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      totalOutstanding,
      dso,
      collectedThisMonth,
      collectedLastMonth,
      overdueCount: overdueInvoices.length,
      overdueAmount,
      customerCount: custCountRes.count ?? 0,
      agingBuckets,
      topOverdue,
      recentCollected,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(createElement(CFOReport, { data: reportData }) as any);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="AR-Report-${now.toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch (err) {
    console.error("cfo-pdf error:", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
