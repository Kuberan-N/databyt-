"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
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
        <div className="w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center" ref={ref}>
        {/* StoryBrand: success vision + stakes */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Your Next Board Meeting{" "}
          <span className="text-gradient-blue">
            Deserves Clean Data
          </span>
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-slate-400 mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Book a free 20-minute audit. We&apos;ll find at least $15K in wasted
          spend or one critical pipeline gap — guaranteed. No pitch, no pressure.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <button
            onClick={open}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-full px-10 py-4 text-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            Book Your Free Audit
            <ArrowRight
              size={20}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </motion.div>

        <motion.p
          className="text-sm text-slate-500 mt-6"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          No payment required. No spam. Just straight answers about your data.
        </motion.p>

        {/* Trust badges — per strategy recommendation */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-4"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="text-xs text-slate-600 border border-slate-800 rounded-full px-3 py-1">
            SOC 2 in progress
          </span>
          <span className="text-xs text-slate-600 border border-slate-800 rounded-full px-3 py-1">
            GDPR-ready
          </span>
          <span className="text-xs text-slate-600 border border-slate-800 rounded-full px-3 py-1">
            Read-only API access
          </span>
          <span className="text-xs text-slate-600 border border-slate-800 rounded-full px-3 py-1">
            You own the code
          </span>
        </motion.div>
      </div>
    </section>
  );
}
