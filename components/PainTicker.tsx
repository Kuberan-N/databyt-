"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "$16", label: "avg cost per manual invoice", source: "Fintech.com" },
  { value: "4.5hrs", label: "daily manual data entry", source: "Growfin" },
  { value: "45–55", label: "day avg DSO, Series B SaaS", source: "LedgerUp" },
  { value: "27%", label: "AR time on dispute resolution", source: "Amex" },
  { value: "$30K", label: "lost per AR rep per year", source: "Growfin" },
  { value: "384%", label: "avg ROI from AR automation", source: "Industry" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function PainTicker() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 px-6 bg-[#030810] border-y border-slate-800/30">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.p
          className="text-center text-[11px] font-medium uppercase tracking-[0.25em] text-slate-600 mb-12"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          The real cost of manual accounts receivable
        </motion.p>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-5 rounded-2xl glass-card transition-all duration-500 group"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-blue-400 group-hover:text-cyan-400 transition-colors duration-500 mb-2">
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight mb-3">{stat.label}</p>
              <span className="text-[9px] text-slate-700">{stat.source}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
