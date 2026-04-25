"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const guarantees = [
  {
    icon: "⏱️",
    title: "The 10-Week Production Guarantee",
    body: "We scope timelines aggressively. If your agent isn't live in production by week 10, we work for free until it is.",
  },
  {
    icon: "🛡️",
    title: "The 30-Day Breakage Guarantee",
    body: "If the agent fails in production within 30 days of launch, we drop everything and fix it. No support tickets, no hourly billing. Free.",
  },
  {
    icon: "🔑",
    title: "The Full Ownership Guarantee",
    body: "You own the GitHub repo, the Databricks infrastructure, and the evaluation suite. You never pay us a hostage fee.",
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
    <section className="py-24 md:py-32 px-6 bg-[#050A14]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-block text-sm font-semibold tracking-wider text-blue-400 uppercase mb-4">
            Skin in the Game
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
            Agencies Charge for Effort. <br className="hidden md:block" />
            <span className="text-gradient-blue">We Charge for Outcomes.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            We take the risk so your engineering team doesn&apos;t have to.
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
