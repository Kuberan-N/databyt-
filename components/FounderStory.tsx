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
            Why We Built Databyt
          </h2>

          <div className="space-y-4 text-slate-400 leading-relaxed text-base">
            <p>
              I spent 8 years in data engineering. In that time, I watched dozens of AI projects fail — and they almost always failed at the same place. Not the model. Not the prompt. <span className="text-slate-300 font-medium">The data wasn&apos;t ready.</span>
            </p>
            <p>
              Most AI agent builders can&apos;t fix that. They know how to wrap an LLM in an API and call it an agent. They don&apos;t know how to handle messy, siloed, governed enterprise data at production scale. So they build on clean demo data and the agent breaks the moment it hits the real world.
            </p>
            <p className="text-slate-300 font-medium">
              I built Databyt because I know exactly why your AI isn&apos;t shipping. And I can fix it — because I fix the data first.
            </p>
            <p>
              Agent-first businesses are being built right now on Databricks. The ones that ship production agents in weeks, not years, are the ones that treat data engineering as the foundation. That&apos;s our model. That&apos;s the only model that works.
            </p>
          </div>

          {/* Founder tweet-style quote */}
          <div className="mt-8 p-4 border border-slate-700/50 bg-slate-800/30 rounded-xl">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              &ldquo;The #1 reason AI projects fail isn&apos;t the model — it&apos;s that the data isn&apos;t production-ready. I&apos;ve seen this happen 20+ times. Fix the data first, then build the agent. Every. Single. Time.&rdquo;
            </p>
            <p className="text-xs text-slate-500 mt-2">— Kuberan, Founder @ Databyt</p>
          </div>

          <div className="mt-6 text-sm text-slate-300 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
            Currently onboarding our first 10 founding clients at launch pricing. Prices increase after the first 10 case studies are published.
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
