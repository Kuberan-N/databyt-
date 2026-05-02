"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const proofPills = [
  "■ ■ ■ 3 Spots Remaining",
  "10-Week Guarantee",
  "Full Code Ownership",
];

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open } = useDemoForm();

  return (
    <section
      className="relative py-24 md:py-32 px-6 md:px-10 overflow-hidden"
      style={{ background: "#E8321A" }}
    >
      <div className="relative z-10 max-w-[840px] mx-auto text-center" ref={ref}>
        <motion.span
          className="inline-block text-[12px] font-bold uppercase tracking-[0.25em] text-white/85 mb-7 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Free 90-Min Workshop
        </motion.span>

        <motion.h2
          className="font-heading font-extrabold text-white mb-7 leading-[1.04]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "-0.04em" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Stop shipping demos.<br />
          Start shipping systems.
        </motion.h2>

        <motion.p
          className="text-[17px] text-white/85 mb-10 leading-relaxed max-w-[580px] mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Book your free 90-minute workshop. We&apos;ll map out exactly how to build an agent that survives production. No cost. No commitment. 3 founding spots remaining.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <button
            onClick={open}
            className="bg-white font-heading font-semibold rounded-lg px-8 py-4 text-[16px] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            style={{ color: "#E8321A" }}
          >
            Book Free 90-Min Workshop →
          </button>
          <a
            href="mailto:kuberan@databyt.in"
            className="font-semibold rounded-lg px-8 py-4 text-[16px] transition-all duration-300 hover:scale-[1.03] hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.5)", color: "#fff" }}
          >
            Email kuberan@databyt.in
          </a>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {proofPills.map((pill) => (
            <span
              key={pill}
              className="text-[12px] font-medium text-white border border-white/35 rounded-full px-4 py-1.5"
            >
              {pill}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
