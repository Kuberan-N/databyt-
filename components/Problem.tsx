"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Database, AlertTriangle, Layers } from "lucide-react";

const painPoints = [
  {
    icon: Database,
    title: "Dirty Data Kills Agents",
    description:
      "60% of AI projects are abandoned due to poor data quality. Your agent is only as good as the data feeding it — and messy, siloed production data breaks every LLM in minutes.",
    stat: "60%",
    statLabel: "AI projects fail at data (Gartner 2024)",
    statColor: "text-red-400",
  },
  {
    icon: Layers,
    title: "Wrong Tech Stack",
    description:
      "Teams pick LangChain on notebooks that don't scale past demo day. Without Databricks-native infrastructure, you're one data volume spike away from a $0 production agent.",
    stat: "Demo",
    statLabel: "→ Production gap kills projects",
    statColor: "text-amber-400",
  },
  {
    icon: AlertTriangle,
    title: "No Production Discipline",
    description:
      "Agents hallucinate without proper guardrails, evaluation frameworks, and monitoring. 40% of agentic AI projects will be cancelled by 2027 (Gartner). The missing piece is always operational maturity.",
    stat: "40%",
    statLabel: "Agentic AI projects cancelled by 2027",
    statColor: "text-orange-400",
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

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problem" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-4 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Why Most AI Projects{" "}
          <span className="text-gradient-blue">Never Reach Production</span>
        </motion.h2>
        <motion.p
          className="text-base md:text-lg text-slate-400 text-center max-w-2xl mx-auto mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Every Seed-to-Series B startup hits the same three walls. Most AI builders can&apos;t fix them. We can.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all group"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit">
                  <point.icon size={24} className="text-blue-400" />
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${point.statColor}`}>{point.stat}</p>
                  <p className="text-xs text-slate-500 max-w-[120px] text-right leading-tight">{point.statLabel}</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{point.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-slate-500 italic mt-12 text-base"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          You didn&apos;t raise to babysit data pipelines — or watch AI demos that never ship.
        </motion.p>
      </div>
    </section>
  );
}
