"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  DollarSign, Clock, TrendingUp, AlertTriangle,
  RefreshCw, UserPlus, FileText, ArrowRight, Link2, Check, Send,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
  fetchARMetrics, fetchOverdueCustomers, fetchInvoicesWithCustomers,
  ARMetrics, OverdueCustomer, InvoiceRow,
} from "@/lib/ar-data";
import AddCustomerModal from "@/components/AddCustomerModal";
import AddInvoiceModal from "@/components/AddInvoiceModal";
import EmailDraftModal from "@/components/EmailDraftModal";
import { supabase } from "@/lib/supabase";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const STATUS_COLORS: Record<string, string> = {
  open:        "bg-[#F1F5F9] text-[#111111]",
  reminded:    "bg-[#F3F3F3] text-[#000000]",
  overdue:     "bg-[#F3F3F3] text-[#DC2626]",
  paid:        "bg-[#F0FDF4] text-[#16A34A]",
  written_off: "bg-[#F8F9FC] text-[#333333]",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const btnBase = "flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#222222] text-sm hover:text-[#000000] hover:border-[#000000]/30 transition-all";

export default function AgingDashboard({ readOnly = false }: { readOnly?: boolean }) {
  const { organization } = useAuth();
  const [metrics, setMetrics] = useState<ARMetrics | null>(null);
  const [overdue, setOverdue] = useState<OverdueCustomer[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>(["open", "reminded", "overdue"]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage]         = useState(1);
  const [copiedId, setCopied]           = useState<string | null>(null);
  const [emailTarget, setEmailTarget]   = useState<InvoiceRow | null>(null);
  const [payTemplate, setPayTemplate]   = useState<string | null>(null);
  const PER_PAGE = 20;

  const load = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    const [m, o, inv, settings] = await Promise.all([
      fetchARMetrics(organization.id),
      fetchOverdueCustomers(organization.id),
      fetchInvoicesWithCustomers(organization.id, statusFilter),
      db.from("org_settings").select("payment_link_template").eq("org_id", organization.id).single(),
    ]);
    setMetrics(m);
    setOverdue(o);
    setInvoices(inv);
    setPayTemplate(settings?.data?.payment_link_template ?? null);
    setLoading(false);
  }, [organization, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function copyPayLink(inv: InvoiceRow) {
    if (!payTemplate) return;
    const url = payTemplate.replace("{invoice_number}", inv.invoice_number);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(inv.id);
      setTimeout(() => setCopied(null), 3000);
    } catch {
      // clipboard not available in some contexts
    }
  }

  async function markPaid(invoiceId: string) {
    await db.from("invoices").update({
      status: "paid",
      payment_received_date: new Date().toISOString().split("T")[0],
    }).eq("id", invoiceId);
    const inv = invoices.find(i => i.id === invoiceId);
    if (inv && organization) {
      await db.from("payments").insert({
        org_id: organization.id,
        invoice_id: invoiceId,
        amount: inv.amount,
        payment_date: new Date().toISOString().split("T")[0],
        method: "manual",
      });
    }
    load();
  }

  const filtered = invoices.filter(i =>
    !search || i.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    i.invoice_number.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#000000]/20 border-t-[#000000] rounded-full animate-spin" />
          <p className="text-[#222222] text-sm">Loading AR data...</p>
        </div>
      </div>
    );
  }

  const collectionTrend = metrics
    ? metrics.collectedLastMonth > 0
      ? Math.round(((metrics.collectedThisMonth - metrics.collectedLastMonth) / metrics.collectedLastMonth) * 100)
      : 0
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">AR Aging</h2>
          <p className="text-[#222222] text-sm mt-1">Live accounts receivable overview</p>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <button onClick={() => setShowAddCustomer(true)} className={btnBase}>
              <UserPlus className="w-4 h-4" /> Add Customer
            </button>
            <button onClick={() => setShowAddInvoice(true)} className={btnBase}>
              <FileText className="w-4 h-4" /> Add Invoice
            </button>
          </div>
        )}
        <button onClick={load} className={btnBase}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total AR Outstanding", value: fmt(metrics?.totalOutstanding ?? 0), sub: `${metrics?.customerCount ?? 0} customers`, icon: DollarSign, bg: "#111111" },
          { label: "Days Sales Outstanding", value: `${metrics?.dso ?? 0} days`, sub: metrics?.dso && metrics.dso > 45 ? "Above 45d target" : "Within target", icon: Clock, bg: "#111111" },
          { label: "Collected This Month", value: fmt(metrics?.collectedThisMonth ?? 0), sub: `${collectionTrend >= 0 ? "+" : ""}${collectionTrend}% vs last month`, icon: TrendingUp, bg: "#16A34A" },
          { label: "Overdue Invoices", value: `${metrics?.overdueCount ?? 0}`, sub: fmt(metrics?.overdueAmount ?? 0) + " at risk", icon: AlertTriangle, bg: "#DC2626" },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: m.bg }}>
                <m.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{m.value}</p>
            <p className="text-[#222222] text-xs mt-0.5">{m.label}</p>
            <p className="text-[#333333] text-xs mt-0.5">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-5">Aging Buckets</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics?.agingBuckets ?? []} barSize={32}>
              <XAxis dataKey="label" tick={{ fill: "#333333", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#333333", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 12, color: "#0F172A" }}
                formatter={(v) => [fmt(Number(v ?? 0)), "Amount"]}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {(metrics?.agingBuckets ?? []).map((b, i) => <Cell key={i} fill={b.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-5">AR Distribution</h3>
          {metrics && metrics.totalOutstanding > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={metrics.agingBuckets.filter(b => b.amount > 0)} dataKey="amount" nameKey="label" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
                  {metrics.agingBuckets.map((b, i) => <Cell key={i} fill={b.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 12, color: "#0F172A" }}
                  formatter={(v) => fmt(Number(v ?? 0))}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#222222" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-[#333333] text-sm">No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Top overdue customers */}
      {overdue.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#0F172A]">Top Overdue Customers</h3>
            <a href="/dashboard/collections" className="text-xs text-[#000000] font-medium flex items-center gap-1 hover:text-[#111111]">
              Start collecting <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-2">
            {overdue.slice(0, 5).map((c, i) => (
              <div key={c.id} className="flex items-center gap-4 py-2.5 border-b border-[#E2E8F0] last:border-0">
                <span className="text-xs text-[#333333] w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0F172A] font-medium truncate">{c.name}</p>
                  <p className="text-xs text-[#222222]">{c.invoiceCount} invoice{c.invoiceCount !== 1 ? "s" : ""} · {c.maxDaysOverdue}d overdue</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize border ${
                  c.segment === "strategic" ? "bg-[#F3F3F3] text-[#000000] border-[#000000]/20" :
                  c.segment === "at_risk"   ? "bg-[#F3F3F3] text-[#DC2626] border-[#EF4444]/20" :
                  "bg-[#F1F5F9] text-[#222222] border-[#E2E8F0]"
                }`}>{c.segment.replace("_", " ")}</span>
                <span className="text-sm font-bold text-[#0F172A]">{fmt(c.totalOwed)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Invoice table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-[#0F172A] flex-1">Invoices</h3>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] placeholder-[#333333] focus:border-[#000000] outline-none w-48"
          />
          <div className="flex gap-1">
            {[["all","All"],["overdue","Overdue"],["open","Open"],["paid","Paid"]].map(([val, lbl]) => (
              <button key={val}
                onClick={() => {
                  setPage(1);
                  setStatusFilter(val === "all" ? ["open","reminded","overdue","paid"] : val === "overdue" ? ["overdue","reminded"] : [val]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  (val === "all" && statusFilter.length > 2 && statusFilter.includes("paid")) ||
                  (val === "overdue" && statusFilter.includes("overdue") && !statusFilter.includes("paid")) ||
                  (val === "open" && statusFilter.length === 1 && statusFilter[0] === "open") ||
                  (val === "paid" && statusFilter.length === 1 && statusFilter[0] === "paid")
                    ? "bg-[#F3F3F3] text-[#000000] border border-[#000000]/20"
                    : "text-[#222222] hover:text-[#000000] border border-transparent"
                }`}
              >{lbl}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                {[...["Customer","Invoice #","Amount","Due Date","Days Overdue","Status"], ...(!readOnly ? ["Action"] : [])].map(h => (
                  <th key={h} className="text-left text-[#333333] px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={readOnly ? 6 : 7} className="text-center py-12 text-[#333333] text-sm">No invoices found</td></tr>
              ) : paginated.map((inv) => (
                <tr key={inv.id} className="border-t border-[#F1F5F9] hover:bg-[#F8F9FC] transition-colors">
                  <td className="px-4 py-3 text-[#0F172A] font-medium">{inv.customer_name ?? "—"}</td>
                  <td className="px-4 py-3 text-[#222222]">{inv.invoice_number}</td>
                  <td className="px-4 py-3 text-[#0F172A] font-semibold">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3 text-[#222222]">{inv.due_date}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${inv.days_overdue > 60 ? "text-[#DC2626]" : inv.days_overdue > 30 ? "text-[#000000]" : inv.days_overdue > 0 ? "text-[#F59E0B]" : "text-[#16A34A]"}`}>
                      {inv.days_overdue > 0 ? `${inv.days_overdue}d` : "Current"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[inv.status] ?? ""}`}>{inv.status}</span>
                  </td>
                  {!readOnly && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {inv.status !== "paid" && (
                          <>
                            <button
                              onClick={() => setEmailTarget(inv)}
                              className="flex items-center gap-1 text-xs text-[#000000] font-semibold bg-[#F3F3F3] px-2 py-1 rounded-lg hover:bg-[#E5E5E5] transition-colors"
                            >
                              <Send className="w-3 h-3" />Email
                            </button>
                            <button
                              onClick={() => copyPayLink(inv)}
                              title={payTemplate ? "Copy payment link" : "No payment link configured — set one in Settings"}
                              disabled={!payTemplate}
                              className="flex items-center gap-1 text-xs text-[#222222] hover:text-[#000000] font-medium transition-colors"
                            >
                              {copiedId === inv.id
                                ? <><Check className="w-3 h-3 text-[#16A34A]" /><span className="text-[#16A34A]">Copied</span></>
                                : <><Link2 className="w-3 h-3" />Pay link</>}
                            </button>
                            <button
                              onClick={() => markPaid(inv.id)}
                              className="flex items-center gap-1 text-xs font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/25 px-2.5 py-1 rounded-lg hover:bg-[#16A34A] hover:text-white transition-all"
                            >
                              <Check className="w-3 h-3" />Mark Paid
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#222222]">
            <span>{filtered.length} total</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg font-medium transition-all ${p === page ? "bg-[#F3F3F3] text-[#000000]" : "hover:bg-[#F1F5F9] text-[#222222]"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {!readOnly && (
        <>
          <AddCustomerModal open={showAddCustomer} onClose={() => setShowAddCustomer(false)} onSaved={load} />
          <AddInvoiceModal open={showAddInvoice} onClose={() => setShowAddInvoice(false)} onSaved={load} />
        </>
      )}

      {emailTarget && organization && (
        <EmailDraftModal
          invoiceId={emailTarget.id}
          invoiceNumber={emailTarget.invoice_number}
          customerName={emailTarget.customer_name ?? "Customer"}
          customerEmail={emailTarget.customer_email ?? ""}
          daysOverdue={emailTarget.days_overdue}
          orgId={organization.id}
          onClose={() => setEmailTarget(null)}
          onSent={() => { setEmailTarget(null); load(); }}
        />
      )}
    </div>
  );
}
