"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open } = useDemoForm();

  return (
    <section className="relative py-32 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-blue-600/8 blur-[150px]" />
      </div>
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center" ref={ref}>
        <motion.span
          className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-400 mb-8"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Start Automating
        </motion.span>

        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-8 font-heading leading-tight"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Every Day You Wait, Your AR Team <br className="hidden md:block" />
          <span className="text-gradient-blue">Processes 100 Invoices Manually at $16 Each.</span>
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-slate-400 mb-5 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          That&apos;s <span className="text-white font-medium">$1,600/day</span> in inefficiency. An AI agent eliminates this in 3 weeks. Book your free 20-minute assessment.
        </motion.p>

        <motion.p
          className="text-sm text-blue-400/70 mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          3 build slots remaining for May
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <button
            onClick={open}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-full px-12 py-5 text-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] btn-pulse"
          >
            Book Free AR Assessment
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-12"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {["3-Week Guarantee", "Data Never Leaves", "Full Code Ownership"].map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-2 text-xs text-slate-400 border border-slate-700/30 bg-slate-800/20 rounded-full px-4 py-2"
            >
              <Shield size={11} className="text-blue-400/60" />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
