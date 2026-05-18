"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "$15",
    label: "average cost to process one invoice manually",
    sub: "labor, errors, and rework included — PLANERGY 2025",
  },
  {
    value: "25 days",
    label: "average invoice processing cycle",
    sub: "from receipt to payment approval — DocuClipper 2025",
  },
  {
    value: "73%",
    label: "of AP teams still manually key invoices into their system",
    sub: "despite automation being widely available — HighRadius 2025",
  },
];

export default function PainSection() {
  return (
    <section className="bg-[#F8F9FC] py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#E8242A] mb-4">The Cost of Doing Nothing</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] leading-tight">
            Your AR Team Is Doing{" "}
            <span className="text-[#E8242A]">$30,000/Month</span>
            {" "}of Manual Work
          </h2>
        </motion.div>

        {/* Stat cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm"
            >
              <p className="text-5xl font-black text-[#E8242A] mb-3">{s.value}</p>
              <p className="text-[#0F172A] font-semibold text-base mb-2 leading-snug">{s.label}</p>
              <p className="text-[#94A3B8] text-xs italic">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Navy callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1B2B6B] rounded-2xl px-8 py-10 text-center"
        >
          <p className="text-white/80 text-lg mb-1">DataByt replaces all of this for</p>
          <p className="text-white text-4xl sm:text-5xl font-black mb-2">$3,000/month</p>
          <p className="text-white/60 text-base">
            10x cheaper than HighRadius. Same enterprise-grade outcome.
          </p>
          <a href="#pricing"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#E8242A] text-white text-sm font-bold rounded-lg hover:bg-[#C41E23] transition-colors">
            See Pricing
          </a>
        </motion.div>
      </div>
    </section>
  );
}
