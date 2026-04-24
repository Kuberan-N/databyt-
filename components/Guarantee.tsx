"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Shield, RefreshCcw, BadgeCheck } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    title: "6-Week Production Guarantee",
    text: "Production agent running in 6 weeks — or 100% refund. No caveats, no fine print. We don't get paid until your agent is live.",
  },
  {
    icon: RefreshCcw,
    title: "Metrics Accuracy Promise",
    text: "Metrics don't match your source of truth? We rebuild free — as many times as it takes until they match exactly.",
  },
  {
    icon: BadgeCheck,
    title: "Cancel Anytime Terms",
    text: "Cancel your retainer anytime with 7 days notice. You keep everything — every repo, every model, every line of code.",
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
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          6 Weeks,{" "}
          <span className="text-gradient-blue">or Your Money Back</span>
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          We put our money where our mouth is. A production agent in your Databricks account within 6 weeks of kickoff — or a full refund. The risk is entirely on us. That&apos;s how confident we are.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {guarantees.map((g) => (
            <motion.div
              key={g.title}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all text-left"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit mb-4">
                <g.icon size={24} className="text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{g.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{g.text}</p>
            </motion.div>
          ))}
        </motion.div>

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
