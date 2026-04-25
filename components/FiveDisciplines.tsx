"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const disciplines = [
  {
    icon: "📋",
    title: "EVALUATION",
    body: "Test suite of 50-100 real examples. Your agent runs against every one before production. Performance measured, not assumed.",
  },
  {
    icon: "⚠️",
    title: "FAILURE MODES",
    body: "We list every failure: API timeouts, LLM hallucinations, database outages. Then we design what happens when each one fails.",
  },
  {
    icon: "👤",
    title: "HUMAN-IN-THE-LOOP",
    body: "LLMs do 99% well. The 1% they don't can lose your business. We design checkpoints where humans add judgment, creativity, and taste.",
  },
  {
    icon: "🔄",
    title: "MEMORY + FEEDBACK",
    body: "Self-improving agents. Every interaction makes the next one smarter, through reinforcement learning patterns.",
  },
  {
    icon: "📊",
    title: "MONITORING",
    body: "Drift detection, latency tracking, output quality. We watch your agent in production so it doesn't quietly break.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function FiveDisciplines() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6 bg-[#050A14] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
            5 Disciplines of{" "}
            <span className="text-gradient-blue">Real AI Engineering</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We don&apos;t ship demos. We engineer systems that survive Monday mornings, API timeouts, and real-world data.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {disciplines.map((d, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-slate-800/40 transition-all flex flex-col h-full group"
            >
              <div className="text-3xl mb-4 p-3 bg-slate-800/50 rounded-xl w-fit group-hover:scale-110 transition-transform">
                {d.icon}
              </div>
              <h3 className="text-sm font-bold text-white tracking-wider mb-3">
                {d.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed flex-grow">
                {d.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium">
            Most agencies skip 3 of these. We don&apos;t.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
