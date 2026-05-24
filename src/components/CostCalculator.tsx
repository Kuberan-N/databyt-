"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp } from "lucide-react";

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export default function CostCalculator() {
  const [invoices, setInvoices] = useState(500);
  const [hourlyRate, setHourlyRate] = useState(22);
  const [avgInvoiceValue, setAvgInvoiceValue] = useState(2500);

  const manualCostPerInvoice = 15;
  const manualMinutesPerInvoice = 12;
  const manualMonthlyHours = (invoices * manualMinutesPerInvoice) / 60;
  const manualMonthlyCost = invoices * manualCostPerInvoice;
  const databytMonthlyCost = invoices <= 500 ? 49 : invoices <= 2000 ? 99 : 149;
  const monthlySavings = manualMonthlyCost - databytMonthlyCost;
  const annualSavings = monthlySavings * 12;

  const manualDSO = 45;
  const aiDSO = 22;
  const dailyRevenue = (avgInvoiceValue * invoices) / 30;
  const cashUnlocked = dailyRevenue * (manualDSO - aiDSO);
  const paybackDays = Math.ceil((databytMonthlyCost / monthlySavings) * 30);

  return (
    <section id="calculator" className="relative py-24 bg-surface-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-600/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 text-sm font-medium mb-6">
            <Calculator className="w-4 h-4" />
            Interactive Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Find out what manual invoicing is{" "}
            <span className="gradient-text">actually costing you.</span>
          </h2>
          <p className="text-[#333333] text-lg">
            Adjust the sliders. See real numbers in real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 sm:p-10 glow-purple"
        >
          {/* Sliders */}
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <label className="text-[#111111] text-sm font-medium mb-3 block">
                Invoices per month
              </label>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={invoices}
                onChange={(e) => setInvoices(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-2xl font-bold text-white mt-2">
                {fmt(invoices)}
              </div>
            </div>
            <div>
              <label className="text-[#111111] text-sm font-medium mb-3 block">
                AP clerk hourly rate ($)
              </label>
              <input
                type="range"
                min={15}
                max={45}
                step={1}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-2xl font-bold text-white mt-2">
                ${hourlyRate}/hr{" "}
                <span className="text-[#333333] text-xs font-normal">
                  US avg: $20â€“25 (BLS, 2025)
                </span>
              </div>
            </div>
            <div>
              <label className="text-[#111111] text-sm font-medium mb-3 block">
                Avg invoice value ($)
              </label>
              <input
                type="range"
                min={500}
                max={25000}
                step={500}
                value={avgInvoiceValue}
                onChange={(e) => setAvgInvoiceValue(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-2xl font-bold text-white mt-2">
                ${fmt(avgInvoiceValue)}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-danger-500/10 rounded-2xl p-5 text-center border border-danger-500/20">
              <div className="text-[#333333] text-xs mb-1 uppercase tracking-wider">
                Manual Cost / Month
              </div>
              <div className="text-3xl font-black text-danger-400">
                ${fmt(manualMonthlyCost)}
              </div>
              <div className="text-[#333333] text-xs mt-1">
                {manualMonthlyHours.toFixed(0)} hrs of labor
              </div>
            </div>
            <div className="bg-success-500/10 rounded-2xl p-5 text-center border border-success-500/20">
              <div className="text-[#333333] text-xs mb-1 uppercase tracking-wider">
                DataByt Cost / Month
              </div>
              <div className="text-3xl font-black text-success-400">
                ${databytMonthlyCost}
              </div>
              <div className="text-[#333333] text-xs mt-1">
                {((1 - databytMonthlyCost / manualMonthlyCost) * 100).toFixed(1)}% less
              </div>
            </div>
            <div className="bg-primary-500/10 rounded-2xl p-5 text-center border border-primary-500/20">
              <div className="text-[#333333] text-xs mb-1 uppercase tracking-wider">
                Your Annual Savings
              </div>
              <div className="text-3xl font-black text-primary-400">
                ${fmt(annualSavings)}
              </div>
              <div className="text-[#333333] text-xs mt-1">
                ${fmt(monthlySavings)}/month saved
              </div>
            </div>
            <div className="bg-accent-500/10 rounded-2xl p-5 text-center border border-accent-500/20">
              <div className="text-[#333333] text-xs mb-1 uppercase tracking-wider">
                Cash Unlocked (AR)
              </div>
              <div className="text-3xl font-black text-accent-400">
                ${fmt(cashUnlocked)}
              </div>
              <div className="text-[#333333] text-xs mt-1">
                DSO: {manualDSO} â†’ {aiDSO} days
              </div>
            </div>
          </div>

          {/* Payback */}
          <div className="flex flex-col sm:flex-row items-center justify-between glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <TrendingUp className="w-6 h-6 text-success-400" />
              <span className="text-white font-semibold">
                Payback period:{" "}
                <span className="text-success-400 text-xl font-black">
                  {paybackDays > 0 ? `${paybackDays} days` : "Instant"}
                </span>
              </span>
            </div>
            <a
              href="#pricing"
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-white font-semibold text-sm hover:from-primary-500 hover:to-accent-500 transition-all"
            >
              Start saving today â†’
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
