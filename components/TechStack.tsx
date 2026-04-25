"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const techLogos = [
  { name: "Databricks", color: "#FF3621" },
  { name: "Apache Spark", color: "#E25A1C" },
  { name: "Delta Lake", color: "#00A9E0" },
  { name: "Mosaic AI", color: "#FF6D3B" },
  { name: "MLflow", color: "#0194E2" },
  { name: "LangGraph", color: "#1C3C3C" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SocialProofBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-12 px-6 bg-[#03060C] border-y border-slate-800/50 overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.p
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-8"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Used by engineering teams building production AI on Databricks
        </motion.p>

        <motion.div
          className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-6 md:gap-10 overflow-x-auto pb-4 md:pb-0 scrollbar-hide"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {techLogos.map((tech) => (
            <div
              key={tech.name}
              className="flex-shrink-0 group flex items-center gap-2 px-4 py-2 rounded-lg border border-transparent hover:border-slate-700/50 transition-all cursor-default"
            >
              <div
                className="w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: tech.color }}
              />
              <span className="text-sm font-medium text-slate-500 group-hover:text-slate-300 transition-colors whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-lg md:text-xl font-bold text-slate-300 max-w-2xl mx-auto">
            88% of companies use AI. Only 13% see results. <br className="hidden sm:block" />
            <span className="text-white">We work exclusively with the 13%.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
