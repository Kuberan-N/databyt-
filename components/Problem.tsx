"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const painPoints = [
  {
    title: "It works in staging. It fails in production.",
    description: "Your team built something impressive. It passed every test. Then it hit real invoices — real edge cases, real API timeouts, real customer names with special characters. Two quarters of work. Zero production deployments. This is not an AI problem. This is an engineering discipline problem.",
    bottomLine: "Staging success is not production readiness. DataByt bridges the gap."
  },
  {
    title: "You spent ₹15L. The demo still lives in a notebook.",
    description: "The agency delivered. The prototype looked impressive in the deck. Then your team tried to run it on live data and found no evaluation framework, no failure mode handling, no monitoring. A ₹80K demo that the CFO is now asking hard questions about. Agencies optimise for demos. We optimise for 3 AM stability.",
    bottomLine: "Demos don't collect cash. Production agents do."
  },
  {
    title: "Your engineers know pipelines. Not agent systems.",
    description: "Your data team is exceptional at Databricks. They build bulletproof pipelines. But production AI agents require a completely different discipline — evaluation suites, failure mode design, reinforcement loops, real-time monitoring, drift detection. Nobody taught them this. This is the gap DataByt fills.",
    bottomLine: "Pipeline expertise ≠ agent system expertise. That gap costs you."
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function ProblemAgitation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="problem" className="py-32 md:py-40 px-6 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">The Problem</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-6 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.04em" }}
          >
            Your AI project is dying right now.<br />
            <span style={{ color: "#E8321A" }}>Here&apos;s how to tell.</span>
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Three failure modes that kill 98% of enterprise AI projects — and that most teams have accepted as normal.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              className="light-card rounded-2xl p-8 flex flex-col"
            >
              <h3 className="font-heading font-bold text-[#0A0A0A] text-lg mb-4 leading-snug" style={{ letterSpacing: "-0.02em" }}>{point.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-6">{point.description}</p>
              <p className="text-sm font-semibold pt-5 border-t border-black/5" style={{ color: "#E8321A" }}>
                {point.bottomLine}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom dark banner */}
        <motion.div
          className="rounded-2xl p-8 md:p-12 text-center"
          style={{ background: "#0A0A0A" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-base text-white/60 leading-relaxed max-w-3xl mx-auto">
            MIT Technology Review surveyed 800 senior executives in 2025. Only 2% of companies rate their AI performance highly. 88% use AI. Only 13% see results.{" "}
            <span className="text-white font-semibold">Every week this stays unsolved: your competitors ship, your board loses confidence, and the team that built the demo starts getting questions they can&apos;t answer.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
