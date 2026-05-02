"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, Shield, Unlock } from "lucide-react";

const guarantees = [
  {
    Icon: CheckCircle,
    title: "10-Week Production Guarantee",
    body: "We scope timelines aggressively. If your agent isn't live in production by week 10, we work for free until it is.",
  },
  {
    Icon: Shield,
    title: "30-Day Breakage Guarantee",
    body: "If the agent breaks in production within 30 days of launch, we fix it — no support tickets, no hourly billing, free.",
  },
  {
    Icon: Unlock,
    title: "Full Ownership Guarantee",
    body: "You own the GitHub repo, the Databricks infrastructure, the evaluation suite. No hostage fee. You can extend it without us.",
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
    <section className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Guarantees</span>
          <h2
            className="font-heading font-extrabold text-black mb-4 leading-[1.06]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            We take the risk so your engineering team{" "}
            <span style={{ color: "#E8321A" }}>doesn&apos;t have to.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {guarantees.map((g) => (
            <motion.div
              key={g.title}
              variants={fadeUp}
              className="light-card p-8 flex flex-col"
            >
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ background: "rgba(232,50,26,0.08)" }}>
                <g.Icon size={20} style={{ color: "#E8321A" }} />
              </div>
              <h3
                className="font-heading font-bold text-black text-[18px] mb-3"
                style={{ letterSpacing: "-0.02em" }}
              >
                {g.title}
              </h3>
              <p className="text-[14px] text-[#666] leading-relaxed">{g.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
