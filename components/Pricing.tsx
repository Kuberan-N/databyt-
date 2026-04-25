"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Star, ArrowRight } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { open: openDemo } = useDemoForm();
  const [activeTab, setActiveTab] = useState<"audit" | "agents">("audit");

  return (
    <section id="pricing" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
            🎯 Founding 5 Clients Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Simple Pricing.{" "}
            <span className="text-gradient-blue">Production-Grade Delivery.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            Founding 5 Clients pricing — locked in during our first cohort. Prices increase after we publish 5 case studies.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="bg-[#0A1628]/80 p-1.5 rounded-full border border-slate-800 flex gap-1">
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === "audit" 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              Cost Audit
            </button>
            <button
              onClick={() => setActiveTab("agents")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === "agents" 
                  ? "bg-purple-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              AI Agent Builds
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="min-h-[600px]"
        >
          {activeTab === "audit" && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-xl mx-auto"
            >
              {/* Audit Card */}
              <div className="relative bg-[#0A1628]/80 rounded-2xl p-8 backdrop-blur-sm flex flex-col border-2 border-blue-500/60 shadow-[0_0_50px_rgba(59,130,246,0.15)] text-center">
                <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide bg-gradient-to-r from-blue-600 to-cyan-500 text-white w-fit mx-auto mb-4">
                  Find the waste in 7 days
                </span>
                
                <h3 className="text-2xl font-bold text-white mb-4">Databricks Cost Audit</h3>
                
                <div className="mb-2">
                  <span className="text-5xl font-extrabold text-white">$749</span>
                </div>
                <p className="text-sm text-blue-400 font-medium mb-6">7 days from kickoff</p>
                
                <div className="border-t border-slate-800 mb-6" />
                
                <ul className="space-y-3 mb-8 text-left">
                  {[
                    "Complete scan of your Databricks workspace",
                    "Cost breakdown by job, cluster, and workload",
                    "Top 10 waste sources identified with $ impact",
                    "Optimization roadmap (quick wins + structural fixes)",
                    "20-page audit report (PDF)",
                    "60-minute walkthrough call",
                    "30-day email support for questions"
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-start gap-2">
                    <Star size={16} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                      <strong>Guarantee:</strong> 100% refund if we don&apos;t find $5K+ in annual waste.
                    </p>
                  </div>
                </div>

                <button
                  onClick={openDemo}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full px-6 py-4 font-bold text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
                >
                  Book Audit — $749
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "agents" && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {/* Starter Agent */}
              <div className="relative bg-[#0A1628]/80 rounded-2xl p-8 backdrop-blur-sm flex flex-col border border-slate-800 hover:border-slate-700 transition-all">
                <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide bg-slate-800 text-slate-300 w-fit mb-4">
                  FOUNDING CLIENT PRICING
                </span>
                
                <h3 className="text-xl font-bold text-white mb-1">Starter Agent</h3>
                <p className="text-xs text-slate-400 font-medium mb-4">Single-task production agent</p>
                
                <div className="mb-2">
                  <span className="text-4xl font-extrabold text-white">$12,000</span>
                </div>
                <p className="text-xs text-purple-400 font-medium mb-6">4-6 weeks</p>
                
                <div className="border-t border-slate-800 mb-6" />
                
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Discovery: Decompose workflow into agent + non-agent steps",
                    "1-2 system integrations",
                    "Evaluation suite (50+ test cases)",
                    "Failure mode handling design",
                    "Human-in-the-loop checkpoints",
                    "Production deployment on your Databricks",
                    "30-day post-launch monitoring",
                    "Full code ownership + handoff"
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-slate-500 mb-6">
                  <strong>Best For:</strong> Teams testing their first AI agent in production.
                </p>

                <button
                  onClick={openDemo}
                  className="w-full border border-slate-700 hover:border-purple-500/50 text-white rounded-full px-6 py-3.5 font-bold text-sm transition-all duration-200 hover:bg-slate-800/50"
                >
                  Start with Starter
                </button>
              </div>

              {/* Production Agent */}
              <div className="relative bg-[#0A1628]/80 rounded-2xl p-8 backdrop-blur-sm flex flex-col border-2 border-purple-500/60 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-[200px] text-center">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1 mt-2">Production Agent</h3>
                <p className="text-xs text-purple-300 font-medium mb-4">Multi-step agent with memory & tool use</p>
                
                <div className="mb-2">
                  <span className="text-4xl font-extrabold text-white">$25,000</span>
                </div>
                <p className="text-xs text-purple-400 font-medium mb-6">8-10 weeks</p>
                
                <div className="border-t border-slate-800 mb-6" />
                
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Everything in Starter, plus:</span>
                  </li>
                  {[
                    "Multi-step agent with memory + tool calling",
                    "3-5 system integrations (Slack, CRM, email, APIs)",
                    "100+ eval cases with LLM-as-judge",
                    "Reinforcement loops + feedback collection",
                    "Mosaic AI / LangGraph deployment",
                    "Unity Catalog governance setup",
                    "30-day production support",
                    "Documentation + team training"
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-slate-500 mb-6">
                  <strong>Best For:</strong> Teams ready to ship serious AI to production.
                </p>

                <button
                  onClick={openDemo}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white rounded-full px-6 py-3.5 font-bold text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
                >
                  Build Production Agent
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Optional Support Section */}
        <motion.div
          className="mt-20 max-w-2xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Post-Launch Support (Optional)</h3>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-1">AI Operations Retainer</h4>
              <p className="text-xs text-slate-500 mb-4">Ongoing (cancel anytime, 30-day notice)</p>
              <div className="text-3xl font-extrabold text-white mb-6">$3,500<span className="text-lg text-slate-500 font-medium">/month</span></div>
              
              <p className="text-sm text-slate-400 italic">
                Best For: Keeping your agent healthy and improving over time.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <ul className="space-y-3">
                {[
                  "Production monitoring + alerting",
                  "Monthly eval re-runs",
                  "Prompt + tool optimization",
                  "Incident response (24hr business hours)",
                  "Cost optimization",
                  "1 sync call per week"
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
