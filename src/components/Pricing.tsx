"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Star, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 49,
    period: "/month",
    subtitle: "For freelancers & micro-businesses",
    invoiceLimit: "Up to 500 invoices/month",
    icon: Zap,
    color: "from-primary-500 to-primary-600",
    popular: false,
    features: [
      "AI Invoice Processing (95%+ accuracy)",
      "Basic Dunning (3 email templates)",
      "1 ERP integration (QuickBooks)",
      "5 reviewer logins",
      "Full vendor learning",
      "Email support",
      "30-day money-back guarantee",
    ],
  },
  {
    name: "Growth",
    price: 99,
    period: "/month",
    subtitle: "For small businesses scaling fast",
    invoiceLimit: "Up to 2,000 invoices/month",
    icon: Star,
    color: "from-accent-500 to-accent-600",
    popular: true,
    features: [
      "Everything in Starter, plus:",
      "Full AI Collections Agent",
      "AR Dashboard & Analytics",
      "Smart priority scoring",
      "SMS reminders",
      "2 ERP integrations (QBO + Xero)",
      "25 reviewer logins",
      "Phone support (business hours)",
      "60-day money-back guarantee",
    ],
  },
  {
    name: "Scale",
    price: 149,
    period: "/month",
    subtitle: "For growing companies",
    invoiceLimit: "Up to 5,000 invoices/month",
    icon: Crown,
    color: "from-warning-400 to-warning-500",
    popular: false,
    features: [
      "Everything in Growth, plus:",
      "Custom dunning sequences",
      "Payment link generation",
      "Unlimited ERP integrations",
      "Unlimited reviewer logins",
      "Custom column mapping",
      "Priority support + dedicated CSM",
      "60-day money-back guarantee",
      "On-call engineering support",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 bg-surface-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Simple pricing.{" "}
            <span className="gradient-text">No invoice-per-invoice fees.</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            Flat monthly investment. Everything included. Cancel anytime.
          </p>

          {/* Value anchor */}
          <div className="mt-8 inline-flex items-center gap-3 glass-light rounded-full px-6 py-3">
            <span className="text-surface-400 text-sm">
              HighRadius charges{" "}
              <span className="line-through text-danger-400">$8,000–$15,000/year</span>
            </span>
            <span className="text-surface-600">|</span>
            <span className="text-success-400 text-sm font-semibold">
              DataByt starts at $588/year
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-3xl overflow-hidden ${
                plan.popular ? "lg:scale-105 lg:-my-4" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-accent-500 to-primary-500 text-white text-center py-2 text-sm font-bold">
                  ⚡ MOST POPULAR — Best Value
                </div>
              )}

              <div
                className={`glass h-full flex flex-col ${
                  plan.popular
                    ? "pt-14 border-accent-500/30"
                    : "pt-8 border-surface-700/30"
                } p-8 border rounded-3xl`}
              >
                {/* Plan header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}
                    >
                      <plan.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {plan.name}
                      </h3>
                      <p className="text-surface-500 text-xs">{plan.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">
                      ${plan.price}
                    </span>
                    <span className="text-surface-400 text-lg">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-surface-500 text-sm mt-1">
                    {plan.invoiceLimit}
                  </p>
                </div>

                {/* CTA */}
                <a
                  href="#"
                  id={`pricing-cta-${plan.name.toLowerCase()}`}
                  className={`w-full py-3.5 rounded-full text-center font-semibold text-sm transition-all flex items-center justify-center gap-2 mb-8 ${
                    plan.popular
                      ? "bg-gradient-to-r from-accent-500 to-primary-500 text-white hover:from-accent-400 hover:to-primary-400 pulse-glow"
                      : "glass-light text-white hover:bg-white/10"
                  }`}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </a>

                {/* Features */}
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-sm text-surface-200"
                    >
                      <Check className="w-4 h-4 text-success-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 glass-light rounded-2xl px-8 py-6">
            <div className="flex items-center gap-2 text-sm text-surface-200">
              <span className="text-2xl">🛡️</span>
              <span>60-day unconditional refund</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-surface-700" />
            <div className="flex items-center gap-2 text-sm text-surface-200">
              <span className="text-2xl">📋</span>
              <span>Process 10 invoices free first</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-surface-700" />
            <div className="flex items-center gap-2 text-sm text-surface-200">
              <span className="text-2xl">🔓</span>
              <span>Cancel anytime. Full data export.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
