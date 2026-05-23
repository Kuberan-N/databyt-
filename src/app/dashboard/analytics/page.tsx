"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import {
  TrendingUp, TrendingDown, Mail, Clock, AlertTriangle,
  CheckCircle, Minus, RefreshCw, DollarSign,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchAnalyticsData, type AnalyticsData } from "@/lib/analytics-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function StatCard({
  label, value, sub, icon: Icon, iconColor = "#2563EB", delay = 0,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; iconColor?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-2xl p-5"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${iconColor}18` }}>
        <Icon className="w-4 h-4" style={{ color: iconColor }} />
      </div>
      <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
      <p className="text-[#64748B] text-xs mt-0.5">{label}</p>
      {sub && <p className="text-[#94A3B8] text-xs mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function CEIGauge({ value, prev }: { value: number; prev: number }) {
  const color = value >= 80 ? "#16A34A" : value >= 60 ? "#D97706" : "#DC2626";
  const diff = value - prev;
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${(value / 100) * 264} 264`}
            strokeLinecap="round" className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-[#0F172A]">{value}%</span>
          <span className="text-xs text-[#64748B]">CEI</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        {diff > 0
          ? <TrendingUp className="w-3.5 h-3.5 text-green-600" />
          : diff < 0
          ? <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          : <Minus className="w-3.5 h-3.5 text-[#94A3B8]" />}
        <span className={`text-xs font-medium ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-500" : "text-[#94A3B8]"}`}>
          {diff > 0 ? "+" : ""}{diff}% vs last month
        </span>
      </div>
      <p className="text-xs text-[#94A3B8] mt-1">
        {value >= 80 ? "Excellent — top quartile" : value >= 60 ? "Good — room to improve" : "Needs attention"}
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { organization } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    try {
      const result = await fetchAnalyticsData(organization.id);
      setData(result);
    } catch {
      // show empty state
    } finally {
      setLoading(false);
    }
  }, [organization]);

  useEffect(() => { load(); }, [load]);

  const spinner = (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
    </div>
  );

  if (loading) return spinner;

  const d = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Analytics</h2>
          <p className="text-[#64748B] text-sm mt-1">Collections performance and AR intelligence</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] text-sm hover:text-[#2563EB] hover:border-[#2563EB]/30 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Top KPI row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Emails Sent (month)" value={d?.emailEffectiveness.totalSent.toString() ?? "0"}
          sub={`${d?.emailEffectiveness.openRate ?? 0}% open rate`} icon={Mail} delay={0} />
        <StatCard label="Payment Conversion" value={`${d?.emailEffectiveness.paymentConversionRate ?? 0}%`}
          sub="Dunned invoices that paid" icon={CheckCircle} iconColor="#16A34A" delay={0.05} />
        <StatCard label="Avg Days to Pay" value={`${d?.velocity.avgDaysToPayAfterReminder ?? 0}d`}
          sub="After first reminder email" icon={Clock} iconColor="#D97706" delay={0.1} />
        <StatCard label="Active Disputes" value={d?.activeDisputes.toString() ?? "0"}
          sub={`${d?.resolvedDisputes ?? 0} resolved`} icon={AlertTriangle} iconColor="#DC2626" delay={0.15} />
      </div>

      {/* CEI + Email Breakdown */}
      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Collections Effectiveness Index</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                (Collected ÷ Collectible) × 100 — target: 80%+
              </p>
            </div>
          </div>
          {d ? (
            <>
              <CEIGauge value={d.cei.cei} prev={d.cei.prevCei} />
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
                  <p className="text-xs text-[#64748B]">Collected</p>
                  <p className="text-base font-bold text-[#0F172A] mt-0.5">{fmt(d.cei.collected)}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
                  <p className="text-xs text-[#64748B]">Collectible AR</p>
                  <p className="text-base font-bold text-[#0F172A] mt-0.5">{fmt(d.cei.collectible)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-[#94A3B8] text-sm">No data yet</div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-5">Email Performance</h3>
          {d && d.emailEffectiveness.totalSent > 0 ? (
            <div className="space-y-4">
              {[
                { label: "Sent", value: d.emailEffectiveness.totalSent, color: "#64748B", pct: 100 },
                { label: "Opened", value: d.emailEffectiveness.opened, color: "#D97706", pct: d.emailEffectiveness.openRate },
                { label: "Clicked", value: d.emailEffectiveness.clicked, color: "#16A34A", pct: d.emailEffectiveness.totalSent > 0 ? Math.round((d.emailEffectiveness.clicked / d.emailEffectiveness.totalSent) * 100) : 0 },
                { label: "Bounced", value: d.emailEffectiveness.bounced, color: "#DC2626", pct: d.emailEffectiveness.totalSent > 0 ? Math.round((d.emailEffectiveness.bounced / d.emailEffectiveness.totalSent) * 100) : 0 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#64748B]">{row.label}</span>
                    <span className="text-xs font-medium text-[#0F172A]">{row.value} ({row.pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F1F5F9]">
                    <div className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${row.pct}%`, background: row.color }} />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">Payment conversion (dunned → paid)</span>
                  <span className="text-sm font-bold text-[#2563EB]">{d.emailEffectiveness.paymentConversionRate}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-[#94A3B8] text-sm">No emails sent yet</div>
          )}
        </motion.div>
      </div>

      {/* Monthly Collections Trend */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-5">Collections — 6 Month Trend</h3>
        {d && d.monthlyTrend.some(m => m.collected > 0) ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.monthlyTrend} barSize={36}>
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 12, color: "#0F172A" }}
                formatter={(v) => [fmt(Number(v)), "Collected"]}
              />
              <Bar dataKey="collected" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-52 text-[#94A3B8] text-sm">
            No payment data yet — collections will appear here once invoices are paid
          </div>
        )}
      </motion.div>

      {/* Velocity + Bad Debt row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Fastest Payment" value={`${d?.velocity.fastestPaymentDays ?? 0}d`}
          sub="After first reminder" icon={TrendingUp} iconColor="#16A34A" delay={0.35} />
        <StatCard label="Median Pay Speed" value={`${d?.velocity.medianDaysToPayAfterReminder ?? 0}d`}
          sub="P50 days after reminder" icon={Clock} iconColor="#64748B" delay={0.38} />
        <StatCard label="Slowest Payment" value={`${d?.velocity.slowestPaymentDays ?? 0}d`}
          sub="Worst-case observed" icon={TrendingDown} iconColor="#D97706" delay={0.41} />
        <StatCard label="Bad Debt Rate" value={`${d?.badDebtRate ?? 0}%`}
          sub={`${fmt(d?.totalWrittenOff ?? 0)} written off`} icon={DollarSign} iconColor="#DC2626" delay={0.44} />
      </div>

      {/* CEI explanation */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-5 bg-[#EFF6FF] border border-[#2563EB]/15">
        <p className="text-xs font-semibold text-[#2563EB] mb-1">What is CEI?</p>
        <p className="text-xs text-[#7F1D1D] leading-relaxed">
          The Collections Effectiveness Index measures how much of your collectible AR you actually collected in a period.
          100% = you collected everything. 80%+ is excellent. Below 60% means invoices are aging into bad debt.
          Industry average for manual teams is ~65–72%. DataByt&apos;s AI-driven collections target 80%+.
        </p>
      </motion.div>
    </div>
  );
}
