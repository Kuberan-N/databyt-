"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";


const painPoints = [
  // ROW 1 - COST PAIN
  {
    icon: "💸",
    title: "Databricks bill keeps climbing",
    description: "Your monthly DBU spend grew 2-3x this year. Finance is asking questions you can't answer.",
  },
  {
    icon: "🐌",
    title: "Pipelines are slow and flaky",
    description: "Jobs take hours longer than they should. You've added more compute to 'fix' it, but the problem keeps coming back.",
  },
  {
    icon: "🤷",
    title: "Nobody knows what's actually running",
    description: "Your workspace has 40+ jobs, dozens of clusters, and notebooks nobody owns. You're paying for compute that probably isn't needed.",
  },
  // ROW 2 - AI PAIN
  {
    icon: "🎭",
    title: "Your AI demos never reach production",
    description: "You've shipped 3 agent prototypes. None survived production. The team calls them 'demos that work on Tuesdays.'",
  },
  {
    icon: "🔥",
    title: "AI projects burn budget without ROI",
    description: "You spent $80K on a chatbot that hallucinates customer names. CFO is asking when this turns into revenue.",
  },
  {
    icon: "🛠️",
    title: "Your engineers can't build agents yet",
    description: "Your team is great at pipelines but stuck on agent rigor — evaluation, failure modes, monitoring. They keep shipping demos, not systems.",
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
          className="text-3xl md:text-5xl font-bold text-white text-center mb-16 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          If This Sounds Familiar,{" "}
          <span className="text-gradient-blue">We Can Help</span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 w-fit flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {point.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{point.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed flex-grow">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
