"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Shield, RefreshCcw, BadgeCheck } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    text: "First report delivered before you pay a single rupee",
  },
  {
    icon: RefreshCcw,
    text: "Full refund if the metrics don't match your actual data",
  },
  {
    icon: BadgeCheck,
    text: "Free revisions until you — and your investors — are fully confident",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Guarantee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center" ref={ref}>
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-6"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Our Promise:{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            You Pay After You See the Work
          </span>
        </motion.h2>

        {/* Body */}
        <motion.p
          className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          We deliver your first report. You review every number. If the metrics
          match reality and you&apos;re satisfied — you pay. If something&apos;s
          off, we fix it free until it&apos;s right. No risk. No upfront
          commitment. No awkward conversations.
        </motion.p>

        {/* Guarantee cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 w-fit mx-auto mb-4">
                <g.icon size={24} className="text-purple-400" />
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{g.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing */}
        <motion.p
          className="text-lg font-semibold text-white"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          The risk is entirely on us. That&apos;s how confident we are.
        </motion.p>
      </div>
    </section>
  );
}
