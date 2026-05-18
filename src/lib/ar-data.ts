import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export interface AgingBucket {
  label: string;
  amount: number;
  count: number;
  color: string;
}

export interface ARMetrics {
  totalOutstanding: number;
  dso: number;
  collectedThisMonth: number;
  collectedLastMonth: number;
  overdueCount: number;
  overdueAmount: number;
  customerCount: number;
  agingBuckets: AgingBucket[];
}

export interface OverdueCustomer {
  id: string;
  name: string;
  email: string | null;
  totalOwed: number;
  invoiceCount: number;
  maxDaysOverdue: number;
  segment: string;
}

export interface InvoiceRow {
  id: string;
  customer_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  due_date: string;
  issue_date: string;
  status: string;
  days_overdue: number;
  priority_score: number;
  customer_name?: string;
  customer_email?: string;
}

export async function fetchARMetrics(orgId: string): Promise<ARMetrics> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];

  // All open/overdue invoices
  const { data: openInvoices } = await db
    .from("invoices")
    .select("amount, days_overdue, due_date, issue_date, status")
    .eq("org_id", orgId)
    .in("status", ["open", "reminded", "overdue"]);

  // Payments this month
  const { data: paymentsThisMonth } = await db
    .from("payments")
    .select("amount")
    .eq("org_id", orgId)
    .gte("payment_date", startOfMonth);

  // Payments last month
  const { data: paymentsLastMonth } = await db
    .from("payments")
    .select("amount")
    .eq("org_id", orgId)
    .gte("payment_date", startOfLastMonth)
    .lte("payment_date", endOfLastMonth);

  const { count: customerCount } = await db
    .from("customers")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId);

  const invoices: Array<{ amount: number; days_overdue: number; due_date: string; issue_date: string; status: string }> = openInvoices ?? [];

  const totalOutstanding = invoices.reduce((s: number, i: { amount: number }) => s + (i.amount ?? 0), 0);
  const collectedThisMonth = (paymentsThisMonth ?? []).reduce((s: number, p: { amount: number }) => s + (p.amount ?? 0), 0);
  const collectedLastMonth = (paymentsLastMonth ?? []).reduce((s: number, p: { amount: number }) => s + (p.amount ?? 0), 0);

  const overdueInvoices = invoices.filter((i: { days_overdue: number }) => i.days_overdue > 0);
  const overdueAmount = overdueInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0);

  // DSO = (AR outstanding / total credit sales) * days — simplified: avg days to collect
  const dso = invoices.length > 0
    ? Math.round(invoices.reduce((s: number, i: { days_overdue: number }) => s + (i.days_overdue ?? 0), 0) / invoices.length)
    : 0;

  // Aging buckets
  const bucketDefs = [
    { label: "Current",   min: -Infinity, max: 0,  color: "#22c55e" },
    { label: "1–30 days", min: 1,         max: 30,  color: "#facc15" },
    { label: "31–60 days",min: 31,        max: 60,  color: "#f97316" },
    { label: "61–90 days",min: 61,        max: 90,  color: "#ef4444" },
    { label: "90+ days",  min: 91,        max: Infinity, color: "#991b1b" },
  ];

  const agingBuckets: AgingBucket[] = bucketDefs.map(b => {
    const matching = invoices.filter((i: { days_overdue: number }) => i.days_overdue >= b.min && i.days_overdue <= b.max);
    return {
      label: b.label,
      amount: matching.reduce((s: number, i: { amount: number }) => s + i.amount, 0),
      count: matching.length,
      color: b.color,
    };
  });

  return {
    totalOutstanding,
    dso,
    collectedThisMonth,
    collectedLastMonth,
    overdueCount: overdueInvoices.length,
    overdueAmount,
    customerCount: customerCount ?? 0,
    agingBuckets,
  };
}

export async function fetchOverdueCustomers(orgId: string): Promise<OverdueCustomer[]> {
  const { data } = await db
    .from("invoices")
    .select("customer_id, amount, days_overdue, customers(id, name, email, segment)")
    .eq("org_id", orgId)
    .gt("days_overdue", 0)
    .in("status", ["open", "reminded", "overdue"]);

  if (!data) return [];

  const map = new Map<string, OverdueCustomer>();
  for (const row of data) {
    const cust = row.customers;
    if (!cust) continue;
    const existing = map.get(cust.id);
    if (existing) {
      existing.totalOwed += row.amount;
      existing.invoiceCount++;
      existing.maxDaysOverdue = Math.max(existing.maxDaysOverdue, row.days_overdue);
    } else {
      map.set(cust.id, {
        id: cust.id,
        name: cust.name,
        email: cust.email,
        totalOwed: row.amount,
        invoiceCount: 1,
        maxDaysOverdue: row.days_overdue,
        segment: cust.segment,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.totalOwed - a.totalOwed)
    .slice(0, 10);
}

export async function fetchInvoicesWithCustomers(orgId: string, statusFilter?: string[]): Promise<InvoiceRow[]> {
  let query = db
    .from("invoices")
    .select("*, customers(name, email)")
    .eq("org_id", orgId)
    .order("days_overdue", { ascending: false });

  if (statusFilter?.length) query = query.in("status", statusFilter);

  const { data } = await query;
  if (!data) return [];

  return data.map((row: InvoiceRow & { customers?: { name: string; email: string } }) => ({
    ...row,
    customer_name: row.customers?.name,
    customer_email: row.customers?.email,
  }));
}

export async function updateInvoicePriorityScores(orgId: string) {
  const invoices = await fetchInvoicesWithCustomers(orgId, ["open", "reminded", "overdue"]);
  const maxAmount = Math.max(...invoices.map(i => i.amount), 1);
  const maxDays = Math.max(...invoices.map(i => i.days_overdue), 1);

  for (const inv of invoices) {
    const score =
      (inv.amount / maxAmount) * 0.4 +
      (inv.days_overdue / maxDays) * 0.3 +
      0.3; // payment history score placeholder = 0.3 until we have history
    await db.from("invoices").update({ priority_score: Math.round(score * 100) / 100 })
      .eq("id", inv.id);
  }
}
