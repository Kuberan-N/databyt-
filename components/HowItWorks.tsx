"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "We Audit",
    duration: "Day 1–3",
    description: "We connect to your Databricks or Snowflake, map your AR workflow, and show you exactly where money is leaking. You get a written AR Leakage Report — whether you hire us or not.",
    color: "#0A0A0A",
  },
  {
    num: "02",
    title: "We Build",
    duration: "Week 1–3",
    description: "We build the AI agent inside YOUR infrastructure. Your data never leaves. Weekly demos. You see the agent learning your invoices, your customers, your patterns in real-time.",
    color: "#E8321A",
  },
  {
    num: "03",
    title: "You Collect",
    duration: "Week 3+",
    description: "The agent goes live. It collects, prioritizes, tracks, and escalates — autonomously. We monitor for 30 days. Then it's yours forever. Every line of code.",
    color: "#0A0A0A",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-32 md:py-40 px-6 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">
            Simple Process
          </span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-6 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.04em" }}
          >
            From First Call to Collecting Cash <br className="hidden md:block" />
            <span style={{ color: "#E8321A" }}>in 3 Weeks</span>
          </h2>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            We build. We measure. We leave you with something that works while you sleep.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-24 right-24 h-px border-t border-dashed border-black/10" />

          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="relative flex flex-col"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border mx-auto mb-6 relative z-10 bg-white"
                style={{
                  borderColor: step.color === "#E8321A" ? "#E8321A" : "rgba(0,0,0,0.1)",
                }}
              >
                <span className="font-heading text-lg font-bold" style={{ color: step.color }}>
                  {step.num}
                </span>
              </div>

              <div className="light-card rounded-2xl p-8 flex-1 transition-all duration-300 flex flex-col text-center"
                   style={{ borderColor: step.color === "#E8321A" ? "#E8321A" : "rgba(0,0,0,0.08)" }}>
                <span
                  className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full w-fit mx-auto mb-5"
                  style={{
                    color: step.color,
                    backgroundColor: step.color === "#E8321A" ? "rgba(232,50,26,0.08)" : "rgba(0,0,0,0.04)",
                  }}
                >
                  {step.duration}
                </span>
                <h3 className="font-heading text-xl font-bold text-[#0A0A0A] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
