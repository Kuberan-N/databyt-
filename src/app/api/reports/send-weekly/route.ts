import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { CFOReport, ReportData } from "@/lib/pdf-report";
import { withRetry } from "@/lib/retry";
import { logFailedJob } from "@/lib/failed-jobs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;
const resend = new Resend(process.env.RESEND_API_KEY);

async function buildReportData(orgId: string, orgName: string): Promise<ReportData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];

  const [openInvRes, paymentsThisRes, paymentsLastRes, custCountRes, overdueInvRes, recentPayRes] = await Promise.all([
    db.from("invoices").select("amount, days_overdue, status").eq("org_id", orgId).in("status", ["open", "reminded", "overdue"]),
    db.from("payments").select("amount").eq("org_id", orgId).gte("payment_date", startOfMonth),
    db.from("payments").select("amount").eq("org_id", orgId).gte("payment_date", startOfLastMonth).lte("payment_date", endOfLastMonth),
    db.from("customers").select("id", { count: "exact", head: true }).eq("org_id", orgId),
    db.from("invoices").select("customer_id, amount, days_overdue, customers(name, segment)").eq("org_id", orgId).gt("days_overdue", 0).in("status", ["open", "reminded", "overdue"]),
    db.from("payments").select("amount, payment_date, invoices(customers(name))").eq("org_id", orgId).gte("payment_date", startOfMonth).order("payment_date", { ascending: false }).limit(5),
  ]);

  const openInvoices: Array<{ amount: number; days_overdue: number }> = openInvRes.data ?? [];
  const collectedThisMonth = (paymentsThisRes.data ?? []).reduce((s: number, p: { amount: number }) => s + p.amount, 0);
  const collectedLastMonth = (paymentsLastRes.data ?? []).reduce((s: number, p: { amount: number }) => s + p.amount, 0);
  const overdueInvoices = openInvoices.filter((i) => i.days_overdue > 0);

  const bucketDefs = [
    { label: "Current",    min: -Infinity, max: 0,        color: "#22c55e" },
    { label: "1–30 days",  min: 1,         max: 30,       color: "#facc15" },
    { label: "31–60 days", min: 31,        max: 60,       color: "#f97316" },
    { label: "61–90 days", min: 61,        max: 90,       color: "#ef4444" },
    { label: "90+ days",   min: 91,        max: Infinity,  color: "#991b1b" },
  ];
  const agingBuckets = bucketDefs.map(b => {
    const matching = openInvoices.filter((i) => i.days_overdue >= b.min && i.days_overdue <= b.max);
    return { label: b.label, amount: matching.reduce((s, i) => s + i.amount, 0), count: matching.length, color: b.color };
  });

  const overdueMap = new Map<string, { name: string; totalOwed: number; maxDaysOverdue: number; invoiceCount: number; segment: string }>();
  for (const row of overdueInvRes.data ?? []) {
    const cust = row.customers;
    if (!cust) continue;
    const e = overdueMap.get(row.customer_id) ?? { name: cust.name, totalOwed: 0, maxDaysOverdue: 0, invoiceCount: 0, segment: cust.segment ?? "standard" };
    e.totalOwed += row.amount; e.invoiceCount++;
    e.maxDaysOverdue = Math.max(e.maxDaysOverdue, row.days_overdue);
    overdueMap.set(row.customer_id, e);
  }

  return {
    orgName,
    generatedAt: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    totalOutstanding: openInvoices.reduce((s, i) => s + i.amount, 0),
    dso: openInvoices.length > 0 ? Math.round(openInvoices.reduce((s, i) => s + i.days_overdue, 0) / openInvoices.length) : 0,
    collectedThisMonth,
    collectedLastMonth,
    overdueCount: overdueInvoices.length,
    overdueAmount: overdueInvoices.reduce((s, i) => s + i.amount, 0),
    customerCount: custCountRes.count ?? 0,
    agingBuckets,
    topOverdue: Array.from(overdueMap.values()).sort((a, b) => b.totalOwed - a.totalOwed).slice(0, 8),
    recentCollected: (recentPayRes.data ?? []).map((p: { amount: number; payment_date: string; invoices?: { customers?: { name: string } } }) => ({
      customerName: p.invoices?.customers?.name ?? "Unknown",
      amount: p.amount,
      date: p.payment_date,
    })),
  };
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const orgIdOverride: string | undefined = body.orgId;

  const { data: orgs } = await db
    .from("organizations")
    .select("id, name")
    .eq(orgIdOverride ? "id" : "status", orgIdOverride ?? "active");

  if (!orgs?.length) {
    return NextResponse.json({ sent: 0, message: "No active orgs found" });
  }

  const results: Array<{ orgId: string; orgName: string; sentTo: string | null; error?: string }> = [];
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "collections@databyt.io";
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  for (const org of orgs) {
    try {
      const { data: userRow } = await db
        .from("users")
        .select("email")
        .eq("org_id", org.id)
        .eq("role", "admin")
        .order("created_at")
        .limit(1)
        .single();

      const toEmail: string | null = userRow?.email ?? null;
      if (!toEmail) {
        results.push({ orgId: org.id, orgName: org.name, sentTo: null, error: "No admin user found" });
        continue;
      }

      const reportData = await buildReportData(org.id, org.name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buffer = await renderToBuffer(createElement(CFOReport, { data: reportData }) as any);

      await withRetry(() =>
        resend.emails.send({
          from: `DataByt Reports <${fromEmail}>`,
          to: [toEmail],
          subject: `Your Weekly AR Report — ${dateStr}`,
          html: `
            <p>Hi,</p>
            <p>Your weekly accounts receivable report is attached. Here's the summary:</p>
            <ul>
              <li><strong>Total AR Outstanding:</strong> $${reportData.totalOutstanding.toLocaleString()}</li>
              <li><strong>Collected This Month:</strong> $${reportData.collectedThisMonth.toLocaleString()}</li>
              <li><strong>Overdue Invoices:</strong> ${reportData.overdueCount} ($${reportData.overdueAmount.toLocaleString()})</li>
              <li><strong>DSO:</strong> ${reportData.dso} days</li>
            </ul>
            <p>Your DataByt operator is actively working on collections. Full details are in the attached PDF.</p>
            <p>— DataByt Collections Team</p>
          `,
          attachments: [{
            filename: `AR-Report-${now.toISOString().split("T")[0]}.pdf`,
            content: Buffer.from(buffer),
          }],
        })
      );

      results.push({ orgId: org.id, orgName: org.name, sentTo: toEmail });
    } catch (e) {
      const msg = (e as Error).message;
      console.error(`send-weekly: failed for org ${org.name}:`, msg);
      await logFailedJob({ orgId: org.id, jobType: "weekly_report", payload: { orgName: org.name }, error: msg });
      results.push({ orgId: org.id, orgName: org.name, sentTo: null, error: msg });
    }
  }

  const sent = results.filter(r => !r.error).length;
  return NextResponse.json({ sent, total: orgs.length, results });
}
