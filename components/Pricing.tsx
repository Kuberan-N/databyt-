"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check, Star, ArrowRight } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const plans = [
  {
    name: "AI Readiness Audit",
    tag: "Start Here",
    price: "$5,000",
    priceNote: "one-time",
    duration: "2 weeks",
    who: "Seed-stage or pre-AI startups on Databricks",
    features: [
      "2-week data + infrastructure diagnostic",
      "Agent opportunity map — 5 use cases prioritized",
      "FinOps baseline + cost reduction plan",
      "Written deliverable + 90-min walkthrough",
      "100% applicable to Starter Agent tier",
    ],
    cta: "Start Here",
    ctaStyle: "secondary" as const,
    popular: false,
    highlighted: false,
  },
  {
    name: "Starter Agent",
    tag: "Most Popular",
    price: "$15,000",
    priceNote: "4 weeks",
    duration: "4 weeks",
    who: "Seed to Series A startups ready to ship their first agent",
    features: [
      "AI Readiness Audit included",
      "1 production AI agent built on your Databricks",
      "Data pipeline feeding the agent",
      "Monitoring + cost tracking dashboard",
      "Documentation + handoff training",
      "30-day bug-fix warranty",
    ],
    cta: "Book Free Audit First",
    ctaStyle: "primary" as const,
    popular: true,
    highlighted: true,
  },
  {
    name: "Production Agent System",
    tag: "Enterprise",
    price: "$50,000",
    priceNote: "8 weeks",
    duration: "8 weeks",
    who: "Series A–B startups needing multi-agent production systems",
    features: [
      "Everything in Starter Agent, plus:",
      "Multi-step agent with tool use + memory",
      "Custom integrations (Slack/Email/CRM/API)",
      "Evaluation framework + guardrails",
      "Mosaic AI / Agent Bricks deployment",
      "Unity Catalog governance setup",
    ],
    cta: "Book Free Audit First",
    ctaStyle: "secondary" as const,
    popular: false,
    highlighted: false,
  },
  {
    name: "AI Operations Retainer",
    tag: "Ongoing",
    price: "$10,000",
    priceNote: "/month",
    duration: "Ongoing",
    who: "Post-launch clients scaling AI with new agents every month",
    features: [
      "Monitoring + incident response (24hr SLA)",
      "1 new agent shipped every month",
      "Cost optimization ongoing",
      "Private Slack + 2 calls/week",
      "Cancel anytime with 7 days notice",
      "You keep everything",
    ],
    cta: "Book Free Audit First",
    ctaStyle: "secondary" as const,
    popular: false,
    highlighted: false,
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

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { open: openDemo } = useDemoForm();

  return (
    <section id="pricing" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-6"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Simple Pricing.{" "}
            <span className="text-gradient-blue">Production-Ready Delivery.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            Fixed fees, no surprises. Every engagement starts with an AI Readiness Audit so we know exactly what to build.
          </p>
        </motion.div>

        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
            <Star size={12} className="fill-amber-400" />
            Every project starts with the $5K Audit — 100% applied toward your build
          </span>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative bg-[#0A1628]/80 rounded-2xl p-7 backdrop-blur-sm flex flex-col ${
                plan.highlighted
                  ? "border-2 border-blue-500/60 shadow-[0_0_50px_rgba(59,130,246,0.15)]"
                  : "border border-slate-800"
              }`}
            >
              {/* Tag badge */}
              <span
                className={`absolute -top-3 left-6 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {plan.tag}
              </span>

              {/* Plan name */}
              <h3 className="text-lg font-bold text-white mb-1 mt-3">{plan.name}</h3>
              <p className="text-xs text-slate-500 mb-5 leading-snug">{plan.who}</p>

              {/* Pricing */}
              <div className="mb-1">
                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                <span className="text-slate-500 ml-2 text-sm">{plan.priceNote}</span>
              </div>
              <p className="text-xs text-blue-400 font-medium mb-5">{plan.duration}</p>

              {/* Divider */}
              <div className="border-t border-slate-800 mb-5" />

              {/* Features */}
              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-300 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              {plan.ctaStyle === "primary" ? (
                <button
                  onClick={openDemo}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full px-6 py-3.5 font-semibold text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
                >
                  {plan.cta}
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  onClick={openDemo}
                  className="w-full border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white rounded-full px-6 py-3.5 font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                >
                  {plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-slate-500 text-sm mt-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          All projects: fixed price, no surprises. Retainer: cancel anytime with 7 days&apos; notice. You keep the code.
        </motion.p>
      </div>
    </section>
  );
}
