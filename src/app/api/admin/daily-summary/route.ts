import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!adminEmail) return NextResponse.json({ error: "NEXT_PUBLIC_ADMIN_EMAIL not set" }, { status: 500 });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "collections@databyt.io";

  // Parallel fetch of daily stats
  const [orgsRes, emailsTodayRes, overdueRes, failedJobsTodayRes] = await Promise.all([
    db.from("organizations").select("id", { count: "exact", head: true }).eq("status", "active"),
    db.from("communications").select("id", { count: "exact", head: true })
      .eq("direction", "outbound").gte("sent_at", todayStart),
    db.from("invoices").select("amount").in("status", ["overdue", "reminded"]),
    db.from("failed_jobs").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
  ]);

  const activeOrgs = orgsRes.count ?? 0;
  const emailsSentToday = emailsTodayRes.count ?? 0;
  const totalOverdueAR = (overdueRes.data ?? []).reduce((s: number, i: { amount: number }) => s + i.amount, 0);
  const failedJobsToday = failedJobsTodayRes.count ?? 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const html = `
<div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#1a1a2e">
  <h2 style="color:#6366f1;margin-bottom:4px">DataByt Daily Summary</h2>
  <p style="color:#6b7280;margin-top:0">${dateStr}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:8px 0;color:#374151;font-weight:600">Active Client Orgs</td><td style="padding:8px 0;text-align:right">${activeOrgs}</td></tr>
    <tr style="background:#f9fafb"><td style="padding:8px 4px;color:#374151;font-weight:600">Emails Sent Today</td><td style="padding:8px 4px;text-align:right">${emailsSentToday}</td></tr>
    <tr><td style="padding:8px 0;color:#374151;font-weight:600">Total Overdue AR</td><td style="padding:8px 0;text-align:right;color:#ef4444;font-weight:700">${fmt(totalOverdueAR)}</td></tr>
    <tr style="background:#f9fafb"><td style="padding:8px 4px;color:#374151;font-weight:600">Failed Jobs Today</td><td style="padding:8px 4px;text-align:right;color:${failedJobsToday > 0 ? "#ef4444" : "#22c55e"}">${failedJobsToday}</td></tr>
  </table>
  ${failedJobsToday > 0 ? `<p style="color:#ef4444;font-size:14px">⚠️ ${failedJobsToday} job${failedJobsToday !== 1 ? "s" : ""} failed today. Check /admin for details.</p>` : ""}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
  <p style="color:#9ca3af;font-size:12px">DataByt Collections · Automated daily digest</p>
</div>`;

  const { error } = await resend.emails.send({
    from: `DataByt <${fromEmail}>`,
    to: [adminEmail],
    subject: `DataByt Daily: ${emailsSentToday} emails sent · ${fmt(totalOverdueAR)} AR overdue`,
    html,
  });

  if (error) {
    console.error("daily-summary send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sent: true, to: adminEmail, stats: { activeOrgs, emailsSentToday, totalOverdueAR, failedJobsToday } });
}
