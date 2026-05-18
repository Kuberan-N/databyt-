"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, Clock, TrendingUp, ArrowRight, Upload,
  AlertTriangle, CheckCircle2, BarChart2, Send, Users,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchARMetrics, fetchOverdueCustomers, ARMetrics, OverdueCustomer } from "@/lib/ar-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const BUCKET_COLORS: Record<string, string> = {
  "Current":    "bg-success-500",
  "1–30 days":  "bg-warning-400",
  "31–60 days": "bg-orange-500",
  "61–90 days": "bg-danger-400",
  "90+ days":   "bg-red-600",
};

export default function DashboardOverview() {
  const { organization } = useAuth();
  const [metrics, setMetrics] = useState<ARMetrics | null>(null);
  const [overdue, setOverdue] = useState<OverdueCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    const [m, o] = await Promise.all([
      fetchARMetrics(organization.id),
      fetchOverdueCustomers(organization.id),
    ]);
    setMetrics(m);
    setOverdue(o);
    setLoading(false);
  }, [organization]);

  useEffect(() => { load(); }, [load]);

  const hasData = (metrics?.totalOutstanding ?? 0) > 0 || (metrics?.customerCount ?? 0) > 0;
  const orgName = organization?.name ?? "Your Company";

  const collectionTrend = metrics && metrics.collectedLastMonth > 0
    ? Math.round(((metrics.collectedThisMonth - metrics.collectedLastMonth) / metrics.collectedLastMonth) * 100)
    : 0;

  const metricCards = [
    {
      label: "Total AR Outstanding",
      value: loading ? "—" : fmt(metrics?.totalOutstanding ?? 0),
      sub: loading ? "Loading..." : `${metrics?.customerCount ?? 0} customers`,
      icon: DollarSign,
      color: "from-primary-500 to-primary-600",
    },
    {
      label: "Days Sales Outstanding",
      value: loading ? "—" : hasData ? `${metrics?.dso ?? 0} days` : "— days",
      sub: loading ? "Loading..." : hasData ? (metrics?.dso && metrics.dso > 45 ? "Above 45d target" : "Within target") : "Import data to calculate",
      icon: Clock,
      color: "from-warning-400 to-warning-500",
    },
    {
      label: "Collected This Month",
      value: loading ? "—" : fmt(metrics?.collectedThisMonth ?? 0),
      sub: loading ? "Loading..." : hasData
        ? `${collectionTrend >= 0 ? "+" : ""}${collectionTrend}% vs last month`
        : "vs $0 last month",
      icon: TrendingUp,
      color: "from-success-400 to-success-500",
    },
    {
      label: "Overdue Invoices",
      value: loading ? "—" : `${metrics?.overdueCount ?? 0}`,
      sub: loading ? "Loading..." : fmt(metrics?.overdueAmount ?? 0) + " at risk",
      icon: AlertTriangle,
      color: "from-danger-400 to-danger-500",
    },
  ];

  const totalAR = metrics?.totalOutstanding ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome back, <span className="gradient-text">{orgName}</span>
        </h2>
        <p className="text-surface-400 mt-1 text-sm">
          {hasData ? "Here's your AR collections overview." : "Your AR collections command center. Import data to see live metrics."}
        </p>
      </div>

      {/* Setup banner — only if no data yet */}
      {!hasData && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary-500/25 bg-primary-500/5 p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">3 steps to your first AI collection</h3>
              <p className="text-surface-400 text-sm mt-0.5">Complete setup to start recovering overdue revenue automatically.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { step: 1, title: "Import AR Data", desc: "Upload a CSV from QuickBooks, Xero, or any accounting software.", href: "/dashboard/ar-aging", cta: "Import Data", icon: Upload },
              { step: 2, title: "Review Aging Report", desc: "See which invoices are overdue and how much is at risk by aging bucket.", href: "/dashboard/ar-aging", cta: "View AR Aging", icon: BarChart2 },
              { step: 3, title: "Launch AI Collections", desc: "Let AI draft personalized dunning emails. You approve before anything sends.", href: "/dashboard/collections", cta: "Set Up Collections", icon: Send },
            ].map((item) => (
              <div key={item.step} className="rounded-xl p-4 bg-surface-800/40 border border-surface-700/50 hover:border-primary-500/30 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-md bg-surface-700 text-surface-400 text-xs font-bold flex items-center justify-center shrink-0">{item.step}</span>
                  <span className="text-sm font-semibold text-white">{item.title}</span>
                </div>
                <p className="text-surface-400 text-xs mb-3 leading-relaxed">{item.desc}</p>
                <a href={item.href} className="inline-flex items-center gap-1 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors">
                  {item.cta} <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Metric cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                <m.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <p className="text-surface-500 text-xs mt-1">{m.label}</p>
            <p className="text-surface-600 text-xs mt-0.5">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* AR Aging Buckets */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">AR Aging Buckets</h3>
            <a href="/dashboard/ar-aging" className="text-primary-400 hover:text-primary-300 text-xs font-medium flex items-center gap-1">
              Full report <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            {(metrics?.agingBuckets ?? [{ label: "Current", amount: 0, count: 0, color: "#22c55e" }, { label: "1–30 days", amount: 0, count: 0, color: "#facc15" }, { label: "31–60 days", amount: 0, count: 0, color: "#f97316" }, { label: "61–90 days", amount: 0, count: 0, color: "#ef4444" }, { label: "90+ days", amount: 0, count: 0, color: "#991b1b" }]).map((b) => {
              const pct = totalAR > 0 ? (b.amount / totalAR) * 100 : 0;
              return (
                <div key={b.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-surface-300 font-medium">{b.label}</span>
                    <span className="text-surface-500">{fmt(b.amount)}{b.count > 0 ? ` · ${b.count}` : ""}</span>
                  </div>
                  <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                    <div className={`h-full ${BUCKET_COLORS[b.label] ?? "bg-primary-500"} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {!hasData && !loading && (
            <div className="mt-5 pt-4 border-t border-surface-800">
              <a href="/dashboard/ar-aging"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/15 transition-colors">
                <Upload className="w-4 h-4" /> Import AR Data
              </a>
            </div>
          )}
        </motion.div>

        {/* Top Overdue Customers */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">Top Overdue Customers</h3>
            <a href="/dashboard/customers" className="text-primary-400 hover:text-primary-300 text-xs font-medium flex items-center gap-1">
              All customers <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {overdue.length > 0 ? (
            <div className="space-y-2">
              {overdue.slice(0, 5).map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 py-2.5 border-b border-surface-800 last:border-0">
                  <span className="text-xs text-surface-600 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{c.name}</p>
                    <p className="text-xs text-surface-500">{c.invoiceCount} inv · {c.maxDaysOverdue}d overdue</p>
                  </div>
                  <span className="text-sm font-bold text-white">{fmt(c.totalOwed)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-surface-600" />
              </div>
              <p className="text-surface-300 text-sm font-medium mb-1">No overdue customers</p>
              <p className="text-surface-500 text-xs mb-5 max-w-[220px] leading-relaxed">
                {hasData ? "All customers are current." : "Import your AR aging data to see who owes you money."}
              </p>
              {!hasData && (
                <a href="/dashboard/collections"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium hover:bg-accent-500/15 transition-colors">
                  <Send className="w-3.5 h-3.5" /> Set Up Collections
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* DSO trend placeholder */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-white">DSO Trend</h3>
          <span className="text-xs text-surface-500 px-2 py-1 rounded-lg bg-surface-800">Last 30 days</span>
        </div>
        <p className="text-surface-500 text-xs mb-6">Days Sales Outstanding — lower is better. Target: under 45 days.</p>
        <div className="flex items-end justify-center gap-1 h-24">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="flex-1 bg-surface-800 rounded-t-sm" style={{ height: `${30 + i * 4}%`, opacity: hasData ? 0.6 : 0.3 }} />
          ))}
        </div>
        {hasData ? (
          <p className="text-center text-surface-500 text-xs mt-3">Current DSO: <span className="text-white font-semibold">{metrics?.dso ?? 0} days</span></p>
        ) : (
          <p className="text-center text-surface-600 text-xs mt-3">Import data to see your real DSO trend</p>
        )}
      </motion.div>
    </div>
  );
}
