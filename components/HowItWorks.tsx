"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Free Workshop",
    duration: "Week 0",
    description: "90 minutes. We sit with your team and map your biggest manual workflow step by step. We identify which parts genuinely need AI, which need simple rules, and which need a human. You leave with an AI Opportunity Map. We leave with what we need to scope the build. No cost. No commitment.",
    color: "#3B82F6",
  },
  {
    num: "02",
    title: "Architecture & Evaluation Design",
    duration: "Weeks 1-2",
    description: "Before building: we design the agent architecture, the evaluation framework, and every failure mode. You approve the plan before we write production code. No surprises mid-build.",
    color: "#06B6D4",
  },
  {
    num: "03",
    title: "Build & Evaluate",
    duration: "Weeks 3-8",
    description: "We build inside your Databricks workspace. Weekly demos. Evaluation suite runs continuously. Human-in-the-loop checkpoints designed and tested. You see progress weekly — not just at the end.",
    color: "#8B5CF6",
  },
  {
    num: "04",
    title: "Deploy & Monitor",
    duration: "Weeks 8-10",
    description: "Production deployment with full monitoring. 30 days of post-launch support included. Full code handoff. Your team owns everything. We're available if something needs adjusting — at no additional cost for 30 days.",
    color: "#10B981",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-we-work" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
            From First Call to Production <br className="hidden md:block" />
            <span className="text-gradient-blue">in 8-10 Weeks</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            A structured process designed to move fast without cutting corners.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-10 left-12 right-12 h-px border-t-2 border-dashed border-slate-800" />

          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="relative flex flex-col pt-4 lg:pt-0"
            >
              {/* Number badge */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border mx-auto lg:mx-0 mb-6 relative z-10 bg-[#050A14]"
                style={{
                  backgroundColor: `${step.color}15`,
                  borderColor: `${step.color}40`,
                }}
              >
                <span className="text-xl font-bold" style={{ color: step.color }}>
                  {step.num}
                </span>
              </div>

              <div className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 flex-1 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all flex flex-col text-center lg:text-left">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full border w-fit mx-auto lg:mx-0 mb-4"
                  style={{
                    color: step.color,
                    backgroundColor: `${step.color}10`,
                    borderColor: `${step.color}30`,
                  }}
                >
                  {step.duration}
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-grow">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
