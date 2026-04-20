"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Zap, Shield, TrendingUp, Bot } from "lucide-react";

const results = [
  {
    icon: TrendingUp,
    metric: "$47K",
    label: "Databricks cost savings found in 20 minutes",
  },
  {
    icon: Shield,
    metric: "99.2%",
    label: "Pipeline uptime after first month",
  },
  {
    icon: Zap,
    metric: "3 weeks",
    label: "From zero to production-grade pipelines",
  },
  {
    icon: Bot,
    metric: "15 hrs/wk",
    label: "Saved by one AR chaser agent",
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

export default function NarrativeExample() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-4 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Results That{" "}
          <span className="text-gradient-blue">
            Speak for Themselves
          </span>
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-slate-400 text-center mb-12 max-w-xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Real numbers from real engagements. This is what Week 1 looks like.
        </motion.p>

        {/* Results grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {results.map((result) => (
            <motion.div
              key={result.label}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit mx-auto mb-4">
                <result.icon size={24} className="text-blue-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">
                {result.metric}
              </p>
              <p className="text-xs text-slate-500 leading-snug">{result.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Investor narrative sample — bridge to wedge product */}
        <motion.div
          className="mt-12 relative bg-[#0A1628]/80 border border-blue-500/30 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(59,130,246,0.1)]"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-blue-400 mb-4">
            Sample Investor Narrative — Auto-generated
          </p>
          <p className="text-base md:text-lg text-slate-200 leading-relaxed italic">
            &ldquo;Data infrastructure is now fully automated on Databricks with
            99.2% pipeline uptime. We identified $47K in annual compute savings
            and shipped an AR chaser agent that recovers an additional $12K/month
            in overdue invoices. Series A metrics are board-ready.&rdquo;
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Copy-paste into your investor email. 30 seconds. Done.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
