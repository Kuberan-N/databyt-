"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";
import { useCurrency } from "./CurrencyContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const starterFeatures = [
  "90-min AI readiness workshop (included)",
  "Full workflow decomposition + architecture design",
  "Single-task agent with 3–5 system integrations",
  "Evaluation suite — 50 documented test cases",
  "Failure mode handling for every identified risk",
  "Human-in-the-loop checkpoint design",
  "Production deployment to your workspace",
  "30-day post-launch monitoring at no extra cost",
  "Full code ownership — every line belongs to you",
  "Documentation your team can extend without us",
];

const productionFeatures = [
  "Everything in Starter Agent, plus:",
  "Multi-step agent with persistent memory + tool calling",
  "3–5 deep system integrations (ERP, CRM, email, Slack)",
  "100+ evaluation cases with LLM-as-judge scoring",
  "Reinforcement patterns + feedback collection",
  "Mosaic AI / LangGraph production deployment",
  "Unity Catalog governance — full audit trail",
  "Real-time monitoring dashboard (latency, quality, drift)",
  "Incident response support (24hr business hours)",
  "Full team training and handoff documentation",
  "Architecture review call at 90 days post-launch",
];

const retainerFeatures = [
  "Monthly evaluation re-runs and quality tuning",
  "Prompt and tool optimisation",
  "Production monitoring and drift alerts",
  "Incident response (24-hour business hours)",
  "One 30-minute sync call per week",
];

const comparisonRows = [
  { label: "Cost", internal: "$450K/year (1 DE + 1 AI eng.)", agency: "$150,000+ minimum", databyt: "India ₹3.5–7L / US $4,200–8,400" },
  { label: "Timeline", internal: "4–6 months to hire, 6+ months to ship", agency: "6–12 months start to production", databyt: "8–10 weeks to production" },
  { label: "Output", internal: "Your first agent (maybe)", agency: "Junior consultants, senior account manager", databyt: "Senior engineer on your account" },
  { label: "Risk", internal: "Wrong hire, 12-month runway burned", agency: "Templates, not Databricks-native", databyt: "30-day production guarantee" },
  { label: "Result", internal: "Ownership after 18 months + $450K", agency: "Generic delivery at enterprise price", databyt: "Production agent you own, in weeks" },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open: openDemo } = useDemoForm();
  const { currency } = useCurrency();
  const isINR = currency === "INR";

  return (
    <section id="pricing" className="py-32 md:py-40 px-6 bg-[#F5F4F0]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Founding Client Pricing</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-5 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.04em" }}
          >
            Two Ways to Engage.<br />
            <span style={{ color: "#E8321A" }}>One Standard of Engineering.</span>
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-10">
            We are taking 5 founding clients at launch pricing. After 5 case studies are published, pricing moves to market rate. 3 spots remain for the May cohort.
          </p>

          {/* Scarcity bar */}
          <div
            className="inline-flex items-center gap-3 text-sm text-white rounded-full px-6 py-3"
            style={{ background: "#0A0A0A" }}
          >
            <span className="pulse-dot" />
            <span className="font-medium text-xs tracking-wide">
              Founding spots: ■ ■ □ □ □ — 3 of 5 remain · Closes May 31, 2026
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Starter */}
          <motion.div variants={fadeUp} className="light-card rounded-2xl p-8 flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Starter Agent</span>
            <div className="mb-2">
              <span className="font-heading font-extrabold text-4xl text-[#0A0A0A]">
                {isINR ? "₹3,50,000" : "$4,200"}
              </span>
              <span className="text-sm text-gray-400 ml-2">one-time</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs line-through text-gray-400">{isINR ? "₹5,00,000" : "$6,000"}</span>
              <span className="text-xs font-semibold" style={{ color: "#E8321A" }}>Founding rate</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">4–6 weeks · Single workflow automated end-to-end.</p>
            <div className="border-t border-black/5 mb-6" />
            <ul className="space-y-3 mb-8 flex-1">
              {starterFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#E8321A" }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={openDemo}
              className="w-full border border-black/15 hover:border-[#E8321A] text-[#0A0A0A] font-semibold rounded-full py-3.5 text-sm transition-all duration-200"
            >
              Claim Starter Spot →
            </button>
          </motion.div>

          {/* Production — Featured */}
          <motion.div
            variants={fadeUp}
            className="relative rounded-2xl p-8 flex flex-col text-white"
            style={{ background: "#0A0A0A", border: "1px solid #E8321A" }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span
                className="text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider text-white"
                style={{ background: "#E8321A" }}
              >
                Most Popular
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4 mt-2">Production Agent</span>
            <div className="mb-2">
              <span className="font-heading font-extrabold text-4xl text-white">
                {isINR ? "₹7,00,000" : "$8,400"}
              </span>
              <span className="text-sm text-white/40 ml-2">one-time</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs line-through text-white/30">{isINR ? "₹12,00,000" : "$14,500"}</span>
              <span className="text-xs font-semibold" style={{ color: "#E8321A" }}>Founding rate</span>
            </div>
            <p className="text-sm text-white/50 mb-6">8–10 weeks · Full multi-step system with memory, monitoring, governance.</p>
            <div className="border-t border-white/10 mb-6" />
            <ul className="space-y-3 mb-8 flex-1">
              {productionFeatures.map((f) => (
                <li key={f} className={`flex items-start gap-2.5 text-sm ${f.startsWith("Everything") ? "text-white font-medium" : "text-white/70"}`}>
                  <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#E8321A" }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={openDemo}
              className="w-full text-white font-semibold rounded-full py-3.5 text-sm transition-all duration-200 hover:opacity-90 btn-pulse"
              style={{ background: "#E8321A" }}
            >
              Claim Production Spot →
            </button>
          </motion.div>

          {/* Retainer */}
          <motion.div variants={fadeUp} className="light-card rounded-2xl p-8 flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">AI Ops Retainer</span>
            <div className="mb-2">
              <span className="font-heading font-extrabold text-4xl text-[#0A0A0A]">
                {isINR ? "₹95,000" : "$1,150"}
              </span>
              <span className="text-sm text-gray-400 ml-2">/month</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">Available to Starter or Production Agent clients only</p>
            <p className="text-sm text-gray-500 mb-6">Ongoing monitoring, tuning, and incident response after launch.</p>
            <div className="border-t border-black/5 mb-6" />
            <ul className="space-y-3 mb-8 flex-1">
              {retainerFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#E8321A" }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={openDemo}
              className="w-full border border-black/15 hover:border-[#E8321A] text-[#0A0A0A] font-semibold rounded-full py-3.5 text-sm transition-all duration-200"
            >
              Add After Launch →
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing note */}
        <motion.p
          className="text-sm text-center text-gray-500 max-w-2xl mx-auto mb-20"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          After 5 founding case studies are published, pricing moves to market rate: $6,500 for Starter, $14,500 for Production.
          The founding rate exists because we need case studies. You get the advantage. Both sides win.
        </motion.p>

        {/* Comparison table */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h3
            className="font-heading font-extrabold text-center text-[#0A0A0A] mb-10"
            style={{ fontSize: "1.75rem", letterSpacing: "-0.03em" }}
          >
            &quot;Hiring a data engineer + AI engineer costs $37,500/month.
            DataByt delivers both for <span style={{ color: "#E8321A" }}>$8,400 total.</span>&quot;
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide w-32" />
                  <th className="py-4 px-5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Build Internally</th>
                  <th className="py-4 px-5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Big Agency</th>
                  <th className="py-4 px-5 text-center text-xs font-semibold uppercase tracking-wide" style={{ color: "#E8321A" }}>DataByt</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-[#F5F4F0]"}>
                    <td className="py-4 px-5 font-semibold text-[#0A0A0A] text-xs uppercase tracking-wide">{row.label}</td>
                    <td className="py-4 px-5 text-center text-gray-500">{row.internal}</td>
                    <td className="py-4 px-5 text-center text-gray-500">{row.agency}</td>
                    <td className="py-4 px-5 text-center font-semibold text-[#0A0A0A]">{row.databyt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
