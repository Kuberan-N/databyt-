"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Search, Database, Bot, Repeat } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "AI READINESS AUDIT",
    duration: "2 weeks",
    description:
      "We run a deep diagnostic on your data stack, infrastructure, and business processes. You get a written agent opportunity map (5 use cases prioritized), a FinOps baseline, and a cost reduction plan. Zero obligation after this.",
    deliverable: "Written report + 90-min walkthrough",
    color: "#3B82F6",
  },
  {
    num: "02",
    icon: Database,
    title: "DATA FOUNDATION",
    duration: "4–6 weeks",
    description:
      "We clean, unify, and prepare your data for AI. This means Databricks Lakehouse setup, dbt modelling, Unity Catalog governance, and production-grade pipelines. No agent works without this — and 95% of agencies skip it.",
    deliverable: "Agent-ready data layer in your Databricks workspace",
    color: "#06B6D4",
  },
  {
    num: "03",
    icon: Bot,
    title: "AGENT BUILD",
    duration: "4 weeks",
    description:
      "First production agent running on your real data. Evaluated, monitored, versioned. With guardrails so it doesn't hallucinate. Deployed on Mosaic AI / Databricks Model Serving — inside your account.",
    deliverable: "1 production AI agent + monitoring dashboard",
    color: "#8B5CF6",
  },
  {
    num: "04",
    icon: Repeat,
    title: "SCALE & OWN",
    duration: "Ongoing",
    description:
      "One new agent shipped every month. FinOps optimization to control token costs. You own every repo, every model, every line of code. Cancel any month with 7 days notice. The compounding value stays with you.",
    deliverable: "New agent monthly + 24hr SLA + private Slack",
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
    <section id="how-it-works" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            From AI Idea to Production{" "}
            <span className="text-gradient-blue">in 4 Steps</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            A clear path from audit to running agents. Fixed timelines, fixed prices — no 6-month SOW required.
          </p>
        </motion.div>

        <motion.div
          className="relative"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Vertical connecting line */}
          <div className="absolute top-7 bottom-7 left-7 w-px border-l-2 border-dashed border-slate-800 hidden md:block" />

          <div className="flex flex-col gap-8">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="relative flex items-start gap-5 md:pl-14"
              >
                {/* Number badge */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center border md:absolute md:left-0"
                  style={{
                    backgroundColor: `${step.color}15`,
                    borderColor: `${step.color}40`,
                  }}
                >
                  <span className="text-sm font-bold" style={{ color: step.color }}>
                    {step.num}
                  </span>
                </div>

                <div className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 flex-1 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg border"
                        style={{ backgroundColor: `${step.color}15`, borderColor: `${step.color}30` }}
                      >
                        <step.icon size={18} style={{ color: step.color }} />
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-wide">
                        {step.title}
                      </h3>
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full border w-fit"
                      style={{
                        color: step.color,
                        backgroundColor: `${step.color}10`,
                        borderColor: `${step.color}30`,
                      }}
                    >
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">{step.description}</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                    <span className="text-xs text-slate-500">Deliverable:</span>
                    <span className="text-xs font-medium text-slate-300">{step.deliverable}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
