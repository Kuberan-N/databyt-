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
    badgeColor: "#E8321A",
    featured: true,
    features: [
      "AgentBricks + MLflow evaluation",
      "Unity Catalog governance",
      "Delta Lake invoice storage",
      "Enterprise-grade monitoring",
    ],
    note: "Our primary build environment. Every agent is Databricks-native by default.",
  },
  {
    name: "Snowflake",
    badge: "Great Fit",
    badgeColor: "#0A0A0A",
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
    badgeColor: "#6b7280",
    featured: false,
    features: [
      "QuickBooks API integration",
      "SAP ERP connector",
      "Excel / CSV ingestion",
      "Upgrade path to Databricks included",
    ],
    note: "Great starting point. Most clients upgrade to Databricks after first build.",
  },
];

export default function PlatformSupport() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="platforms" className="py-32 md:py-40 px-6 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Platform Support</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            We meet you where your data lives.
          </h2>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            No migration required. No new tools. We connect to your existing stack and build the agent inside your infrastructure.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {platforms.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              className="rounded-2xl p-8 flex flex-col transition-all duration-200 hover:-translate-y-1"
              style={{
                background: p.featured ? "#0A0A0A" : "#fff",
                border: p.featured ? "1px solid #E8321A" : "0.5px solid rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="font-heading font-bold text-xl"
                  style={{ color: p.featured ? "#fff" : "#0A0A0A", letterSpacing: "-0.03em" }}
                >
                  {p.name}
                </h3>
                <span
                  className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full text-white"
                  style={{ background: p.badgeColor }}
                >
                  {p.badge}
                </span>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: p.featured ? "rgba(255,255,255,0.65)" : "#374151" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: p.featured ? "#E8321A" : "#9ca3af" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <p
                className="text-xs leading-relaxed border-t pt-5"
                style={{
                  color: p.featured ? "rgba(255,255,255,0.35)" : "#9ca3af",
                  borderColor: p.featured ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                }}
              >
                {p.note}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Info box */}
        <motion.div
          className="rounded-2xl p-8 max-w-4xl mx-auto"
          style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-sm text-gray-600 leading-relaxed text-center">
            <span className="font-semibold text-[#0A0A0A]">No Databricks yet?</span> We can provision and configure a Databricks workspace for you as part of the project. You own the account. You pay the compute directly (typically{" "}
            <span className="font-semibold text-[#0A0A0A]">₹25,000–50,000/month</span> for AR workloads). We configure everything. This is the upgrade path most clients take after starting on QuickBooks or SAP.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
