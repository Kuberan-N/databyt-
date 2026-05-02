"use client";

import { motion, type Variants } from "framer-motion";
import { useDemoForm } from "./DemoFormContext";
import { useEffect, useState } from "react";

const proofStats = [
  { num: "18d", label: "Average DSO reduction" },
  { num: "40h", label: "Finance hours saved weekly" },
  { num: "8–10w", label: "First call to production" },
  { num: "₹0", label: "New infrastructure cost" },
];

const trustStack = [
  "Databricks AgentBricks",
  "Anthropic Claude API",
  "Snowflake Cortex",
  "Delta Lake",
  "MLflow",
  "Unity Catalog",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Hero() {
  const { open: openDemo } = useDemoForm();
  const [wasteCost, setWasteCost] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWasteCost((prev) => prev + 47);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Subtle red glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,50,26,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-20 text-center">
        {/* Positioning chip */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/50 bg-white/5 border border-white/10 rounded-full px-5 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8321A]" />
            Production AI Engineering · Not Another Demo
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-heading font-extrabold text-white leading-[1.05] tracking-tight mb-8"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "-0.04em" }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Your AR team is doing<br />
          <span style={{ color: "#E8321A" }}>₹40L worth of manual work.</span><br />
          Every. Single. Year.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto mb-4 leading-relaxed font-light"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          We build production AI agents that automate accounts receivable collections — on your existing{" "}
          <span className="text-white/80 font-medium">Databricks, Snowflake, QuickBooks, or SAP</span>.
          Your data never leaves your environment. Your team gets 40 hours back every week.
        </motion.p>

        {/* Live counter */}
        <motion.p
          className="text-sm text-white/30 mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2.5}
        >
          Since you opened this page, manual AR has cost finance teams{" "}
          <span className="font-semibold tabular-nums" style={{ color: "#E8321A" }}>
            ₹{wasteCost.toLocaleString("en-IN")}
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <button
            onClick={openDemo}
            className="btn-pulse text-white font-semibold rounded-full px-10 py-4 transition-all duration-200 hover:opacity-90 hover:scale-[1.02] flex items-center gap-2"
            style={{ background: "#E8321A" }}
          >
            Book Free 90-Min Workshop →
          </button>
          <a
            href="#how-it-works"
            className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold rounded-full px-10 py-4 transition-all duration-200"
          >
            See How We Build →
          </a>
        </motion.div>

        {/* Proof stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          {proofStats.map(({ num, label }) => (
            <div key={label} className="text-center">
              <div
                className="font-heading font-extrabold text-3xl md:text-4xl mb-1"
                style={{ color: "#E8321A", letterSpacing: "-0.04em" }}
              >
                {num}
              </div>
              <div className="text-xs text-white/40 leading-snug">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Trust bar */}
      <motion.div
        className="w-full border-t border-white/5 bg-white/[0.02] py-5"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={5}
      >
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <span className="text-[10px] font-semibold tracking-widest text-white/25 uppercase">
            Built on:
          </span>
          {trustStack.map((item) => (
            <span key={item} className="text-xs font-medium text-white/30">
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
