"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

const differentiators = [
  {
    point: "Most agent builders can't handle real enterprise data. We can.",
    emphasis: true,
  },
  {
    point: "Databricks-native — your data never leaves your workspace",
    emphasis: false,
  },
  {
    point: "FinOps-aware — we control token costs from Day 1",
    emphasis: false,
  },
  {
    point: "Unity Catalog governance — every action is audited",
    emphasis: false,
  },
  {
    point: "You own every line of code we write",
    emphasis: false,
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function TheRealProblem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6 bg-[#0A1628]/30">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: heading + context */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
              Our Difference
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading leading-tight">
              We&apos;re{" "}
              <span className="text-gradient-blue">
                Data Engineers First,
              </span>{" "}
              AI Builders Second
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Building an AI agent on clean demo data is easy. Building one that survives your messy, siloed, governed enterprise data — that&apos;s a fundamentally different skill set. Most AI agencies don&apos;t have it.
            </p>
            <p className="text-slate-400 leading-relaxed">
              We came up through data engineering — Databricks, Unity Catalog, dbt, Spark. We only build AI on top of a data foundation we&apos;ve already hardened. That&apos;s why our agents work in production.
            </p>

            {/* Quote callout */}
            <div className="mt-8 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                &ldquo;70% of enterprise AI projects fail to move from proof-of-concept to production. The #1 reason: data infrastructure not ready.&rdquo;
              </p>
              <p className="text-xs text-slate-500 mt-2">— Databricks State of Data + AI Report, 2024</p>
            </div>
          </motion.div>

          {/* Right: bullet points */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <div className="space-y-4">
              {differentiators.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    item.emphasis
                      ? "bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50"
                      : "bg-[#0A1628]/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className={`p-1 rounded-full flex-shrink-0 mt-0.5 ${item.emphasis ? "bg-blue-500/20" : "bg-slate-700/50"}`}>
                    <Check size={14} className={item.emphasis ? "text-blue-400" : "text-slate-400"} />
                  </div>
                  <span className={`text-sm leading-relaxed ${item.emphasis ? "text-white font-medium" : "text-slate-300"}`}>
                    {item.point}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
