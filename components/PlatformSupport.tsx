"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const platforms = [
  {
    name: "Databricks",
    badge: "Best Fit",
    badgeStyle: { background: "#E8321A", color: "#fff" },
    featured: true,
    features: [
      "Agent Bricks + MLflow evaluation",
      "Unity Catalog governance",
      "Delta Lake invoice storage",
      "Enterprise-grade monitoring",
    ],
    note: "Our primary build environment. Every agent is Databricks-native by default.",
  },
  {
    name: "Snowflake",
    badge: "Great Fit",
    badgeStyle: { background: "#1A1A1A", color: "#fff" },
    featured: false,
    features: [
      "Snowflake Cortex agents",
      "Iceberg table storage",
      "SQL-native orchestration",
      "Strong FS compliance posture",
    ],
    note: "Full production capability with Cortex and Iceberg.",
  },
  {
    name: "QuickBooks / SAP / Excel",
    badge: "Also Works",
    badgeStyle: { background: "#666", color: "#fff" },
    featured: false,
    features: [
      "QuickBooks API integration",
      "SAP ERP connector",
      "Excel / CSV ingestion",
      "Upgrade path to Databricks included",
    ],
    note: "Great starting point. Most clients upgrade to Databricks after the first build.",
  },
];

export default function PlatformSupport() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

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
            className="font-heading font-extrabold text-black mb-5 leading-[1.06]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            We meet you <span style={{ color: "#E8321A" }}>where your data lives.</span>
          </h2>
          <p className="text-[16px] text-[#666] max-w-[600px] mx-auto">
            No migration required. We connect to your existing stack and build inside your infrastructure.
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
              className="rounded-xl p-7 flex flex-col bg-white transition-all duration-300 hover:scale-[1.02]"
              style={{
                border: p.featured ? "2px solid #E8321A" : "1px solid #E8E8E8",
                boxShadow: p.featured ? "0 4px 24px rgba(232,50,26,0.08)" : "none",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="font-heading font-bold text-[20px] text-black"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {p.name}
                </h3>
                <span
                  className="text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-md"
                  style={p.badgeStyle}
                >
                  {p.badge}
                </span>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[14px] text-[#1A1A1A]"
                  >
                    <span
                      className="font-bold flex-shrink-0 leading-tight"
                      style={{ color: "#E8321A" }}
                    >
                      →
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <p
                className="text-[12px] leading-relaxed border-t pt-4 text-[#666]"
                style={{ borderColor: "#E8E8E8" }}
              >
                {p.note}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Info box */}
        <motion.div
          className="rounded-xl p-7 max-w-[920px] mx-auto"
          style={{ background: "#F5F5F5", border: "1px solid #E8E8E8" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-[14px] text-[#1A1A1A] leading-relaxed text-center">
            <span className="font-semibold text-black">No Databricks yet?</span> We provision and configure a Databricks workspace for you as part of the project. You own the account. You pay compute directly (typically{" "}
            <span className="font-semibold text-black">₹25,000–50,000/month</span> for AR workloads).
          </p>
        </motion.div>
      </div>
    </section>
  );
}
