"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, DollarSign, BrainCircuit } from "lucide-react";

const painPoints = [
  {
    icon: AlertTriangle,
    title: "Pipelines Break Every Week",
    description:
      "30–40% of data pipelines fail weekly. 67 incidents per month on average. Your board sees the broken dashboard — and loses confidence in your numbers.",
    stat: "67",
    statLabel: "incidents/month avg",
  },
  {
    icon: DollarSign,
    title: "Can't Justify a $150K Hire",
    description:
      "A full-time US data engineer costs $131K–$170K loaded. You need 20 hours a week, not 40. But Upwork freelancers disappear after two sprints.",
    stat: "$150K",
    statLabel: "avg annual cost",
  },
  {
    icon: BrainCircuit,
    title: "AI Pilots That Go Nowhere",
    description:
      "40% of agentic AI projects will be cancelled by 2027. The gap between 'we want AI' and 'our data supports AI' is where projects die.",
    stat: "40%",
    statLabel: "AI projects cancelled",
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
          Sound Familiar?
        </motion.h2>
        <motion.p
          className="text-base md:text-lg text-slate-400 text-center max-w-xl mx-auto mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Every Seed-to-Series B founder hits these walls.
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
                  <p className="text-2xl font-bold text-gradient-blue">{point.stat}</p>
                  <p className="text-xs text-slate-500">{point.statLabel}</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* StoryBrand: stakes — what happens if you don't act */}
        <motion.p
          className="text-center text-slate-500 italic mt-12 text-base"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          You didn&apos;t raise to babysit data pipelines.
        </motion.p>
      </div>
    </section>
  );
}
