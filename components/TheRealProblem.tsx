"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { AlertCircle } from "lucide-react";

const causes = [
  "Databricks bills growing 17–32% year-over-year with no visibility into waste",
  "Data scattered across 10–15 SaaS tools — no single source of truth",
  "Pipeline failures silently corrupting your board-ready dashboards",
  "AI pilots running on dirty data that nobody owns or validates",
  "Manual metric reconciliation before every board meeting",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function TheRealProblem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-8 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Only 31% of Firms Say Their Data Is{" "}
          <span className="text-gradient-blue">
            AI-Ready
          </span>
        </motion.h2>

        {/* Body */}
        <motion.p
          className="text-base md:text-lg text-slate-400 text-center max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          The gap between &ldquo;we want AI&rdquo; and &ldquo;our data
          supports AI&rdquo; is where 40%+ of agentic projects get cancelled.
          <br /><br />
          The same data problems show up at every startup we audit:
        </motion.p>

        {/* Causes list */}
        <motion.div
          className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 md:p-8 mb-10"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {causes.map((cause, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-start gap-3 py-3 border-b border-slate-800/50 last:border-b-0"
            >
              <AlertCircle
                size={18}
                className="text-blue-400 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm md:text-base text-slate-300 leading-relaxed">
                {cause}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing */}
        <motion.p
          className="text-base md:text-lg text-slate-300 text-center max-w-2xl mx-auto leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          We audit your data stack, find the gaps, fix them once, and
          automate them so they never break again. Your metrics become{" "}
          <span className="text-white font-semibold">
            board-trustworthy
          </span>{" "}
          — for the first time.
        </motion.p>
      </div>
    </section>
  );
}
