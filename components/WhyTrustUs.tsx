"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Database, Layers, Target } from "lucide-react";

const cards = [
  {
    icon: Database,
    title: "Databricks-Native Specialist",
    description:
      "Not a generalist dev shop. Every deliverable uses the same stack you'll scale into at Series B. No re-platforming, no migrations — just compounding value.",
  },
  {
    icon: Layers,
    title: "Data + AI in One Operator",
    description:
      "Competitors silo data engineering and AI into separate vendors — doubling your coordination tax and your bills. One person, one bill, one Slack channel.",
  },
  {
    icon: Target,
    title: "Outcomes, Not Hours",
    description:
      "Deliverables per month, not timesheets. No surprise invoices, no scope-creep conversations. You know exactly what you're getting and exactly what it costs.",
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

export default function WhyTrustUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Heading */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-16 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Three Reasons to{" "}
          <span className="text-gradient-blue">
            Pick Us
          </span>
        </motion.h2>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit mb-5">
                <card.icon size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
