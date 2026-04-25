"use client";

import React from "react";
import { X, Check } from "lucide-react";

export default function ComparisonTable() {
  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6 tracking-tight">
            Why Not Just Hire?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Every team asks this. The answer is almost always the same.
          </p>
        </div>

        <div className="overflow-x-auto pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[800px] md:min-w-0">
            {/* Column 1 */}
            <div className="bg-[#050A14] p-8 rounded-2xl border border-slate-800 flex flex-col">
              <h3 className="text-2xl font-outfit font-bold mb-8 text-white">Build Internally</h3>
              <ul className="space-y-6 flex-1 text-slate-300">
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Cost</span>
                  <span className="text-lg font-medium">$450,000/year <span className="text-sm font-normal text-slate-500">(senior DE + AI engineer)</span></span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Timeline</span>
                  <span className="text-lg">4-6 months to hire, then 6+ months to ship</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Output</span>
                  <span className="text-lg">Your first production agent (maybe)</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Risk</span>
                  <span className="text-lg text-red-400 flex items-center gap-2"><X className="w-4 h-4" /> Wrong hire, 12-month runway burned</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-800">
                <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold block mb-2">Result</span>
                <span className="text-lg font-medium text-white">Ownership + 18 months + $450K</span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="bg-[#050A14] p-8 rounded-2xl border border-slate-800 flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-outfit font-bold text-white">Big Agency</h3>
                <p className="text-sm text-slate-500 mt-1">(Accenture, Tiger Analytics, Deloitte)</p>
              </div>
              <ul className="space-y-6 flex-1 text-slate-300">
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Cost</span>
                  <span className="text-lg font-medium">$150,000+ minimum</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Timeline</span>
                  <span className="text-lg">6-12 months start to production</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Output</span>
                  <span className="text-lg">Junior consultants, senior account manager</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Risk</span>
                  <span className="text-lg text-red-400 flex items-center gap-2"><X className="w-4 h-4" /> Template solutions, not Databricks-native</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-800">
                <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold block mb-2">Result</span>
                <span className="text-lg font-medium text-white">Generic delivery at enterprise price</span>
              </div>
            </div>

            {/* Column 3 - Highlight */}
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-indigo-500 flex flex-col relative shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  The Wedge
                </span>
              </div>
              <h3 className="text-2xl font-outfit font-bold mb-8 text-white">DataByt</h3>
              <ul className="space-y-6 flex-1 text-slate-200">
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-indigo-300 uppercase tracking-wider font-semibold">Cost</span>
                  <span className="text-lg font-medium text-white">$12,000-$25,000</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-indigo-300 uppercase tracking-wider font-semibold">Timeline</span>
                  <span className="text-lg font-medium">8-10 weeks to production</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-indigo-300 uppercase tracking-wider font-semibold">Output</span>
                  <span className="text-lg font-medium">Senior data engineer on your account</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm text-indigo-300 uppercase tracking-wider font-semibold">Risk</span>
                  <span className="text-lg text-indigo-300 flex items-center gap-2"><Check className="w-4 h-4" /> 30-day post-launch support, no extra cost</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-indigo-500/30">
                <span className="text-sm text-indigo-300 uppercase tracking-wider font-semibold block mb-2">Result</span>
                <span className="text-lg font-bold text-white">Production agent you own, delivered in weeks</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center max-w-3xl mx-auto p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
          <p className="text-lg md:text-xl font-medium text-white">
            <span className="font-bold">Hiring a data engineer + AI engineer costs $37,500 per month.</span><br className="hidden md:block" /> DataByt delivers both for $25,000 total.
          </p>
        </div>
      </div>
    </section>
  );
}
