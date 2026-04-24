"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import {
  Database,
  Bot,
  BarChart3,
  Wallet,
  Headphones,
  FileText,
} from "lucide-react";

const deliverables = [
  {
    icon: Database,
    title: "Agent-Ready Data Foundation",
    description: "Databricks Lakehouse setup, Unity Catalog governance, Delta Live Tables, dbt modelling — everything an AI agent needs to operate on real production data.",
  },
  {
    icon: Bot,
    title: "Production AI Agent",
    description: "One production agent shipped per engagement — built on Claude/OpenAI + your Databricks lakehouse. Evaluated, monitored, versioned, and running on Mosaic AI.",
  },
  {
    icon: BarChart3,
    title: "Agent Monitoring Dashboard",
    description: "Live dashboard showing agent performance, token usage, error rates, and business outcome metrics. You see exactly what your agent is doing and what it costs.",
  },
  {
    icon: Wallet,
    title: "FinOps Cost Control",
    description: "Token cost optimization from Day 1. Databricks compute cost alerts. Average clients save $47K/yr on infrastructure after audit. Runaway costs eliminated.",
  },
  {
    icon: Headphones,
    title: "Guardrails & Evaluation Framework",
    description: "Agents hallucinate without guardrails. We build evaluation pipelines, safety checks, and output validation — so your agent is reliable enough for production.",
  },
  {
    icon: FileText,
    title: "Full Documentation & Handoff",
    description: "Architecture docs, agent runbooks, data lineage maps, and a handoff guide for your team. You own everything — every repo, every model, every config file.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Deliverables() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="deliverables" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            What We{" "}
            <span className="text-gradient-blue">Actually Build</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            Six deliverables. One fixed price. Everything inside your Databricks workspace — and you own it all.
          </p>
        </motion.div>

        {/* Deliverable cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {deliverables.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300"
            >
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 w-fit mb-4">
                <item.icon size={20} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Callout card — Hormozi: effort reduction */}
        <motion.div
          className="mt-10 bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 border-l-4 border-l-blue-500"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Everything is{" "}
            <span className="text-white font-semibold">
              outcome-counted, not hour-billed
            </span>{" "}
            — deliverables per month, not timesheets. No surprise invoices,
            no scope creep conversations. One operator, one bill, one Slack channel.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
