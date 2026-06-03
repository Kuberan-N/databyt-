"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fmtCurrency, getLocaleConfig } from "@/lib/geo";
import type { Locale, LocaleConfig } from "@/lib/geo";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ROICalculator({ locale = "INTL", cfg }: { locale?: Locale; cfg?: LocaleConfig }) {
  const c = cfg ?? getLocaleConfig(locale === "IN" ? "IN" : "US");
  const fmt = (n: number) => fmtCurrency(n, locale);

  const [revenue, setRevenue] = useState(c.roiRevenueDefault);
  const [dso, setDso] = useState(c.roiDsoDefault);

  const r = useMemo(() => {
    const annualRev   = revenue * c.roiRevenueToBaseUnit;
    const dailyRev    = annualRev / 365;
    const arBalance   = dailyRev * dso;
    const newDso      = Math.round(dso * 0.70);
    const cashFreed   = dailyRev * (dso - newDso);
    const annualGain  = cashFreed * 0.08;          // 8% cost of capital
    const databytCost = c.roiDataBytCostYear;
    const netBenefit  = annualGain - databytCost;
    const roi         = Math.round((annualGain / databytCost) * 100);
    return { arBalance, cashFreed, annualGain, newDso, netBenefit, roi, databytCost };
  }, [revenue, dso, c]);

  const revPrefix = locale === "IN" ? "₹" : "$";
  const revMinLabel = `${revPrefix}${c.roiRevenueMin}${locale === "IN" ? "Cr" : "M"}`;
  const revMaxLabel = `${revPrefix}${c.roiRevenueMax}${locale === "IN" ? "Cr" : "M"}`;
  const costMonthlyLabel = locale === "IN"
    ? `${fmt(c.roiDataBytMonthly)}/month effective`
    : `${fmt(c.roiDataBytMonthly)}/month flat`;

  return (
    <section id="roi" className="bg-[#F8FAFC] py-20 border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-12"
        >
          <h2 className="text-[30px] sm:text-[38px] font-bold text-[#111111] leading-[1.15] tracking-[-0.02em]">
            See exactly what DataByt<br className="hidden sm:block" />{" "}
            <span className="text-[#000000]">saves your business.</span>
          </h2>
          <p className="text-[#475569] text-[15px] mt-3 max-w-md leading-relaxed">
            Move the sliders. The savings update in real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease }}
          className="grid lg:grid-cols-2 gap-5"
        >
          {/* ── Inputs ── */}
          <div className="rounded-xl border border-[#E2E8F0] p-7 bg-white">
            <p className="text-[13px] font-semibold text-[#475569] mb-6">Your Numbers</p>

            <div className="space-y-8">
              {/* Revenue slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[13px] text-[#111111]">Annual Revenue</label>
                  <span className="text-[14px] font-bold text-[#111111]">{revPrefix}{revenue}{locale === "IN" ? "Cr" : "M"}</span>
                </div>
                <input
                  type="range" min={c.roiRevenueMin} max={c.roiRevenueMax} step={c.roiRevenueStep}
                  value={revenue}
                  onChange={e => setRevenue(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "#4F46E5" }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[11px] text-[#475569]">{revMinLabel}</span>
                  <span className="text-[11px] text-[#475569]">{revMaxLabel}</span>
                </div>
              </div>

              {/* DSO slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[13px] text-[#111111]">Current DSO (Days Sales Outstanding)</label>
                  <span className="text-[14px] font-bold text-[#111111]">{dso} days</span>
                </div>
                <input
                  type="range" min={20} max={120} step={1}
                  value={dso}
                  onChange={e => setDso(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "#4F46E5" }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[11px] text-[#475569]">20 days</span>
                  <span className="text-[11px] text-[#475569]">120 days</span>
                </div>
              </div>
            </div>

            {/* Current AR balance */}
            <div className="mt-7 p-4 rounded-lg bg-[#F9F9F9] border border-[#EDEDED]">
              <p className="text-[11px] text-[#475569] font-medium mb-1">Cash currently locked in AR</p>
              <p className="text-[28px] font-bold text-[#111111]">{fmt(r.arBalance)}</p>
              <p className="text-[11px] text-[#475569] mt-1">
                = ({revPrefix}{revenue}{locale === "IN" ? "Cr" : "M"} ÷ 365) × {dso} days
              </p>
            </div>
          </div>

          {/* ── Results ── */}
          <div className="flex flex-col gap-3">

            {/* Dark card — cash freed */}
            <div className="rounded-xl bg-[#070707] p-7 text-white flex-1">
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-4">
                With DataByt (30% DSO reduction)
              </p>

              <div className="flex items-end gap-3 mb-1">
                <span className="text-[13px] text-white/50 mb-1 leading-none">DSO</span>
                <span className="text-[22px] font-bold text-white leading-none line-through decoration-white/30">{dso}d</span>
                <span className="text-[13px] text-white/50 mb-1 leading-none">→</span>
                <span className="text-[22px] font-bold text-[#A5B4FC] leading-none">{r.newDso}d</span>
              </div>

              <p className="text-[36px] font-bold text-white mt-4 leading-none">{fmt(r.cashFreed)}</p>
              <p className="text-white/40 text-[13px] mt-1">cash freed from AR</p>

              <div className="border-t border-white/[0.08] mt-5 pt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/35 text-[11px] mb-1">Annual opportunity gain</p>
                  <p className="text-[20px] font-bold text-white">{fmt(r.annualGain)}</p>
                  <p className="text-white/25 text-[10px] mt-0.5">at 8% cost of capital</p>
                </div>
                <div>
                  <p className="text-white/35 text-[11px] mb-1">DataByt costs</p>
                  <p className="text-[20px] font-bold text-white">{fmt(c.roiDataBytCostYear)}/yr</p>
                  <p className="text-white/25 text-[10px] mt-0.5">{costMonthlyLabel}</p>
                </div>
              </div>
            </div>

            {/* Net benefit card */}
            <div className="rounded-xl bg-[#000000] p-5 text-white flex items-center justify-between">
              <div>
                <p className="text-white/70 text-[11px] font-semibold mb-1">Net annual benefit</p>
                <p className="text-[28px] font-bold leading-none">
                  {r.netBenefit > 0 ? fmt(r.netBenefit) : "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-[11px] font-semibold mb-1">ROI</p>
                <p className="text-[28px] font-bold leading-none">{r.roi}%</p>
              </div>
            </div>

            <p className="text-[11px] text-[#475569] leading-relaxed">
              Based on 30% DSO reduction (DataByt average) and 8% cost of capital.
              Labor savings and bad debt reduction not included — those add further upside.
            </p>

            <a href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#4F46E5] text-white text-[14px] font-semibold hover:bg-[#4338CA] transition-colors">
              Get Started — {fmt(c.foundingMonthly)}/Month
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
