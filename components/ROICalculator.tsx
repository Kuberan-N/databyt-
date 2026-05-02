"use client";

import { useState, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useCurrency } from "./CurrencyContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function formatINR(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

function formatUSD(amount: number) {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount}`;
}

const USD_RATE = 83;

export default function ROICalculator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { currency } = useCurrency();
  const isINR = currency === "INR";

  const [invoices, setInvoices] = useState(500);
  const [minutesPerInvoice, setMinutesPerInvoice] = useState(12);
  const [hourlyRate, setHourlyRate] = useState(600);

  const monthlyManual = Math.round((invoices * minutesPerInvoice / 60) * hourlyRate);
  const agentCost = 95000;
  const monthlySaving = Math.max(0, monthlyManual - agentCost);

  const fmt = (n: number) => isINR ? formatINR(n) : formatUSD(Math.round(n / USD_RATE));
  const rateLabel = isINR ? "₹/hour" : "$/hour";
  const rateDisplay = isINR
    ? `₹${hourlyRate.toLocaleString("en-IN")}/hr`
    : `$${Math.round(hourlyRate / USD_RATE)}/hr`;

  return (
    <section className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">ROI Calculator</span>
          <h2
            className="font-heading font-extrabold text-black mb-4 leading-[1.06]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            Calculate what manual AR is <span style={{ color: "#E8321A" }}>costing you.</span>
          </h2>
          <p className="text-[#666] text-[16px] max-w-[600px] mx-auto">
            Move the sliders. See the real cost of doing nothing.
          </p>
        </motion.div>

        <motion.div
          className="rounded-xl p-8 md:p-10"
          style={{ background: "#F8F8F8", border: "1px solid #E8E8E8" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="grid md:grid-cols-2 gap-10">
            {/* Sliders */}
            <div className="space-y-9">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[14px] font-medium text-[#1A1A1A]">Invoices per month</label>
                  <span className="font-heading font-bold text-[16px]" style={{ color: "#E8321A" }}>
                    {invoices.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range" min={50} max={2000} step={50}
                  value={invoices}
                  onChange={(e) => setInvoices(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E8321A 0%, #E8321A ${((invoices-50)/1950)*100}%, #E0E0E0 ${((invoices-50)/1950)*100}%, #E0E0E0 100%)` }}
                />
                <div className="flex justify-between mt-2 text-[11px] text-[#999]">
                  <span>50</span><span>2,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[14px] font-medium text-[#1A1A1A]">Minutes per invoice</label>
                  <span className="font-heading font-bold text-[16px]" style={{ color: "#E8321A" }}>
                    {minutesPerInvoice} min
                  </span>
                </div>
                <input
                  type="range" min={5} max={30} step={1}
                  value={minutesPerInvoice}
                  onChange={(e) => setMinutesPerInvoice(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E8321A 0%, #E8321A ${((minutesPerInvoice-5)/25)*100}%, #E0E0E0 ${((minutesPerInvoice-5)/25)*100}%, #E0E0E0 100%)` }}
                />
                <div className="flex justify-between mt-2 text-[11px] text-[#999]">
                  <span>5 min</span><span>30 min</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[14px] font-medium text-[#1A1A1A]">Finance staff cost ({rateLabel})</label>
                  <span className="font-heading font-bold text-[16px]" style={{ color: "#E8321A" }}>
                    {rateDisplay}
                  </span>
                </div>
                <input
                  type="range" min={200} max={2000} step={50}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E8321A 0%, #E8321A ${((hourlyRate-200)/1800)*100}%, #E0E0E0 ${((hourlyRate-200)/1800)*100}%, #E0E0E0 100%)` }}
                />
                <div className="flex justify-between mt-2 text-[11px] text-[#999]">
                  <span>{isINR ? "₹200" : "$2"}</span><span>{isINR ? "₹2,000" : "$24"}</span>
                </div>
              </div>
            </div>

            {/* Results - red panel */}
            <div className="rounded-xl p-7 flex flex-col justify-between" style={{ background: "#E8321A" }}>
              <div className="mb-6">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-white/80 mb-2">Your monthly manual cost</p>
                <p className="font-heading font-extrabold text-white" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {fmt(monthlyManual)}
                </p>
              </div>
              <div className="border-t border-white/25 pt-5 mb-5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-white/80 mb-1">DataByt retainer</p>
                <p className="font-heading font-bold text-white text-[22px]" style={{ letterSpacing: "-0.02em" }}>
                  {fmt(agentCost)}<span className="text-[14px] text-white/70 font-medium">/month</span>
                </p>
              </div>
              <div className="border-t border-white/25 pt-5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-white/80 mb-1">You save</p>
                <p className="font-heading font-extrabold text-white" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {monthlySaving > 0 ? fmt(monthlySaving) : (isINR ? "₹0" : "$0")}
                  <span className="text-[14px] text-white/70 font-medium ml-2">/month</span>
                </p>
                {monthlySaving <= 0 && (
                  <p className="text-[11px] text-white/70 mt-2">Increase invoices or rate to see savings</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
