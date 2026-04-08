"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function NarrativeExample() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center" ref={ref}>
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-4"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          The Copy-Paste Summary That{" "}
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Impresses Investors
          </span>
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-zinc-400 mb-12 max-w-xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Every report comes with a 3-line narrative you can send as-is.
        </motion.p>

        {/* Quote box */}
        <motion.div
          className="relative bg-zinc-900/50 border border-purple-500/30 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(139,92,246,0.1)] mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <Quote
            size={32}
            className="text-purple-500/30 absolute top-5 left-6"
          />
          <p className="text-base md:text-lg text-zinc-200 leading-relaxed italic relative z-10">
            &ldquo;MRR grew 12% to ₹4.2L, with improved retention bringing
            churn down to 3.1%. Customer acquisition remained efficient at
            ₹1,850 CAC. With 18 months of runway, we&apos;re focused on scaling
            acquisition channels.&rdquo;
          </p>
        </motion.div>

        {/* Below quote */}
        <motion.p
          className="text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Every report includes this. Three lines. Professional. Confident.
          Written so you can copy-paste it straight into an investor email. Your
          investors will think you have a full-time data team. You don&apos;t.
          You have{" "}
          <span className="text-purple-400 font-semibold">Databyt</span>.
        </motion.p>
      </div>
    </section>
  );
}
