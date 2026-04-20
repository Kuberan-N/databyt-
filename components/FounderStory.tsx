"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FounderStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 md:p-12 relative overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Subtle gradient accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />

          {/* Initials avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-6">
            <span className="text-lg font-bold text-white">K</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-heading">
            Why I Built Databyt
          </h2>

          <div className="space-y-4 text-slate-400 leading-relaxed text-base">
            <p>
              I&apos;ve been the founder at midnight — exporting CSV files,
              praying the numbers add up before a 10 AM board call. I&apos;ve
              watched the Razorpay dashboard say one number while my
              spreadsheet said another, and I couldn&apos;t explain the gap.
            </p>
            <p>
              I watched my own 11 PM panic twice before I decided nobody
              should have to do this. Not founders. Not CTOs. Not anyone
              who raised money to build a product, not to babysit data.
            </p>
            <p className="text-slate-300 font-medium">
              Databyt exists because the gap between &ldquo;we want clean
              data&rdquo; and &ldquo;we can afford a $150K data engineer&rdquo;
              shouldn&apos;t exist. One senior operator, outcome-counted,
              cancel anytime — that&apos;s the model I wish I had when I
              was scrambling.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-white font-semibold">Kuberan</p>
            <p className="text-sm text-slate-500">Founder, Databyt</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
