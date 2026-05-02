"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Code2, PlayCircle, FileText } from "lucide-react";

const proofs = [
  {
    Icon: Code2,
    title: "AR Collections Agent — Full Build",
    text: "Production-grade AR collections agent on synthetic fintech data. Evaluation suite, failure mode handling, MLflow tracing, production deployment. Full code on GitHub.",
    cta: "View on GitHub →",
    link: "https://github.com",
  },
  {
    Icon: PlayCircle,
    title: "20-Minute Build Walkthrough",
    text: "Watch us apply our methodology to a real agent build. Architecture decisions, evaluation design, failure mode handling, deployment. Unedited. No script.",
    cta: "Watch Walkthrough →",
    link: "https://loom.com",
  },
  {
    Icon: FileText,
    title: "databyt Engineering Framework",
    text: "The complete 22-page technical framework behind every agent we build. Download free — no email gate. Used by data teams at Series A to Series C companies.",
    cta: "Download Free →",
    link: "/databyt_business_strategy.pdf",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ProofSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Proof</span>
          <h2 className="font-heading font-extrabold text-[#0A0A0A] mb-4 leading-[1.08]" style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.02em" }}>
            See the work <span style={{ color: "#0066FF" }}>before you commit</span>
          </h2>
          <p className="text-[16px] text-[#666] max-w-[600px] mx-auto">
            Proof before promises. Everything below is publicly available — no email required.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {proofs.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="ios-card p-7 flex flex-col"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(0,102,255,0.08)" }}>
                <p.Icon size={20} style={{ color: "#0066FF" }} />
              </div>
              <h3 className="font-heading font-bold text-[17px] text-[#0A0A0A] mb-3 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {p.title}
              </h3>
              <p className="text-[13px] text-[#666] leading-relaxed mb-6 flex-1">
                {p.text}
              </p>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-semibold text-[14px] transition-colors duration-300 hover:opacity-80"
                style={{ color: "#0066FF" }}
              >
                {p.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Technical credibility note */}
        <motion.div
          className="text-center max-w-[720px] mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h4 className="font-heading font-bold text-[15px] text-[#0A0A0A] mb-3" style={{ letterSpacing: "-0.01em" }}>
            Technical credibility
          </h4>
          <p className="text-[13px] text-[#666] leading-relaxed">
            Built on Databricks Agent Bricks, Claude API, MLflow 3.0, and production-grade systems. Every agent evaluated on YOUR data before launch. No demos. Only production.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
