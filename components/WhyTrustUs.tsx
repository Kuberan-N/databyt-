"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";

const big4Rows = [
  "$150K+ minimum engagement",
  "6-12 month timelines",
  "Junior consultants doing the work",
  "Generic templates, not Databricks-native",
  "Slow change orders, scope expansion",
];

const freelancerRows = [
  "Cheap ($5K-$15K per agent)",
  "Built on tutorials, no production rigor",
  "Ships demos that fail in production",
  "No Databricks depth",
  "Generic LangChain wrappers",
];

const databytRows = [
  "$749 audits, $12K-$25K agents",
  "7 days to 10 weeks (transparent timelines)",
  "Senior data engineer does everything",
  "Databricks-native (Mosaic AI, Unity Catalog, MLflow)",
  "5 disciplines applied to every build (Code ownership: 100% yours)",
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function WhyTrustUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6 bg-[#0A1628]/30">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            What Makes{" "}
            <span className="text-gradient-blue">Databyt Different</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            The space between expensive theory and cheap prototypes.
          </p>
        </motion.div>

        {/* Comparison table (3 columns) */}
        <motion.div
          className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-3 border-b border-slate-800">
            <div className="p-5 text-center text-sm font-semibold text-slate-400">
              Big 4 Consulting<br/><span className="text-xs font-normal opacity-70">(Accenture, Deloitte, etc.)</span>
            </div>
            <div className="p-5 text-center text-sm font-semibold text-slate-400 border-l border-slate-800/50">
              Generic AI Freelancer
            </div>
            <div className="p-5 text-center text-sm font-bold text-white bg-blue-500/5 border-l border-blue-500/30">
              <span className="text-gradient-blue">Databyt</span>
            </div>
          </div>

          {/* Desktop Rows */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="hidden md:block"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="grid grid-cols-3 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
              >
                <div className="p-4 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-center">
                    <X size={16} className="text-red-500/70 flex-shrink-0 hidden lg:block" />
                    <span className="text-sm text-slate-400">{big4Rows[i]}</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-center border-l border-slate-800/50">
                  <div className="flex items-center gap-2 text-center">
                    <X size={16} className="text-red-500/70 flex-shrink-0 hidden lg:block" />
                    <span className="text-sm text-slate-400">{freelancerRows[i]}</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-center border-l border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center gap-2 text-center">
                    <Check size={16} className="text-blue-400 flex-shrink-0 hidden lg:block" />
                    <span className="text-sm text-white font-medium">{databytRows[i]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile view (Stacked Cards) */}
          <div className="md:hidden flex flex-col">
            {/* Big 4 */}
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">Big 4 Consulting</h3>
              <ul className="space-y-3">
                {big4Rows.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X size={16} className="text-red-500/70 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Freelancer */}
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">Generic AI Freelancer</h3>
              <ul className="space-y-3">
                {freelancerRows.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X size={16} className="text-red-500/70 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Databyt */}
            <div className="p-6 bg-blue-500/5 border-t border-blue-500/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
                Databyt
              </h3>
              <ul className="space-y-3 relative z-10">
                {databytRows.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
