"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Link, Search, Wrench, Calculator, Mail } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Link,
    title: "Connect",
    description:
      "Share your Razorpay or Stripe API keys and your Google Sheet. Takes 30 minutes. You control access — revoke anytime.",
  },
  {
    num: "02",
    icon: Search,
    title: "We Audit",
    description:
      "We pull every transaction, compare it across all your data sources, and tell you exactly where the numbers don't match — and why.",
  },
  {
    num: "03",
    icon: Wrench,
    title: "We Fix",
    description:
      "Refunds, duplicates, timezone mismatches, test payments — we resolve every discrepancy once so your data is clean from day one.",
  },
  {
    num: "04",
    icon: Calculator,
    title: "We Calculate",
    description:
      "MRR. Churn. CAC. LTV. Burn Rate. Runway. All six metrics computed from verified, reconciled data — not best guesses from a broken spreadsheet.",
  },
  {
    num: "05",
    icon: Mail,
    title: "You Receive",
    description:
      "A branded PDF report, a live dashboard, and a 3-line narrative summary an investor can read in 30 seconds. Delivered by the 3rd of every month. Zero effort from you.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            From Messy Data to Investor-Ready Report in{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              5 Days
            </span>
          </h2>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="relative"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Vertical connecting line */}
          <div className="absolute top-0 bottom-0 left-7 w-px border-l-2 border-dashed border-zinc-800" />

          <div className="flex flex-col gap-10">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="relative flex items-start gap-5 pl-14"
              >
                {/* Number badge */}
                <div className="absolute left-0 flex-shrink-0 w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-400">
                    {step.num}
                  </span>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex-1 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                      <step.icon size={18} className="text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
