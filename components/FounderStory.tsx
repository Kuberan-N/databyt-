"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FounderStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 md:p-12 relative overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Subtle gradient accent */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />

          {/* Initials avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-6">
            <span className="text-lg font-bold text-white">K</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-heading">
            Why I Started Databyt
          </h2>

          <div className="space-y-4 text-slate-400 leading-relaxed text-base">
            <p>
              I spent 8 years as a data engineer watching companies waste money on Databricks AND watching their AI projects fail to reach production.
            </p>
            <p>
              Both problems have the same root cause: nobody specifically owns them. Engineers focus on shipping features. Finance focuses on the overall bill. AI experiments live in notebooks, never reaching production.
            </p>
            <p className="text-slate-300 font-medium">
              Databyt fills these gaps with two specialized services:
            </p>
            <p>
              <strong className="text-white">Cost audits</strong> that find what&apos;s wasted — usually $30K-$80K/year.
            </p>
            <p>
              <strong className="text-white">Production AI agents</strong> that ship systems your team can actually trust — using the 5 disciplines (evaluation, failure modes, human-in-the-loop, memory loops, monitoring) that separate demos from production systems.
            </p>
            <p>
              No retainers pushed on you. No junior consultants. Senior engineer on every project. Founding-client pricing while we collect our first 5 case studies.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-white font-semibold">Kuberan</p>
            <p className="text-sm text-slate-500">Founder, Databyt · 8 years in data engineering · Databricks-native</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
