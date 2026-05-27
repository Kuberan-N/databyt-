import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export interface CEIData {
  cei: number;           // Collections Effectiveness Index (0–100)
  collected: number;     // Amount collected in period
  collectible: number;   // Amount that was collectible (beginning AR + new sales - ending current)
  trend: "up" | "down" | "flat";
  prevCei: number;
}

export interface DSOTrend {
  week: string;          // "May W1", "May W2" etc.
  dso: number;
}

export interface EmailEffectiveness {
  totalSent: number;
  opened: number;
  clicked: number;
  bounced: number;
  openRate: number;       // percentage
  responseRate: number;   // percentage — opened or clicked
  paymentConversionRate: number; // % of dunned invoices that got paid
}

export interface CollectionVelocity {
  avgDaysToPayAfterReminder: number;
  medianDaysToPayAfterReminder: number;
  fastestPaymentDays: number;
  slowestPaymentDays: number;
}

export interface MonthlyCollections {
  month: string;
  collected: number;
  invoices_paid: number;
}

export interface AnalyticsData {
  cei: CEIData;
  emailEffectiveness: EmailEffectiveness;
  velocity: CollectionVelocity;
  monthlyTrend: MonthlyCollections[];
  totalWrittenOff: number;
  badDebtRate: number;
  activeDisputes: number;
  resolvedDisputes: number;
}

export interface CashFlowBucket {
  label: string;
  daysRange: string;
  expectedAmount: number;
  invoiceCount: number;
}

export interface CashFlowForecast {
  buckets: CashFlowBucket[];
  totalExpected: number;
}

export async function fetchCashFlowForecast(orgId: string): Promise<CashFlowForecast> {
  const { data } = await db
    .from("invoices")
    .select("id, amount, days_overdue")
    .eq("org_id", orgId)
    .in("status", ["open", "overdue", "reminded"])
    .gt("days_overdue", 0);

  const items: Array<{ id: string; amount: number; days_overdue: number }> = data ?? [];

  const buckets = [
    { label: "0 – 30 days", daysRange: "0–30", min: 0, max: 30, expectedAmount: 0, invoiceCount: 0 },
    { label: "31 – 60 days", daysRange: "31–60", min: 31, max: 60, expectedAmount: 0, invoiceCount: 0 },
    { label: "61 – 90 days", daysRange: "61–90", min: 61, max: 90, expectedAmount: 0, invoiceCount: 0 },
    { label: "90 + days", daysRange: "90+", min: 91, max: Infinity, expectedAmount: 0, invoiceCount: 0 },
  ];

  for (const inv of items) {
    const bucket = buckets.find(b => inv.days_overdue >= b.min && inv.days_overdue <= b.max);
    if (bucket) { bucket.expectedAmount += inv.amount; bucket.invoiceCount++; }
  }

  const totalExpected = buckets.reduce((s, b) => s + b.expectedAmount, 0);

  return {
    buckets: buckets.map(({ label, daysRange, expectedAmount, invoiceCount }) => ({
      label, daysRange, expectedAmount, invoiceCount,
    })),
    totalExpected,
  };
}

function weekLabel(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "short" });
  const weekOfMonth = Math.ceil(date.getDate() / 7);
  return `${month} W${weekOfMonth}`;
}

export async function fetchAnalyticsData(orgId: string): Promise<AnalyticsData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    allInvoicesRes,
    paymentsThisMonthRes,
    paymentsLastMonthRes,
    commsRes,
    paidInvoicesWithCommsRes,
    monthlyPaymentsRes,
    writtenOffRes,
    disputesRes,
  ] = await Promise.all([
    // All invoices (open + overdue + paid + written_off)
    db.from("invoices")
      .select("id, amount, days_overdue, status, due_date, issue_date, payment_received_date, customer_id")
      .eq("org_id", orgId),

    // Payments this month
    db.from("payments")
      .select("amount, payment_date, invoice_id")
      .eq("org_id", orgId)
      .gte("payment_date", startOfMonth.toISOString().split("T")[0]),

    // Payments last month (for CEI comparison)
    db.from("payments")
      .select("amount, invoice_id")
      .eq("org_id", orgId)
      .gte("payment_date", startOfLastMonth.toISOString().split("T")[0])
      .lte("payment_date", endOfLastMonth.toISOString().split("T")[0]),

    // All communications this month
    db.from("communications")
      .select("id, invoice_id, status, sent_at, type")
      .eq("org_id", orgId)
      .eq("type", "email")
      .gte("sent_at", startOfMonth.toISOString()),

    // Paid invoices that had a communication — for velocity and conversion
    db.from("invoices")
      .select("id, amount, payment_received_date, communications(sent_at, status)")
      .eq("org_id", orgId)
      .eq("status", "paid")
      .not("payment_received_date", "is", null)
      .gte("payment_received_date", sixMonthsAgo.toISOString().split("T")[0]),

    // Monthly payment totals (last 6 months)
    db.from("payments")
      .select("amount, payment_date")
      .eq("org_id", orgId)
      .gte("payment_date", sixMonthsAgo.toISOString().split("T")[0]),

    // Written-off invoices
    db.from("invoices")
      .select("amount")
      .eq("org_id", orgId)
      .eq("status", "written_off"),

    // Disputes
    db.from("disputes")
      .select("id, status")
      .eq("org_id", orgId),
  ]);

  const allInvoices: Array<{ id: string; amount: number; days_overdue: number; status: string }> =
    allInvoicesRes.data ?? [];
  const paymentsThisMonth: Array<{ amount: number; payment_date: string; invoice_id: string }> =
    paymentsThisMonthRes.data ?? [];
  const paymentsLastMonth: Array<{ amount: number; invoice_id: string }> =
    paymentsLastMonthRes.data ?? [];
  const comms: Array<{ id: string; invoice_id: string; status: string; sent_at: string }> =
    commsRes.data ?? [];
  const paidWithComms: Array<{
    id: string;
    amount: number;
    payment_received_date: string;
    communications: Array<{ sent_at: string; status: string }>;
  }> = paidInvoicesWithCommsRes.data ?? [];
  const monthlyPaymentsRaw: Array<{ amount: number; payment_date: string }> =
    monthlyPaymentsRes.data ?? [];
  const writtenOff: Array<{ amount: number }> = writtenOffRes.data ?? [];
  const disputes: Array<{ id: string; status: string }> = disputesRes.data ?? [];

  // ── CEI Calculation ──────────────────────────────────────────────────────
  // Simplified CEI: (Collected in period) / (Collectible in period) × 100
  // Collectible = invoices that were open/overdue/reminded at some point + new invoices this month
  const collectibleInvoices = allInvoices.filter(
    i => i.status !== "written_off"
  );
  const collectible = collectibleInvoices.reduce((s, i) => s + i.amount, 0);
  const collected = paymentsThisMonth.reduce((s, p) => s + p.amount, 0);
  const collectedLastMonthTotal = paymentsLastMonth.reduce((s, p) => s + p.amount, 0);

  const cei = collectible > 0 ? Math.min(Math.round((collected / collectible) * 100), 100) : 0;

  // Previous period CEI (last month)
  const prevCei =
    collectible > 0 ? Math.min(Math.round((collectedLastMonthTotal / collectible) * 100), 100) : 0;
  const ceiTrend: "up" | "down" | "flat" =
    cei > prevCei + 2 ? "up" : cei < prevCei - 2 ? "down" : "flat";

  // ── Email Effectiveness ──────────────────────────────────────────────────
  const totalSent = comms.length;
  const opened = comms.filter(c => c.status === "opened" || c.status === "clicked").length;
  const clicked = comms.filter(c => c.status === "clicked").length;
  const bounced = comms.filter(c => c.status === "bounced").length;
  const openRate = totalSent > 0 ? Math.round((opened / totalSent) * 100) : 0;
  const responseRate = totalSent > 0 ? Math.round((opened / totalSent) * 100) : 0;

  // Invoices that were dunned (had a comm) and then paid this month
  const dunnedInvoiceIds = new Set(comms.map(c => c.invoice_id).filter(Boolean));
  const paidAfterDunning = paymentsThisMonth.filter(p => dunnedInvoiceIds.has(p.invoice_id)).length;
  const paymentConversionRate =
    dunnedInvoiceIds.size > 0 ? Math.round((paidAfterDunning / dunnedInvoiceIds.size) * 100) : 0;

  // ── Collection Velocity ──────────────────────────────────────────────────
  const daysToPayArr: number[] = [];
  for (const inv of paidWithComms) {
    const commsForInv = inv.communications ?? [];
    if (!commsForInv.length || !inv.payment_received_date) continue;
    const firstCommDate = new Date(
      commsForInv.sort(
        (a: { sent_at: string }, b: { sent_at: string }) =>
          new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
      )[0].sent_at
    );
    const paidDate = new Date(inv.payment_received_date);
    const days = Math.round(
      (paidDate.getTime() - firstCommDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days >= 0 && days <= 180) daysToPayArr.push(days);
  }
  daysToPayArr.sort((a, b) => a - b);
  const avgDays =
    daysToPayArr.length > 0
      ? Math.round(daysToPayArr.reduce((s, d) => s + d, 0) / daysToPayArr.length)
      : 0;
  const medianDays =
    daysToPayArr.length > 0
      ? daysToPayArr[Math.floor(daysToPayArr.length / 2)]
      : 0;

  // ── Monthly Collections Trend ────────────────────────────────────────────
  const monthMap = new Map<string, { collected: number; invoices_paid: number }>();
  for (let m = 5; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    monthMap.set(key, { collected: 0, invoices_paid: 0 });
  }
  for (const p of monthlyPaymentsRaw) {
    const d = new Date(p.payment_date);
    const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    const entry = monthMap.get(key);
    if (entry) {
      entry.collected += p.amount;
      entry.invoices_paid += 1;
    }
  }
  const monthlyTrend: MonthlyCollections[] = Array.from(monthMap.entries()).map(
    ([month, data]) => ({ month, ...data })
  );

  // ── Bad Debt ─────────────────────────────────────────────────────────────
  const totalWrittenOff = writtenOff.reduce((s, i) => s + i.amount, 0);
  const totalRevenue = allInvoices.reduce((s, i) => s + i.amount, 0);
  const badDebtRate = totalRevenue > 0 ? (totalWrittenOff / totalRevenue) * 100 : 0;

  // ── Disputes ─────────────────────────────────────────────────────────────
  const activeDisputes = disputes.filter(d => d.status === "open" || d.status === "investigating").length;
  const resolvedDisputes = disputes.filter(d => d.status === "resolved" || d.status === "rejected").length;

  return {
    cei: { cei, collected, collectible, trend: ceiTrend, prevCei },
    emailEffectiveness: { totalSent, opened, clicked, bounced, openRate, responseRate, paymentConversionRate },
    velocity: {
      avgDaysToPayAfterReminder: avgDays,
      medianDaysToPayAfterReminder: medianDays,
      fastestPaymentDays: daysToPayArr[0] ?? 0,
      slowestPaymentDays: daysToPayArr[daysToPayArr.length - 1] ?? 0,
    },
    monthlyTrend,
    totalWrittenOff,
    badDebtRate: Math.round(badDebtRate * 10) / 10,
    activeDisputes,
    resolvedDisputes,
  };
}
