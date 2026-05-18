"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  DollarSign, Clock, TrendingUp, AlertTriangle,
  RefreshCw, UserPlus, FileText, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
  fetchARMetrics, fetchOverdueCustomers, fetchInvoicesWithCustomers,
  ARMetrics, OverdueCustomer, InvoiceRow,
} from "@/lib/ar-data";
import AddCustomerModal from "@/components/AddCustomerModal";
import AddInvoiceModal from "@/components/AddInvoiceModal";
import { supabase } from "@/lib/supabase";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const STATUS_COLORS: Record<string, string> = {
  open: "bg-surface-700 text-surface-300",
  reminded: "bg-warning-500/15 text-warning-400",
  overdue: "bg-danger-500/15 text-danger-400",
  paid: "bg-success-500/15 text-success-400",
  written_off: "bg-surface-700/50 text-surface-500",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export default function AgingDashboard() {
  const { organization } = useAuth();
  const [metrics, setMetrics] = useState<ARMetrics | null>(null);
  const [overdue, setOverdue] = useState<OverdueCustomer[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>(["open", "reminded", "overdue"]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const load = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    const [m, o, inv] = await Promise.all([
      fetchARMetrics(organization.id),
      fetchOverdueCustomers(organization.id),
      fetchInvoicesWithCustomers(organization.id, statusFilter),
    ]);
    setMetrics(m);
    setOverdue(o);
    setInvoices(inv);
    setLoading(false);
  }, [organization, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function markPaid(invoiceId: string) {
    await db.from("invoices").update({
      status: "paid",
      payment_received_date: new Date().toISOString().split("T")[0],
    }).eq("id", invoiceId);
    // Log payment
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
          <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-surface-400 text-sm">Loading AR data...</p>
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
          <h2 className="text-2xl font-bold text-white">AR Aging</h2>
          <p className="text-surface-400 text-sm mt-1">Live accounts receivable overview</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddCustomer(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all">
            <UserPlus className="w-4 h-4" /> Add Customer
          </button>
          <button onClick={() => setShowAddInvoice(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all">
            <FileText className="w-4 h-4" /> Add Invoice
          </button>
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total AR Outstanding", value: fmt(metrics?.totalOutstanding ?? 0), sub: `${metrics?.customerCount ?? 0} customers`, icon: DollarSign, color: "from-primary-500 to-primary-600" },
          { label: "Days Sales Outstanding", value: `${metrics?.dso ?? 0} days`, sub: metrics?.dso && metrics.dso > 45 ? "Above 45d target" : "Within target", icon: Clock, color: "from-warning-400 to-warning-500" },
          { label: "Collected This Month", value: fmt(metrics?.collectedThisMonth ?? 0), sub: `${collectionTrend >= 0 ? "+" : ""}${collectionTrend}% vs last month`, icon: TrendingUp, color: "from-success-400 to-success-500" },
          { label: "Overdue Invoices", value: `${metrics?.overdueCount ?? 0}`, sub: fmt(metrics?.overdueAmount ?? 0) + " at risk", icon: AlertTriangle, color: "from-danger-400 to-danger-500" },
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                <m.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <p className="text-surface-500 text-xs mt-0.5">{m.label}</p>
            <p className="text-surface-600 text-xs mt-0.5">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Bar chart — aging buckets */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5">Aging Buckets</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics?.agingBuckets ?? []} barSize={32}>
              <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [fmt(Number(v ?? 0)), "Amount"]}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {(metrics?.agingBuckets ?? []).map((b, i) => <Cell key={i} fill={b.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart — AR distribution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5">AR Distribution</h3>
          {metrics && metrics.totalOutstanding > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={metrics.agingBuckets.filter(b => b.amount > 0)} dataKey="amount" nameKey="label" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
                  {metrics.agingBuckets.map((b, i) => <Cell key={i} fill={b.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, fontSize: 12 }} formatter={(v) => fmt(Number(v ?? 0))} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-surface-600 text-sm">No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Top overdue customers */}
      {overdue.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Top Overdue Customers</h3>
            <a href="/dashboard/collections" className="text-xs text-primary-400 font-medium flex items-center gap-1 hover:text-primary-300">
              Start collecting <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-2">
            {overdue.slice(0, 5).map((c, i) => (
              <div key={c.id} className="flex items-center gap-4 py-2.5 border-b border-surface-800 last:border-0">
                <span className="text-xs text-surface-600 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{c.name}</p>
                  <p className="text-xs text-surface-500">{c.invoiceCount} invoice{c.invoiceCount !== 1 ? "s" : ""} · {c.maxDaysOverdue}d overdue</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize border ${
                  c.segment === "strategic" ? "bg-primary-500/10 text-primary-400 border-primary-500/20" :
                  c.segment === "at_risk" ? "bg-danger-500/10 text-danger-400 border-danger-500/20" :
                  "bg-surface-700 text-surface-400 border-surface-600"
                }`}>{c.segment.replace("_"," ")}</span>
                <span className="text-sm font-bold text-white">{fmt(c.totalOwed)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Invoice table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-800 flex items-center gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-white flex-1">Invoices</h3>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="bg-surface-800/60 border border-surface-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-surface-500 focus:border-primary-500 outline-none w-48"
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
                    ? "bg-primary-500/15 text-primary-400 border border-primary-500/30"
                    : "text-surface-400 hover:text-white border border-transparent"
                }`}
              >{lbl}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-800">
                {["Customer","Invoice #","Amount","Due Date","Days Overdue","Status","Action"].map(h => (
                  <th key={h} className="text-left text-surface-500 px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-surface-600 text-sm">No invoices found</td></tr>
              ) : paginated.map((inv) => (
                <tr key={inv.id} className="border-t border-surface-800/50 hover:bg-surface-800/20 transition-colors">
                  <td className="px-4 py-3 text-surface-200 font-medium">{inv.customer_name ?? "—"}</td>
                  <td className="px-4 py-3 text-surface-400">{inv.invoice_number}</td>
                  <td className="px-4 py-3 text-white font-semibold">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3 text-surface-400">{inv.due_date}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${inv.days_overdue > 60 ? "text-danger-400" : inv.days_overdue > 30 ? "text-warning-400" : inv.days_overdue > 0 ? "text-yellow-400" : "text-success-400"}`}>
                      {inv.days_overdue > 0 ? `${inv.days_overdue}d` : "Current"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[inv.status] ?? ""}`}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {inv.status !== "paid" && (
                      <button onClick={() => markPaid(inv.id)} className="text-xs text-success-400 hover:text-success-300 font-medium transition-colors">
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-surface-800 flex items-center justify-between text-xs text-surface-500">
            <span>{filtered.length} total</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg font-medium transition-all ${p === page ? "bg-primary-500/20 text-primary-400" : "hover:bg-surface-800 text-surface-400"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <AddCustomerModal open={showAddCustomer} onClose={() => setShowAddCustomer(false)} onSaved={load} />
      <AddInvoiceModal open={showAddInvoice} onClose={() => setShowAddInvoice(false)} onSaved={load} />
    </div>
  );
}
