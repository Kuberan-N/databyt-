"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const plans = [
  {
    name:     "AR Engine",
    monthly:  2500,
    annual:   25000,
    period:   "/month",
    note:     "30-day free trial. No credit card.",
    desc:     "Full AR collections automation for mid-market finance teams.",
    featured: false,
    features: [
      "AI Collections Agent — fully automated",
      "L1 / L2 / L3 dunning email sequences",
      "Payment links in every email (Dodo Payments)",
      "Dispute management portal",
      "AR aging dashboard & CEI analytics",
      "QuickBooks, Xero, NetSuite, Sage integration",
      "Reply detection & opt-out handling",
      "Live in 48 hours",
    ],
  },
  {
    name:     "CashFlow Command",
    monthly:  5000,
    annual:   50000,
    period:   "/month",
    note:     "30-day free trial. No credit card.",
    desc:     "Full cash flow command center — AR, AP, and forecasting.",
    featured: true,
    badge:    "Most Popular",
    features: [
      "Everything in AR Engine, plus:",
      "AI Invoice Processor (AP automation)",
      "Cash flow forecasting dashboard",
      "Multi-entity support",
      "Custom dunning sequences",
      "Unlimited ERP integrations",
      "Dedicated CSM + priority support",
      "Board-ready reporting suite",
    ],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="bg-white py-20 border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-10"
        >
          <p className="text-[#000000] text-[11px] font-semibold uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#111111] leading-[1.15] tracking-[-0.02em]">
            Flat fee. No per-invoice charges.
          </h2>
          <p className="mt-3 text-[#111111] text-[15px] max-w-md">
            10× cheaper than HighRadius. Start free, scale when you&apos;re ready.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              !yearly
                ? "bg-[#111111] text-white"
                : "text-[#555555] hover:text-[#111111]"
            }`}
          >
            Monthly
          </button>

          <div
            onClick={() => setYearly(y => !y)}
            className="relative w-11 h-6 rounded-full bg-[#E5E5E5] cursor-pointer transition-colors"
            style={{ background: yearly ? "#111111" : "#E5E5E5" }}
          >
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: yearly ? "calc(100% - 20px)" : "4px" }}
            />
          </div>

          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-2 ${
              yearly
                ? "bg-[#111111] text-white"
                : "text-[#555555] hover:text-[#111111]"
            }`}
          >
            Yearly
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-[10px] font-bold">
              <Zap className="w-2.5 h-2.5" />
              2 months free
            </span>
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {plans.map((plan, i) => {
            const displayPrice = yearly
              ? Math.round(plan.annual / 12)
              : plan.monthly;
            const savings = plan.monthly * 12 - plan.annual;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className={`relative rounded-xl p-7 flex flex-col ${
                  plan.featured
                    ? "bg-[#111111] border border-[#111111]"
                    : "bg-white border border-[#E5E5E5]"
                }`}
              >
                {plan.featured && plan.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-white text-[#111111] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <p className={`text-[14px] font-bold mb-0.5 ${plan.featured ? "text-white" : "text-[#111111]"}`}>
                  {plan.name}
                </p>
                <p className={`text-[13px] mb-6 ${plan.featured ? "text-white/40" : "text-[#555555]"}`}>
                  {plan.desc}
                </p>

                <div className="mb-1 flex items-end gap-1.5">
                  <span className={`text-[40px] font-extrabold leading-none ${plan.featured ? "text-white" : "text-[#111111]"}`}>
                    ${displayPrice.toLocaleString()}
                  </span>
                  <span className={`text-[14px] mb-1.5 ${plan.featured ? "text-white/40" : "text-[#555555]"}`}>
                    /month
                  </span>
                </div>

                {yearly ? (
                  <div className="mb-7 flex items-center gap-2">
                    <p className={`text-[12px] ${plan.featured ? "text-white/40" : "text-[#555555]"}`}>
                      Billed ${plan.annual.toLocaleString()}/year
                    </p>
                    <span className="text-[11px] font-semibold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full">
                      Save ${savings.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <p className={`text-[12px] mb-7 ${plan.featured ? "text-white/40" : "text-[#16A34A]"}`}>
                    {plan.note}
                  </p>
                )}

                <a
                  href="/auth"
                  className={`py-3 rounded-lg text-center text-[14px] font-semibold mb-7 transition-colors ${
                    plan.featured
                      ? "bg-white text-[#111111] hover:bg-[#F3F3F3]"
                      : "bg-[#111111] text-white hover:bg-[#000000]"
                  }`}
                >
                  Start 30-Day Free Trial
                </a>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[13px]">
                      <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.featured ? "text-white/60" : "text-[#000000]"}`} />
                      <span className={plan.featured ? "text-white/70" : "text-[#111111]"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center gap-6 text-[#555555] text-[12px]"
        >
          <span>&#10003; 30-day free trial, no credit card</span>
          <span>&#10003; Month-to-month or annual — cancel anytime</span>
          <span>&#10003; No IT team required</span>
          <span>&#10003; Live in 48 hours</span>
          <span>&#10003; CAN-SPAM compliant</span>
          <span className="ml-auto text-[#777777]">
            HighRadius starts at <span className="line-through">$100K+/year</span> &mdash; DataByt: from $25K/yr
          </span>
        </motion.div>

      </div>
    </section>
  );
}
