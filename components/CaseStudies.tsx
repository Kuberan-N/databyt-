"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Building2 } from "lucide-react";

const studies = [
  {
    type: "Series A SaaS · AR Automation",
    problem: "Manual accounts receivable — 15 hrs/week chasing invoices",
    result: "AR Chase Agent live in Week 6. $184K recovered in Month 1.",
    quote: "The agent paid for the entire engagement in the first 30 days.",
    weeks: "6 weeks",
  },
  {
    type: "Seed-Stage Fintech · Data Foundation",
    problem: "AI pilot killed by dirty data — 3 vendors had already failed",
    result: "Data foundation built. First agent live. 99.2% uptime since launch.",
    quote: "They fixed in 6 weeks what three agencies couldn't fix in 8 months.",
    weeks: "6 weeks",
  },
  {
    type: "Series B Marketplace · Cost Optimisation",
    problem: "Runaway Databricks costs — 20-40% in wasted compute identified",
    result: "20-40% saved. Agent routes support tickets. 60% ops reduction.",
    quote: "The FinOps audit alone paid for everything. The agent was a bonus.",
    weeks: "2 weeks",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function CaseStudies() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Startups We&apos;ve{" "}
            <span className="text-gradient-blue">Shipped Agents For</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            Real results. Real production agents. Anonymized for privacy.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {studies.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 w-fit">
                  <Building2 size={20} className="text-blue-400" />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                  {item.weeks}
                </span>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-400 mb-2">
                {item.type}
              </p>
              <h3 className="text-base font-semibold text-white mb-2">{item.problem}</h3>
              <p className="text-sm text-emerald-400 font-medium mb-4">{item.result}</p>
              <p className="text-sm text-slate-400 italic border-t border-slate-800 pt-4">
                &ldquo;{item.quote}&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
