"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const disciplines = [
  {
    number: "01",
    title: "We test your agent on YOUR data before launch",
    body: "We build a test suite of 50–100 real scenarios from your data before deployment. Performance is measured, documented, reported — not assumed.",
    result: "Zero production surprises.",
  },
  {
    number: "02",
    title: "We design for every possible failure",
    body: "APIs time out. Models hallucinate. Databases go offline. We list every failure mode before building and design what happens when each one occurs.",
    result: "Predictable behavior under pressure.",
  },
  {
    number: "03",
    title: "Your team approves every risky action",
    body: "It's the 1% edge cases that destroy trust. We design approval checkpoints where human judgment is required — keeping you in control.",
    result: "Trust at scale.",
  },
  {
    number: "04",
    title: "The system learns from every interaction",
    body: "We build feedback collection and reinforcement patterns into every agent — so the system improves from live usage without retraining from scratch.",
    result: "An agent that gets better over time.",
  },
  {
    number: "05",
    title: "You see live metrics. Always.",
    body: "We instrument every agent with latency tracking, output quality scoring, and drift detection. You know how your agent is performing — in real time.",
    result: "No silent degradation in production.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
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
          <span className="section-label mb-5 block">How we engineer</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-5 leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Five disciplines that keep your agent <span style={{ color: "#0066FF" }}>working in production</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {disciplines.map((d) => (
            <motion.div
              key={d.number}
              variants={fadeUp}
              className="bg-white p-7 flex flex-col transition-all duration-500 ease-ios hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              style={{
                borderRadius: "16px",
                border: "1px solid #E8E8E8",
                borderLeft: "4px solid #0066FF",
              }}
            >
              <div className="flex items-start gap-4 mb-3">
                <span className="font-mono font-medium text-[12px] text-[#666] mt-1">{d.number}</span>
                <h3 className="font-heading font-bold text-[#0A0A0A] text-[18px] leading-snug flex-1" style={{ letterSpacing: "-0.01em" }}>
                  {d.title}
                </h3>
              </div>
              <p className="text-[14px] text-[#666] leading-relaxed mb-4 ml-9">
                {d.body}
              </p>
              <span className="text-[13px] font-semibold ml-9" style={{ color: "#0066FF" }}>
                → {d.result}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
