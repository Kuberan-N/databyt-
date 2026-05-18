"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  {
    value: "$15",
    label: "to process one invoice manually",
    sub: "Labor, errors, and rework — PLANERGY 2025",
  },
  {
    value: "25 days",
    label: "average invoice processing cycle",
    sub: "From receipt to payment — DocuClipper 2025",
  },
  {
    value: "73%",
    label: "of AP teams still key invoices manually",
    sub: "Despite automation being available — HighRadius 2025",
  },
];

export default function PainSection() {
  return (
    <section className="bg-white py-28 border-b border-[#EBEBEB]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#111111] leading-tight max-w-2xl">
            Your AR team is doing <span className="text-[#E8242A]">$30,000/month</span> of manual work
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="p-8 rounded-2xl bg-[#FAFAFA] border border-[#EBEBEB]"
            >
              <p className="text-5xl font-black text-[#E8242A] mb-3">{s.value}</p>
              <p className="text-[#111111] font-semibold text-base mb-2">{s.label}</p>
              <p className="text-[#999999] text-xs">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease, delay: 0.28 }}
          className="mt-6 rounded-2xl p-8 bg-[#111111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <p className="text-white/50 text-sm mb-1">DataByt replaces all of this for</p>
            <p className="text-4xl font-black text-white">$3,000/month</p>
            <p className="text-white/40 text-sm mt-1">10× cheaper than HighRadius. Same outcome.</p>
          </div>
          <a href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors shrink-0">
            See Pricing
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
