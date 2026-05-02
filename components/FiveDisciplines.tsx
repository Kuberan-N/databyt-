"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const disciplines = [
  {
    number: "01",
    title: "Evaluation",
    body: "We build a test suite of 50–100 real scenarios before deployment. Performance is measured, documented, reported — not assumed.",
    result: "Zero production surprises.",
  },
  {
    number: "02",
    title: "Failure Mode Design",
    body: "APIs time out. LLMs hallucinate. We list every failure mode before building and design what happens when each one occurs.",
    result: "Predictable behavior under pressure.",
  },
  {
    number: "03",
    title: "Human-in-the-Loop",
    body: "It's the 1% edge cases that destroy trust. We design approval checkpoints where human judgment is required.",
    result: "Trust at scale.",
  },
  {
    number: "04",
    title: "Memory & Feedback",
    body: "We build feedback collection and reinforcement patterns into every agent — so the system improves from live usage.",
    result: "An agent that gets better over time.",
  },
  {
    number: "05",
    title: "Monitoring",
    body: "We instrument every agent with latency tracking, output quality scoring, and drift detection in real-time.",
    result: "No silent degradation in production.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function FiveDisciplines() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Why DataByt is different</span>
          <h2
            className="font-heading font-extrabold text-black mb-5 leading-[1.06]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.25rem)", letterSpacing: "-0.04em" }}
          >
            Production AI requires 5 disciplines.<br />
            <span style={{ color: "#E8321A" }}>Most agencies know 2.</span>
          </h2>
          <p className="text-[16px] text-[#666] max-w-[700px] mx-auto">
            This is what we design before we write a single line of production code.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {disciplines.map((d) => (
            <motion.div
              key={d.number}
              variants={fadeUp}
              className="light-card p-6 flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-4 gap-2">
                <h3 className="font-heading font-bold text-black text-[17px] leading-snug" style={{ letterSpacing: "-0.02em" }}>
                  {d.title}
                </h3>
                <div className="font-heading text-[28px] font-black text-[#E8E8E8] group-hover:text-[#E8321A] transition-colors duration-300 flex-shrink-0 leading-none">
                  {d.number}
                </div>
              </div>
              <p className="text-[13px] text-[#666] leading-relaxed flex-grow mb-5">
                {d.body}
              </p>
              <div className="pt-4 border-t border-[#E8E8E8] mt-auto">
                <span className="text-[13px] font-semibold" style={{ color: "#E8321A" }}>
                  {d.result}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-14 text-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h3 className="font-heading text-[18px] md:text-[20px] font-bold text-black" style={{ letterSpacing: "-0.02em" }}>
            Most agencies deliver on 2 of these. We deliver all 5.<br className="hidden md:block" />
            That is why our agents <span style={{ color: "#E8321A" }}>survive production.</span>
          </h3>
        </motion.div>
      </div>
    </section>
  );
}
