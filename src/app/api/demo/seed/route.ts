import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;

const CUSTOMERS = [
  { name: "Sunrise Foods Pvt Ltd",       email: "accounts@sunrisefoods.in",      segment: "strategic", payment_terms: 30 },
  { name: "Global Trade Solutions",       email: "finance@globaltradesolutions.com", segment: "standard", payment_terms: 45 },
  { name: "Apex Industries Ltd",          email: "ar@apexindustries.in",          segment: "at_risk",   payment_terms: 30 },
  { name: "TechBridge Solutions",         email: "billing@techbridge.io",         segment: "standard",  payment_terms: 60 },
  { name: "Emerald Exports Pvt Ltd",      email: "accounts@emeraldexports.in",    segment: "strategic", payment_terms: 30 },
  { name: "Pinnacle Manufacturing",       email: "finance@pinnaclemfg.in",        segment: "at_risk",   payment_terms: 45 },
  { name: "BlueSky Logistics",            email: "ar@bluesky.in",                segment: "standard",  payment_terms: 30 },
  { name: "Metro Services Pvt Ltd",       email: "accounts@metroservices.in",     segment: "standard",  payment_terms: 30 },
  { name: "Horizon Pharma Ltd",           email: "billing@horizonpharma.in",      segment: "strategic", payment_terms: 60 },
  { name: "Delta Engineering Works",      email: "accounts@deltaeng.in",          segment: "standard",  payment_terms: 30 },
  { name: "Royal Constructions Pvt Ltd",  email: "finance@royalconstructions.in", segment: "at_risk",   payment_terms: 45 },
  { name: "Zenith Technologies",          email: "billing@zenithtech.in",         segment: "standard",  payment_terms: 30 },
  { name: "Pacific Traders",             email: "accounts@pacifictraders.in",    segment: "standard",  payment_terms: 45 },
  { name: "Acme Corporation",             email: "finance@acmecorp.com",          segment: "standard",  payment_terms: 30 },
  { name: "Silver Oak Media Pvt Ltd",     email: "ar@silveroakmedia.com",         segment: "standard",  payment_terms: 30 },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function round(n: number, nearest = 1000) {
  return Math.round(n / nearest) * nearest;
}

export async function POST(req: NextRequest) {
  const { orgId } = await req.json() as { orgId: string };
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  // Guard: don't seed if org already has invoices
  const { count } = await db.from("invoices").select("id", { count: "exact" }).eq("org_id", orgId).limit(1);
  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: "This organisation already has invoice data." }, { status: 409 });
  }

  // ── Insert customers ──────────────────────────────────────────────────────
  const { data: customers, error: custErr } = await db.from("customers").insert(
    CUSTOMERS.map(c => ({ ...c, org_id: orgId }))
  ).select("id, name, segment");

  if (custErr) return NextResponse.json({ error: custErr.message }, { status: 500 });

  // ── Build invoice batches ─────────────────────────────────────────────────
  const invoices: object[] = [];
  let invNum = 1;

  function inv(customerId: string, amount: number, dueDaysAgo: number, status: string, currency = "USD") {
    const dueDate = daysAgo(dueDaysAgo);
    const daysOverdue = Math.max(0, dueDaysAgo);
    invoices.push({
      org_id: orgId,
      customer_id: customerId,
      invoice_number: `INV-${String(invNum++).padStart(3, "0")}`,
      amount,
      currency,
      due_date: dueDate,
      days_overdue: status === "paid" ? 0 : daysOverdue,
      status,
    });
  }

  const c = customers as { id: string; name: string; segment: string }[];

  // Sunrise Foods (strategic) — large overdue
  inv(c[0].id, 458550, 12,  "overdue");
  inv(c[0].id, 125000, 45,  "reminded");
  inv(c[0].id, 220000, 0,   "open");
  inv(c[0].id, 89000,  90,  "reminded");

  // Global Trade Solutions — mixed
  inv(c[1].id, round(randInt(15,  80) * 1000), 8,  "overdue");
  inv(c[1].id, round(randInt(10,  40) * 1000), 35, "reminded");
  inv(c[1].id, round(randInt(5,   20) * 1000), 0,  "open");
  inv(c[1].id, round(randInt(20,  60) * 1000), 65, "overdue");

  // Apex Industries (at_risk) — long overdue
  inv(c[2].id, round(randInt(30,  80) * 1000), 110, "reminded");
  inv(c[2].id, round(randInt(15,  50) * 1000), 45,  "overdue");
  inv(c[2].id, round(randInt(5,   25) * 1000), 35,  "overdue");
  inv(c[2].id, round(randInt(40, 100) * 1000), 0,   "open");
  inv(c[2].id, round(randInt(10,  30) * 1000), 75,  "overdue");
  inv(c[2].id, round(randInt(20,  50) * 1000), 150, "reminded");

  // TechBridge — mostly current/open + some paid
  inv(c[3].id, round(randInt(8,   30) * 1000), 0,  "open");
  inv(c[3].id, round(randInt(5,   20) * 1000), 0,  "open");
  inv(c[3].id, round(randInt(10,  25) * 1000), 25, "paid");
  inv(c[3].id, round(randInt(5,   15) * 1000), 55, "paid");

  // Emerald Exports (strategic, INR) — large amounts
  inv(c[4].id, round(randInt(200, 500) * 1000), 10, "overdue",  "INR");
  inv(c[4].id, round(randInt(100, 300) * 1000), 0,  "open",    "INR");
  inv(c[4].id, round(randInt(50,  150) * 1000), 70, "reminded", "INR");
  inv(c[4].id, round(randInt(300, 800) * 1000), 30, "overdue",  "INR");

  // Pinnacle Manufacturing (at_risk, INR)
  inv(c[5].id, round(randInt(100, 400) * 1000), 65,  "overdue",  "INR");
  inv(c[5].id, round(randInt(50,  200) * 1000), 30,  "overdue",  "INR");
  inv(c[5].id, round(randInt(20,   80) * 1000), 95,  "reminded", "INR");
  inv(c[5].id, round(randInt(80,  300) * 1000), 0,   "open",    "INR");

  // BlueSky Logistics — standard mix
  inv(c[6].id, round(randInt(10,  50) * 1000), 12, "overdue");
  inv(c[6].id, round(randInt(5,   20) * 1000), 0,  "open");
  inv(c[6].id, round(randInt(8,   25) * 1000), 40, "reminded");
  inv(c[6].id, round(randInt(15,  40) * 1000), 20, "paid");

  // Metro Services
  inv(c[7].id, round(randInt(5,   30) * 1000), 65, "overdue");
  inv(c[7].id, round(randInt(10,  40) * 1000), 70, "overdue");
  inv(c[7].id, round(randInt(5,   15) * 1000), 0,  "open");
  inv(c[7].id, round(randInt(20,  50) * 1000), 30, "paid");
  inv(c[7].id, round(randInt(10,  25) * 1000), 45, "paid");

  // Horizon Pharma (strategic) — clean payer
  inv(c[8].id, round(randInt(50, 200) * 1000), 5,  "overdue");
  inv(c[8].id, round(randInt(30, 100) * 1000), 0,  "open");
  inv(c[8].id, round(randInt(80, 250) * 1000), 20, "paid");
  inv(c[8].id, round(randInt(40, 120) * 1000), 50, "paid");

  // Delta Engineering
  inv(c[9].id, round(randInt(20,  60) * 1000), 18, "overdue");
  inv(c[9].id, round(randInt(10,  35) * 1000), 0,  "open");
  inv(c[9].id, round(randInt(5,   20) * 1000), 55, "reminded");

  // Royal Constructions (at_risk)
  inv(c[10].id, round(randInt(50, 200) * 1000), 120, "reminded");
  inv(c[10].id, round(randInt(30, 100) * 1000), 90,  "reminded");
  inv(c[10].id, round(randInt(20,  60) * 1000), 0,   "open");

  // Zenith Technologies
  inv(c[11].id, round(randInt(8,   30) * 1000), 10, "overdue");
  inv(c[11].id, round(randInt(5,   20) * 1000), 0,  "open");
  inv(c[11].id, round(randInt(10,  25) * 1000), 30, "paid");

  // Pacific Traders
  inv(c[12].id, round(randInt(15,  50) * 1000), 22, "overdue");
  inv(c[12].id, round(randInt(5,   20) * 1000), 0,  "open");
  inv(c[12].id, round(randInt(8,   25) * 1000), 35, "reminded");

  // Acme Corporation
  inv(c[13].id, round(randInt(20,  80) * 1000), 50, "overdue");
  inv(c[13].id, round(randInt(10,  30) * 1000), 0,  "open");
  inv(c[13].id, round(randInt(30,  90) * 1000), 15, "paid");

  // Silver Oak Media
  inv(c[14].id, round(randInt(5,   20) * 1000), 8,  "overdue");
  inv(c[14].id, round(randInt(3,   10) * 1000), 0,  "open");
  inv(c[14].id, round(randInt(8,   25) * 1000), 25, "paid");

  const { error: invErr } = await db.from("invoices").insert(invoices);
  if (invErr) return NextResponse.json({ error: invErr.message }, { status: 500 });

  // ── Seed 3 disputes on the most overdue invoices ──────────────────────────
  const { data: overdueInvs } = await db.from("invoices")
    .select("id, customer_id, invoice_number")
    .eq("org_id", orgId).eq("status", "reminded")
    .order("days_overdue", { ascending: false }).limit(3);

  if (overdueInvs?.length) {
    const REASONS = ["incorrect_amount", "goods_not_received", "already_paid"];
    const disputes = overdueInvs.map((inv: { id: string; customer_id: string }, i: number) => ({
      org_id: orgId,
      invoice_id: inv.id,
      customer_id: inv.customer_id,
      reason: REASONS[i] ?? "other",
      description: "Raised via demo data seed.",
      status: "open",
    }));
    await db.from("disputes").insert(disputes);
    await db.from("invoices").update({ status: "disputed" })
      .in("id", overdueInvs.map((i: { id: string }) => i.id));
  }

  // ── Seed some past communications ─────────────────────────────────────────
  const { data: remindedInvs } = await db.from("invoices")
    .select("id, customer_id").eq("org_id", orgId).eq("status", "reminded").limit(8);

  if (remindedInvs?.length) {
    const comms = remindedInvs.map((inv: { id: string; customer_id: string }, i: number) => ({
      org_id: orgId,
      customer_id: inv.customer_id,
      invoice_id: inv.id,
      type: "email",
      subject: `Payment reminder — Invoice outstanding`,
      content: "This is a demo communication record.",
      status: "sent",
      direction: "outbound",
      sent_by_ai: true,
      approved_by: "auto",
      sent_at: new Date(Date.now() - (i + 2) * 86_400_000 * 3).toISOString(),
    }));
    await db.from("communications").insert(comms);
  }

  // ── Update org_settings with sample email signature ───────────────────────
  await db.from("org_settings").upsert({
    org_id: orgId,
    email_signature: "Best regards,\nAccounts Receivable Team",
    currency: "USD",
    dunning_l1_days: 1,
    dunning_l2_days: 10,
    dunning_l3_days: 30,
    dunning_cooldown_days: 3,
  }, { onConflict: "org_id" });

  return NextResponse.json({
    ok: true,
    customers: customers.length,
    invoices: invoices.length,
    message: `Seeded ${customers.length} customers and ${invoices.length} invoices.`,
  });
}
