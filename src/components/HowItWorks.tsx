"use client";

import { motion } from "framer-motion";
import { ArrowRight, Database, Brain, Mail, CreditCard, AlertTriangle, BarChart2 } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    num:   "01",
    icon:  Database,
    title: "Connect your accounting system",
    desc:  "OAuth connection to QuickBooks, Xero, NetSuite, or Sage. AR aging data imported automatically every day. No CSV exports. No manual uploads.",
    tag:   "5-min setup",
  },
  {
    num:   "02",
    icon:  Brain,
    title: "AI scores every invoice",
    desc:  "Every overdue invoice scored by amount, days overdue, payment history, and customer segment. Your team gets a ranked list — highest risk first.",
    tag:   "Daily priority list",
  },
  {
    num:   "03",
    icon:  Mail,
    title: "Personalized dunning emails, automatically",
    desc:  "One batched email per customer covering all overdue invoices. Tone escalates L1 → L2 → L3 based on age. Every email includes a direct payment link.",
    tag:   "Daily, fully automated",
  },
  {
    num:   "04",
    icon:  CreditCard,
    title: "Customer pays via hosted portal",
    desc:  "Customer clicks link → sees their invoice → pays via Dodo Payments checkout in under 60 seconds. No login required. Payment auto-matched instantly.",
    tag:   "One-click payment",
  },
  {
    num:   "05",
    icon:  AlertTriangle,
    title: "Disputes handled — not stuck in email",
    desc:  "Customer disputes → collections pause → your team investigates in the dispute dashboard → resolves → collections resume. Full audit trail.",
    tag:   "Structured workflow",
  },
  {
    num:   "06",
    icon:  BarChart2,
    title: "CFO sees real performance",
    desc:  "CEI gauge, email open/click rates, payment velocity, 6-month collection trend, and DSO tracking — all live. One-click PDF for the board.",
    tag:   "Live analytics",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 border-y border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-12"
        >
          <p className="text-[#4F46E5] text-[11px] font-semibold uppercase tracking-widest mb-3">The Product</p>
          <h2 className="text-[30px] sm:text-[38px] font-bold text-[#111111] leading-[1.15] tracking-[-0.02em] max-w-[580px]">
            The complete AR loop.<br />
            <span className="text-[#4F46E5]">Closed end-to-end.</span>
          </h2>
          <p className="text-[#111111] text-[15px] mt-3 max-w-[480px] leading-relaxed">
            Most tools stop at "send the email." DataByt closes the full loop:
            import → score → email → pay → match → dispute → analytics.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
              className="p-6 rounded-xl bg-white border border-[#E8E8E8] flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                  <s.icon className="w-[18px] h-[18px] text-[#4F46E5]" />
                </div>
                <span className="text-[#4F46E5] font-bold text-[13px]">{s.num}</span>
              </div>
              <h3 className="text-[#111111] font-semibold text-[14px] mb-2.5 leading-snug">{s.title}</h3>
              <p className="text-[#111111] text-[13px] leading-relaxed flex-1">{s.desc}</p>
              <div className="mt-4">
                <span className="inline-flex px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-[11px] font-semibold">
                  {s.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a href="/auth"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#4F46E5] text-white text-[14px] font-semibold hover:bg-[#4338CA] transition-colors">
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-[#333333] text-[13px]">No IT team. Live in 48 hours. Month-to-month.</p>
        </motion.div>

      </div>
    </section>
  );
}
