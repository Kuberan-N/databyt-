"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Clock, DollarSign, Shield } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "30%",    label: "Average DSO reduction",   icon: TrendingDown },
  { value: "48 hrs", label: "From signup to live",      icon: Clock },
  { value: "10×",    label: "Cheaper than HighRadius",  icon: DollarSign },
  { value: "CAN-SPAM", label: "Compliant by default",  icon: Shield },
];

const logos = ["QuickBooks", "Xero", "NetSuite", "Sage"];

export default function Hero() {
  return (
    <section className="bg-white pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Social proof banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF2F2] border border-[#E8242A]/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#E8242A] animate-pulse" />
          <span className="text-[#E8242A] text-xs font-semibold">
            44% of B2B invoices are paid late — DataByt fixes that, automatically
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#111111] leading-[1.0] tracking-tight mb-6">
            Your invoices are<br />
            aging while you read this.<br />
            <span className="text-[#E8242A]">DataByt collects them.</span>
          </h1>

          <p className="text-xl text-[#555555] max-w-2xl mb-4 leading-relaxed">
            AI-powered AR automation that connects to QuickBooks, Xero, NetSuite, and Sage —
            sends personalized dunning emails with payment links, manages disputes,
            matches payments automatically, and shows your CFO real collection metrics.
          </p>
          <p className="text-sm text-[#999999] mb-10">
            No IT setup. No 6-month implementation. Live in <strong className="text-[#111111]">48 hours</strong>.
            Used by finance teams who have better things to do than chase invoices.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors shadow-lg shadow-[#E8242A]/20">
              Book Free AR Audit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[#DDDDDD] text-[#333333] text-sm font-bold hover:border-[#111111] transition-colors">
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Integration logos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="mt-14 flex flex-wrap items-center gap-3"
        >
          <span className="text-xs text-[#AAAAAA] font-medium mr-2">Connects with</span>
          {logos.map((l) => (
            <span key={l} className="px-4 py-2 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA] text-xs font-semibold text-[#444444]">
              {l}
            </span>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.07 }}
              className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-[#E8242A]" />
              </div>
              <div>
                <p className="text-xl font-black text-[#111111] leading-none">{s.value}</p>
                <p className="text-xs text-[#777777] mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
