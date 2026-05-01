"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function CostOfInaction() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open: openDemo } = useDemoForm();

  return (
    <section className="py-32 px-6 bg-[#050A14]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
            90 Days From Now: <span className="text-gradient-blue">Which Reality Is Yours?</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Left Column: Nightmare */}
          <motion.div
            variants={fadeUp}
            className="glass-card rounded-2xl p-10 flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-red-500/40 to-orange-500/20" />
            <h3 className="text-2xl font-bold text-white mb-10 border-b border-slate-800/50 pb-5">
              If Nothing Changes
            </h3>
            <ul className="space-y-5 flex-grow">
              {[
                "DSO stays at 55 days — $1.5M locked in overdue invoices",
                "AR team burns 4.5 hrs/day on manual follow-ups",
                "CFO hires another AR specialist at $65K/year",
                "27% of team time wasted resolving manual errors",
                "Competitors who automated close deals 40% faster",
                "12 months from now: same spreadsheets, $170K more in labor"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <X size={16} className="text-red-500/70 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-300 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column: Dream */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl p-10 flex flex-col h-full relative overflow-hidden bg-[#0A1628]/80 border border-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.06)]"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-blue-500/60 to-cyan-400/40" />
            <h3 className="text-2xl font-bold text-white mb-10 border-b border-slate-800/50 pb-5">
              If We Work Together
            </h3>
            <ul className="space-y-5 flex-grow">
              {[
                "DSO drops to 35 days — $500K+ freed in working capital",
                "AI agent sends 1,000+ personalized collection emails/day",
                "Finance team redirected to strategy instead of spreadsheets",
                "AR agent works 24/7 — collects while your team sleeps",
                "Cash application automated — zero manual reconciliation",
                "12 months from now: fully automated AR, zero new hires"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <Check size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-200 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center gap-5 text-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <button
            onClick={openDemo}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-lg font-semibold rounded-full px-12 py-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
          >
            Book Free AR Assessment &rarr;
          </button>
          <p className="text-sm text-slate-500">
            20 minutes. We&apos;ll show you exactly how much cash is leaking.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
