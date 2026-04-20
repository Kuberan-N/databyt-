"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const techLogos = [
  { name: "Databricks", color: "#FF3621" },
  { name: "dbt", color: "#FF694A" },
  { name: "Snowflake", color: "#29B5E8" },
  { name: "Fivetran", color: "#0073FF" },
  { name: "Airbyte", color: "#615EFF" },
  { name: "Apache Airflow", color: "#017CEE" },
  { name: "Claude AI", color: "#D4A574" },
  { name: "LangChain", color: "#1C3C3C" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TechStack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-12 px-6 border-y border-slate-800/50">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.p
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-8"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Built on the stack you&apos;ll scale into at Series B
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {techLogos.map((tech) => (
            <div
              key={tech.name}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-transparent hover:border-slate-700/50 transition-all cursor-default"
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
      </div>
    </section>
  );
}
