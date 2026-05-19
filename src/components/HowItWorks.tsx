"use client";

import { motion } from "framer-motion";
import { ArrowRight, Database, Brain, Mail, CreditCard, AlertTriangle, BarChart2 } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    num:   "01",
    icon:  Database,
    title: "Connect your accounting system",
    desc:  "OAuth connection to QuickBooks, Xero, NetSuite, or Sage. Your AR aging data is imported automatically, every day. No CSV exports. No manual uploads.",
    tag:   "5-minute setup",
  },
  {
    num:   "02",
    icon:  Brain,
    title: "AI scores and prioritizes every invoice",
    desc:  "Every overdue invoice is scored by amount, days overdue, customer payment history, and segment. Your team gets a ranked list — highest risk first.",
    tag:   "No manual sorting",
  },
  {
    num:   "03",
    icon:  Mail,
    title: "Personalized dunning emails sent automatically",
    desc:  "One batched email per customer, covering all their overdue invoices. Tone escalates from polite (L1) to firm (L2) to final notice (L3) based on age. Every email includes a direct payment link.",
    tag:   "Daily, fully automated",
  },
  {
    num:   "04",
    icon:  CreditCard,
    title: "Customer pays via hosted portal",
    desc:  "Customer clicks the link → sees their invoice → pays via Dodo Payments checkout in under 60 seconds. No login required. Payment auto-matched to the invoice instantly.",
    tag:   "One-click payment",
  },
  {
    num:   "05",
    icon:  AlertTriangle,
    title: "Disputes handled — not stuck in email",
    desc:  "Customer disputes an invoice → collections pause automatically → your team investigates in the dispute dashboard → resolves → collections resume. Full audit trail.",
    tag:   "Structured workflow",
  },
  {
    num:   "06",
    icon:  BarChart2,
    title: "CFO sees real performance, not guesswork",
    desc:  "CEI (Collections Effectiveness Index) gauge, email open/click rates, payment velocity, 6-month collection trend, and DSO tracking — all from live data. One-click PDF for the board.",
    tag:   "Live analytics",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#FAFAFA] py-28 border-y border-[#EBEBEB]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-16"
        >
          <p className="text-[#E8242A] text-xs font-bold uppercase tracking-widest mb-4">The Product</p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#111111] leading-tight max-w-3xl">
            The complete AR collections loop.<br />
            <span className="text-[#E8242A]">Closed end-to-end.</span>
          </h2>
          <p className="text-[#666666] text-lg mt-4 max-w-2xl">
            Most AR tools stop at "send the email." DataByt closes the full loop:
            import → score → email → pay → match → dispute → analytics.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.07 }}
              className="p-7 rounded-2xl bg-white border border-[#EBEBEB] flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-[#E8242A]" />
                </div>
                <span className="text-[#E8242A] font-black text-sm">{s.num}</span>
              </div>
              <h3 className="text-[#111111] font-bold text-base mb-3 leading-snug">{s.title}</h3>
              <p className="text-[#666666] text-sm leading-relaxed flex-1">{s.desc}</p>
              <div className="mt-5">
                <span className="inline-flex px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-xs font-semibold">
                  {s.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors">
            Book a Demo
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-[#888888] text-sm">No IT team required. Live in 48 hours. Month-to-month.</p>
        </motion.div>

      </div>
    </section>
  );
}
