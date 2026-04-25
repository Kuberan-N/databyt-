"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    step: "Step 1",
    title: "AUDIT",
    timeframe: "Week 1",
    text: "We scan your workspace, identify waste, deliver the report. $749 flat. You own everything.",
  },
  {
    step: "Step 2",
    title: "QUICK WINS",
    timeframe: "Weeks 2-3, optional",
    text: "Most audits reveal 3-5 fixes you can implement yourself in under a week. No additional cost from us — your team handles it.",
  },
  {
    step: "Step 3",
    title: "ONGOING OPTIMIZATION",
    timeframe: "Month 2+, optional",
    text: "If you want hands-on help with deeper fixes (structural data issues, pipeline redesign, future AI work), we offer advisory packages. Discussed only after audit — no upsell pressure.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function WhatHappensAfter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6 bg-[#0A1628]/30 border-y border-slate-800/50">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            What Happens{" "}
            <span className="text-gradient-blue">After the Audit?</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            A clear path from audit to results — no vendor lock-in.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Optional: A connecting line for desktop view */}
          <div className="hidden md:block absolute top-1/4 left-1/6 right-1/6 h-px bg-slate-800 -z-10" />

          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[#0A1628]/90 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all flex flex-col h-full relative"
            >
              <div className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-widest">
                {s.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{s.title}</h3>
              <p className="text-sm font-semibold text-slate-500 mb-4">{s.timeframe}</p>
              
              <div className="w-12 h-px bg-blue-500/30 mb-5" />
              
              <p className="text-sm text-slate-400 leading-relaxed">
                {s.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
