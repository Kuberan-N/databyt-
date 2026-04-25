"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";


const painPoints = [
  {
    icon: "🔴",
    title: "It works in staging. It fails in production.",
    description: "Your team built something impressive. It passed every internal test. Then it hit real users and started hallucinating names, misrouting requests, and producing outputs no one can explain. Your engineers are debugging prompts instead of shipping features. Two quarters of work. Zero production deployments.",
    bottomLine: "This is not an AI problem. This is an engineering discipline problem."
  },
  {
    icon: "🔴",
    title: "You spent $80K. The demo still lives in a notebook.",
    description: "The agency delivered. The prototype looked impressive in the deck. Then your team tried to run it on live data and it broke. No evaluation framework. No failure mode handling. No monitoring. A $80K demo that your CFO is now asking about in quarterly reviews.",
    bottomLine: "Agencies optimise for demos. We optimise for Monday mornings."
  },
  {
    icon: "🔴",
    title: "Your engineers know pipelines. Not agent systems.",
    description: "Your data team is exceptional at Databricks. They build bulletproof pipelines. But production AI agents require a different discipline — evaluation suites, human-in-the-loop checkpoints, reinforcement loops, deployment monitoring. Nobody taught them this. Nobody teaches this.",
    bottomLine: "This is the gap DataByt fills."
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

export default function ProblemAgitation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problem" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
            Your AI Project Is Probably Dying Right Now. <br className="hidden md:block" />
            <span className="text-gradient-blue">Here&apos;s How to Tell.</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Three symptoms that appear in every team before the AI project gets cancelled, the budget gets frozen, or the CTO starts asking hard questions.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="text-2xl group-hover:scale-110 transition-transform">
                  {point.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{point.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed flex-grow mb-6">{point.description}</p>
              <p className="text-sm font-bold text-red-400 mt-auto pt-4 border-t border-slate-800">
                {point.bottomLine}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center shadow-xl"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-lg md:text-xl font-medium text-slate-300 leading-relaxed">
            Every week this remains unsolved: your competitors ship. Your OKRs slip. Your board loses confidence in AI initiatives. And the engineering team that built the demo starts getting questions they can&apos;t answer.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
