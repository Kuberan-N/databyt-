"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Link, Cpu, Mail } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Link,
    title: "Connect",
    description:
      "Link your Razorpay, Google Sheets, and CRM. Takes 30 minutes.",
  },
  {
    num: "02",
    icon: Cpu,
    title: "Automate",
    description:
      "We build your metrics pipeline. MRR, churn, CAC, LTV — all calculated automatically.",
  },
  {
    num: "03",
    icon: Mail,
    title: "Receive",
    description:
      "A branded PDF + live dashboard delivered to your inbox by the 3rd of every month.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
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
            How Databyt Works
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto">
            From raw data to investor-ready report in 3 steps.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="relative"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Horizontal connecting line — desktop only */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px border-t-2 border-dashed border-zinc-800" />

          {/* Vertical connecting line — mobile only */}
          <div className="md:hidden absolute top-0 bottom-0 left-7 w-px border-l-2 border-dashed border-zinc-800" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="relative flex md:flex-col items-start md:items-center md:text-center gap-5 md:gap-0 pl-14 md:pl-0"
              >
                {/* Number badge */}
                <div className="absolute left-0 md:relative md:left-auto flex-shrink-0 w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-0 md:mb-5">
                  <span className="text-sm font-bold text-purple-400">
                    {step.num}
                  </span>
                </div>

                <div>
                  {/* Icon */}
                  <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 w-fit mb-3 md:mx-auto">
                    <step.icon size={20} className="text-zinc-300" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-xs md:mx-auto">
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
