"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { AlertCircle } from "lucide-react";

const causes = [
  "Refunds processed in Razorpay but never updated in your sheet",
  "Duplicate transactions from webhook retries you didn't know about",
  "UTC vs IST timezone gaps silently splitting revenue across months",
  "Test payments mixed in with real revenue",
  "Incomplete data syncs that skip transactions on certain dates",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function TheRealProblem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-8"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          The #1 Problem:{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Your Numbers Don&apos;t Match
          </span>
        </motion.h2>

        {/* Body */}
        <motion.p
          className="text-base md:text-lg text-zinc-400 text-center max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Razorpay shows ₹10L. Your spreadsheet shows ₹9.2L. That&apos;s
          ₹80,000 you can&apos;t explain — and neither can your CA.
          <br /><br />
          We&apos;ve seen this with every founder we&apos;ve spoken to. The
          causes are always the same:
        </motion.p>

        {/* Causes list */}
        <motion.div
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-10"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {causes.map((cause, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-start gap-3 py-3 border-b border-zinc-800/50 last:border-b-0"
            >
              <AlertCircle
                size={18}
                className="text-purple-400 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm md:text-base text-zinc-300 leading-relaxed">
                {cause}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing */}
        <motion.p
          className="text-base md:text-lg text-zinc-300 text-center max-w-2xl mx-auto leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          We audit your data, find the exact discrepancy, fix it once, and
          automate it so it never breaks again. Your metrics become{" "}
          <span className="text-white font-semibold">
            investor-trustworthy
          </span>{" "}
          — for the first time.
        </motion.p>
      </div>
    </section>
  );
}
