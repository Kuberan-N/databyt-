"use client";

import { motion, type Variants } from "framer-motion";
import { useDemoForm } from "./DemoFormContext";

const proofStats = [
  { num: "18d", label: "DSO reduction" },
  { num: "40h", label: "saved weekly" },
  { num: "8–10w", label: "to production" },
  { num: "₹0", label: "new infrastructure" },
];

const trustStack = [
  "Databricks Agent Bricks",
  "Anthropic Claude",
  "Snowflake Cortex",
  "Delta Lake",
  "MLflow",
  "Unity Catalog",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Hero() {
  const { open: openDemo } = useDemoForm();

  return (
    <>
      <section className="relative bg-white pt-[120px] pb-20 px-6 md:px-10">
        <div className="max-w-[1100px] mx-auto text-center">
          {/* Headline */}
          <motion.h1
            className="font-heading font-extrabold text-black leading-[1.04] mb-6"
            style={{ fontSize: "clamp(2.5rem, 6.5vw, 4rem)", letterSpacing: "-0.04em" }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Your AR team loses<br />
            <span style={{ color: "#E8321A" }}>₹40L yearly</span><br />
            to manual work.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-[18px] text-[#333] max-w-[640px] mx-auto mb-10 leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            We build production AI agents on your infrastructure. Databricks, Snowflake, QuickBooks, SAP, or Excel.
            Zero new costs. 8–10 weeks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <button
              onClick={openDemo}
              className="text-white font-semibold rounded-lg px-8 py-4 text-[15px] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_24px_rgba(232,50,26,0.3)] btn-pulse"
              style={{ background: "#E8321A" }}
            >
              Book 90-Min Free Workshop →
            </button>
            <a
              href="#how-it-works"
              className="font-semibold rounded-lg px-8 py-4 text-[15px] transition-all duration-300 hover:scale-[1.03] hover:bg-[#E8321A] hover:text-white"
              style={{ border: "1px solid #E8321A", color: "#E8321A" }}
            >
              See how it works
            </a>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[900px] mx-auto"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            {proofStats.map(({ num, label }) => (
              <div key={label} className="text-center">
                <div
                  className="font-heading font-extrabold text-3xl md:text-4xl mb-2"
                  style={{ color: "#E8321A", letterSpacing: "-0.03em" }}
                >
                  {num}
                </div>
                <div className="text-[13px] text-[#666] leading-snug">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <motion.div
        className="bg-white border-y border-[#E8E8E8] py-6 px-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] text-[#666]">
          <span className="font-medium text-[#1A1A1A]">Built on:</span>
          {trustStack.map((item, i) => (
            <span key={item} className="inline-flex items-center gap-3">
              <span>{item}</span>
              {i < trustStack.length - 1 && (
                <span className="w-1 h-1 rounded-full" style={{ background: "#E8321A" }} />
              )}
            </span>
          ))}
        </div>
      </motion.div>
    </>
  );
}
