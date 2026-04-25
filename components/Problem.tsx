"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Database, AlertTriangle, Layers } from "lucide-react";

const painPoints = [
  {
    icon: "💸",
    title: "Databricks bill keeps climbing",
    description:
      "Your monthly DBU spend grew 2-3x this year, but you can't point to specific reasons. Finance is asking questions you can't answer.",
  },
  {
    icon: "🐌",
    title: "Pipelines are slow and flaky",
    description:
      "Jobs take hours longer than they should. You've added more compute to 'fix' it, but the problem keeps coming back.",
  },
  {
    icon: "🤷",
    title: "Nobody knows what's actually running",
    description:
      "Your workspace has 40+ jobs, dozens of clusters, and notebooks nobody owns. You're paying for compute that probably isn't needed.",
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
          You Probably Have{" "}
          <span className="text-gradient-blue">These 3 Symptoms</span>
        </motion.h2>
        <motion.p
          className="text-base md:text-lg text-slate-400 text-center max-w-2xl mx-auto mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          If any of these sound familiar, you have hidden waste in your Databricks environment.
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
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit flex items-center justify-center text-2xl">
                  {point.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{point.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
