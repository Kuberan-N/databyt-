"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "We Audit",
    duration: "Day 1–3",
    description: "We connect to your Databricks or Snowflake, map your AR workflow, and show you exactly where money is leaking. You get a written AR Leakage Report — whether you hire us or not.",
    color: "#3B82F6",
  },
  {
    num: "02",
    title: "We Build",
    duration: "Week 1–3",
    description: "We build the AI agent inside YOUR infrastructure. Your data never leaves. Weekly demos. You see the agent learning your invoices, your customers, your patterns in real-time.",
    color: "#06B6D4",
  },
  {
    num: "03",
    title: "You Collect",
    duration: "Week 3+",
    description: "The agent goes live. It collects, prioritizes, tracks, and escalates — autonomously. We monitor for 30 days. Then it\u2019s yours forever. Every line of code.",
    color: "#10B981",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-32 md:py-40 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] text-blue-400 uppercase mb-5">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
            From First Call to Collecting Cash <br className="hidden md:block" />
            <span className="text-gradient-blue">in 3 Weeks</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            We build. We measure. We leave you with something that works while you sleep.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-16 right-16 h-px border-t-2 border-dashed border-slate-800/50" />

          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="relative flex flex-col"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center border mx-auto mb-8 relative z-10 bg-[#050A14]"
                style={{
                  backgroundColor: `${step.color}08`,
                  borderColor: `${step.color}25`,
                }}
              >
                <span className="text-xl font-bold" style={{ color: step.color }}>
                  {step.num}
                </span>
              </div>

              <div className="glass-card rounded-2xl p-8 flex-1 transition-all duration-500 flex flex-col text-center">
                <span
                  className="text-[10px] font-semibold px-3 py-1.5 rounded-full border w-fit mx-auto mb-5"
                  style={{
                    color: step.color,
                    backgroundColor: `${step.color}08`,
                    borderColor: `${step.color}20`,
                  }}
                >
                  {step.duration}
                </span>
                <h3 className="text-xl font-bold text-white tracking-wide mb-4">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
