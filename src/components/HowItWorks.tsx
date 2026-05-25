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
          initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-16"
        >
          <p className="text-[#000000] text-[11px] font-semibold uppercase tracking-widest mb-3">The Product</p>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#111111] leading-[1.15] tracking-[-0.02em] max-w-[600px]">
            The complete AR loop.<br />
            <span className="text-[#555555]">Closed end-to-end.</span>
          </h2>
          <p className="text-[#555555] text-[15px] mt-4 max-w-[480px] leading-relaxed">
            Most tools stop at &quot;send the email.&quot; DataByt closes the full loop:
            import → score → email → pay → match → dispute → analytics.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease, delay: i * 0.07 }}
              whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
              className="group p-6 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#C8C8C8] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all flex flex-col cursor-default"
            >
              <div className="flex items-start justify-between mb-6">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-[#F3F3F3] group-hover:bg-[#111111] flex items-center justify-center transition-colors duration-300"
                >
                  <s.icon className="w-[18px] h-[18px] text-[#555555] group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <span className="text-[#CCCCCC] font-bold text-[22px] leading-none tabular-nums">{s.num}</span>
              </div>
              <h3 className="text-[#111111] font-semibold text-[14px] mb-3 leading-snug">{s.title}</h3>
              <p className="text-[#555555] text-[13px] leading-relaxed flex-1">{s.desc}</p>
              <div className="mt-5">
                <span className="inline-flex px-2.5 py-1 rounded-full bg-[#F3F3F3] text-[#333333] text-[11px] font-semibold group-hover:bg-[#111111] group-hover:text-white transition-colors duration-300">
                  {s.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a href="/auth"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#000000] hover:shadow-lg hover:shadow-black/15 hover:-translate-y-0.5 transition-all">
            Start Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <p className="text-[#777777] text-[13px]">30 days free · No credit card · Live in 48 hours</p>
        </motion.div>

      </div>
    </section>
  );
}
