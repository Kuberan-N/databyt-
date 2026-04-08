"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const metrics = [
  {
    label: "MRR",
    value: "₹4.2L",
    change: "+12%",
    direction: "up" as const,
  },
  {
    label: "Churn",
    value: "3.1%",
    change: "-0.8%",
    direction: "down" as const,
  },
  {
    label: "CAC",
    value: "₹1,850",
    change: "-₹200",
    direction: "down" as const,
  },
  {
    label: "LTV",
    value: "₹28,400",
    change: "+₹2,100",
    direction: "up" as const,
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

      {/* Secondary subtle orb */}
      <div className="absolute top-1/4 -right-32 w-72 h-72 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-8">
            Built for Indian Founders
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Stop the{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Night-Before
          </span>{" "}
          Investor Call Panic.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Your Razorpay says ₹10L. Your spreadsheet says ₹9.2L. Nobody can
          tell you why — and your investor call is tomorrow.
          <br /><br />
          We find the gap, fix it, and automate your investor reporting so you
          never scramble again.
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
            className="group bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-full px-8 py-4 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center gap-2"
          >
            Book a Free 20-Min Audit
            <ArrowRight
              size={18}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
          <a
            href="#how-it-works"
            className="border border-zinc-700 hover:border-purple-500/50 text-zinc-300 hover:text-white font-semibold rounded-full px-8 py-4 transition-all"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-sm text-zinc-500 mb-16"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3.5}
        >
          No payment required · No spam · Just clarity on your numbers.
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
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-400/20 rounded-3xl blur-xl" />

          <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm p-6 md:p-8 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  Monthly Investor Report
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  March 2026 — Auto-generated
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
                  className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50"
                >
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    {metric.label}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </p>
                  <div className="flex items-center gap-1">
                    {metric.direction === "up" ? (
                      <TrendingUp size={14} className="text-emerald-400" />
                    ) : (
                      <TrendingDown size={14} className="text-emerald-400" />
                    )}
                    <span className="text-xs font-medium text-emerald-400">
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
    </section>
  );
}
