"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "1",
    title: "Week 0 — Free Workshop",
    description: "We connect to your Databricks or Snowflake, map your AR workflow, and show you exactly where money is leaking. You get a written AR Leakage Report — whether you hire us or not.",
    active: false,
  },
  {
    num: "2",
    title: "Weeks 1–3 — Architecture Design",
    description: "We design the agent inside YOUR infrastructure. Evaluation suite, failure modes, governance — all designed before a single line of production code is written.",
    active: false,
  },
  {
    num: "3",
    title: "Weeks 3–8 — Build & Evaluate",
    description: "We build the AI agent. Your data never leaves your environment. Weekly demos. You see the agent learning your invoices, customers, patterns in real-time.",
    active: false,
  },
  {
    num: "4",
    title: "Weeks 8–10 — Deploy & Monitor",
    description: "The agent goes live. It collects, prioritizes, tracks, and escalates — autonomously. We monitor for 30 days. Then it's yours forever. Every line of code.",
    active: true,
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Process</span>
          <h2
            className="font-heading font-extrabold text-black mb-5 leading-[1.06]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)", letterSpacing: "-0.04em" }}
          >
            From first call to <span style={{ color: "#E8321A" }}>collecting cash</span>
          </h2>
          <p className="text-[16px] text-[#666] max-w-[600px] mx-auto">
            We build, measure, and leave you with something that works while you sleep.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="flex flex-col items-start"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-all duration-300"
                style={{
                  border: `2px solid ${step.active ? "#E8321A" : "#E8E8E8"}`,
                  background: step.active ? "#E8321A" : "#fff",
                }}
              >
                <span
                  className="font-heading text-[18px] font-extrabold"
                  style={{ color: step.active ? "#fff" : "#1A1A1A", letterSpacing: "-0.02em" }}
                >
                  {step.num}
                </span>
              </div>
              <h3 className="font-heading font-bold text-black text-[16px] mb-3 leading-snug" style={{ letterSpacing: "-0.02em" }}>
                {step.title}
              </h3>
              <p className="text-[13px] text-[#666] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
