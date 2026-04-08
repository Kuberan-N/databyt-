"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const withoutSteps = [
  "Export Razorpay CSV",
  "Copy-paste into Google Sheets",
  "Fix the formulas that broke again",
  "Manually verify numbers actually match",
  "Write an investor summary you're not confident about",
];

const withSteps = [
  "Open your email",
  "Report is already there",
  "Copy-paste the 3-line narrative",
  "Send",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function TimeSaved() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          You Get{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            4 Hours Back
          </span>{" "}
          Every Month
        </motion.h2>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Without Databyt */}
          <motion.div
            className="bg-zinc-900/50 border border-red-500/20 rounded-2xl p-8"
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h3 className="text-lg font-semibold text-red-400 mb-6">
              Without Databyt
            </h3>
            <div className="space-y-4">
              {withoutSteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <X
                    size={18}
                    className="text-red-400/70 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-zinc-400">{step}</span>
                </motion.div>
              ))}
            </div>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg font-bold text-red-400"
            >
              4 hours gone. Every single month.
            </motion.p>
          </motion.div>

          {/* With Databyt */}
          <motion.div
            className="bg-zinc-900/50 border border-emerald-500/20 rounded-2xl p-8"
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h3 className="text-lg font-semibold text-emerald-400 mb-6">
              With Databyt
            </h3>
            <div className="space-y-4">
              {withSteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <Check
                    size={18}
                    className="text-emerald-400/70 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-zinc-300">{step}</span>
                </motion.div>
              ))}
            </div>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg font-bold text-emerald-400"
            >
              0 hours. Done before your morning chai.
            </motion.p>
          </motion.div>
        </div>

        {/* Closing */}
        <motion.p
          className="text-center text-zinc-500 italic mt-12 text-base"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          That&apos;s 48 hours a year you&apos;re spending on data entry. Build
          your product instead.
        </motion.p>
      </div>
    </section>
  );
}
