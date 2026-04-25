"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const proofs = [
  {
    icon: "📄",
    title: "Sample Audit Report",
    text: "See exactly what a DataByt audit looks like. No email gate, download instantly.",
    cta: "Download Sample Report (PDF)",
    link: "#",
  },
  {
    icon: "🎥",
    title: "AI Agent Walkthrough",
    text: "5-minute Loom showing how we discover, scope, and evaluate an AI agent.",
    cta: "Watch Demo (Loom)",
    link: "#",
  },
  {
    icon: "📊",
    title: "FinOps Field Manual",
    text: "The 22-page framework we use in every audit. Free download.",
    cta: "Get the Manual (PDF)",
    link: "#",
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
            Proof,{" "}
            <span className="text-gradient-blue">Not Promises</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to see before working with us.
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
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{p.icon}</span>
                <h3 className="text-xl font-semibold text-white">{p.title}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                {p.text}
              </p>
              <a
                href={p.link}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mt-auto"
              >
                {p.cta}
                <ArrowRight size={16} />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
