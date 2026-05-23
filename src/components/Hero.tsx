"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const integrations = ["QuickBooks", "Xero", "NetSuite", "Sage"];

function DashboardMockup() {
  const bars = [38, 52, 45, 68, 61, 82];
  return (
    <div className="w-full rounded-2xl border border-[#E2E8F0] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.14)] overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="bg-[#F5F5F5] border-b border-[#E8E8E8] px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 bg-white border border-[#E2E8F0] rounded-md px-3 py-1 text-[11px] text-[#AAAAAA] text-center">
          app.databyt.in/dashboard
        </div>
      </div>

      {/* Dashboard body */}
      <div className="flex" style={{ height: 340 }}>

        {/* Sidebar */}
        <div className="w-[148px] shrink-0 bg-white border-r border-[#F0F0F0] flex flex-col p-3 gap-0.5">
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <div className="w-5 h-5 rounded bg-[#E8242A] flex items-center justify-center shrink-0">
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
                item.active ? "bg-[#FEF2F2] text-[#E8242A]" : "text-[#888888]"
              }`}>
              {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 bg-[#F8FAFC] p-4 overflow-hidden">

          {/* Top metric cards */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Total AR Outstanding", value: "$847,200", sub: "↓ collecting fast", color: "#E8242A" },
              { label: "Days Sales Outstanding", value: "42 days",    sub: "↓ 8 days this month", color: "#16A34A" },
              { label: "CEI Score",              value: "87%",        sub: "↑ excellent",          color: "#16A34A" },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-[#EBEBEB] p-3">
                <p className="text-[9px] text-[#888888] mb-1.5 leading-none">{m.label}</p>
                <p className="text-[14px] font-bold text-[#111111] leading-none mb-1">{m.value}</p>
                <p className="text-[9px] font-medium" style={{ color: m.color }}>{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Bar chart */}
            <div className="bg-white rounded-xl border border-[#EBEBEB] p-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold text-[#111111]">Collections Trend</p>
                <span className="text-[9px] text-[#AAAAAA]">6 months</span>
              </div>
              <div className="flex items-end gap-1" style={{ height: 64 }}>
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t"
                    style={{ height: `${h}%`, background: i === bars.length - 1 ? "#E8242A" : "#FECDD3" }} />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {["Dec", "Jan", "Feb", "Mar", "Apr", "May"].map(m => (
                  <span key={m} className="text-[8px] text-[#CCCCCC]">{m}</span>
                ))}
              </div>
            </div>

            {/* Invoice table */}
            <div className="bg-white rounded-xl border border-[#EBEBEB] p-3">
              <p className="text-[10px] font-semibold text-[#111111] mb-2">Overdue Invoices</p>
              {[
                { name: "Acme Corp",     amt: "$12,400", tag: "L2", tagBg: "#FEF3C7", tagTx: "#D97706" },
                { name: "TechFlow Inc",  amt: "$8,750",  tag: "L1", tagBg: "#FEF2F2", tagTx: "#E8242A" },
                { name: "BuildRight Ltd",amt: "$5,200",  tag: "L3", tagBg: "#FEE2E2", tagTx: "#991B1B" },
              ].map(inv => (
                <div key={inv.name} className="flex items-center justify-between py-1.5 border-b border-[#F5F5F5] last:border-0 gap-2">
                  <span className="text-[9px] text-[#333333] font-medium truncate">{inv.name}</span>
                  <span className="text-[9px] font-bold text-[#E8242A] shrink-0">{inv.amt}</span>
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

export default function Hero() {
  return (
    <section className="bg-[#F8FAFC] pt-24 pb-0">
      <div className="max-w-6xl mx-auto px-6">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FECDD3] bg-[#FEF2F2] text-[#E8242A] text-[11px] font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8242A] animate-pulse" />
            AI-Powered AR Collections
          </span>
        </motion.div>

        {/* Headline — centered */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease, delay: 0.05 }}
          className="text-center text-[36px] sm:text-[48px] lg:text-[56px] font-bold text-[#111111] leading-[1.1] tracking-[-0.03em] mb-4 max-w-[760px] mx-auto"
        >
          Stop chasing invoices.<br />
          <span className="text-[#E8242A]">DataByt collects them.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="text-center text-[16px] text-[#666666] max-w-[480px] mx-auto mb-8 leading-[1.7]"
        >
          AI dunning emails with payment links, dispute management,
          and live CEI analytics — connected to your accounting system in 48 hours.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <a href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E8242A] text-white text-[14px] font-semibold hover:bg-[#C41E23] transition-colors shadow-sm shadow-[#E8242A]/20">
            Book Free AR Audit
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#roi"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#E2E8F0] bg-white text-[#333333] text-[14px] font-medium hover:border-[#CCCCCC] transition-colors">
            Calculate My Savings
          </a>
        </motion.div>

        {/* Integration logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-2 mb-10"
        >
          <span className="text-[11px] text-[#AAAAAA] font-medium mr-1">Integrates with</span>
          {integrations.map(l => (
            <span key={l} className="px-3 py-1 rounded-md border border-[#E5E5E5] bg-white text-[11px] font-medium text-[#555555]">
              {l}
            </span>
          ))}
        </motion.div>

        {/* Dashboard mockup — bleeds into next section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          className="relative"
        >
          <DashboardMockup />
          {/* Fade bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}
