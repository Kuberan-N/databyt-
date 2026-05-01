"use client";

import { motion, type Variants } from "framer-motion";
import { Shield } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";
import { useEffect, useState } from "react";

const trustBadges = [
  "Databricks-Native",
  "Snowflake-Native",
  "Data Never Leaves",
  "3 Weeks to Production",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Hero() {
  const { open: openDemo } = useDemoForm();
  const [wasteCost, setWasteCost] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWasteCost((prev) => prev + 13);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient orb background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="gradient-orb" />
      </div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -left-40 w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Positioning badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 bg-blue-500/8 border border-blue-500/15 rounded-full px-5 py-2 mb-10 shimmer">
            <Shield size={14} />
            Finance AI Agents — Databricks & Snowflake
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-8 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Your Finance Team Is Losing <br className="hidden sm:block" />
          <span className="text-gradient-blue">$47,000/Month</span>{" "}
          to Manual AR.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-6 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          We build AI agents that collect your money, reconcile your cash, and run on{" "}
          <span className="text-white font-medium">your Databricks or Snowflake</span>.{" "}
          No SaaS subscription. No data leaving your infrastructure.
        </motion.p>

        {/* Live waste counter — subtle */}
        <motion.p
          className="text-sm text-slate-500 mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2.5}
        >
          Since you opened this page, manual AR has cost US companies{" "}
          <span className="font-semibold text-blue-400 tabular-nums">
            ${wasteCost.toLocaleString()}
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <button
            onClick={openDemo}
            className="group bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-full px-10 py-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center gap-2 btn-pulse"
          >
            Book Free AR Assessment &rarr;
          </button>
          <a
            href="#services"
            className="border border-slate-700/60 hover:border-blue-500/40 text-slate-300 hover:text-white font-semibold rounded-full px-10 py-4 transition-all duration-300 flex items-center gap-2"
          >
            See What We Build
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-sm text-slate-500 mb-16"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3.5}
        >
          20 minutes. No pitch. We show you exactly where your AR process is leaking cash.
        </motion.p>

        {/* Trust badges row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          {trustBadges.map((label) => (
            <span
              key={label}
              className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-800/30 border border-slate-700/30 rounded-full px-4 py-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050A14] to-transparent pointer-events-none" />
    </section>
  );
}
