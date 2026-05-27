"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { ArrowRight, TrendingDown, Clock, DollarSign } from "lucide-react";

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

function DashboardMockup() {
  const bars = [38, 52, 45, 68, 61, 82];
  return (
    <div className="w-full rounded-2xl border border-[#E2E8F0] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.18)] overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="bg-[#F5F5F5] border-b border-[#E8E8E8] px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 bg-white border border-[#E2E8F0] rounded-md px-3 py-1 text-[11px] text-[#555555] text-center">
          app.databyt.in/dashboard
        </div>
      </div>

      {/* Dashboard body */}
      <div className="flex" style={{ height: 340 }}>
        {/* Sidebar */}
        <div className="w-[148px] shrink-0 bg-white border-r border-[#F0F0F0] flex flex-col p-3 gap-0.5">
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <div className="w-5 h-5 rounded bg-[#000000] flex items-center justify-center shrink-0">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="2" y="2" width="2" height="7" fill="white" />
                <path d="M4 2h2.5C8.43 2 10 3.57 10 5.5S8.43 9 6.5 9H4V2Z" fill="white" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[#111111]">DataByt</span>
          </div>
          {[
            { label: "Dashboard",   active: true },
            { label: "AR Aging",    active: false },
            { label: "Collections", active: false },
            { label: "Disputes",    active: false },
            { label: "Analytics",   active: false },
            { label: "Reports",     active: false },
          ].map(item => (
            <div key={item.label}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                item.active ? "bg-[#F3F3F3] text-[#000000]" : "text-[#555555]"
              }`}>
              {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 bg-[#F8FAFC] p-4 overflow-hidden">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Total AR Outstanding", value: "$847,200", sub: "↓ collecting fast", color: "#000000" },
              { label: "Days Sales Outstanding", value: "42 days",    sub: "↓ 8 days this month", color: "#16A34A" },
              { label: "CEI Score",              value: "87%",        sub: "↑ excellent",          color: "#16A34A" },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-[#EBEBEB] p-3">
                <p className="text-[9px] text-[#555555] mb-1.5 leading-none">{m.label}</p>
                <p className="text-[14px] font-bold text-[#111111] leading-none mb-1">{m.value}</p>
                <p className="text-[9px] font-semibold" style={{ color: m.color }}>{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl border border-[#EBEBEB] p-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold text-[#111111]">Collections Trend</p>
                <span className="text-[9px] text-[#555555]">6 months</span>
              </div>
              <div className="flex items-end gap-1" style={{ height: 64 }}>
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t"
                    style={{ height: `${h}%`, background: i === bars.length - 1 ? "#000000" : "#E5E5E5" }} />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {["Dec", "Jan", "Feb", "Mar", "Apr", "May"].map(m => (
                  <span key={m} className="text-[8px] text-[#999999]">{m}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#EBEBEB] p-3">
              <p className="text-[10px] font-semibold text-[#111111] mb-2">Overdue Invoices</p>
              {[
                { name: "Acme Corp",     amt: "$12,400", tag: "L2", tagBg: "#FEF3C7", tagTx: "#92400E" },
                { name: "TechFlow Inc",  amt: "$8,750",  tag: "L1", tagBg: "#F3F3F3", tagTx: "#111111" },
                { name: "BuildRight Ltd",amt: "$5,200",  tag: "L3", tagBg: "#FEE2E2", tagTx: "#312E81" },
              ].map(inv => (
                <div key={inv.name} className="flex items-center justify-between py-1.5 border-b border-[#F5F5F5] last:border-0 gap-2">
                  <span className="text-[9px] text-[#555555] font-medium truncate">{inv.name}</span>
                  <span className="text-[9px] font-bold text-[#111111] shrink-0">{inv.amt}</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full font-semibold shrink-0"
                    style={{ background: inv.tagBg, color: inv.tagTx }}>{inv.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { icon: TrendingDown, prefix: "", target: 30, suffix: "%", label: "avg DSO reduction", color: "#4F46E5" },
  { icon: Clock,        prefix: "", target: 48, suffix: "hrs", label: "to live collections", color: "#4F46E5" },
  { icon: DollarSign,  prefix: "$", target: 847, suffix: "K", label: "avg AR recovered/mo", color: "#4F46E5" },
];

export default function Hero() {
  return (
    <section className="relative bg-[#F8FAFC] pt-24 pb-0 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #E5E5E5 1px, transparent 0)",
        backgroundSize: "32px 32px",
        opacity: 0.4,
      }} />

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="flex justify-center mb-7"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4D4D4] bg-white text-[#111111] text-[11px] font-semibold tracking-widest uppercase shadow-sm">
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
          className="text-center text-[17px] text-[#333333] max-w-[500px] mx-auto mb-9 leading-[1.7] font-[450]"
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
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#E2E8F0] bg-white text-[#333333] text-[14px] font-medium hover:border-[#4F46E5]/40 hover:-translate-y-0.5 transition-all">
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
                <p className="text-[11px] text-[#333333] mt-0.5">{s.label}</p>
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
          <span className="text-[11px] text-[#333333] font-medium mr-1">Integrates with</span>
          {integrations.map(l => (
            <span key={l} className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-white text-[11px] font-semibold text-[#333333] shadow-sm">
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
          <DashboardMockup />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}
