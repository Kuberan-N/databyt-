"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import {
  TrendingUp,
  UserMinus,
  Target,
  Heart,
  Flame,
  MessageSquare,
} from "lucide-react";

const metrics = [
  {
    icon: TrendingUp,
    title: "MRR & ARR Tracking",
    description: "Your recurring revenue, tracked month-over-month — verified against your actual Razorpay or Stripe transactions. No formulas. No guesswork.",
    sample: "₹4.2L",
  },
  {
    icon: UserMinus,
    title: "Churn Rate Analysis",
    description: "Not just a percentage. Know exactly who you lost, when they left, and why — so you can fix retention before your next board update.",
    sample: "3.1%",
  },
  {
    icon: Target,
    title: "Customer Acquisition Cost (CAC)",
    description: "Calculated from your real ad spend and conversion data, not back-of-napkin estimates you'll have to defend later.",
    sample: "₹1,850",
  },
  {
    icon: Heart,
    title: "Lifetime Value (LTV)",
    description: "See the true long-term value of each customer segment, so you can justify your spend and project growth with confidence.",
    sample: "₹28,400",
  },
  {
    icon: Flame,
    title: "Burn Rate & Runway",
    description: "Know exactly how many months you have left — and precisely when to start your next fundraise, before it becomes urgent.",
    sample: "18 months",
  },
  {
    icon: MessageSquare,
    title: "Executive Summary",
    description:
      "Three lines. Plain English. Copy-paste it into your investor email and hit send. Done.",
    sample: "AI-generated",
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

export default function Deliverables() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="deliverables" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            What&apos;s Inside Your Report
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto">
            Every metric your investors care about — calculated, formatted, and
            delivered.
          </p>
        </motion.div>

        {/* Metric cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.title}
              variants={fadeUp}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                  <metric.icon size={20} className="text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-400">
                  {metric.sample}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {metric.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {metric.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Callout card */}
        <motion.div
          className="mt-10 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 border-l-4 border-l-purple-500"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
            Every report includes a{" "}
            <span className="text-white font-semibold">
              3-line narrative summary
            </span>{" "}
            you can copy-paste directly into your investor update. This is what
            makes your report truly investor-ready.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
