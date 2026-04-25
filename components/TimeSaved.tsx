"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Clock, DollarSign, Bot, Activity } from "lucide-react";

const results = [
  {
    icon: Clock,
    value: "7 days",
    label: "Average time from kickoff to audit delivery",
    color: "#3B82F6",
  },
  {
    icon: DollarSign,
    value: "40-60%",
    label: "Typical Databricks overspend we uncover (industry data)",
    color: "#10B981",
  },
  {
    icon: Activity,
    value: "22 pages",
    label: "Depth of our audit deliverable",
    color: "#8B5CF6",
  },
  {
    icon: Bot,
    value: "$749",
    label: "Flat fee — no scope creep, no add-ons",
    color: "#06B6D4",
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

export default function TimeSaved() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6 bg-[#0A1628]/30">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            What the{" "}
            <span className="text-gradient-blue">Numbers Say</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
            Verifiable or directional metrics. No inflated claims.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {results.map((r) => (
            <motion.div
              key={r.label}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 border"
                style={{
                  backgroundColor: `${r.color}15`,
                  borderColor: `${r.color}30`,
                }}
              >
                <r.icon size={26} style={{ color: r.color }} />
              </div>
              <p
                className="text-4xl font-extrabold mb-2"
                style={{ color: r.color }}
              >
                {r.value}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">{r.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
