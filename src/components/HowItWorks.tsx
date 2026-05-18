"use client";

import { motion } from "framer-motion";
import { BarChart3, Brain, Mail, DollarSign } from "lucide-react";

const steps = [
  {
    icon: BarChart3,
    num: "01",
    title: "AR Aging Imported",
    desc: "Your overdue invoices are pulled from QuickBooks or Xero automatically — every day, no manual export needed.",
    accent: "#1B2B6B",
  },
  {
    icon: Brain,
    num: "02",
    title: "AI Prioritizes",
    desc: "Smart scoring determines who to chase first: amount, days overdue, payment history, and customer segment — all weighed instantly.",
    accent: "#E8242A",
  },
  {
    icon: Mail,
    num: "03",
    title: "Personalized Emails Sent",
    desc: "AI drafts and sends dunning emails calibrated to each customer's history and invoice age. Professional, persistent — never generic.",
    accent: "#1B2B6B",
  },
  {
    icon: DollarSign,
    num: "04",
    title: "Cash Collected",
    desc: "Payment links in every email. Real-time dashboard shows DSO improvement and recovered cash as it comes in.",
    accent: "#16A34A",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#E8242A] mb-4">How It Works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] leading-tight max-w-3xl mx-auto">
            From overdue invoice to collected cash — in 4 steps
          </h2>
          <p className="mt-4 text-[#64748B] text-lg max-w-xl mx-auto">
            No IT setup. No workflow mapping. Live in 48 hours.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-[#E2E8F0] z-0" />

          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: s.accent + "15" }}
              >
                <s.icon className="w-6 h-6" style={{ color: s.accent }} />
              </div>
              <p className="text-xs font-mono text-[#94A3B8] mb-2">{s.num}</p>
              <h3 className="text-[#0F172A] font-bold text-base mb-2 leading-snug">{s.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#pricing"
            className="px-7 py-3 rounded-lg bg-[#1B2B6B] text-white text-sm font-bold hover:bg-[#152356] transition-colors">
            Book a Demo
          </a>
          <p className="text-[#94A3B8] text-sm">No IT involvement. Live in 48 hours.</p>
        </motion.div>
      </div>
    </section>
  );
}
