"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { FileSpreadsheet, Clock, AlertTriangle } from "lucide-react";

const painPoints = [
  {
    icon: FileSpreadsheet,
    title: "Manual Razorpay Exports",
    description:
      "Downloading CSVs and copying numbers into spreadsheets every single month.",
  },
  {
    icon: Clock,
    title: "4+ Hours Wasted Monthly",
    description:
      "Calculating MRR, churn, and CAC by hand instead of building your product.",
  },
  {
    icon: AlertTriangle,
    title: "Night-Before Panic",
    description:
      "Scrambling to fix numbers that don't match hours before an investor call.",
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

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problem" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Sound Familiar?
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 w-fit mb-5">
                <point.icon size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-zinc-500 italic mt-12 text-base"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          You didn&apos;t start a company to do data entry.
        </motion.p>
      </div>
    </section>
  );
}
