"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check, Star, ArrowRight } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const plans = [
  {
    name: "Databricks Cost Audit",
    tag: "Primary Offer",
    price: "$749",
    priceNote: "flat fee",
    subtitle: "",
    duration: "7 days from kickoff",
    who: "Data teams looking to reduce Databricks spend",
    features: [
      "Complete scan of your Databricks workspace",
      "Cost breakdown by job, cluster, and workload",
      "Top 10 waste sources identified with $ impact",
      "Optimization roadmap (quick wins + structural fixes)",
      "20-page audit report (PDF)",
      "60-minute walkthrough call",
      "30-day email support for questions",
    ],
    cta: "Book Audit — $749",
    ctaStyle: "primary" as const,
    popular: true,
    highlighted: true,
    hasButton: true,
  },
  {
    name: "Data + AI Advisory (Coming Soon)",
    tag: "Coming Soon",
    price: "Advisory",
    priceNote: "",
    subtitle: "For clients post-audit who want ongoing optimization, data platform improvements, or AI agent builds.",
    duration: "Available from July",
    who: "Available only to post-audit clients",
    features: [
      "Structural data issues",
      "Pipeline redesign",
      "Future AI work",
    ],
    cta: "",
    ctaStyle: "secondary" as const,
    popular: false,
    highlighted: false,
    hasButton: false,
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
            🎯 Zero Risk, High ROI
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Simple Pricing.{" "}
            <span className="text-gradient-blue">Clear Outcomes.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            One flat fee. We find the waste, give you the exact steps to fix it, and support you along the way.
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
            100% Money-Back Guarantee if we don&apos;t find at least $5K in savings
          </span>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl mx-auto"
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
              {plan.subtitle && (
                <p className="text-xs font-semibold text-amber-400 mb-2">{plan.subtitle}</p>
              )}
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
              {plan.hasButton && (
                plan.ctaStyle === "primary" ? (
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
                )
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
          All audits: fixed price, no surprises. You keep all the recommendations.
        </motion.p>
      </div>
    </section>
  );
}
