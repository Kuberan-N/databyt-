"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const guarantees = [
  {
    number: "01",
    title: "The 10-Week Production Guarantee",
    body: "We scope timelines aggressively. If your agent isn't live in production by week 10, we work for free until it is.",
  },
  {
    number: "02",
    title: "The 30-Day Breakage Guarantee",
    body: "If the agent breaks in production within 30 days of launch, we fix it — no support tickets, no hourly billing, free.",
  },
  {
    number: "03",
    title: "The Full Ownership Guarantee",
    body: "You own the GitHub repo, the Databricks infrastructure, and the evaluation suite. You never pay us a hostage fee. You can extend it without us.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Guarantee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 md:py-40 px-6 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">
            Agencies Charge for Effort. We Charge for Outcomes.
          </span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-4 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            We take the risk so your engineering team{" "}
            <span style={{ color: "#E8321A" }}>doesn&apos;t have to.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {guarantees.map((g) => (
            <motion.div
              key={g.number}
              variants={fadeUp}
              className="light-card rounded-2xl p-8 flex flex-col"
            >
              <span
                className="font-heading font-extrabold text-5xl mb-6 block"
                style={{ color: "#E8321A", opacity: 0.3, letterSpacing: "-0.06em" }}
              >
                {g.number}
              </span>
              <h3
                className="font-heading font-bold text-[#0A0A0A] text-lg mb-4"
                style={{ letterSpacing: "-0.02em" }}
              >
                {g.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{g.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
