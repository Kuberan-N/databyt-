"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Shield, TrendingDown } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const trustBadges = [
  { label: "SOC 2 practices" },
  { label: "GDPR ready" },
  { label: "Read-only API access" },
  { label: "You own all recommendations" },
  { label: "7-day delivery guarantee" },
];



const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function Hero() {
  const { open: openDemo } = useDemoForm();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient orb background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="gradient-orb" />
      </div>
      <div className="absolute top-1/4 -right-32 w-72 h-72 rounded-full bg-purple-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Positioning badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8 shimmer">
            <TrendingDown size={14} />
            Databricks Cost Optimization
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          We find wasted Databricks spend —{" "}
          <span className="text-gradient-blue">
            usually $30K-$80K/year.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Databricks-native engineers who stop the bleeding — and ship production AI systems that don&apos;t fail.{" "}
          <span className="text-slate-300 font-medium">
            Two services. One specialized stack. Built with the same rigor your data pipelines deserve.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <button
            onClick={openDemo}
            className="group bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-full px-8 py-4 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-2"
          >
            Book Your Audit — $749
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={openDemo}
            className="border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-white font-semibold rounded-full px-8 py-4 transition-all flex items-center gap-2"
          >
            Build an AI Agent →
          </button>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-sm text-slate-500 mb-10"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3.5}
        >
          Audit ($749) or Agent ($12K-$25K). Founding 5 clients pricing.
        </motion.p>

        {/* Trust badges row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mb-14"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          {trustBadges.map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800/50 border border-slate-700/50 rounded-full px-3 py-1.5"
            >
              <Shield size={10} className="text-blue-400" />
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* Stats row / Agent flow removed */}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050A14] to-transparent pointer-events-none" />
    </section>
  );
}
