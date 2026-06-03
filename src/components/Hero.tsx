"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { ArrowRight, TrendingDown, Clock, DollarSign } from "lucide-react";
import type { Locale, LocaleConfig } from "@/lib/geo";

const ease = [0.22, 1, 0.36, 1] as const;

const integrations = ["QuickBooks", "Xero"];

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const value = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent =
            prefix + Math.round(v).toLocaleString() + suffix;
        }
      },
    });
    return controls.stop;
  }, [inView, target, duration, prefix, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

function DashboardMockup({ locale = "INTL" }: { locale?: Locale }) {
  const isIN = locale === "IN";
  // Tier-1 "Financial Health" metrics — mirrors the real dashboard
  const metrics = isIN
    ? [
        { label: "Total AR Outstanding",     value: "₹6.8Cr",  sub: "21 active customers",   icon: "$", iconBg: "linear-gradient(135deg,#4F46E5,#6366F1)", subTone: "#64748B" },
        { label: "Days Sales Outstanding",   value: "32d",     sub: "✓ Within 45-day target", icon: "◷", iconBg: "linear-gradient(135deg,#0F172A,#334155)", subTone: "#16A34A" },
        { label: "Collection Effectiveness", value: "86%",     sub: "✓ Healthy (80%+)",       icon: "◎", iconBg: "linear-gradient(135deg,#16A34A,#4ADE80)", subTone: "#16A34A" },
        { label: "Overdue % of AR",          value: "18%",     sub: "₹1.2Cr past due",        icon: "▮", iconBg: "linear-gradient(135deg,#D97706,#F59E0B)", subTone: "#64748B" },
      ]
    : [
        { label: "Total AR Outstanding",     value: "$744,450", sub: "21 active customers",   icon: "$", iconBg: "linear-gradient(135deg,#4F46E5,#6366F1)", subTone: "#64748B" },
        { label: "Days Sales Outstanding",   value: "32d",      sub: "✓ Within 45-day target", icon: "◷", iconBg: "linear-gradient(135deg,#0F172A,#334155)", subTone: "#16A34A" },
        { label: "Collection Effectiveness", value: "86%",      sub: "✓ Healthy (80%+)",       icon: "◎", iconBg: "linear-gradient(135deg,#16A34A,#4ADE80)", subTone: "#16A34A" },
        { label: "Overdue % of AR",          value: "18%",      sub: "$132K past due",         icon: "▮", iconBg: "linear-gradient(135deg,#D97706,#F59E0B)", subTone: "#64748B" },
      ];
  // AR aging buckets — horizontal rows like the real dashboard
  const buckets = isIN
    ? [
        { label: "Current",    amt: "₹1.9Cr", inv: 6,  pct: 34, color: "#16A34A" },
        { label: "1–30 days",  amt: "₹2.4Cr", inv: 9,  pct: 42, color: "#4F46E5" },
        { label: "31–60 days", amt: "₹1.1Cr", inv: 4,  pct: 16, color: "#EA580C" },
        { label: "90+ days",   amt: "₹0.4Cr", inv: 2,  pct: 8,  color: "#B91C1C" },
      ]
    : [
        { label: "Current",    amt: "$210K", inv: 6,  pct: 34, color: "#16A34A" },
        { label: "1–30 days",  amt: "$268K", inv: 9,  pct: 42, color: "#4F46E5" },
        { label: "31–60 days", amt: "$132K", inv: 4,  pct: 16, color: "#EA580C" },
        { label: "90+ days",   amt: "$48K",  inv: 2,  pct: 8,  color: "#B91C1C" },
      ];
  // Top overdue customers — ranked list like the real dashboard
  const top = isIN
    ? [
        { rank: 1, name: "Sunrise Foods",    meta: "4 inv · 12d overdue",  amt: "₹45.8L" },
        { rank: 2, name: "Global Trade Co",  meta: "3 inv · 28d overdue",  amt: "₹24.5L" },
        { rank: 3, name: "Acme Corp",        meta: "4 inv · 9d overdue",   amt: "₹7.4L"  },
      ]
    : [
        { rank: 1, name: "Sunrise Foods",    meta: "4 inv · 12d overdue",  amt: "$58,550" },
        { rank: 2, name: "Global Trade Co",  meta: "3 inv · 28d overdue",  amt: "$45,000" },
        { rank: 3, name: "Acme Corp",        meta: "4 inv · 9d overdue",   amt: "$33,700" },
      ];
  return (
    <div className="w-full rounded-2xl border border-[#E2E8F0] shadow-[0_40px_100px_-20px_rgba(79,70,229,0.18)] overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="bg-[#F5F3FF] border-b border-[#E2E8F0] px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 bg-white border border-[#E2E8F0] rounded-md px-3 py-1 text-[11px] text-[#64748B] text-center">
          app.databyt.in/dashboard
        </div>
      </div>

      {/* Dashboard body */}
      <div className="flex" style={{ height: 372 }}>
        {/* Sidebar */}
        <div className="w-[150px] shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col p-3 gap-0.5 relative">
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg,#4F46E5,#7C3AED)" }} />
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <div className="w-5 h-5 rounded bg-[#0F172A] flex items-center justify-center shrink-0">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="2" y="2" width="2" height="7" fill="white" />
                <path d="M4 2h2.5C8.43 2 10 3.57 10 5.5S8.43 9 6.5 9H4V2Z" fill="white" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[#0F172A]">DataByt</span>
          </div>
          {[
            { label: "Dashboard",    active: true },
            { label: "AR Aging",     active: false },
            { label: "Collections",  active: false },
            { label: "Disputes",     active: false },
            { label: "Analytics",    active: false },
            { label: "Customers",    active: false },
            { label: "Reports",      active: false },
            { label: "Settings",     active: false },
          ].map(item => (
            <div key={item.label}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                item.active ? "bg-[#EEF2FF] text-[#4338CA] border-l-2 border-[#4F46E5]" : "text-[#64748B]"
              }`}>
              {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 bg-[#F8FAFC] p-4 overflow-hidden">
          {/* Tier label */}
          <p className="text-[7.5px] font-bold text-[#6366F1] uppercase tracking-widest mb-1.5">Financial Health</p>

          {/* 4 metric cards */}
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {metrics.map(m => (
              <div key={m.label} className="bg-white rounded-lg border border-[#E2E8F0] p-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center mb-1.5 text-white text-[10px] font-bold"
                  style={{ background: m.iconBg }}>{m.icon}</div>
                <p className="text-[13px] font-bold text-[#0F172A] leading-none mb-1">{m.value}</p>
                <p className="text-[8px] text-[#64748B] mb-0.5 leading-tight">{m.label}</p>
                <p className="text-[8px] font-semibold leading-none" style={{ color: m.subTone }}>{m.sub}</p>
              </div>
            ))}
          </div>

          {/* AR Aging Buckets + Top Overdue Customers */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-3">
              <p className="text-[10px] font-semibold text-[#0F172A] mb-2.5">AR Aging Buckets</p>
              <div className="space-y-2">
                {buckets.map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8.5px] text-[#475569] font-medium">{b.label}</span>
                      <span className="text-[8px] text-[#64748B]">{b.amt} · {b.inv} inv</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-3">
              <p className="text-[10px] font-semibold text-[#0F172A] mb-2.5">Top Overdue Customers</p>
              {top.map(c => (
                <div key={c.rank} className="flex items-center gap-2 py-1.5 border-b border-[#F1F5F9] last:border-0">
                  <span className="text-[8px] text-[#94A3B8] w-2 shrink-0">{c.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-semibold text-[#0F172A] truncate leading-none mb-0.5">{c.name}</p>
                    <p className="text-[7.5px] text-[#64748B] leading-none">{c.meta}</p>
                  </div>
                  <span className="text-[9px] font-bold text-[#0F172A] shrink-0">{c.amt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ locale = "INTL", cfg }: { locale?: Locale; cfg?: LocaleConfig }) {
  const arStat = locale === "IN" ? { prefix: "₹", target: 7, suffix: "Cr" } : { prefix: "$", target: 847, suffix: "K" };
  const stats = [
    { icon: TrendingDown, prefix: "",            target: 30,          suffix: "%",       label: "avg DSO reduction",    color: "#4F46E5" },
    { icon: Clock,        prefix: "",            target: 48,          suffix: "hrs",     label: "to live collections",  color: "#4F46E5" },
    { icon: DollarSign,   prefix: arStat.prefix, target: arStat.target, suffix: arStat.suffix, label: "avg AR recovered/mo", color: "#4F46E5" },
  ];
  void cfg;
  return (
    <section className="relative bg-[#F8FAFC] pt-24 pb-0 overflow-hidden">
      {/* Subtle brand grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #C7D2FE 1px, transparent 0)",
        backgroundSize: "32px 32px",
        opacity: 0.35,
      }} />
      {/* Soft indigo glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="flex justify-center mb-7"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] text-[#4338CA] text-[11px] font-semibold tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
            AI-Powered AR Collections
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="text-center text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold text-[#111111] leading-[1.05] tracking-[-0.03em] mb-5 max-w-[820px] mx-auto"
        >
          Stop chasing invoices.
          <br />
          <span className="text-[#111111]">DataByt collects them.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.12 }}
          className="text-center text-[17px] text-[#475569] max-w-[500px] mx-auto mb-9 leading-[1.7] font-[450]"
        >
          AI dunning emails, dispute management, and live CEI analytics —
          connected to your accounting system in 48 hours.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.18 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <a href="/auth"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#4F46E5] text-white text-[14px] font-semibold hover:bg-[#4338CA] transition-all shadow-lg shadow-[#4F46E5]/25 hover:shadow-[#4F46E5]/40 hover:-translate-y-0.5">
            Start Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a href="#roi"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#C7D2FE] bg-white text-[#4338CA] text-[14px] font-semibold hover:border-[#4F46E5] hover:bg-[#EEF2FF] hover:-translate-y-0.5 transition-all">
            Calculate My Savings
          </a>
        </motion.div>

        {/* Live stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.22 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] border border-[#4F46E5]/20 flex items-center justify-center shadow-sm">
                <s.icon className="w-3.5 h-3.5 text-[#4F46E5]" />
              </div>
              <div>
                <p className="text-[16px] font-extrabold leading-none" style={{ color: s.color }}>
                  <AnimatedCounter
                    target={s.target}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    duration={1.6 + i * 0.2}
                  />
                </p>
                <p className="text-[11px] text-[#64748B] mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Integration logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease, delay: 0.28 }}
          className="flex flex-wrap justify-center items-center gap-2 mb-12"
        >
          <span className="text-[11px] text-[#64748B] font-medium mr-1">Integrates with</span>
          {integrations.map(l => (
            <span key={l} className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[11px] font-semibold text-[#475569] shadow-sm">
              {l}
            </span>
          ))}
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.3 }}
          className="relative"
        >
          <DashboardMockup locale={locale} />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}
