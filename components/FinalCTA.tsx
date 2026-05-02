"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open } = useDemoForm();

  return (
    <section
      className="relative py-24 md:py-32 px-6 md:px-10 overflow-hidden"
      style={{ background: "#0066FF" }}
    >
      <div className="relative z-10 max-w-[860px] mx-auto text-center" ref={ref}>
        <motion.span
          className="inline-block text-[12px] font-bold uppercase tracking-[0.25em] text-white/80 mb-7 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Free 90-Min AR Workflow Audit
        </motion.span>

        <motion.h2
          className="font-heading font-extrabold text-white mb-7 leading-[1.06]"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)", letterSpacing: "-0.02em" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Stop chasing invoices manually.<br />
          Start collecting automatically.
        </motion.h2>

        <motion.p
          className="text-[17px] text-white/85 mb-10 leading-relaxed max-w-[560px] mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Book your 90-minute free AR workflow audit. See exactly what we&apos;d automate.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <button
            onClick={open}
            className="bg-white font-heading font-semibold rounded-xl px-8 py-4 text-[16px] transition-all duration-500 ease-ios hover:scale-[1.03] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
            style={{ color: "#0066FF" }}
          >
            Book your audit →
          </button>
          <a
            href="mailto:kuberan@databyt.in"
            className="font-heading font-semibold rounded-xl px-8 py-4 text-[16px] transition-all duration-500 ease-ios hover:scale-[1.03] hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.5)", color: "#fff" }}
          >
            Email kuberan@databyt.in
          </a>
        </motion.div>
      </div>
    </section>
  );
}
