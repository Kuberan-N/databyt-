"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const plans = [
  {
    name: "Investor Report",
    popular: true,
    setup: "₹25,000",
    monthly: "₹5,000",
    features: [
      "Automated MRR, churn, CAC, LTV",
      "Branded PDF report",
      "Live metrics dashboard",
      "Monthly narrative summary",
      "Email delivery by the 3rd",
    ],
    cta: "Get Started",
    ctaStyle: "primary" as const,
  },
  {
    name: "Full Data Pipeline",
    popular: false,
    setup: "₹35,000",
    monthly: "₹5,000",
    features: [
      "Everything in Investor Report",
      "Unified data from Razorpay + Sheets + CRM",
      "Real-time dashboard updates",
      "Daily automated data sync",
      "Custom metric definitions",
    ],
    cta: "Request Demo",
    ctaStyle: "secondary" as const,
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { open: openDemo } = useDemoForm();

  return (
    <section id="pricing" className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simple Pricing. No Surprises.
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto">
            Transparent pricing for startups that value their time.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative bg-zinc-900/50 rounded-2xl p-8 backdrop-blur-sm ${
                plan.popular
                  ? "border border-purple-500/50 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                  : "border border-zinc-800"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <span className="absolute -top-3 left-8 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  Popular
                </span>
              )}

              {/* Plan name */}
              <h3 className="text-xl font-semibold text-white mb-6">
                {plan.name}
              </h3>

              {/* Pricing */}
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">
                  {plan.setup}
                </span>
                <span className="text-zinc-500 ml-2 text-sm">
                  one-time setup
                </span>
              </div>
              <p className="text-zinc-400 text-base mb-6">
                <span className="text-white font-semibold">{plan.monthly}</span>
                /month
              </p>

              {/* Divider */}
              <div className="border-t border-zinc-800 mb-6" />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={18}
                      className="text-purple-400 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              {plan.ctaStyle === "primary" ? (
                <button onClick={openDemo} className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-full px-8 py-4 font-semibold transition-all duration-200 hover:scale-[1.02]">
                  {plan.cta}
                </button>
              ) : (
                <button onClick={openDemo} className="w-full border border-zinc-700 hover:border-purple-500 text-zinc-300 hover:text-white rounded-full px-8 py-4 font-semibold transition-all duration-200 hover:scale-[1.02]">
                  {plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-zinc-500 text-sm mt-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Setup takes 5 business days. Cancel anytime. No lock-in.
        </motion.p>
      </div>
    </section>
  );
}
