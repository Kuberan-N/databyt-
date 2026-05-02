"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const disciplines = [
  {
    number: "01",
    title: "Evaluation",
    body: "We build a test suite of 50-100 real scenarios before deployment. Your agent runs against every case. Performance is measured, documented, and reported — not assumed.",
    result: "Outcome: Zero production surprises."
  },
  {
    number: "02",
    title: "Failure Mode Design",
    body: "APIs time out. LLMs hallucinate. Databases go offline. We list every failure mode before building and design what happens when each one occurs. Your agent fails gracefully — never silently or catastrophically.",
    result: "Outcome: Predictable behavior under pressure."
  },
  {
    number: "03",
    title: "Human-in-the-Loop",
    body: "LLMs perform at 99% in normal conditions. It's the 1% edge cases that destroy trust. We design approval checkpoints where human judgment is required — keeping your team in control of high-stakes decisions.",
    result: "Outcome: Trust at scale."
  },
  {
    number: "04",
    title: "Memory & Feedback Loops",
    body: "Every interaction teaches the next one. We build feedback collection and reinforcement patterns into every agent — so the system improves from live usage without retraining from scratch.",
    result: "Outcome: An agent that gets better over time."
  },
  {
    number: "05",
    title: "Monitoring After Deployment",
    body: "We instrument every agent with latency tracking, output quality scoring, and drift detection. You know exactly how your agent is performing — in real time, at all times.",
    result: "Outcome: No silent degradation in production."
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

export default function FiveDisciplines() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6 bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">
            Why DataByt Is Different
          </span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-6 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.04em" }}
          >
            Production AI Requires 5 Disciplines. <br className="hidden md:block" />
            <span style={{ color: "#E8321A" }}>Most Agencies Know 2.</span>
          </h2>
          <p className="text-base text-gray-500 max-w-3xl mx-auto">
            This is what we design before we write a single line of production code. Most teams discover these requirements 6 weeks after launch — when it&apos;s expensive to fix.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {disciplines.map((d, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#E8321A]/30 transition-all flex flex-col h-full group relative shadow-sm"
            >
              <div className="flex justify-between items-start mb-4 relative z-10 gap-2">
                <h3 className="font-heading font-bold text-[#0A0A0A] text-lg leading-snug" style={{ letterSpacing: "-0.02em" }}>
                  {d.title}
                </h3>
                <div className="font-heading text-4xl font-black text-gray-200 group-hover:text-[#E8321A] transition-colors duration-300 flex-shrink-0">
                  {d.number}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow relative z-10 mb-6">
                {d.body}
              </p>
              <div className="pt-4 border-t border-black/5 relative z-10 mt-auto">
                <span className="text-sm font-semibold" style={{ color: "#E8321A" }}>
                  {d.result}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h3 className="font-heading text-xl md:text-2xl font-bold text-[#0A0A0A]" style={{ letterSpacing: "-0.03em" }}>
            Most agencies deliver on 2 of these. We deliver all 5. <br className="hidden md:block" />
            That is why our agents survive production.
          </h3>
        </motion.div>
      </div>
    </section>
  );
}
