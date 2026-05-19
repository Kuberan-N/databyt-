"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "30%",     label: "Average DSO reduction" },
  { value: "48 hrs",  label: "From signup to live" },
  { value: "10×",     label: "Cheaper than HighRadius" },
  { value: "4 ERPs",  label: "QuickBooks, Xero, NetSuite, Sage" },
];

const integrations = ["QuickBooks", "Xero", "NetSuite", "Sage"];

export default function Hero() {
  return (
    <>
      {/* ── Dark hero ── */}
      <section className="bg-[#070707] pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8242A]/30 bg-[#E8242A]/10 mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8242A] animate-pulse" />
            <span className="text-[#E8242A] text-[11px] font-semibold tracking-widest uppercase">
              AI-Powered AR Collections
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="text-[38px] sm:text-[52px] lg:text-[60px] font-bold text-white leading-[1.08] tracking-[-0.03em] mb-5 max-w-[820px]"
          >
            Your invoices are aging<br className="hidden sm:block" /> while you read this.<br />
            <span className="text-[#E8242A]">DataByt collects them.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="text-[16px] sm:text-[17px] text-white/50 max-w-[520px] mb-9 leading-[1.7]"
          >
            Connect your accounting system. AI scores every invoice, sends personalized
            dunning emails with payment links, manages disputes, and tracks CEI —
            all without a single manual step.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.15 }}
            className="flex flex-wrap gap-3 mb-14"
          >
            <a href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E8242A] text-white text-[14px] font-semibold hover:bg-[#C41E23] transition-colors">
              Book Free AR Audit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#roi"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/15 text-white/80 text-[14px] font-medium hover:border-white/30 hover:text-white transition-colors">
              Calculate My Savings
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 border border-white/[0.08] rounded-xl overflow-hidden"
          >
            {stats.map((s, i) => (
              <div key={i} className={`px-6 py-5 ${i < stats.length - 1 ? "border-r border-white/[0.07]" : ""} ${i >= 2 ? "border-t border-white/[0.07] lg:border-t-0" : ""}`}>
                <p className="text-[24px] font-bold text-white leading-none mb-1.5">{s.value}</p>
                <p className="text-[12px] text-white/40 leading-snug">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Integrations strip ── */}
      <div className="bg-white border-b border-[#EBEBEB] py-3.5">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center gap-3">
          <span className="text-[12px] text-[#AAAAAA] font-medium mr-1">Integrates with</span>
          {integrations.map(l => (
            <span key={l}
              className="px-3 py-1 rounded-md border border-[#E8E8E8] text-[12px] font-medium text-[#555555] bg-[#FAFAFA]">
              {l}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
