"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

const statBadges = [
  { value: "30%", label: "DSO Reduction" },
  { value: "95%+", label: "Email Accuracy" },
  { value: "48 hrs", label: "Setup Time" },
];

const socialProof = [
  "Meridian Holdings", "Alpine Capital", "NovaBridge Group",
  "Stellarworks Inc", "Crestline Partners", "Vantage CFO",
];

export default function Hero() {
  return (
    <section className="bg-white pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Social proof ticker */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-center gap-2 mb-10 flex-wrap"
        >
          <span className="text-xs font-medium text-[#94A3B8] uppercase tracking-widest">Trusted by finance teams at</span>
          {socialProof.map((c, i) => (
            <span key={i} className="text-xs font-semibold text-[#64748B] px-2.5 py-1 rounded-full bg-[#F8F9FC] border border-[#E2E8F0]">
              {c}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black leading-[1.08] tracking-tight text-[#0F172A] mb-6">
            Recover Overdue Receivables{" "}
            <span className="text-[#1B2B6B]">30% Faster</span>{" "}
            <span className="text-[#E8242A]">With AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed">
            DataByt&apos;s AI Collections Agent prioritizes your overdue invoices,
            drafts personalized dunning emails, and chases payments automatically.
            Built for finance teams who are tired of manual follow-ups.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a href="#pricing" id="hero-cta-primary"
              className="group flex items-center gap-2 px-8 py-4 rounded-lg bg-[#1B2B6B] text-white text-base font-bold hover:bg-[#152356] transition-colors shadow-lg shadow-[#1B2B6B]/20">
              Book a Demo — Free AR Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a href="#how-it-works" id="hero-cta-secondary"
              className="text-base font-semibold text-[#E8242A] hover:text-[#C41E23] transition-colors flex items-center gap-1">
              See How It Works <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust line */}
          <p className="text-sm text-[#94A3B8] mb-12">
            Trusted by finance teams at mid-market companies across US &amp; EU.
            No IT involvement. Live in 48 hours.
          </p>
        </motion.div>

        {/* Stat badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          {statBadges.map((s, i) => (
            <div key={i}
              className="flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-[#1B2B6B]/20 rounded-xl shadow-sm">
              <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0" />
              <div>
                <span className="text-xl font-black text-[#1B2B6B]">{s.value}</span>
                <span className="text-sm font-medium text-[#64748B] ml-2">{s.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Free audit callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto bg-[#F8F9FC] border border-[#E2E8F0] rounded-2xl p-8 text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8242A] mb-3">Free AR Audit</p>
          <p className="text-[#0F172A] font-semibold text-lg mb-2">
            We&apos;ll review your current AR process and show you exactly where the money is leaking.
          </p>
          <p className="text-[#64748B] text-sm">
            30-minute call. No sales pressure. Free. No commitment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
