"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function CostOfInaction() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { open: openDemo } = useDemoForm();

  return (
    <section className="py-24 px-6 bg-[#050A14]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
            What Happens If You Don&apos;t Fix This in the Next 90 Days
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Left Column: Nightmare */}
          <motion.div
            variants={fadeUp}
            className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 transition-all group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-50" />
            
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
              If Nothing Changes
            </h3>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {[
                "Your AI OKR fails publicly this quarter",
                "CFO freezes AI budget citing \"no demonstrated ROI\"",
                "Engineering team loses confidence, best people leave",
                "Competitor ships production AI, earns the customer trust you're still trying to build",
                "You spend another $50K-$100K on a new agency that delivers the same outcome",
                "12 months from now: still no production AI, $200K spent, same demos in the notebook"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">✗</span>
                  <span className="text-sm md:text-base text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column: Dream */}
          <motion.div
            variants={fadeUp}
            className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-8 transition-all group flex flex-col h-full relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.1)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-100" />
            
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
              If We Work Together
            </h3>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {[
                "Production AI agent live in 8-10 weeks",
                "Engineering team owns the system — no dependency on us",
                "Evaluation framework catches problems before users do",
                "CFO sees ROI: hours saved, revenue automated, costs reduced",
                "AI OKR delivered — team builds on a working foundation",
                "12 months from now: multiple agents live, compounding value"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={20} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm md:text-base text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center justify-center gap-4 text-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <button
            onClick={openDemo}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-lg font-semibold rounded-full px-10 py-5 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-2"
          >
            Book Free 90-Min Workshop &rarr;
          </button>
          <p className="text-sm text-slate-500">
            We have 2 founding client spots remaining for May cohort.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
