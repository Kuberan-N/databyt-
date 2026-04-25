"use client";

import { motion, type Variants } from "framer-motion";
import { Shield } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const trustBadges = [
  { label: "Databricks-Native" },
  { label: "5 Disciplines Framework" },
  { label: "Code Ownership: Yours" },
  { label: "Production-Ready in 8 Weeks" },
  { label: "30-Day Post-Launch Support" },
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

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 text-center mt-12">
        {/* Positioning badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8 shimmer">
            <Shield size={14} />
            Production AI Engineering on Databricks
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
          Stop Shipping AI Demos. <br className="hidden sm:block" />
          <span className="text-gradient-blue">
            Start Shipping Systems.
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
          We engineer production AI agents on your Databricks stack — with evaluation suites, failure modes, and live monitoring built in from day one.{" "}
          <span className="text-slate-300 font-medium">
            Not chatbots. Not prototypes. Systems your engineering team can trust at 3 AM.
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
            Book Free 90-Min Workshop &rarr;
          </button>
          <a
            href="#how-we-work"
            className="border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-white font-semibold rounded-full px-8 py-4 transition-all flex items-center gap-2"
          >
            See How We Build &rarr;
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-sm text-slate-500 mb-10"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3.5}
        >
          No pitch. No commitment. We map your biggest workflow and show you what actually needs AI — in 90 minutes.
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
              <span className="text-blue-400">◉</span>
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
