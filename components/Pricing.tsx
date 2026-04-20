"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check, Star, ArrowRight } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const plans = [
  {
    name: "Audit Sprint",
    tag: "Starter",
    price: "$1,500",
    priceNote: "one-time",
    monthly: null,
    who: "Pre-Seed, early Seed, or \"not sure\" founders",
    features: [
      "2-week data audit",
      "Databricks/Snowflake cost report",
      "Architecture map & gap analysis",
      "1 quick-win agent delivered",
      "Written deliverable + 90-min walkthrough",
    ],
    cta: "Start With an Audit",
    ctaStyle: "secondary" as const,
    popular: false,
  },
  {
    name: "Fractional Lite",
    tag: "Most Popular",
    price: "$2,500",
    priceNote: "/month",
    monthly: "+ $500 setup",
    who: "Seed startups, 5–20 employees, need a data foundation",
    features: [
      "1 pipeline OR 1 AI agent shipped/month",
      "Databricks Lakehouse setup",
      "Live metrics dashboard",
      "Async Slack support",
      "1 sync call/week",
      "You own the code — cancel anytime",
    ],
    cta: "Book a Free Audit First",
    ctaStyle: "primary" as const,
    popular: true,
  },
  {
    name: "Fractional Monthly",
    tag: "Full Stack",
    price: "$4,500",
    priceNote: "/month",
    monthly: "+ $1,500 setup",
    who: "Series A, 10–40 employees, no data engineer",
    features: [
      "1 pipeline + 1 AI agent shipped/month",
      "Everything in Lite, plus:",
      "dbt modelling + Unity Catalog",
      "FinOps monitoring (20–40% savings)",
      "Investor-ready PDF + narrative",
      "2 sync calls/week + 24hr incident SLA",
    ],
    cta: "Book a Free Audit First",
    ctaStyle: "secondary" as const,
    popular: false,
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
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Heading — Hormozi: anchor against alternative */}
        <motion.div
          className="text-center mb-6"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Simple Pricing. No Surprises.
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            A full-time data engineer costs $131K–$170K/year.
            We start at $2,500/month.
          </p>
        </motion.div>

        {/* Price anchor badge */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
            <Star size={12} className="fill-amber-400" />
            Save $100K+ vs full-time hire in year one
          </span>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative bg-[#0A1628]/80 rounded-2xl p-8 backdrop-blur-sm ${
                plan.popular
                  ? "border-2 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                  : "border border-slate-800"
              }`}
            >
              {/* Tag badge */}
              <span className={`absolute -top-3 left-8 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                plan.popular
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}>
                {plan.tag}
              </span>

              {/* Plan name */}
              <h3 className="text-xl font-semibold text-white mb-1 mt-2">
                {plan.name}
              </h3>
              <p className="text-xs text-slate-500 mb-6">{plan.who}</p>

              {/* Pricing */}
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-slate-500 ml-2 text-sm">
                  {plan.priceNote}
                </span>
              </div>
              {plan.monthly && (
                <p className="text-sm text-slate-500 mb-6">{plan.monthly}</p>
              )}
              {!plan.monthly && <div className="mb-6" />}

              {/* Divider */}
              <div className="border-t border-slate-800 mb-6" />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={18}
                      className="text-blue-400 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              {plan.ctaStyle === "primary" ? (
                <button
                  onClick={openDemo}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full px-8 py-4 font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={openDemo}
                  className="w-full border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white rounded-full px-8 py-4 font-semibold transition-all duration-200 hover:scale-[1.02]"
                >
                  {plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-slate-500 text-sm mt-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          All plans: cancel anytime with 7 days&apos; notice. You keep the code. Billed monthly, no 6-month SOWs.
        </motion.p>
      </div>
    </section>
  );
}
