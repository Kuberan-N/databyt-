"use client";

import { useState, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function formatINR(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export default function ROICalculator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [invoices, setInvoices] = useState(500);
  const [minutesPerInvoice, setMinutesPerInvoice] = useState(12);
  const [hourlyRate, setHourlyRate] = useState(600);

  const monthlyManual = Math.round((invoices * minutesPerInvoice / 60) * hourlyRate);
  const agentCost = 95000;
  const monthlySaving = Math.max(0, monthlyManual - agentCost);
  const annualSaving = monthlySaving * 12;

  return (
    <section className="py-32 md:py-40 px-6 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block" style={{ color: "#E8321A" }}>ROI Calculator</span>
          <h2
            className="font-heading font-extrabold text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            Calculate what manual AR is costing you.
          </h2>
          <p className="text-white/40 text-base max-w-xl mx-auto">
            Move the sliders. See the real cost of doing nothing. Most finance teams are shocked.
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl p-8 md:p-12"
          style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Sliders */}
            <div className="space-y-10">
              {/* Invoices */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-white/70">Invoices per month</label>
                  <span className="font-heading font-bold text-white" style={{ color: "#E8321A" }}>{invoices.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range" min={50} max={2000} step={50}
                  value={invoices}
                  onChange={(e) => setInvoices(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E8321A ${((invoices-50)/1950)*100}%, rgba(255,255,255,0.1) 0%)` }}
                />
                <div className="flex justify-between mt-1.5 text-[10px] text-white/25">
                  <span>50</span><span>2,000</span>
                </div>
              </div>

              {/* Minutes per invoice */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-white/70">Minutes per invoice (manual work)</label>
                  <span className="font-heading font-bold" style={{ color: "#E8321A" }}>{minutesPerInvoice} min</span>
                </div>
                <input
                  type="range" min={5} max={30} step={1}
                  value={minutesPerInvoice}
                  onChange={(e) => setMinutesPerInvoice(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E8321A ${((minutesPerInvoice-5)/25)*100}%, rgba(255,255,255,0.1) 0%)` }}
                />
                <div className="flex justify-between mt-1.5 text-[10px] text-white/25">
                  <span>5 min</span><span>30 min</span>
                </div>
              </div>

              {/* Hourly rate */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-white/70">Finance staff cost (₹/hour)</label>
                  <span className="font-heading font-bold" style={{ color: "#E8321A" }}>₹{hourlyRate.toLocaleString("en-IN")}/hr</span>
                </div>
                <input
                  type="range" min={200} max={2000} step={50}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E8321A ${((hourlyRate-200)/1800)*100}%, rgba(255,255,255,0.1) 0%)` }}
                />
                <div className="flex justify-between mt-1.5 text-[10px] text-white/25">
                  <span>₹200</span><span>₹2,000</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl p-6" style={{ background: "#E8321A" }}>
                <p className="text-sm font-medium text-white/70 mb-2">Monthly cost doing it manually</p>
                <p className="font-heading font-extrabold text-4xl text-white" style={{ letterSpacing: "-0.04em" }}>
                  {formatINR(monthlyManual)}
                </p>
              </div>
              <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
                <p className="text-sm font-medium text-white/50 mb-2">DataByt agent cost</p>
                <p className="font-heading font-extrabold text-3xl text-white" style={{ letterSpacing: "-0.04em" }}>
                  ₹95,000<span className="text-lg text-white/40">/month</span>
                </p>
                <p className="text-xs text-white/30 mt-1">Includes monitoring, tuning, incident response</p>
              </div>
              <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
                <p className="text-sm font-medium text-white/50 mb-2">Your annual saving</p>
                <p className="font-heading font-extrabold text-4xl text-white" style={{ letterSpacing: "-0.04em", color: annualSaving > 0 ? "#4ade80" : "white" }}>
                  {annualSaving > 0 ? formatINR(annualSaving) : "₹0"}
                </p>
                {annualSaving <= 0 && (
                  <p className="text-xs text-white/30 mt-1">Increase invoices or minutes to see savings</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
