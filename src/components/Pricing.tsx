"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "AR Engine",
    price: "$3,000",
    period: "/month",
    setup: "$5,000 one-time setup",
    desc: "AI-powered AR collections for mid-market finance teams",
    primary: false,
    features: [
      "AI Collections Agent — full automation",
      "Personalized dunning emails (L1/L2/L3)",
      "AR aging dashboard & analytics",
      "Customer segmentation",
      "QuickBooks & Xero integration",
      "Reply detection & tracking",
      "Weekly performance reports",
      "Live in 48 hours",
    ],
  },
  {
    name: "CashFlow Command",
    price: "$6,000",
    period: "/month",
    setup: "$10,000 one-time setup",
    desc: "Full cash flow command center — AR + AP + forecasting",
    primary: true,
    features: [
      "Everything in AR Engine, plus:",
      "AI Invoice Processor (AP automation)",
      "Cash flow forecasting dashboard",
      "Multi-entity support",
      "Custom dunning sequences",
      "Payment link generation",
      "Unlimited ERP integrations",
      "Dedicated CSM + priority support",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 border-b border-[#111111]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#111111] leading-tight">
            Pricing
          </h2>
          <p className="mt-4 text-[#555555] text-lg max-w-xl">
            Flat monthly fee. No per-invoice charges. 10× cheaper than HighRadius.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-0 border border-[#111111]">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              className={`p-10 flex flex-col ${plan.primary ? "bg-[#111111]" : "bg-white"} ${i === 0 ? "border-r border-[#111111]" : ""}`}
            >
              {plan.primary && (
                <div className="mb-4">
                  <span className="bg-[#E8242A] text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                    Full Suite
                  </span>
                </div>
              )}

              <h3 className={`text-xl font-black mb-1 ${plan.primary ? "text-white" : "text-[#111111]"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-8 ${plan.primary ? "text-white/50" : "text-[#888888]"}`}>
                {plan.desc}
              </p>

              <div className="mb-2">
                <span className={`text-5xl font-black ${plan.primary ? "text-white" : "text-[#111111]"}`}>
                  {plan.price}
                </span>
                <span className={`text-base ml-1 ${plan.primary ? "text-white/40" : "text-[#888888]"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm mb-8 ${plan.primary ? "text-white/30" : "text-[#AAAAAA]"}`}>
                + {plan.setup}
              </p>

              <a
                href="#"
                className={`py-3.5 text-center text-sm font-bold mb-10 transition-colors ${
                  plan.primary
                    ? "bg-[#E8242A] text-white hover:bg-[#C41E23]"
                    : "border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                }`}
              >
                Book a Demo
              </a>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.primary ? "text-[#E8242A]" : "text-[#E8242A]"}`} />
                    <span className={plan.primary ? "text-white/70" : "text-[#555555]"}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-[#888888] text-sm"
        >
          HighRadius starts at <span className="line-through">$30,000+/year</span>. DataByt AR Engine: $41,000/year all-in.
        </motion.p>

      </div>
    </section>
  );
}
