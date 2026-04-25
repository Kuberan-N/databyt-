"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const guarantees = [
  {
    icon: "⏱️",
    title: "7 days, or your money back",
    body: "If we don't deliver the audit within 7 days of kickoff, full refund.",
  },
  {
    icon: "💰",
    title: "Found waste, or your money back",
    body: "If we don't identify at least $5K/year in Databricks waste, full refund.",
  },
  {
    icon: "✅",
    title: "Production-ready agents, or we iterate free",
    body: "Every agent build includes 30 days of post-launch fixes at no charge. If it doesn't survive production, we keep iterating until it does.",
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

export default function Guarantee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Three <span className="text-gradient-blue">Guarantees</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            We take the risk so you don&apos;t have to.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all flex flex-col items-center text-center group"
            >
              <div className="text-4xl mb-6 p-4 bg-slate-800/50 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                {g.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{g.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {g.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
