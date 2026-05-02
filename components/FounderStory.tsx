"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
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
          {/* Left - Story */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <span className="section-label mb-5 block">Founder</span>
            <h2 className="font-heading font-extrabold text-black mb-7 leading-[1.06]" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", letterSpacing: "-0.04em" }}>
              Why I started <span style={{ color: "#E8321A" }}>DataByt</span>
            </h2>

            <div className="space-y-5 text-[15px] leading-relaxed text-[#1A1A1A]">
              <p>
                I spent 4 years as a data engineer watching fintech companies bleed money through manual finance processes — while sitting on Databricks and Snowflake infrastructure powerful enough to automate everything.
              </p>
              <p>
                The gap between &quot;we have the data&quot; and &quot;the data works for us&quot; is massive. Most companies know they should automate AR. But they&apos;re stuck choosing between $100K+ enterprise SaaS that locks them in, or hiring specialists who take months to ramp.
              </p>
              <p className="text-black font-medium">
                DataByt closes that gap. We build production AI agents on YOUR infrastructure. Your data never leaves. No subscriptions. You own the code forever.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E8E8E8]">
              <p className="font-heading font-bold text-black text-[17px]" style={{ letterSpacing: "-0.02em" }}>Kuberan</p>
              <p className="text-[13px] text-[#666] mt-1">Founder, DataByt</p>
            </div>
          </motion.div>

          {/* Right - Stats grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]"
                style={{ background: "#F5F5F5", border: "1px solid #E8E8E8" }}
              >
                <p className="font-heading font-extrabold text-[36px] mb-2 leading-none" style={{ color: "#E8321A", letterSpacing: "-0.04em" }}>
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
