"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";
import { useCurrency } from "./CurrencyContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const tier1Features = [
  "AR workflow audit on YOUR data",
  "Single workflow automated end-to-end",
  "Hands-on configuration in your stack",
  "Evaluation on real invoices before launch",
  "7–14 days to prove value",
  "Full handoff documentation",
];

const tier2Features = [
  "Everything in AR Workflow Fix, plus:",
  "Multi-step agent with memory + tool calling",
  "Deep integrations (ERP, CRM, email, Slack)",
  "100+ evaluation cases with quality scoring",
  "Reinforcement loops + feedback collection",
  "Production deployment to your environment",
  "Real-time monitoring (latency, quality, drift)",
  "30-day post-launch support included",
  "Architecture review at 90 days",
  "Full code ownership — every line is yours",
];

const tier3Features = [
  "Monthly evaluation re-runs and quality tuning",
  "Prompt and tool optimisation",
  "Production monitoring and drift alerts",
  "Incident response (24-hour business hours)",
  "One 30-minute sync call per week",
  "Available to existing clients only",
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open: openDemo } = useDemoForm();
  const { currency, setCurrency } = useCurrency();
  const isINR = currency === "INR";

  // Display ranges per spec
  const tier1Price = isINR ? "₹30K–₹50K" : "$500–$1.5K";
  const tier1FuturePrice = isINR ? "₹75K–₹1.2L" : "$900–$1.4K";
  const tier2Price = isINR ? "₹7L" : "$8K–$10K";
  const tier3Price = isINR ? "₹95K" : "$1K–$1.5K";

  return (
    <section id="pricing" className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Pricing</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-5 leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)", letterSpacing: "-0.02em" }}
          >
            Three ways to engage. <span style={{ color: "#0066FF" }}>Start small.</span>
          </h2>
          <p className="text-[15px] text-[#666] max-w-[640px] mx-auto mb-8">
            Starting: ₹30K pilot. Timeline: 7–14 days to prove. No long-term commitment required.
          </p>

          {/* Geo toggle */}
          <div className="flex items-center justify-center mt-2">
            <div className="inline-flex p-1 rounded-xl" style={{ background: "#F5F5F5", border: "1px solid #E8E8E8" }}>
              <button
                onClick={() => setCurrency("INR")}
                className="text-[13px] font-semibold rounded-lg px-4 py-2 transition-all duration-300 ease-ios"
                style={{
                  background: isINR ? "#0066FF" : "transparent",
                  color: isINR ? "#fff" : "#666",
                  boxShadow: isINR ? "0 2px 8px rgba(0,102,255,0.25)" : "none",
                }}
              >
                🇮🇳 India (₹)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className="text-[13px] font-semibold rounded-lg px-4 py-2 transition-all duration-300 ease-ios"
                style={{
                  background: !isINR ? "#0066FF" : "transparent",
                  color: !isINR ? "#fff" : "#666",
                  boxShadow: !isINR ? "0 2px 8px rgba(0,102,255,0.25)" : "none",
                }}
              >
                🇺🇸 US/EU ($)
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* TIER 1 — AR Workflow Fix */}
          <motion.div
            variants={fadeUp}
            className="bg-white p-7 flex flex-col transition-all duration-500 ease-ios hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            style={{ border: "1px solid #E8E8E8", borderRadius: "20px" }}
          >
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#0066FF" }}>AR Workflow Fix</span>
            <h3 className="font-heading font-extrabold text-[22px] text-[#0A0A0A] mb-5 leading-tight" style={{ letterSpacing: "-0.01em" }}>
              Pilot the system
            </h3>
            <div className="mb-2">
              <span className="font-mono font-semibold text-[34px] text-[#0A0A0A] leading-none" style={{ letterSpacing: "-0.02em" }}>
                {tier1Price}
              </span>
            </div>
            <p className="text-[12px] text-[#999] mb-5">(First 2–3 clients. Then {tier1FuturePrice})</p>

            {/* Guarantee box */}
            <div className="rounded-xl p-3.5 mb-5" style={{ background: "rgba(0,102,255,0.06)", border: "1px solid rgba(0,102,255,0.2)" }}>
              <p className="text-[12px] font-semibold leading-snug" style={{ color: "#0066FF" }}>
                If it doesn&apos;t improve collections, you don&apos;t pay.
              </p>
            </div>

            <ul className="space-y-2.5 mb-7 flex-1">
              {tier1Features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-[#333]">
                  <Check size={14} className="mt-1 flex-shrink-0" style={{ color: "#0066FF" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={openDemo} className="btn-primary w-full justify-center">
              Start with the pilot →
            </button>
          </motion.div>

          {/* TIER 2 — AR Automation System (FEATURED) */}
          <motion.div
            variants={fadeUp}
            className="bg-white p-7 flex flex-col transition-all duration-500 ease-ios hover:-translate-y-1"
            style={{
              border: "2px solid #0066FF",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0,102,255,0.15)",
            }}
          >
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#0066FF" }}>AR Automation System</span>
            <h3 className="font-heading font-extrabold text-[22px] text-[#0A0A0A] mb-5 leading-tight" style={{ letterSpacing: "-0.01em" }}>
              Full multi-step system
            </h3>
            <div className="mb-2">
              <span className="font-mono font-semibold text-[34px] text-[#0A0A0A] leading-none" style={{ letterSpacing: "-0.02em" }}>
                {tier2Price}
              </span>
            </div>
            <p className="text-[12px] text-[#666] mb-5">8–10 weeks · Memory, monitoring, governance</p>
            <div className="border-t border-[#E8E8E8] mb-5" />
            <ul className="space-y-2.5 mb-7 flex-1">
              {tier2Features.map((f) => (
                <li key={f} className={`flex items-start gap-2 text-[13px] ${f.startsWith("Everything") ? "text-[#0A0A0A] font-semibold" : "text-[#333]"}`}>
                  <Check size={14} className="mt-1 flex-shrink-0" style={{ color: "#0066FF" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={openDemo} className="btn-primary w-full justify-center">
              Build the full system →
            </button>
          </motion.div>

          {/* TIER 3 — AR System Support */}
          <motion.div
            variants={fadeUp}
            className="bg-white p-7 flex flex-col transition-all duration-500 ease-ios hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            style={{ border: "1px solid #E8E8E8", borderRadius: "20px" }}
          >
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#0066FF" }}>AR System Support</span>
            <h3 className="font-heading font-extrabold text-[22px] text-[#0A0A0A] mb-5 leading-tight" style={{ letterSpacing: "-0.01em" }}>
              Keep it running
            </h3>
            <div className="mb-5">
              <span className="font-mono font-semibold text-[34px] text-[#0A0A0A] leading-none" style={{ letterSpacing: "-0.02em" }}>
                {tier3Price}
              </span>
              <span className="text-[14px] text-[#666] ml-2 font-medium">/month</span>
            </div>
            <p className="text-[13px] text-[#666] mb-5">Ongoing monitoring, tuning, and incident response after launch.</p>
            <div className="border-t border-[#E8E8E8] mb-5" />
            <ul className="space-y-2.5 mb-7 flex-1">
              {tier3Features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-[#333]">
                  <Check size={14} className="mt-1 flex-shrink-0" style={{ color: "#0066FF" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={openDemo}
              className="btn-ghost w-full justify-center"
              style={{ color: "#0A0A0A" }}
            >
              Add after launch →
            </button>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-[14px] text-center text-[#666] max-w-[620px] mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Start with the pilot. Prove ROI on real invoices. Upgrade if it works. Walk away with working automation if it doesn&apos;t.
        </motion.p>
      </div>
    </section>
  );
}
