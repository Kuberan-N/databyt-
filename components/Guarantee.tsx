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
    body: "You own the repo, the infrastructure, the evaluation suite. No hostage fee. You can extend it without us.",
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
            className="font-heading font-extrabold text-[#0A0A0A] mb-4 leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            We take the risk so your team{" "}
            <span style={{ color: "#0066FF" }}>doesn&apos;t have to</span>
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
              className="ios-card p-7 flex flex-col"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(0,102,255,0.08)" }}>
                <g.Icon size={20} style={{ color: "#0066FF" }} />
              </div>
              <h3
                className="font-heading font-bold text-[#0A0A0A] text-[18px] mb-3"
                style={{ letterSpacing: "-0.01em" }}
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
