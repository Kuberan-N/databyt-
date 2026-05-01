"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const guarantees = [
  {
    icon: "⏱️",
    title: "3-Week Delivery",
    body: "AR Collections Agent delivered to production in 3 weeks. If we miss the deadline, you don\u2019t pay.",
  },
  {
    icon: "🛡️",
    title: "30-Day Protection",
    body: "If the agent breaks in production within 30 days, we fix it immediately. No tickets, no hourly billing.",
  },
  {
    icon: "🔑",
    title: "Full Ownership",
    body: "You own the code, the infrastructure, and the data. No hostage fees. No subscriptions. Ever.",
  },
  {
    icon: "🔒",
    title: "Data Sovereignty",
    body: "Your data NEVER leaves your Databricks or Snowflake. We build inside your cloud. Period.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Guarantee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 md:py-40 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] text-blue-400 uppercase mb-5">
            Skin in the Game
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
            We Don&apos;t Hide Behind Contracts. <br className="hidden md:block" />
            <span className="text-gradient-blue">We Stand Behind Guarantees.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            If we fail, you don&apos;t pay. That&apos;s not marketing — it&apos;s how we do business.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="glass-card rounded-2xl p-8 transition-all duration-500 flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-8 p-5 bg-slate-800/30 rounded-2xl w-fit">
                {g.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-4">{g.title}</h3>
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
