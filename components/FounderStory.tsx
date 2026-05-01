"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function FounderStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 md:py-40 px-6">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          className="glass-card rounded-2xl p-10 md:p-14 relative overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/8 via-cyan-500/3 to-transparent rounded-bl-full pointer-events-none" />

          <div className="w-16 h-16 rounded-full overflow-hidden mb-8 border-2 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.12)]">
            <Image src="/founder.jpg" alt="Kuberan" width={64} height={64} className="object-cover w-full h-full" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-heading">
            Why I Built DataByt
          </h2>

          <div className="space-y-5 text-slate-400 leading-relaxed text-[15px]">
            <p>
              I spent 4 years as a data engineer watching fintech companies bleed money through manual finance processes — while sitting on Databricks and Snowflake infrastructure powerful enough to automate everything.
            </p>
            <p>
              The gap between &quot;we have the data&quot; and &quot;the data works for us&quot; is massive. Most companies know they should automate AR. But they&apos;re stuck choosing between $100K+ enterprise SaaS that locks them in, or hiring specialists who take months to ramp.
            </p>
            <p className="text-slate-300 font-medium pt-2">
              DataByt closes that gap. We build production AI agents on YOUR infrastructure. Your data never leaves. No subscriptions. You own the code forever. If that sounds like what you need, let&apos;s talk.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800/40">
            <p className="text-white font-semibold">Kuberan</p>
            <p className="text-sm text-slate-500 mt-1">Founder, DataByt · Databricks & Snowflake</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
