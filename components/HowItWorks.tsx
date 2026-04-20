"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Search, Wrench, Rocket, Headphones } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Audit",
    description:
      "We run a free 2-week diagnostic on your data stack. Find the gaps. Map the architecture. Identify 20–40% in wasted Databricks/Snowflake spend. You get a written report — zero obligation.",
  },
  {
    num: "02",
    icon: Wrench,
    title: "Build",
    description:
      "Production-grade data pipelines in 3 weeks. Ingestion (Fivetran/Airbyte) → Databricks Lakehouse → dbt models → dashboard. Not a PoC, not a deck — running in your account.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Ship",
    description:
      "One AI agent shipped per month — AR chaser, CS triage, lead enricher, inventory alerter. Tied to your lakehouse so it stays accurate. Evaluated, monitored, versioned.",
  },
  {
    num: "04",
    icon: Headphones,
    title: "Own",
    description:
      "Private Slack channel, 2 live syncs per week, 24-hour incident SLA. You own the code, the repo, and the docs. Runbook included so you're never locked in. Cancel any month.",
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

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Heading — StoryBrand: the plan */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            From Broken Data to{" "}
            <span className="text-gradient-blue">
              Board-Ready
            </span>{" "}
            in 4 Steps
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            A clear path from audit to ownership. No 6-month SOW required.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="relative"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Vertical connecting line */}
          <div className="absolute top-0 bottom-0 left-7 w-px border-l-2 border-dashed border-slate-800" />

          <div className="flex flex-col gap-10">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="relative flex items-start gap-5 pl-14"
              >
                {/* Number badge */}
                <div className="absolute left-0 flex-shrink-0 w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-400">
                    {step.num}
                  </span>
                </div>

                <div className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 flex-1 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <step.icon size={18} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
