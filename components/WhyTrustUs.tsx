"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";

const genericRows = [
  "$15K-$40K minimum engagement",
  "3-4 week start time",
  "Generic audits, mostly meetings",
  "Junior consultants doing the work",
  "Scope expands, price expands",
];

const databytRows = [
  "$749 flat, no surprises",
  "Kick off within 48 hours",
  "Fixed-scope deliverable",
  "Senior engineer does everything",
  "What you see is what you pay",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function WhyTrustUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6 bg-[#0A1628]/30">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Why Not Hire{" "}
            <span className="text-gradient-blue">a Consultant?</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            Traditional consultants bill by the hour and stretch projects out. We productized the exact steps needed to find waste.
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Header */}
          <div className="grid grid-cols-2 border-b border-slate-800">
            <div className="p-5 text-center text-sm font-semibold text-slate-400">
              Hiring a Databricks Consultant
            </div>
            <div className="p-5 text-center text-sm font-bold text-white bg-blue-500/5 border-l border-blue-500/20">
              <span className="text-gradient-blue">Databyt Audit</span>
            </div>
          </div>

          {/* Rows */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {genericRows.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="grid grid-cols-2 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
              >
                <div className="p-4 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <X size={16} className="text-red-500/70 flex-shrink-0" />
                    <span className="text-sm text-slate-400">{item}</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-center border-l border-blue-500/20 bg-blue-500/3">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-white font-medium">{databytRows[i]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-slate-500 text-sm mt-8 italic"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          The difference isn&apos;t the process — it&apos;s the lack of bloated scope.
        </motion.p>
      </div>
    </section>
  );
}
