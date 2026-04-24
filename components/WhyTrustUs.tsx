"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";

const genericRows = [
  "Can call LLM APIs",
  "Knows LangChain",
  "Builds demos on clean data",
  "Can't handle messy production data",
  "No FinOps — runaway costs",
  "Works on their infrastructure",
  "$40K project becomes $80K when data issues hit",
];

const databytRows = [
  "Data engineers FIRST, AI builders second",
  "Databricks-native (Mosaic AI, Unity Catalog)",
  "Handle real enterprise data — messy, siloed, governed",
  "FinOps-aware — costs controlled from Day 1",
  "All work inside your Databricks workspace",
  "Fixed price, no surprises",
  "You own every line of code we write",
];

const genericPositive = [true, true, true, false, false, false, false];
const databytPositive = [true, true, true, true, true, true, true];

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
            <span className="text-gradient-blue">Generic AI Consultants?</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            Generic AI developers and agencies can call an LLM. What they can&apos;t do is handle your real enterprise data.
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
          <div className="grid grid-cols-3 border-b border-slate-800">
            <div className="p-5 text-xs font-semibold uppercase tracking-widest text-slate-500">
              What They Offer
            </div>
            <div className="p-5 text-center text-sm font-semibold text-slate-400 border-l border-slate-800">
              Generic AI Dev / Agency
            </div>
            <div className="p-5 text-center text-sm font-bold text-white bg-blue-500/5 border-l border-blue-500/20">
              <span className="text-gradient-blue">Databyt</span>
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
                className="grid grid-cols-3 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
              >
                <div className="p-4 text-sm text-slate-400 flex items-center">
                  {databytRows[i]}
                </div>
                <div className="p-4 flex items-center justify-center border-l border-slate-800">
                  {genericPositive[i] ? (
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-slate-500" />
                      <span className="text-sm text-slate-500">{item}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <X size={16} className="text-red-500/70" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center border-l border-blue-500/20 bg-blue-500/3">
                  <Check size={16} className="text-blue-400 flex-shrink-0" />
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
          The difference isn&apos;t the AI toolkit — it&apos;s whether your data is ready to power it.
        </motion.p>
      </div>
    </section>
  );
}
