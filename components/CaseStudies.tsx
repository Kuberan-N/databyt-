"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Building2 } from "lucide-react";

const placeholders = [
  {
    type: "D2C Fashion Brand",
    problem: "₹1.2L discrepancy between Razorpay and Sheets",
    result: "100% reconciled data, investor report automated",
  },
  {
    type: "SaaS Platform",
    problem: "Churn miscalculated for 6 months",
    result: "Accurate churn tracking, saved 5 hrs/month",
  },
  {
    type: "Subscription Box",
    problem: "MRR included test payments and refunds",
    result: "Clean MRR, investor-ready in 5 days",
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

export default function CaseStudies() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Founders We&apos;ve Helped
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto">
            Real results. Real metrics. Real peace of mind.
          </p>
        </motion.div>

        {/* Placeholder cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {placeholders.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl p-8 hover:border-zinc-700 transition-all"
            >
              <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 w-fit mb-5">
                <Building2 size={24} className="text-zinc-500" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-purple-400 mb-2">
                {item.type}
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.problem}
              </h3>
              <p className="text-sm text-zinc-400 mb-4">{item.result}</p>
              <p className="text-sm text-zinc-600 italic">
                &ldquo;Founder quote coming soon&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
