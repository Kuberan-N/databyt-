"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { open } = useDemoForm();

  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background gradient orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-blue-600/12 blur-[120px]" />
      </div>
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-cyan-600/8 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center" ref={ref}>
        <motion.span
          className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-6"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Free 90-Min Workshop
        </motion.span>

        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Stop Shipping Demos. <br className="hidden md:block" />
          <span className="text-gradient-blue">Start Shipping Systems.</span>
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-slate-400 mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Book your free 90-minute workshop. We&apos;ll map out exactly how to build an agent that survives production. No cost. No commitment.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <button
            onClick={open}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-full px-10 py-4 text-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]"
          >
            Book Free 90-Min Workshop
            <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mt-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {["2 Founding Spots Remaining", "10-Week Production Guarantee", "Full Code Ownership"].map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 text-xs text-slate-300 border border-slate-700 bg-slate-800/50 rounded-full px-4 py-2"
            >
              <Shield size={12} className="text-blue-500" />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
