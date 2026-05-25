"use client";

import { motion } from "framer-motion";
import { ArrowRight, X, Check } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const pains = [
  {
    stat:    "60–70%",
    context: "of finance staff time",
    problem: "Spent chasing invoices manually — not doing actual finance work.",
    cost:    "~$36,000/year per person in wasted labor",
    source:  "PYMNTS Intelligence, 2025",
  },
  {
    stat:    "42–60",
    context: "days average DSO",
    problem: "At $10M revenue, that's $1.6M you can't access or invest.",
    cost:    "Every extra DSO day costs ~$2,700 in opportunity cost",
    source:  "Atradius Payment Report, 2025",
  },
  {
    stat:    "83%",
    context: "of companies",
    problem: "Haven't automated AR — despite 44% of B2B invoices being paid late.",
    cost:    "Manual work that software handles 24/7 at zero marginal cost",
    source:  "PYMNTS Intelligence, June 2025",
  },
  {
    stat:    "∞",
    context: "days in limbo",
    problem: "Disputed invoices halt all collections, age further, stay stuck in email threads.",
    cost:    "No workflow means no resolution means uncollected cash",
    source:  "Industry observation",
  },
];

const beforeAfter = [
  {
    before: "Manually pulling AR aging from QuickBooks every Monday",
    after:  "Auto-synced daily from QuickBooks, Xero, NetSuite, or Sage",
  },
  {
    before: "Writing individual dunning emails per invoice",
    after:  "AI writes one batched email per customer covering all overdue invoices",
  },
  {
    before: "Copying payment details into every email",
    after:  "Dodo Payments link embedded in every email automatically",
  },
  {
    before: "Tracking disputes in a spreadsheet",
    after:  "Dispute portal: file → pause → investigate → resolve → resume",
  },
  {
    before: "Asking 'did they pay?' and updating QuickBooks manually",
    after:  "Payment webhook auto-matches and marks invoice paid in seconds",
  },
  {
    before: "CFO asks for AR report → 2 hours of Excel",
    after:  "Live CEI dashboard + one-click PDF for the board",
  },
];

export default function PainSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-12"
        >
          <p className="text-[#000000] text-[11px] font-semibold uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#111111] leading-[1.15] tracking-[-0.02em] max-w-[540px]">
            Manual AR doesn&apos;t just cost time.<br />
            <span className="text-[#000000]">It costs working capital.</span>
          </h2>
        </motion.div>

        {/* Pain point cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
          {pains.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
              className="p-5 rounded-xl bg-[#FAFAFA] border border-[#EBEBEB] flex flex-col"
            >
              <div className="mb-4">
                <p className="text-[32px] font-bold text-[#000000] leading-none">{p.stat}</p>
                <p className="text-[11px] text-[#333333] mt-0.5 font-medium">{p.context}</p>
              </div>
              <p className="text-[13.5px] text-[#333333] font-medium leading-snug mb-2 flex-1">{p.problem}</p>
              <p className="text-[12px] text-[#000000] font-semibold mb-3">{p.cost}</p>
              <p className="text-[11px] text-[#555555]">Source: {p.source}</p>
            </motion.div>
          ))}
        </div>

        {/* Before / After */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-10"
        >
          <h3 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-[-0.015em] mb-7">
            Before DataByt vs. After DataByt
          </h3>

          <div className="rounded-xl border border-[#E5E5E5] overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="px-5 py-2.5 bg-[#F3F3F3] flex items-center gap-1.5">
                <X className="w-3.5 h-3.5 text-[#DC2626]" />
                <span className="text-[11px] font-semibold text-[#DC2626] uppercase tracking-wider">Without DataByt</span>
              </div>
              <div className="px-5 py-2.5 bg-[#F0FDF4] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="text-[11px] font-semibold text-[#16A34A] uppercase tracking-wider">With DataByt</span>
              </div>
            </div>
            {beforeAfter.map((row, i) => (
              <div key={i}
                className={`grid grid-cols-2 border-t border-[#F0F0F0] ${i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}`}>
                <div className="px-5 py-4 flex items-start gap-2.5 border-r border-[#EBEBEB]">
                  <X className="w-3 h-3 text-[#DC2626] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-[#111111] leading-snug">{row.before}</p>
                </div>
                <div className="px-5 py-4 flex items-start gap-2.5">
                  <Check className="w-3 h-3 text-[#16A34A] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-[#111111] font-medium leading-snug">{row.after}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cost anchor */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease }}
          className="rounded-xl p-7 bg-[#111111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div>
            <p className="text-white/40 text-[13px] mb-1">All of this, for</p>
            <p className="text-[42px] font-bold text-white leading-none">
              $3,000<span className="text-[20px] text-white/35 font-medium">/month</span>
            </p>
            <p className="text-white/35 text-[13px] mt-2">
              HighRadius: $100K+/yr &nbsp;·&nbsp; Billtrust: $50K+/yr &nbsp;·&nbsp; DataByt: $36K/yr
            </p>
          </div>
          <a href="#pricing"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-[#111111] text-[14px] font-semibold hover:bg-[#F3F3F3] transition-colors shrink-0">
            See Full Pricing
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
