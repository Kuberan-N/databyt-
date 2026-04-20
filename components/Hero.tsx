"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap, Bot } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const metrics = [
  {
    label: "Pipelines Active",
    value: "12",
    change: "+3 this month",
    icon: Zap,
  },
  {
    label: "Data Quality",
    value: "99.2%",
    change: "+0.4%",
    icon: Shield,
  },
  {
    label: "Cost Savings",
    value: "$47K",
    change: "Databricks optimized",
    icon: TrendingUp,
  },
  {
    label: "Agent Tasks",
    value: "1,847",
    change: "Automated this month",
    icon: Bot,
  },
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

      {/* Secondary warm orb */}
      <div className="absolute top-1/4 -right-32 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Badge — Hormozi hook: time compression */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8 shimmer">
            Investor-ready metrics in 5 days
          </span>
        </motion.div>

        {/* Headline — StoryBrand: problem-first, customer is hero */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Your Data Is Broken.{" "}
          <span className="text-gradient-blue">
            Your Board Meets Tuesday.
          </span>
        </motion.h1>

        {/* Sub-headline — Hormozi value equation: dream outcome + low effort */}
        <motion.p
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          One senior operator. Fixed monthly fee. Databricks pipelines and
          AI agents shipped every 30 days — for the cost of one junior hire.
          <br /><br />
          <span className="text-slate-300 font-medium">
            Replace the $150K data engineer with a $2,500/month retainer.
          </span>
        </motion.p>

        {/* CTAs — Brunson: irresistible offer + clear action */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <button
            onClick={openDemo}
            className="group bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-full px-8 py-4 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-2"
          >
            Book a Free 20-Min Audit
            <ArrowRight
              size={18}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
          <a
            href="#how-it-works"
            className="border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-white font-semibold rounded-full px-8 py-4 transition-all"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Trust line — Hormozi: risk reversal */}
        <motion.p
          className="text-sm text-slate-500 mb-16"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3.5}
        >
          Week 1, or your money back · Cancel anytime · You own the code
        </motion.p>

        {/* Mock dashboard card */}
        <motion.div
          className="relative max-w-2xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          {/* Glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-3xl blur-xl" />

          <div className="relative bg-[#0A1628]/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-6 md:p-8 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Monthly Platform Overview
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  April 2026 — Live Dashboard
                </p>
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                Live
              </span>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon size={14} className="text-blue-400" />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {metric.label}
                    </p>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </p>
                  <span className="text-xs font-medium text-emerald-400">
                    {metric.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050A14] to-transparent pointer-events-none" />
    </section>
  );
}
