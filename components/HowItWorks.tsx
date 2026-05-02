"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "1",
    title: "Week 0 — Free AR workflow audit",
    description: "We connect to your existing systems, map your AR workflow, and show you exactly where money is leaking. You get a written report — whether you hire us or not.",
    active: false,
  },
  {
    num: "2",
    title: "Weeks 1–3 — Architecture & approval",
    description: "We design the agent inside YOUR infrastructure. Evaluation suite, failure modes, governance — all designed before a single line of production code is written.",
    active: false,
  },
  {
    num: "3",
    title: "Weeks 3–8 — Build & test",
    description: "We build the agent. Your data never leaves your environment. Weekly demos. You see the agent learning your invoices, customers, patterns in real-time.",
    active: false,
  },
  {
    num: "4",
    title: "Weeks 8–10 — Production deployment",
    description: "The agent goes live. It collects, prioritises, tracks, and escalates — autonomously. We monitor for 30 days. Then it's yours forever. Every line of code.",
    active: true,
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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
            className="font-heading font-extrabold text-[#0A0A0A] mb-5 leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            From first call to <span style={{ color: "#0066FF" }}>collecting cash</span>
          </h2>
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
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 font-heading font-bold text-[16px] transition-all duration-500 ease-ios ${
                  step.active ? "pulse-blue" : ""
                }`}
                style={{
                  background: "#0066FF",
                  color: "#fff",
                  boxShadow: step.active ? "0 8px 24px rgba(0,102,255,0.35)" : "0 4px 12px rgba(0,102,255,0.2)",
                }}
              >
                {step.num}
              </div>
              <h3 className="font-heading font-bold text-[#0A0A0A] text-[16px] mb-3 leading-snug" style={{ letterSpacing: "-0.01em" }}>
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
