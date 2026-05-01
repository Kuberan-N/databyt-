"use client";

import React from "react";
import { X, Check } from "lucide-react";

export default function ComparisonTable() {
  return (
    <section className="py-32 bg-[#060D18] border-y border-slate-800/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] text-blue-400 uppercase mb-5">
            Compare Your Options
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight leading-tight">
            Why Not <span className="text-gradient-blue">HighRadius, Billtrust, or a New Hire?</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every CFO asks this. Here&apos;s the honest comparison.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="glass-card p-10 rounded-2xl flex flex-col">
            <div className="mb-10">
              <h3 className="text-xl font-heading font-bold text-white">Enterprise SaaS</h3>
              <p className="text-sm text-slate-500 mt-1.5">(HighRadius, Billtrust, Esker)</p>
            </div>
            <ul className="space-y-7 flex-1 text-slate-300">
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Cost</span>
                <span className="text-base font-medium">$50K – $150K/year</span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Timeline</span>
                <span className="text-base">3-6 months implementation</span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Data</span>
                <span className="text-base text-red-400/70 flex items-center gap-2"><X className="w-4 h-4" /> Their cloud</span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Lock-in</span>
                <span className="text-base text-red-400/70 flex items-center gap-2"><X className="w-4 h-4" /> Annual contract</span>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="glass-card p-10 rounded-2xl flex flex-col">
            <h3 className="text-xl font-heading font-bold mb-10 text-white">Hire AR Specialist</h3>
            <ul className="space-y-7 flex-1 text-slate-300">
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Cost</span>
                <span className="text-base font-medium">$55K – $75K/year</span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Timeline</span>
                <span className="text-base">2-4 months to hire + ramp</span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Capacity</span>
                <span className="text-base text-red-400/70 flex items-center gap-2"><X className="w-4 h-4" /> 50-80 invoices/day</span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Availability</span>
                <span className="text-base text-red-400/70 flex items-center gap-2"><X className="w-4 h-4" /> 8 hrs/day, turnover risk</span>
              </li>
            </ul>
          </div>

          {/* Column 3 — DataByt */}
          <div className="rounded-2xl p-10 flex flex-col relative bg-[#0A1628]/80 border border-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.06)]">
            <div className="absolute -top-3 right-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Best Value
              </span>
            </div>
            <h3 className="text-xl font-heading font-bold mb-10 text-white">DataByt</h3>
            <ul className="space-y-7 flex-1 text-slate-200">
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Cost</span>
                <span className="text-base font-semibold text-white">$4,900 – $14,900 <span className="text-sm font-normal text-slate-400">(one-time)</span></span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Timeline</span>
                <span className="text-base font-medium">3-6 weeks</span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Data</span>
                <span className="text-base text-emerald-400 flex items-center gap-2"><Check className="w-4 h-4" /> YOUR cloud. Always.</span>
              </li>
              <li className="flex flex-col gap-1.5">
                <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Lock-in</span>
                <span className="text-base text-emerald-400 flex items-center gap-2"><Check className="w-4 h-4" /> Zero. You own the code.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
