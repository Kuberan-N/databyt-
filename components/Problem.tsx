"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Zap, DollarSign, Puzzle } from "lucide-react";

const painPoints = [
  {
    icon: Zap,
    title: "Works in staging. Fails in production.",
    description: "Your team built something impressive. It passed every test. Then it hit real invoices — real edge cases, real API timeouts, real customer names with special characters. Two quarters of work. Zero production deployments.",
    bottomLine: "Staging success is not production readiness.",
  },
  {
    icon: DollarSign,
    title: "₹15L spent. Demo still in a notebook.",
    description: "The agency delivered. The prototype looked impressive in the deck. Then your team tried to run it on live data and found no evaluation framework, no failure mode handling, no monitoring. Agencies optimise for demos.",
    bottomLine: "Demos don't collect cash. Production agents do.",
  },
  {
    icon: Puzzle,
    title: "Your engineers know pipelines. Not agents.",
    description: "Your data team is exceptional at Databricks. They build bulletproof pipelines. But production AI agents require a completely different discipline — evaluation suites, failure mode design, reinforcement loops, real-time monitoring.",
    bottomLine: "Pipeline expertise ≠ agent system expertise.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="problem" className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">The Problem</span>
          <h2
            className="font-heading font-extrabold text-black mb-5 leading-[1.06]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)", letterSpacing: "-0.04em" }}
          >
            Your AI project dies <span style={{ color: "#E8321A" }}>before it ships.</span>
          </h2>
          <p className="text-[16px] text-[#666] max-w-[600px] mx-auto">
            Three failure modes that kill 98% of enterprise AI projects.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                variants={fadeUp}
                className="light-card p-8 flex flex-col"
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ background: "rgba(232,50,26,0.08)" }}>
                  <Icon size={20} style={{ color: "#E8321A" }} />
                </div>
                <h3 className="font-heading font-bold text-black text-[18px] mb-3 leading-snug" style={{ letterSpacing: "-0.02em" }}>
                  {point.title}
                </h3>
                <p className="text-[14px] text-[#666] leading-relaxed flex-grow mb-5">{point.description}</p>
                <p className="text-[13px] font-semibold pt-4 border-t border-[#E8E8E8]" style={{ color: "#E8321A" }}>
                  {point.bottomLine}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom dark banner — kept black for contrast */}
        <motion.div
          className="rounded-xl p-8 md:p-10 text-center"
          style={{ background: "#0A0A0A" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-[15px] text-white/70 leading-relaxed max-w-[720px] mx-auto">
            MIT surveyed 800 execs in 2025. <span className="text-white font-semibold">88% use AI. Only 13% see results.</span>{" "}
            Every week this stays unsolved, your competitors ship and your board loses confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
