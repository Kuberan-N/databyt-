"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const withoutSteps = [
  "Post job listing on LinkedIn — wait 2–3 months",
  "$131K–$170K loaded annual cost (US average)",
  "Single point of failure — 18-month median attrition",
  "Can't also do AI — need a second hire for that",
  "You manage them full-time — standups, reviews, 1:1s",
  "They leave. Knowledge walks out the door.",
];

const withSteps = [
  "Start this week — working pipeline in 7 days",
  "$2,500–$4,500/mo — save $100K+ in year one",
  "Senior operator, backed by documented runbooks",
  "Data engineering + agentic AI in one person",
  "Async Slack + 2 calls/week — zero management overhead",
  "You own the code, repo, and docs. Cancel anytime.",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function TimeSaved() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        {/* Headline — Hormozi: anchor the alternative cost */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-4 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Why Not{" "}
          <span className="text-gradient-blue">
            Just Hire?
          </span>
        </motion.h2>
        <motion.p
          className="text-base md:text-lg text-slate-400 text-center max-w-xl mx-auto mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          A full-time data engineer costs 3–4× more. Here&apos;s the side-by-side.
        </motion.p>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Without Databyt */}
          <motion.div
            className="bg-[#0A1628]/80 border border-red-500/20 rounded-2xl p-8"
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h3 className="text-lg font-semibold text-red-400 mb-6">
              Full-Time Hire
            </h3>
            <div className="space-y-4">
              {withoutSteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <X
                    size={18}
                    className="text-red-400/70 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-slate-400">{step}</span>
                </motion.div>
              ))}
            </div>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg font-bold text-red-400"
            >
              $150K/year. 3 months to ramp. High risk.
            </motion.p>
          </motion.div>

          {/* With Databyt */}
          <motion.div
            className="bg-[#0A1628]/80 border border-emerald-500/20 rounded-2xl p-8"
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h3 className="text-lg font-semibold text-emerald-400 mb-6">
              Databyt Fractional
            </h3>
            <div className="space-y-4">
              {withSteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <Check
                    size={18}
                    className="text-emerald-400/70 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-slate-300">{step}</span>
                </motion.div>
              ))}
            </div>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg font-bold text-emerald-400"
            >
              $30K–$54K/year. Live in 7 days. Zero risk.
            </motion.p>
          </motion.div>
        </div>

        {/* Closing — Hormozi: quantified value */}
        <motion.p
          className="text-center text-slate-500 italic mt-12 text-base"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Save $100K+ in year one. Ship 12 pipelines and 12 AI agents. Keep the code forever.
        </motion.p>
      </div>
    </section>
  );
}
