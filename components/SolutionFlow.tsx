"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const steps = [
  { num: "01", title: "Detect overdue invoices", body: "The system pulls live data from your existing AR systems and flags every invoice that needs attention." },
  { num: "02", title: "Send smart reminders", body: "Personalised, context-aware emails go out automatically. No copy-paste. No templates that read like spam." },
  { num: "03", title: "Handle responses automatically", body: "Customer replies are categorised, summarised, and routed. Disputes don't go cold. Promises-to-pay don't get lost." },
  { num: "04", title: "Escalate when needed", body: "When a human touch is required, the right person on your team gets a clean, prioritised handoff with full context." },
  { num: "05", title: "Track everything", body: "Every action logged. Every metric live. You see what's working — and what isn't — without asking anyone." },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function SolutionFlow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">How the agent works</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-5 leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Five steps. <span style={{ color: "#0066FF" }}>Fully automated.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {steps.map((step) => (
            <motion.div key={step.num} variants={fadeUp} className="flex flex-col items-start">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-5 font-heading font-bold text-[14px]"
                style={{ background: "#0066FF", color: "#fff", boxShadow: "0 4px 12px rgba(0,102,255,0.25)" }}
              >
                {step.num}
              </div>
              <h3 className="font-heading font-bold text-[#0A0A0A] text-[16px] mb-3 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {step.title}
              </h3>
              <p className="text-[13px] text-[#666] leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
