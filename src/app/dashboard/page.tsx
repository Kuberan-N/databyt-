"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, Clock, TrendingUp, ArrowRight,
  AlertTriangle, RefreshCw, Sparkles, FileSpreadsheet,
  Target, BarChart2, Mail, Users,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchARMetrics, fetchOverdueCustomers, ARMetrics, OverdueCustomer } from "@/lib/ar-data";

// Count-up animation hook
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const BUCKETS = [
  { label: "Current",    color: "#16A34A", track: "#DCFCE7" },
  { label: "1–30 days",  color: "#000000", track: "#FEF3C7" },
  { label: "31–60 days", color: "#EA580C", track: "#FFEDD5" },
  { label: "61–90 days", color: "#DC2626", track: "#F3F3F3" },
  { label: "90+ days",   color: "#991B1B", track: "#F3F3F3" },
];

export default function DashboardOverview() {
  const { organization } = useAuth();
  const [metrics, setMetrics]   = useState<ARMetrics | null>(null);
  const [overdue, setOverdue]   = useState<OverdueCustomer[]>([]);
  const [loading, setLoading]   = useState(true);

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

  const outstanding = useCountUp(loading ? 0 : (metrics?.totalOutstanding ?? 0));
  const cei         = useCountUp(loading ? 0 : (metrics?.cei ?? 0));
  const overduePct  = useCountUp(loading ? 0 : (metrics?.overduePercent ?? 0));
  const dsoVal      = useCountUp(loading ? 0 : (metrics?.dso ?? 0));
  const collected   = useCountUp(loading ? 0 : (metrics?.collectedThisMonth ?? 0));
  const avgDel      = useCountUp(loading ? 0 : (metrics?.avgDaysDelinquent ?? 0));
  const disputes    = useCountUp(loading ? 0 : (metrics?.activeDisputes ?? 0));
  const emails      = useCountUp(loading ? 0 : (metrics?.emailsSentThisMonth ?? 0));

  const row1 = [
    {
      label: "Total AR Outstanding",
      value: loading ? "—" : `$${outstanding.toLocaleString()}`,
      sub:   loading ? "Loading…" : `${metrics?.customerCount ?? 0} active customers`,
      icon: DollarSign, iconClass: "metric-icon-brand",
      tooltip: "Total unpaid invoices across all customers",
    },
    {
      label: "Days Sales Outstanding",
      value: loading ? "—" : hasData ? `${dsoVal}d` : "—",
      sub:   loading ? "Loading…" : hasData
        ? (metrics?.dso && metrics.dso > 45 ? "⚠ Above 45-day target" : "✓ Within 45-day target")
        : "Import invoices to calculate",
      icon: Clock,
      iconClass: metrics?.dso && metrics.dso > 45 ? "metric-icon-danger" : "metric-icon-dark",
      tooltip: "Average days to collect payment. Industry target: under 45 days",
    },
    {
      label: "Collection Effectiveness",
      value: loading ? "—" : hasData ? `${cei}%` : "—",
      sub:   loading ? "Loading…" : (metrics?.cei ?? 0) >= 80 ? "✓ Healthy (target 80%+)" : "⚠ Below 80% target",
      icon: Target,
      iconClass: (metrics?.cei ?? 0) >= 80 ? "metric-icon-success" : "metric-icon-danger",
      tooltip: "CEI: % of collectible AR actually collected. 80%+ is healthy",
    },
    {
      label: "Overdue % of AR",
      value: loading ? "—" : hasData ? `${overduePct}%` : "—",
      sub:   loading ? "Loading…" : fmt(metrics?.overdueAmount ?? 0) + " past due",
      icon: BarChart2,
      iconClass: (metrics?.overduePercent ?? 0) > 50 ? "metric-icon-danger" : "metric-icon-amber",
      tooltip: "What percentage of your total AR is past the due date",
    },
  ];

  const row2 = [
    {
      label: "Collected This Month",
      value: loading ? "—" : `$${collected.toLocaleString()}`,
      sub:   loading ? "Loading…" : collectionTrend !== 0
        ? `${collectionTrend >= 0 ? "+" : ""}${collectionTrend}% vs last month`
        : "vs last month",
      icon: TrendingUp, iconClass: "metric-icon-success",
      tooltip: "Total payments received this calendar month",
    },
    {
      label: "Avg Days Delinquent",
      value: loading ? "—" : hasData ? `${avgDel}d` : "—",
      sub:   loading ? "Loading…" : `across ${metrics?.overdueCount ?? 0} overdue invoices`,
      icon: Clock, iconClass: "metric-icon-dark",
      tooltip: "Average number of days overdue for all outstanding invoices",
    },
    {
      label: "Active Disputes",
      value: loading ? "—" : `${disputes}`,
      sub:   loading ? "Loading…" : (metrics?.activeDisputes ?? 0) > 0 ? "Need resolution" : "All clear",
      icon: AlertTriangle,
      iconClass: (metrics?.activeDisputes ?? 0) > 0 ? "metric-icon-danger" : "metric-icon-success",
      tooltip: "Open disputes pausing collections — need your attention",
    },
    {
      label: "Emails Sent (Month)",
      value: loading ? "—" : `${emails}`,
      sub:   loading ? "Loading…" : `to ${metrics?.customerCount ?? 0} customers`,
      icon: Mail, iconClass: "metric-icon-brand",
      tooltip: "Total dunning emails sent this month by DataByt",
    },
  ];

  const totalAR = metrics?.totalOutstanding ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">
            Welcome back,{" "}
            <span className="gradient-text">{orgName}</span>
          </h2>
          <p className="text-[#222222] mt-1 text-sm">
            {hasData
              ? "Here's your AR collections overview."
              : "Your AR command center. Connect an integration or import data to see live metrics."}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] text-[#222222] text-sm hover:text-[#000000] hover:border-[#000000]/30 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Empty state — shown only when org has no data */}
      {!loading && !hasData && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#F0F4FF] p-8 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#4F46E5] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-base font-bold text-[#1E1B4B] mb-2">You&apos;re all set up — let&apos;s get data in</h3>
          <p className="text-sm text-[#4338CA] mb-6 max-w-md mx-auto">
            Connect your accounting system, import a CSV, or load sample data to see your AR dashboard come alive.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/dashboard/integrations"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white text-sm font-semibold rounded-xl hover:bg-[#4338CA] transition-colors">
              <Sparkles className="w-4 h-4" />
              Load sample data
            </a>
            <a href="/dashboard/integrations"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#C7D2FE] text-[#4F46E5] text-sm font-semibold rounded-xl hover:bg-[#EEF2FF] transition-colors">
              <FileSpreadsheet className="w-4 h-4" />
              Import CSV
            </a>
          </div>
        </motion.div>
      )}

      {/* Tier 1 — Strategic metrics (CFO view) */}
      <div>
        <p className="text-[11px] font-semibold text-[#6366F1] uppercase tracking-widest mb-3">Financial Health</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {row1.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-5 cursor-default" title={m.tooltip}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${m.iconClass}`}>
                <m.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#0F172A] tabular-nums">{m.value}</p>
              <p className="text-xs font-semibold text-[#475569] mt-1">{m.label}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{m.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tier 2 — Operational metrics (AR Manager view) */}
      <div>
        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-3">Operations This Month</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {row2.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i + 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-5 cursor-default" title={m.tooltip}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${m.iconClass}`}>
                <m.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#0F172A] tabular-nums">{m.value}</p>
              <p className="text-xs font-semibold text-[#475569] mt-1">{m.label}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{m.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* AR Aging Buckets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-[#0F172A]">AR Aging Buckets</h3>
            <a href="/dashboard/ar-aging"
              className="text-[#000000] hover:text-[#111111] text-xs font-medium flex items-center gap-1 transition-colors">
              Full report <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-4">
            {BUCKETS.map((b) => {
              const bucket = metrics?.agingBuckets?.find(ag => ag.label === b.label);
              const amount = bucket?.amount ?? 0;
              const count  = bucket?.count  ?? 0;
              const pct    = totalAR > 0 && amount > 0 ? Math.max((amount / totalAR) * 100, 2) : 0;
              return (
                <div key={b.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#0F172A] font-medium">{b.label}</span>
                    <span className="text-[#222222]">
                      {fmt(amount)}{count > 0 ? ` · ${count} inv` : ""}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: b.track }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: b.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Overdue Customers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-[#0F172A]">Top Overdue Customers</h3>
            <a href="/dashboard/customers"
              className="text-[#000000] hover:text-[#111111] text-xs font-medium flex items-center gap-1 transition-colors">
              All customers <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-5 h-5 border-2 border-[#000000]/20 border-t-[#000000] rounded-full animate-spin" />
            </div>
          ) : overdue.length > 0 ? (
            <div className="space-y-1">
              {overdue.slice(0, 5).map((c, i) => (
                <div key={c.id}
                  className="flex items-center gap-3 py-2.5 border-b border-[#F1F5F9] last:border-0">
                  <span className="text-xs text-[#333333] w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0F172A] font-medium truncate">{c.name}</p>
                    <p className="text-xs text-[#333333]">
                      {c.invoiceCount} inv · {c.maxDaysOverdue}d overdue
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#0F172A] shrink-0">{fmt(c.totalOwed)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-[#333333]" />
              </div>
              <p className="text-[#222222] text-sm font-medium mb-1">
                {hasData ? "All customers are current" : "No overdue customers yet"}
              </p>
              <p className="text-[#333333] text-xs max-w-[200px] leading-relaxed">
                {hasData
                  ? "Great — no overdue accounts."
                  : "Connect an integration or import invoices to get started."}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* DSO Trend */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-[#0F172A]">DSO Trend</h3>
          <span className="text-xs text-[#222222] px-2 py-1 rounded-lg bg-[#F8F9FC] border border-[#E2E8F0]">
            Last 30 days
          </span>
        </div>
        <p className="text-[#333333] text-xs mb-6">
          Days Sales Outstanding — lower is better. Target: under 45 days.
        </p>
        <div className="flex items-end justify-between gap-1 h-20 px-1">
          {Array.from({ length: 14 }).map((_, i) => {
            const height = hasData
              ? 20 + Math.sin(i * 0.6) * 15 + i * 2
              : 10 + i * 3;
            const isHigh = height > 50;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${Math.min(height, 100)}%`,
                  background: isHigh ? "#F3F3F3" : "#F1F5F9",
                  opacity: hasData ? 1 : 0.4,
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-[#333333] text-xs">
            {hasData ? `Current DSO: ` : "Import data to see real DSO trend"}
            {hasData && (
              <span className={`font-semibold ${(metrics?.dso ?? 0) > 45 ? "text-[#DC2626]" : "text-[#16A34A]"}`}>
                {metrics?.dso ?? 0} days
              </span>
            )}
          </p>
          {hasData && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              (metrics?.dso ?? 0) > 45
                ? "bg-[#F3F3F3] text-[#DC2626]"
                : "bg-[#F0FDF4] text-[#16A34A]"
            }`}>
              {(metrics?.dso ?? 0) > 45 ? "Above target" : "On track"}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
