"use client";

import { motion } from "framer-motion";

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
    <section className="bg-white py-24 border-b border-[#111111]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#111111] leading-tight max-w-2xl">
            Your AR team is doing <span className="text-[#E8242A]">$30,000/month</span> of manual work
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-0 border border-[#111111]">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              className={`p-8 ${i < stats.length - 1 ? "border-r border-[#111111] md:border-b-0 border-b" : ""}`}
            >
              <p className="text-5xl font-black text-[#E8242A] mb-3">{s.value}</p>
              <p className="text-[#111111] font-semibold text-base mb-2">{s.label}</p>
              <p className="text-[#888888] text-xs">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="mt-6 border border-[#111111] p-8 bg-[#111111] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <p className="text-white/60 text-sm mb-1">DataByt replaces all of this for</p>
            <p className="text-4xl font-black">$3,000/month</p>
            <p className="text-white/50 text-sm mt-1">10× cheaper than HighRadius. Same outcome.</p>
          </div>
          <a href="#pricing"
            className="px-6 py-3 bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors shrink-0">
            See Pricing
          </a>
        </motion.div>

      </div>
    </section>
  );
}
