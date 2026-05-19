"use client";

import { motion } from "framer-motion";
import { ArrowRight, X, Check } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const pains = [
  {
    problem: "Finance staff spend 60–70% of their time chasing invoices manually",
    cost:    "That's ~$36,000/year per person in wasted labor",
    source:  "PYMNTS Intelligence, 2025",
  },
  {
    problem: "Average DSO is 42–60 days. At $10M revenue, that's $1.6M you can't touch",
    cost:    "Every extra day of DSO costs you ~$2,700 in opportunity cost",
    source:  "Atradius Payment Report, 2025",
  },
  {
    problem: "44% of B2B invoices are paid late. 83% of companies haven't automated AR",
    cost:    "You're manually doing what software can handle 24/7",
    source:  "PYMNTS Intelligence, June 2025",
  },
  {
    problem: "Disputed invoices halt collections, get stuck in email threads, and age further",
    cost:    "No workflow = no resolution = uncollected cash sitting in limbo",
    source:  "Industry observation",
  },
];

const beforeAfter = [
  { before: "Manually pulling AR aging from QuickBooks every Monday", after: "Auto-synced daily from QuickBooks, Xero, NetSuite, or Sage" },
  { before: "Writing individual dunning emails per invoice", after: "AI writes one batched email per customer, per dunning cycle" },
  { before: "Copying payment details into email", after: "Dodo Payments link embedded in every email automatically" },
  { before: "Tracking disputes in a spreadsheet", after: "Dispute portal: file → pause → investigate → resolve → resume" },
  { before: "Asking 'did they pay?' and updating QuickBooks manually", after: "Payment webhook auto-matches and marks invoice paid in seconds" },
  { before: "CFO asks for AR report → 2 hours of Excel", after: "Live CEI dashboard + one-click PDF report" },
];

export default function PainSection() {
  return (
    <section className="bg-white py-28 border-b border-[#EBEBEB]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-16"
        >
          <p className="text-[#E8242A] text-xs font-bold uppercase tracking-widest mb-4">The Problem</p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#111111] leading-tight max-w-3xl">
            Manual AR doesn&apos;t just cost time.<br />
            <span className="text-[#E8242A]">It costs you working capital.</span>
          </h2>
        </motion.div>

        {/* Pain points */}
        <div className="grid md:grid-cols-2 gap-4 mb-20">
          {pains.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.07 }}
              className="p-7 rounded-2xl bg-[#FAFAFA] border border-[#EBEBEB]"
            >
              <p className="text-[#111111] font-semibold text-base mb-3 leading-snug">{p.problem}</p>
              <p className="text-[#E8242A] font-bold text-sm mb-3">{p.cost}</p>
              <p className="text-[#AAAAAA] text-xs">Source: {p.source}</p>
            </motion.div>
          ))}
        </div>

        {/* Before / After */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-10"
        >
          <h3 className="text-3xl sm:text-4xl font-black text-[#111111] mb-10">
            Before DataByt vs. After DataByt
          </h3>

          <div className="rounded-2xl border border-[#EBEBEB] overflow-hidden">
            <div className="grid grid-cols-2 border-b border-[#EBEBEB]">
              <div className="px-6 py-3 bg-[#FEF2F2] flex items-center gap-2">
                <X className="w-4 h-4 text-[#DC2626]" />
                <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">Without DataByt</span>
              </div>
              <div className="px-6 py-3 bg-[#F0FDF4] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#16A34A]" />
                <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">With DataByt</span>
              </div>
            </div>
            {beforeAfter.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 border-b border-[#F5F5F5] last:border-0 ${i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}`}>
                <div className="px-6 py-4 flex items-start gap-3 border-r border-[#EBEBEB]">
                  <X className="w-3.5 h-3.5 text-[#DC2626] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#555555] leading-snug">{row.before}</p>
                </div>
                <div className="px-6 py-4 flex items-start gap-3">
                  <Check className="w-3.5 h-3.5 text-[#16A34A] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#111111] font-medium leading-snug">{row.after}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cost anchor */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease, delay: 0.15 }}
          className="rounded-2xl p-8 bg-[#111111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <p className="text-white/50 text-sm mb-1">All of the above, for</p>
            <p className="text-5xl font-black text-white">$3,000<span className="text-2xl text-white/40">/month</span></p>
            <p className="text-white/40 text-sm mt-2">HighRadius costs $100,000+/year. Billtrust: $50,000+. DataByt: $36,000/year. Same outcome.</p>
          </div>
          <a href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors shrink-0">
            See Pricing
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
