"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function TwoPaths() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { open: openDemo } = useDemoForm();

  return (
    <section className="py-24 px-6 bg-[#050A14]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Card 1: Cost Audit */}
          <motion.div
            variants={fadeUp}
            className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-50" />
            
            <span className="text-xs font-semibold tracking-wide text-blue-400 uppercase mb-4">
              PATH 1 — COST AUDIT
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Find the waste hiding in your Databricks workspace
            </h3>
            <p className="text-slate-400 mb-8 leading-relaxed flex-grow">
              Most data teams overspend by 40-60%. We run a 7-day audit that identifies exactly where the waste is — and how to fix it. No retainer, no upsell pressure.
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                "7-day delivery",
                "20-page audit report",
                "Cost breakdown by job, cluster, workload",
                "Top 10 waste sources with $ impact",
                "$749 flat fee"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={openDemo}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 group-hover:border-blue-500/50"
            >
              Start with Audit
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Card 2: Production AI Agents */}
          <motion.div
            variants={fadeUp}
            className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-purple-500/30 transition-all group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />
            
            <span className="text-xs font-semibold tracking-wide text-purple-400 uppercase mb-4">
              PATH 2 — PRODUCTION AI AGENTS
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ship AI systems your engineering team can actually trust
            </h3>
            <p className="text-slate-400 mb-8 leading-relaxed flex-grow">
              88% of companies use AI. Only 13% see real value. The gap is production rigor. We build agents on your Databricks stack with full evaluation suites, failure mode handling, and monitoring from day one.
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                "Built on YOUR Databricks workspace",
                "Evaluation framework + failure mode design",
                "Human-in-the-loop checkpoints",
                "Production monitoring included",
                "Starting at $12,000"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={openDemo}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 group-hover:border-purple-500/50"
            >
              Build an Agent
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
