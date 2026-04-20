"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Shield, RefreshCcw, BadgeCheck } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    text: "Working pipeline or agent in your account within 7 days — or 100% refund",
  },
  {
    icon: RefreshCcw,
    text: "Metrics that don't match your source of truth? We rebuild free until they match",
  },
  {
    icon: BadgeCheck,
    text: "Cancel any month with 7 days' notice. You keep the code, the repo, and the docs",
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
        {/* Headline — Hormozi: risk reversal */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Week 1, or{" "}
          <span className="text-gradient-blue">
            Your Money Back
          </span>
        </motion.h2>

        {/* Body */}
        <motion.p
          className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          A working pipeline or agent lands in your account within 7 days of
          kickoff, or we refund 100%. No caveats, no fine print. We don&apos;t
          get paid until you see the work.
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
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit mx-auto mb-4">
                <g.icon size={24} className="text-blue-400" />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{g.text}</p>
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
