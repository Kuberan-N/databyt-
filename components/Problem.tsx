"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const painPoints = [
  {
    title: "Your AR team chases $2M+ in overdue invoices — manually.",
    description: "Every morning, your AR specialists open spreadsheets, copy invoice numbers, and write follow-up emails. They spend 4.5 hours per day on manual data entry — that\u2019s $30,000 per person per year in pure waste.",
    bottomLine: "An AI agent does this in seconds. 24/7. Without missing a single invoice."
  },
  {
    title: "Your DSO is 50+ days. Your competitors are at 30.",
    description: "Series B SaaS companies average 45-55 days DSO. For every $10M in annual revenue, that\u2019s $1.5M locked in unpaid invoices. Companies that automated AR dropped DSO by 15-25 days.",
    bottomLine: "Every day of DSO costs you. An AI agent collects while your team sleeps."
  },
  {
    title: "You\u2019re paying $65K/year per AR specialist to do what AI does for $4,900.",
    description: "The average AR specialist costs $55,000-$75,000/year. They process 50-80 invoices per day. An AI agent processes thousands. It never calls in sick. It never forgets a follow-up.",
    bottomLine: "This is not a technology problem. It\u2019s a finance execution problem."
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function ProblemAgitation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="problem" className="py-32 md:py-40 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-heading leading-tight">
            Manual AR Is Bleeding Your Company Dry. <br className="hidden md:block" />
            <span className="text-gradient-blue">Here&apos;s the Proof.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Three problems that cost Series B+ companies hundreds of thousands every year — and that your finance team has accepted as normal.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              className="glass-card rounded-2xl p-8 transition-all duration-500 flex flex-col"
            >
              <h3 className="text-lg font-semibold text-white mb-4 leading-snug">{point.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed flex-grow mb-8">{point.description}</p>
              <p className="text-sm font-semibold text-blue-400 pt-5 border-t border-slate-800/50">
                {point.bottomLine}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto glass-card p-10 rounded-2xl text-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Every month you wait: your DSO stays high, your cash stays locked, your competitors get faster.{" "}
            <span className="text-white font-semibold">The cost of inaction is $47,000/month.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
