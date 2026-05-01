"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const numbers = [
  { before: "$16", after: "$2.50", label: "Cost per invoice processed", improvement: "84% reduction", source: "Fintech.com, 2025" },
  { before: "55 days", after: "35 days", label: "Days Sales Outstanding", improvement: "15-25 day reduction", source: "Billtrust, 2025" },
  { before: "4.5 hrs/day", after: "45 min/day", label: "Finance team manual work", improvement: "80% time saved", source: "Growfin, 2025" },
  { before: "50-80", after: "1,000+", label: "Invoices processed per day", improvement: "15x throughput", source: "Industry benchmark" },
  { before: "2-5%", after: "< 0.1%", label: "Processing error rate", improvement: "Near-zero errors", source: "American Express, 2025" },
  { before: "", after: "384%", label: "Average ROI from AR automation", improvement: "Positive ROI in 9-12 months", source: "Industry meta-analysis" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function RealNumbers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 md:py-40 px-6 bg-[#030810]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] text-blue-400 uppercase mb-5">
            Verified Data
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
            Real Numbers. <span className="text-gradient-blue">Real Sources.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every statistic below comes from published industry reports. Not projections — results companies are achieving right now.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {numbers.map((n) => (
            <motion.div
              key={n.label}
              variants={fadeUp}
              className="glass-card rounded-2xl p-8 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-5">
                {n.before ? (
                  <>
                    <span className="text-xl font-extrabold text-slate-600 line-through">{n.before}</span>
                    <span className="text-blue-400/60 text-sm">→</span>
                    <span className="text-xl font-extrabold text-white">{n.after}</span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-blue-400">{n.after}</span>
                )}
              </div>
              <p className="text-sm font-medium text-white mb-1.5">{n.label}</p>
              <p className="text-xs text-blue-400/80 font-medium mb-4">{n.improvement}</p>
              <p className="text-[10px] text-slate-600 border-t border-slate-800/40 pt-4">
                {n.source}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 max-w-3xl mx-auto glass-card p-10 rounded-2xl text-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            For a company with <span className="text-white font-semibold">$50M annual revenue</span>, reducing DSO by just 5 days frees up{" "}
            <span className="text-blue-400 font-semibold">$700,000 in working capital</span>.
          </p>
          <p className="text-[10px] text-slate-600 mt-4">Montopay Financial Analysis, 2025</p>
        </motion.div>
      </div>
    </section>
  );
}
