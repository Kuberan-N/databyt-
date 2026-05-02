"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useCurrency } from "./CurrencyContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const platforms = [
  {
    name: "Databricks",
    features: [
      "Native build environment",
      "Unity Catalog governance",
      "Delta Lake invoice storage",
      "Enterprise-grade monitoring",
    ],
    note: "Our most common build environment for clients on the data lakehouse.",
  },
  {
    name: "Snowflake",
    features: [
      "Cortex agents",
      "Iceberg table storage",
      "SQL-native orchestration",
      "Strong compliance posture",
    ],
    note: "Full production capability inside your existing Snowflake account.",
  },
  {
    name: "QuickBooks · SAP · Excel",
    features: [
      "QuickBooks API integration",
      "SAP ERP connector",
      "Excel / CSV ingestion",
      "Upgrade path included",
    ],
    note: "Great starting point. We meet you where your data already lives today.",
  },
];

export default function PlatformSupport() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { fmt } = useCurrency();

  const computeLow = fmt(25000);
  const computeHigh = fmt(50000);

  return (
    <section id="platforms" className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Platforms</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-5 leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Works with <span style={{ color: "#0066FF" }}>your stack</span>
          </h2>
          <p className="text-[16px] text-[#666] max-w-[620px] mx-auto">
            We build inside your existing systems — no new infrastructure required.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {platforms.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              className="ios-card p-7 flex flex-col"
            >
              <h3
                className="font-heading font-bold text-[20px] text-[#0A0A0A] mb-6"
                style={{ letterSpacing: "-0.01em" }}
              >
                {p.name}
              </h3>

              <ul className="space-y-3 flex-1 mb-6">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[14px] text-[#333]"
                  >
                    <span className="font-bold flex-shrink-0 leading-tight" style={{ color: "#0066FF" }}>→</span>
                    {f}
                  </li>
                ))}
              </ul>

              <p className="text-[12px] leading-relaxed border-t pt-4 text-[#666]" style={{ borderColor: "#E8E8E8" }}>
                {p.note}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="rounded-2xl p-7 max-w-[920px] mx-auto"
          style={{ background: "#F9FAFB", border: "1px solid #E8E8E8" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-[14px] text-[#333] leading-relaxed text-center">
            <span className="font-semibold text-[#0A0A0A]">No data warehouse yet?</span> We can provision one for you as part of the project. You own the account. You pay compute directly (typically{" "}
            <span className="font-semibold text-[#0A0A0A]">{computeLow}–{computeHigh}/month</span> for AR workloads).
          </p>
        </motion.div>
      </div>
    </section>
  );
}
