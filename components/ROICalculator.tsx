"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useCurrency } from "./CurrencyContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const RETAINER_INR = 95000;

export default function ROICalculator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { currency, isLoaded } = useCurrency();
  const isINR = currency === "INR";

  const rateConfig = isINR
    ? { min: 200, max: 2000, step: 50, default: 600, suffix: "₹/hr" }
    : { min: 5, max: 50, step: 1, default: 25, suffix: "$/hr" };

  const [invoices, setInvoices] = useState(500);
  const [minutesPerInvoice, setMinutesPerInvoice] = useState(12);
  const [hourlyRate, setHourlyRate] = useState(rateConfig.default);

  useEffect(() => {
    if (isLoaded) setHourlyRate(rateConfig.default);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, currency]);

  const monthlyManualLocal = (invoices * minutesPerInvoice / 60) * hourlyRate;
  const retainerLocal = isINR ? RETAINER_INR : RETAINER_INR / 83;
  const monthlySaveLocal = Math.max(0, monthlyManualLocal - retainerLocal);

  const fmtLocal = (amount: number): string => {
    if (isINR) {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
      if (amount >= 1000) return `₹${Math.round(amount / 1000)}K`;
      return `₹${Math.round(amount)}`;
    }
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${Math.round(amount)}`;
  };

  const rateLabel = isINR ? `₹${hourlyRate.toLocaleString("en-IN")}/hr` : `$${hourlyRate}/hr`;

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
            className="font-heading font-extrabold text-[#0A0A0A] mb-4 leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Calculate what manual AR is <span style={{ color: "#0066FF" }}>costing you</span>
          </h2>
          <p className="text-[#666] text-[16px] max-w-[600px] mx-auto">
            Move the sliders. See the real cost of doing nothing.
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl p-8 md:p-10"
          style={{ background: "#F9FAFB", border: "1px solid #E8E8E8" }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-9">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[14px] font-medium text-[#0A0A0A]">Invoices per month</label>
                  <span className="font-mono font-semibold text-[15px]" style={{ color: "#0066FF" }}>
                    {invoices.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range" min={50} max={2000} step={50}
                  value={invoices}
                  onChange={(e) => setInvoices(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full cursor-pointer"
                  style={{ background: `linear-gradient(to right, #0066FF 0%, #0066FF ${((invoices-50)/1950)*100}%, #E0E0E0 ${((invoices-50)/1950)*100}%, #E0E0E0 100%)` }}
                />
                <div className="flex justify-between mt-2 text-[11px] text-[#999]">
                  <span>50</span><span>2,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[14px] font-medium text-[#0A0A0A]">Minutes per invoice</label>
                  <span className="font-mono font-semibold text-[15px]" style={{ color: "#0066FF" }}>
                    {minutesPerInvoice} min
                  </span>
                </div>
                <input
                  type="range" min={5} max={30} step={1}
                  value={minutesPerInvoice}
                  onChange={(e) => setMinutesPerInvoice(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full cursor-pointer"
                  style={{ background: `linear-gradient(to right, #0066FF 0%, #0066FF ${((minutesPerInvoice-5)/25)*100}%, #E0E0E0 ${((minutesPerInvoice-5)/25)*100}%, #E0E0E0 100%)` }}
                />
                <div className="flex justify-between mt-2 text-[11px] text-[#999]">
                  <span>5 min</span><span>30 min</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-[14px] font-medium text-[#0A0A0A]">Finance staff cost ({rateConfig.suffix})</label>
                  <span className="font-mono font-semibold text-[15px]" style={{ color: "#0066FF" }}>
                    {rateLabel}
                  </span>
                </div>
                <input
                  type="range"
                  min={rateConfig.min}
                  max={rateConfig.max}
                  step={rateConfig.step}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full cursor-pointer"
                  style={{ background: `linear-gradient(to right, #0066FF 0%, #0066FF ${((hourlyRate-rateConfig.min)/(rateConfig.max-rateConfig.min))*100}%, #E0E0E0 ${((hourlyRate-rateConfig.min)/(rateConfig.max-rateConfig.min))*100}%, #E0E0E0 100%)` }}
                />
                <div className="flex justify-between mt-2 text-[11px] text-[#999]">
                  <span>{isINR ? `₹${rateConfig.min}` : `$${rateConfig.min}`}</span>
                  <span>{isINR ? `₹${rateConfig.max.toLocaleString("en-IN")}` : `$${rateConfig.max}`}</span>
                </div>
              </div>
            </div>

            {/* Result panel */}
            <div className="rounded-2xl p-7 flex flex-col justify-between text-white" style={{ background: "#0066FF", boxShadow: "0 12px 32px rgba(0,102,255,0.2)" }}>
              <div className="mb-6">
                <p className="text-[12px] font-semibold uppercase tracking-wider opacity-80 mb-2">Your monthly manual cost</p>
                <p className="font-heading font-extrabold" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {fmtLocal(monthlyManualLocal)}
                </p>
              </div>
              <div className="border-t border-white/20 pt-5 mb-5">
                <p className="text-[12px] font-semibold uppercase tracking-wider opacity-80 mb-1">databyt retainer</p>
                <p className="font-heading font-bold text-[22px]" style={{ letterSpacing: "-0.01em" }}>
                  {fmtLocal(retainerLocal)}<span className="text-[14px] opacity-75 font-medium">/month</span>
                </p>
              </div>
              <div className="border-t border-white/20 pt-5">
                <p className="text-[12px] font-semibold uppercase tracking-wider opacity-80 mb-1">You save</p>
                <p className="font-heading font-extrabold" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {monthlySaveLocal > 0 ? fmtLocal(monthlySaveLocal) : (isINR ? "₹0" : "$0")}
                  <span className="text-[14px] opacity-75 font-medium ml-2">/month</span>
                </p>
                {monthlySaveLocal <= 0 && (
                  <p className="text-[11px] opacity-75 mt-2">Increase invoices or rate to see savings</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
