"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const proofs = [
  {
    icon: "📁",
    title: "AR Collections Agent — Full Build",
    text: "We built a production-grade Accounts Receivable collections agent on synthetic fintech data. Evaluation suite, failure mode handling, MLflow tracing, production deployment. Full code on GitHub.",
    cta: "View on GitHub →",
    link: "https://github.com",
  },
  {
    icon: "🎥",
    title: "20-Minute Build Walkthrough",
    text: "Watch us apply all 5 disciplines to a real agent build. Architecture decisions, evaluation design, failure mode handling, deployment. Unedited. No script.",
    cta: "Watch Walkthrough →",
    link: "https://loom.com",
  },
  {
    icon: "📊",
    title: "The DataByt Engineering Framework",
    text: "The complete 22-page technical framework behind every agent we build. Download free — no email gate. Used by data teams at Series A to Series C companies.",
    cta: "Download Free →",
    link: "/databyt_business_strategy.pdf",
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

export default function ProofSection() {
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
            See the Work <br className="hidden md:block" />
            <span className="text-gradient-blue">Before You Commit</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            We believe in proof before promises. Everything below is publicly available — no email required.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {proofs.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all flex flex-col group"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl group-hover:scale-110 transition-transform">{p.icon}</span>
                <h3 className="text-xl font-semibold text-white leading-snug">{p.title}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-1">
                {p.text}
              </p>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold py-3 rounded-lg transition-colors mt-auto border border-slate-700 group-hover:border-blue-500/50"
              >
                {p.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
