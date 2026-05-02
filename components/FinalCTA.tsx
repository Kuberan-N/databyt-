"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const proofPills = [
  "3 Founding Spots Remaining",
  "10-Week Production Guarantee",
  "Full Code Ownership",
];

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open } = useDemoForm();

  return (
    <section
      className="relative py-40 px-6 overflow-hidden min-h-[80vh] flex items-center"
      style={{ background: "#E8321A" }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center w-full" ref={ref}>
        <motion.span
          className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-white/60 mb-8"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Free 90-Min Workshop
        </motion.span>

        <motion.h2
          className="font-heading font-extrabold text-white mb-8 leading-[1.05]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.04em" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Stop Shipping Demos.<br />
          Start Shipping Systems.
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-white/70 mb-14 leading-relaxed max-w-xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Book your free 90-minute workshop. We&apos;ll map out exactly how to build an agent that survives production. No cost. No commitment. 3 founding spots remaining.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <button
            onClick={open}
            className="bg-white font-semibold rounded-full px-10 py-4 transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{ color: "#E8321A" }}
          >
            Book Free 90-Min Workshop →
          </button>
          <a
            href="mailto:kuberan@databyt.in"
            className="border border-white/30 hover:border-white/60 text-white font-semibold rounded-full px-10 py-4 transition-all duration-200"
          >
            Email kuberan@databyt.in
          </a>
        </motion.div>

        {/* Proof pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {proofPills.map((pill) => (
            <span
              key={pill}
              className="text-xs font-medium text-white/70 border border-white/20 rounded-full px-4 py-2"
            >
              {pill}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
