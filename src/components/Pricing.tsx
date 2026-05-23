"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const plans = [
  {
    name:     "AR Engine",
    price:    "$3,000",
    period:   "/month",
    setup:    "+ $5,000 one-time setup",
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
    price:    "$6,000",
    period:   "/month",
    setup:    "+ $10,000 one-time setup",
    desc:     "Full cash flow command center — AR, AP, and forecasting.",
    featured: true,
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
  return (
    <section id="pricing" className="bg-white py-20 border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-12"
        >
          <p className="text-[#E8242A] text-[11px] font-semibold uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-[30px] sm:text-[38px] font-bold text-[#111111] leading-[1.15] tracking-[-0.02em]">
            Flat fee. No per-invoice charges.
          </h2>
          <p className="mt-3 text-[#666666] text-[15px] max-w-md">
            10× cheaper than HighRadius. Month-to-month. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
          {plans.map((plan, i) => (
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
              {plan.featured && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#E8242A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Full Suite
                  </span>
                </div>
              )}

              <p className={`text-[14px] font-bold mb-0.5 ${plan.featured ? "text-white" : "text-[#111111]"}`}>
                {plan.name}
              </p>
              <p className={`text-[13px] mb-6 ${plan.featured ? "text-white/40" : "text-[#888888]"}`}>
                {plan.desc}
              </p>

              <div className="mb-1">
                <span className={`text-[40px] font-bold leading-none ${plan.featured ? "text-white" : "text-[#111111]"}`}>
                  {plan.price}
                </span>
                <span className={`text-[15px] ml-1 ${plan.featured ? "text-white/40" : "text-[#999999]"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-[12px] mb-7 ${plan.featured ? "text-white/30" : "text-[#BBBBBB]"}`}>
                {plan.setup}
              </p>

              <a
                href="#"
                className={`py-3 rounded-lg text-center text-[14px] font-semibold mb-7 transition-colors ${
                  plan.featured
                    ? "bg-[#E8242A] text-white hover:bg-[#C41E23]"
                    : "bg-[#F3F3F3] text-[#111111] hover:bg-[#EAEAEA]"
                }`}
              >
                Book a Demo
              </a>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-[13px]">
                    <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.featured ? "text-[#E8242A]" : "text-[#E8242A]"}`} />
                    <span className={plan.featured ? "text-white/70" : "text-[#555555]"}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center gap-6 text-[#999999] text-[12px]"
        >
          <span>✓ Month-to-month, cancel anytime</span>
          <span>✓ No IT team required</span>
          <span>✓ Live in 48 hours</span>
          <span>✓ CAN-SPAM compliant</span>
          <span className="ml-auto">
            HighRadius starts at <span className="line-through text-[#CCCCCC]">$100K+/year</span> — DataByt: $41K all-in
          </span>
        </motion.div>

      </div>
    </section>
  );
}
