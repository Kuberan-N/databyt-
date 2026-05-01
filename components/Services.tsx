"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const services = [
  {
    badge: "THE WEDGE",
    name: "AR Collections Agent",
    tagline: "Stop chasing invoices. Let AI collect your money.",
    description: "A production AI agent that automates your entire accounts receivable collections process — from dunning emails to payment tracking to escalation. Built on your Databricks or Snowflake. Deployed in 3 weeks.",
    features: [
      "AI-powered dunning email workflows",
      "Smart account prioritization by risk, amount, and aging",
      "Payment promise tracking and automated follow-ups",
      "Intelligent escalation rules",
      "Real-time AR aging dashboard on your data platform",
      "Built inside YOUR infrastructure — data never leaves",
      "Full code ownership — every line belongs to you",
    ],
    result: "Average result: 15-25 day DSO reduction in 90 days",
    timeline: "3 weeks to production",
    highlight: false,
  },
  {
    badge: "THE SYSTEM",
    name: "Order-to-Cash Automation",
    tagline: "The full finance AI stack. Invoice to cash. Automated.",
    description: "End-to-end automation of your entire order-to-cash pipeline. Invoice generation, payment tracking, cash application, reconciliation, and financial reporting — all orchestrated by AI agents on your infrastructure.",
    features: [
      "Everything in AR Collections Agent, plus:",
      "Automated invoice generation and delivery",
      "AI-powered cash application and matching",
      "Bank reconciliation automation",
      "Revenue recognition and reporting",
      "Exception handling with human-in-the-loop checkpoints",
      "Executive finance dashboard with real-time KPIs",
      "Full code ownership and team training",
    ],
    result: "Average result: 40+ hours/month saved for finance team",
    timeline: "6 weeks to production",
    highlight: true,
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open: openDemo } = useDemoForm();

  return (
    <section id="services" className="py-32 md:py-40 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] text-blue-400 uppercase mb-5">
            What We Build
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
            Two Agents. <span className="text-gradient-blue">Real Results.</span> <br className="hidden md:block" />
            Your Infrastructure.
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Not dashboards. Not reports. Not another SaaS subscription. <br className="hidden md:block" />
            Production AI agents that work while you sleep.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((service) => (
            <motion.div
              key={service.name}
              variants={fadeUp}
              className={`relative rounded-2xl p-10 flex flex-col transition-all duration-500 ${
                service.highlight
                  ? "bg-[#0A1628]/80 border border-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.06)]"
                  : "glass-card"
              }`}
            >
              {service.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                    Most Requested
                  </span>
                </div>
              )}

              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.15em] bg-blue-500/8 text-blue-400 border border-blue-500/15 w-fit mb-6">
                {service.badge}
              </span>

              <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
              <p className={`text-sm font-medium mb-5 ${service.highlight ? "text-cyan-400" : "text-slate-400"}`}>
                {service.tagline}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">{service.description}</p>

              <div className="border-t border-slate-800/50 mb-8" />

              <ul className="space-y-4 mb-10 flex-1">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5 mb-8">
                <p className="text-sm font-semibold text-blue-400">{service.result}</p>
                <p className="text-xs text-slate-500 mt-1.5">Timeline: {service.timeline}</p>
              </div>

              <button
                onClick={openDemo}
                className={`w-full rounded-full px-6 py-4 font-semibold text-sm transition-all duration-300 ${
                  service.highlight
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]"
                    : "bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-white"
                }`}
              >
                Get Started &rarr;
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
