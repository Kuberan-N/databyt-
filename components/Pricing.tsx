"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

import { useCurrency } from "./CurrencyContext";

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
  const { currency, isLoaded } = useCurrency();

  const starterPrice = currency === "INR" ? "₹3,50,000" : "$12,000";
  const starterMarketPrice = currency === "INR" ? "₹14,00,000 - ₹25,00,000" : "$20,000 - $35,000";
  const starterSave = currency === "INR" ? "₹10,50,000 - ₹21,50,000" : "$8,000 - $23,000";

  const prodPrice = currency === "INR" ? "₹7,00,000" : "$25,000";
  const prodMarketPrice = currency === "INR" ? "₹35,00,000 - ₹60,00,000" : "$45,000 - $80,000";
  const prodSave = currency === "INR" ? "₹28,00,000 - ₹53,00,000" : "$20,000 - $55,000";

  const retainerPrice = currency === "INR" ? "₹95,000/month" : "$3,500/month";

  return (
    <section id="pricing" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-block text-sm font-semibold tracking-wider text-blue-400 uppercase mb-4">
            Founding 5 Client Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Two Ways to Engage. <br className="hidden md:block" />
            <span className="text-gradient-blue">One Standard of Engineering.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto mb-8">
            We are taking 5 founding clients at launch pricing. After 5 case studies are published, pricing increases to market rate. 2 spots remain for the May cohort.
          </p>

          {/* Scarcity Bar */}
          <div className="inline-flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-semibold text-slate-300">Founding Spots:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-3 bg-blue-500 rounded-sm" />
                ))}
                {[4, 5].map((i) => (
                  <div key={i} className="w-6 h-3 bg-slate-700 rounded-sm" />
                ))}
              </div>
              <span className="text-sm font-semibold text-blue-400">3 of 5 claimed</span>
            </div>
            <p className="text-xs text-slate-500">Next cohort start: May 12th, 2025</p>
          </div>
        </motion.div>

        <motion.div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto transition-opacity duration-300 ${!isLoaded ? 'opacity-50' : 'opacity-100'}`}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Card 1: Starter Agent */}
          <motion.div
            variants={fadeUp}
            className="relative bg-[#0A1628]/80 rounded-2xl p-8 backdrop-blur-sm flex flex-col border border-slate-800 hover:border-slate-700 transition-all"
          >
            <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide bg-slate-800 text-slate-300 w-fit mb-4">
              FOUNDING RATE
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">Starter Agent</h3>
            <p className="text-sm text-slate-400 font-medium mb-6">Your first production AI agent. Single workflow. Built to last.</p>
            
            <div className="mb-2">
              <span className="text-5xl font-extrabold text-white">{starterPrice}</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-cyan-400 font-medium">4-6 weeks</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-sm text-slate-500">Next start: May 12th</span>
            </div>
            
            <div className="border-t border-slate-800 mb-6" />
            
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "90-min AI Readiness Workshop (included)",
                "Full workflow decomposition and architecture design",
                "Single-task agent with 1-2 system integrations",
                "Evaluation suite: 50+ documented test cases",
                "Failure mode handling for every identified risk",
                "Human-in-the-loop checkpoint design",
                "Production deployment on your Databricks workspace",
                "30-day post-launch monitoring and support",
                "Full code ownership — every line belongs to you",
                "Documentation your team can extend without us"
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
              <p className="text-xs text-slate-400 mb-1">Market rate for this scope: <span className="line-through">{starterMarketPrice}</span></p>
              <p className="text-xs text-slate-300 font-medium mb-1">Founding client rate: {starterPrice}</p>
              <p className="text-sm font-bold text-green-400">You save: {starterSave}</p>
            </div>

            <div className="mb-6 text-center">
              <p className="text-xs font-medium text-slate-400">
                <span className="font-bold text-white">Guarantee:</span> 30 days post-launch — if it breaks, we fix it. Free.
              </p>
            </div>

            <button
              onClick={openDemo}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-full px-6 py-4 font-bold text-sm transition-all duration-200"
            >
              Claim Starter Spot &rarr;
            </button>
            <p className="text-xs text-center text-slate-500 mt-3">2 spots remaining at this rate</p>
          </motion.div>

          {/* Card 2: Production Agent (Highlight) */}
          <motion.div
            variants={fadeUp}
            className="relative bg-[#0A1628]/80 rounded-2xl p-8 backdrop-blur-sm flex flex-col border-2 border-cyan-500/60 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-[200px] text-center">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                MOST REQUESTED
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 mt-2">Production Agent</h3>
            <p className="text-sm text-cyan-300 font-medium mb-6">The complete system. Multi-step. Memory. Tools. Built for teams that can&apos;t afford for it to fail.</p>
            
            <div className="mb-2">
              <span className="text-5xl font-extrabold text-white">{prodPrice}</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-cyan-400 font-medium">8-10 weeks</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-sm text-slate-500">Next start: May 12th</span>
            </div>
            
            <div className="border-t border-slate-800 mb-6" />
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <Check size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-white">Everything in Starter Agent, plus:</span>
              </li>
              {[
                "Multi-step agent with persistent memory and tool calling",
                "3-5 deep system integrations (Slack, CRM, email, databases)",
                "100+ evaluation cases with LLM-as-judge scoring",
                "Reinforcement learning patterns and feedback collection",
                "Mosaic AI / LangGraph production deployment",
                "Unity Catalog governance — full audit trail",
                "Real-time monitoring dashboard (latency, quality, drift)",
                "30-day production support with incident response",
                "Full team training and handoff documentation",
                "Architecture review call at 90 days post-launch"
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
              <p className="text-xs text-slate-400 mb-1">Market rate for this scope: <span className="line-through">{prodMarketPrice}</span></p>
              <p className="text-xs text-slate-300 font-medium mb-1">Founding client rate: {prodPrice}</p>
              <p className="text-sm font-bold text-green-400">You save: {prodSave}</p>
            </div>

            <div className="mb-6 text-center">
              <p className="text-xs font-medium text-slate-400">
                <span className="font-bold text-white">Guarantee:</span> If the agent doesn&apos;t reach production in 10 weeks, we work for free until it does.
              </p>
            </div>

            <button
              onClick={openDemo}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full px-6 py-4 font-bold text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
            >
              Claim Production Spot &rarr;
            </button>
            <p className="text-xs text-center text-slate-400 mt-3">1 spot remaining for May cohort</p>
          </motion.div>
        </motion.div>

        {/* Retainer Section */}
        <motion.div
          className="mt-12 max-w-3xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-2">AI Operations Retainer</h4>
              <p className="text-sm text-slate-400 mb-6">
                For clients who want their agent to keep improving after launch.
              </p>
              <div className="text-3xl font-extrabold text-white mb-2">
                {retainerPrice}
              </div>
              <p className="text-xs text-slate-500">
                Available to DataByt build clients only. Discussed after project delivery — never pushed.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <ul className="space-y-3">
                {[
                  "Monthly evaluation re-runs and quality scoring",
                  "Prompt and tool optimization",
                  "Production monitoring and drift alerts",
                  "Incident response (24-hour business hours)",
                  "One 30-min sync call per week"
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

        {/* Bottom Callout */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center shadow-xl"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            After 5 founding case studies are published, pricing moves to market rate: $35,000 for Starter, $65,000 for Production. The founding rate exists because we need case studies. You get the advantage. Both sides win.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
