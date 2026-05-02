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
  visible: { transition: { staggerChildren: 0.1 } },
};

const starterFeatures = [
  "90-min AI readiness workshop",
  "Full workflow decomposition + architecture design",
  "Single-task agent with 3–5 system integrations",
  "Evaluation suite — 50 documented test cases",
  "Failure mode handling for every identified risk",
  "Human-in-the-loop checkpoint design",
  "Production deployment to your workspace",
  "30-day post-launch monitoring",
  "Full code ownership — every line is yours",
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
  "Architecture review at 90 days post-launch",
];

const retainerFeatures = [
  "Monthly evaluation re-runs and quality tuning",
  "Prompt and tool optimisation",
  "Production monitoring and drift alerts",
  "Incident response (24-hour business hours)",
  "One 30-minute sync call per week",
  "Available to Starter or Production clients",
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open: openDemo } = useDemoForm();
  const { currency, setCurrency } = useCurrency();
  const isINR = currency === "INR";

  return (
    <section id="pricing" className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Founding Client Pricing</span>
          <h2
            className="font-heading font-extrabold text-black mb-5 leading-[1.06]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)", letterSpacing: "-0.04em" }}
          >
            Two tiers. <span style={{ color: "#E8321A" }}>One standard.</span>
          </h2>
          <p className="text-[16px] text-[#666] max-w-[620px] mx-auto mb-8">
            We are taking 5 founding clients at launch pricing. After 5 case studies are published, pricing moves to market rate.
          </p>

          {/* Scarcity bar */}
          <div
            className="inline-flex items-center gap-3 text-[13px] rounded-full px-5 py-2.5 mb-6"
            style={{ background: "rgba(232,50,26,0.08)", border: "1px solid rgba(232,50,26,0.2)", color: "#1A1A1A" }}
          >
            <span className="pulse-dot" />
            <span className="font-medium tracking-wide">
              Founding spots: ■ ■ ■ □ □ — <span className="font-bold" style={{ color: "#E8321A" }}>3 of 5 remain</span>
            </span>
          </div>

          {/* Geo toggle */}
          <div className="flex items-center justify-center mt-2">
            <div className="inline-flex p-1 rounded-lg" style={{ background: "#F5F5F5", border: "1px solid #E8E8E8" }}>
              <button
                onClick={() => setCurrency("INR")}
                className="text-[13px] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                style={{
                  background: isINR ? "#E8321A" : "transparent",
                  color: isINR ? "#fff" : "#666",
                }}
              >
                🇮🇳 India (₹)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className="text-[13px] font-semibold rounded-md px-4 py-2 transition-all duration-200"
                style={{
                  background: !isINR ? "#E8321A" : "transparent",
                  color: !isINR ? "#fff" : "#666",
                }}
              >
                🇺🇸 US/EU ($)
              </button>
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-16"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Starter */}
          <motion.div variants={fadeUp} className="rounded-xl p-7 flex flex-col bg-white transition-all duration-300 hover:scale-[1.01]" style={{ border: "1px solid #E8E8E8" }}>
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#E8321A" }}>Starter Agent</span>
            <h3 className="font-heading font-extrabold text-[22px] text-black mb-5 leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Get your first agent live
            </h3>
            <div className="mb-1">
              <span className="font-heading font-extrabold text-[40px] text-black leading-none" style={{ letterSpacing: "-0.03em" }}>
                {isINR ? "₹3,50,000" : "$4,200"}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[12px] line-through text-[#999]">{isINR ? "₹5,00,000" : "$6,000"}</span>
              <span className="text-[12px] font-semibold" style={{ color: "#E8321A" }}>Founding rate</span>
            </div>
            <p className="text-[13px] text-[#666] mb-5">4–6 weeks · Single workflow automated end-to-end.</p>
            <div className="border-t border-[#E8E8E8] mb-5" />
            <ul className="space-y-2.5 mb-7 flex-1">
              {starterFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-[#1A1A1A]">
                  <Check size={14} className="mt-1 flex-shrink-0" style={{ color: "#E8321A" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={openDemo}
              className="w-full font-semibold rounded-lg py-3 text-[14px] transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "#E8321A", color: "#fff" }}
            >
              Claim Starter Spot →
            </button>
          </motion.div>

          {/* Production - featured */}
          <motion.div variants={fadeUp} className="relative rounded-xl p-7 flex flex-col bg-white transition-all duration-300 hover:scale-[1.01]" style={{ border: "2px solid #E8321A", boxShadow: "0 8px 32px rgba(232,50,26,0.1)" }}>
            <div className="absolute -top-3 right-7">
              <span
                className="text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider text-white"
                style={{ background: "#E8321A" }}
              >
                Most Popular
              </span>
            </div>
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#E8321A" }}>Production Agent</span>
            <h3 className="font-heading font-extrabold text-[22px] text-black mb-5 leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Full multi-step system
            </h3>
            <div className="mb-1">
              <span className="font-heading font-extrabold text-[40px] text-black leading-none" style={{ letterSpacing: "-0.03em" }}>
                {isINR ? "₹7,00,000" : "$8,400"}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[12px] line-through text-[#999]">{isINR ? "₹12,00,000" : "$14,500"}</span>
              <span className="text-[12px] font-semibold" style={{ color: "#E8321A" }}>Founding rate</span>
            </div>
            <p className="text-[13px] text-[#666] mb-5">8–10 weeks · Memory, monitoring, governance.</p>
            <div className="border-t border-[#E8E8E8] mb-5" />
            <ul className="space-y-2.5 mb-7 flex-1">
              {productionFeatures.map((f) => (
                <li key={f} className={`flex items-start gap-2 text-[13px] ${f.startsWith("Everything") ? "text-black font-semibold" : "text-[#1A1A1A]"}`}>
                  <Check size={14} className="mt-1 flex-shrink-0" style={{ color: "#E8321A" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={openDemo}
              className="w-full font-semibold rounded-lg py-3 text-[14px] transition-all duration-300 hover:scale-[1.02] btn-pulse"
              style={{ background: "#E8321A", color: "#fff" }}
            >
              Claim Production Spot →
            </button>
          </motion.div>

          {/* Retainer */}
          <motion.div variants={fadeUp} className="rounded-xl p-7 flex flex-col bg-white transition-all duration-300 hover:scale-[1.01]" style={{ border: "1px solid #E8E8E8" }}>
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#E8321A" }}>AI Ops Retainer</span>
            <h3 className="font-heading font-extrabold text-[22px] text-black mb-5 leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Keep it running
            </h3>
            <div className="mb-5">
              <span className="font-heading font-extrabold text-[40px] text-black leading-none" style={{ letterSpacing: "-0.03em" }}>
                {isINR ? "₹95,000" : "$1,150"}
              </span>
              <span className="text-[14px] text-[#666] ml-2 font-medium">/month</span>
            </div>
            <p className="text-[13px] text-[#666] mb-5">Ongoing monitoring, tuning, and incident response after launch.</p>
            <div className="border-t border-[#E8E8E8] mb-5" />
            <ul className="space-y-2.5 mb-7 flex-1">
              {retainerFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-[#1A1A1A]">
                  <Check size={14} className="mt-1 flex-shrink-0" style={{ color: "#E8321A" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={openDemo}
              className="w-full font-semibold rounded-lg py-3 text-[14px] transition-all duration-300 hover:scale-[1.02]"
              style={{ border: "1px solid #E8E8E8", color: "#1A1A1A", background: "#fff" }}
            >
              Add After Launch →
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing note */}
        <motion.p
          className="text-[14px] text-center text-[#666] max-w-[620px] mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          After 5 founding case studies are published, pricing moves to market rate.
          The founding rate exists because we need case studies. You get the advantage. Both sides win.
        </motion.p>
      </div>
    </section>
  );
}
