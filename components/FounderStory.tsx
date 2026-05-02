"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stats = [
  { num: "74%", label: "FS investment growth (2025)" },
  { num: "2%", label: "Companies rating AI highly" },
  { num: "65%", label: "Databricks YoY growth" },
  { num: "$340B", label: "Profits US banks from AI" },
];

export default function FounderStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <span className="section-label mb-5 block">Founder</span>
            <h2 className="font-heading font-extrabold text-[#0A0A0A] mb-7 leading-[1.08]" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", letterSpacing: "-0.02em" }}>
              Why I started <span style={{ color: "#0066FF" }}>databyt</span>
            </h2>

            <div className="space-y-5 text-[15px] leading-relaxed text-[#333]">
              <p>
                I spent 4 years as a data engineer watching fintech companies bleed money through manual finance processes — while sitting on infrastructure powerful enough to automate everything.
              </p>
              <p>
                The gap between &quot;we have the data&quot; and &quot;the data works for us&quot; is massive. Most companies know they should automate AR. But they&apos;re stuck choosing between expensive enterprise SaaS that locks them in, or hiring specialists who take months to ramp.
              </p>
              <p className="text-[#0A0A0A] font-medium">
                databyt closes that gap. We build production AI agents on YOUR infrastructure. Your data never leaves. No subscriptions. You own the code forever.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E8E8E8]">
              <p className="font-heading font-bold text-[#0A0A0A] text-[17px]" style={{ letterSpacing: "-0.01em" }}>Kuberan</p>
              <p className="text-[13px] text-[#666] mt-1">Founder, databyt</p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="p-6 transition-all duration-500 ease-ios hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                style={{ background: "#F9FAFB", border: "1px solid #E8E8E8", borderRadius: "16px" }}
              >
                <p className="font-heading font-extrabold text-[36px] mb-2 leading-none" style={{ color: "#0066FF", letterSpacing: "-0.02em" }}>
                  {s.num}
                </p>
                <p className="text-[12px] text-[#666] leading-snug">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
