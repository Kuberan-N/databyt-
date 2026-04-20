"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Building2 } from "lucide-react";

const studies = [
  {
    type: "Series A SaaS",
    problem: "Found $47K in wasted Databricks compute spend",
    result: "Pipelines automated. 99.2% uptime. $47K/yr saved.",
    quote: "They found cost leaks in 20 minutes that we missed for 8 months.",
  },
  {
    type: "Seed-Stage Fintech",
    problem: "67 pipeline incidents/month — no data engineer on staff",
    result: "From 67 incidents to 3. Full metrics dashboard live in 2 weeks.",
    quote: "We went from panic mode to board-ready in two sprints.",
  },
  {
    type: "Series B Marketplace",
    problem: "AI pilots failing — data quality too low for production agents",
    result: "Shipped 3 AI agents in 90 days. AR chaser saves 15 hrs/week.",
    quote: "The AR chaser paid for the entire retainer in month one.",
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
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Founders We&apos;ve Helped
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            Real results. Real metrics. Anonymized for privacy.
          </p>
        </motion.div>

        {/* Case study cards */}
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
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 w-fit mb-5">
                <Building2 size={24} className="text-blue-400" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-400 mb-2">
                {item.type}
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.problem}
              </h3>
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
