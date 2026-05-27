"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const stackItems = [
  { item: "AI Collections Agent (Tesorio / YayPay equivalent)", value: "$24,000/yr" },
  { item: "AP Invoice Automation (AvidXchange / Stampli equivalent)", value: "$18,000/yr" },
  { item: "ERP Integration & Daily Sync", value: "$6,000/yr" },
  { item: "Dispute Management Portal", value: "$6,000/yr" },
  { item: "AR Analytics + CEI Dashboard", value: "$6,000/yr" },
  { item: "Done-for-you deployment & onboarding", value: "$5,000" },
  { item: "Board-ready PDF reporting suite", value: "$3,600/yr" },
  { item: "Priority support (12 months)", value: "$2,400/yr" },
];

const totalValue = 71000;
const databytPrice = 20000;

const guarantees = [
  {
    emoji: "🔒",
    title: "Performance Guarantee",
    desc: "If your DSO doesn't drop in 30 days, we work free until it does.",
  },
  {
    emoji: "💸",
    title: "30-Day Money Back",
    desc: "Not satisfied? Full refund. No questions asked. You keep all your data.",
  },
  {
    emoji: "📦",
    title: "Full Data Portability",
    desc: "Cancel anytime. Full data export within 24 hours. No lock-in.",
  },
  {
    emoji: "🧪",
    title: "Try Before You Buy",
    desc: "We run live collections on your real invoices before you pay a cent.",
  },
];

export default function ValueStack() {
  return (
    <section className="bg-[#F8FAFC] py-20 border-b border-[#E8E8E8]">
      <div className="max-w-4xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-12"
        >

          <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#111111] leading-[1.15] tracking-[-0.02em] mb-4">
            An offer so good,<br />
            <span className="text-[#4F46E5]">saying no feels like a mistake.</span>
          </h2>
          <p className="text-[#333333] text-[15px] max-w-md mx-auto">
            We take on the risk. You keep the upside.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden shadow-sm"
        >
          {/* Stack items */}
          <div className="p-8 border-b border-[#F0F0F0]">
            <p className="text-[11px] font-semibold text-[#4F46E5] uppercase tracking-wider mb-5">What you get — and what it costs elsewhere</p>
            <div className="space-y-3">
              {stackItems.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease }}
                  className="flex items-center justify-between py-3 border-b border-[#F5F5F5] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#4F46E5] shrink-0" />
                    <span className="text-[13.5px] text-[#111111]">{s.item}</span>
                  </div>
                  <span className="text-[13px] text-[#333333]/40 line-through font-mono shrink-0 ml-4">{s.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Price reveal */}
          <div className="bg-[#111111] p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-white/40 text-[13px] mb-1">If bought separately</p>
                <p className="text-[32px] font-extrabold text-white/30 line-through leading-none mb-4">
                  ${totalValue.toLocaleString()}+/yr
                </p>
                <p className="text-white/50 text-[13px] mb-1">DataByt Pro — everything above</p>
                <p className="text-[46px] font-extrabold text-white leading-none">
                  ${databytPrice.toLocaleString()}<span className="text-[20px] text-white/30 font-medium">/yr</span>
                </p>
                <p className="text-[#A5B4FC] text-[13px] mt-2 font-semibold">
                  You save ${(totalValue - databytPrice).toLocaleString()}+ per year
                </p>
              </div>
              <a
                href="/auth"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#111111] text-[14px] font-bold hover:bg-[#F3F3F3] transition-colors shrink-0 group"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Guarantees */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45, ease }}
              className="rounded-xl p-5 bg-white border border-[#E5E5E5]"
            >
              <p className="text-[15px] mb-1">{g.emoji} <span className="font-semibold text-[#111111] text-[13px]">{g.title}</span></p>
              <p className="text-[#333333] text-[12px] leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
