"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Heart, Search, Headphones } from "lucide-react";

const cards = [
  {
    icon: Heart,
    title: "We Speak Founder",
    description:
      "We've been the founder at midnight, exporting Razorpay CSVs, praying the numbers add up before a 10 AM call. We built Databyt because we lived this pain.",
  },
  {
    icon: Search,
    title: "We Audit, Not Just Automate",
    description:
      "We don't just pull your data into a prettier dashboard. We find exactly why your numbers don't match — and fix the root cause so it never breaks again.",
  },
  {
    icon: Headphones,
    title: "Hypercare After Delivery",
    description:
      "Investor asks a tough question about your metrics? We help you answer it. Numbers look off after delivery? We fix it within 24 hours. You're never on your own.",
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
          className="text-3xl md:text-5xl font-bold text-white text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Why Founders{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Trust Us
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
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 w-fit mb-5">
                <card.icon size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
