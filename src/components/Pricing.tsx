"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "AR Engine",
    price: "$3,000",
    period: "/month",
    setup: "+ $5,000 one-time setup",
    subtitle: "AI-powered AR collections for mid-market finance teams",
    highlight: false,
    features: [
      "AI Collections Agent — full automation",
      "Personalized dunning emails (L1/L2/L3 tone)",
      "AR aging dashboard & analytics",
      "Customer segmentation (strategic / at-risk)",
      "QuickBooks & Xero integration",
      "Reply detection & tracking",
      "Weekly performance reports",
      "Dedicated onboarding — live in 48 hrs",
      "Email & phone support",
    ],
    cta: "Book a Demo",
    ctaHref: "#pricing",
  },
  {
    name: "CashFlow Command",
    price: "$6,000",
    period: "/month",
    setup: "+ $10,000 one-time setup",
    subtitle: "Full cash flow command center — AR + AP + forecasting",
    highlight: true,
    features: [
      "Everything in AR Engine, plus:",
      "AI Invoice Processor (AP automation)",
      "Cash flow forecasting dashboard",
      "Multi-entity / multi-org support",
      "Custom dunning sequences",
      "Payment link generation",
      "Unlimited ERP integrations",
      "Priority support + dedicated CSM",
      "On-call engineering support",
    ],
    cta: "Book a Demo",
    ctaHref: "#pricing",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#F8F9FC] py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#E8242A] mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] leading-tight">
            Enterprise-grade AI.{" "}
            <span className="text-[#1B2B6B]">10× cheaper</span> than HighRadius.
          </h2>
          <p className="mt-4 text-[#64748B] text-lg max-w-xl mx-auto">
            Flat monthly fee. No per-invoice charges. No surprise bills.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? "bg-[#1B2B6B] text-white shadow-xl shadow-[#1B2B6B]/25"
                  : "bg-white border border-[#E2E8F0] shadow-sm"
              }`}
            >
              {plan.highlight && (
                <div className="inline-flex self-start mb-4">
                  <span className="bg-[#E8242A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Full Suite
                  </span>
                </div>
              )}

              <h3 className={`text-xl font-black mb-1 ${plan.highlight ? "text-white" : "text-[#0F172A]"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-white/70" : "text-[#64748B]"}`}>
                {plan.subtitle}
              </p>

              <div className="mb-2">
                <span className={`text-5xl font-black ${plan.highlight ? "text-white" : "text-[#0F172A]"}`}>
                  {plan.price}
                </span>
                <span className={`text-base ml-1 ${plan.highlight ? "text-white/60" : "text-[#94A3B8]"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm mb-8 ${plan.highlight ? "text-white/50" : "text-[#94A3B8]"}`}>
                {plan.setup}
              </p>

              <a
                href={plan.ctaHref}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold mb-8 transition-colors ${
                  plan.highlight
                    ? "bg-[#E8242A] text-white hover:bg-[#C41E23]"
                    : "bg-[#1B2B6B] text-white hover:bg-[#152356]"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </a>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-[#4ADE80]" : "text-[#16A34A]"}`}
                    />
                    <span className={plan.highlight ? "text-white/80" : "text-[#475569]"}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Comparison anchor */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-[#64748B] text-sm">
            HighRadius starts at <span className="line-through text-[#EF4444]">$30,000+/year</span>.{" "}
            <span className="text-[#0F172A] font-semibold">DataByt AR Engine: $36,000/year all-in.</span>{" "}
            Same enterprise-grade outcome.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
