"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    num: "01",
    title: "AR Aging Imported",
    desc: "Overdue invoices pulled from QuickBooks or Xero automatically every day.",
  },
  {
    num: "02",
    title: "AI Prioritizes",
    desc: "Scores every invoice by amount, days overdue, and payment history.",
  },
  {
    num: "03",
    title: "Emails Sent",
    desc: "Personalized dunning emails drafted and sent — tone matched to invoice age.",
  },
  {
    num: "04",
    title: "Cash Collected",
    desc: "Payment links in every email. Dashboard shows DSO improvement in real time.",
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
          className="mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#111111] leading-tight">
            From overdue to collected<br />in 4 steps
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="p-7 rounded-2xl bg-white border border-[#EBEBEB] flex flex-col"
            >
              <p className="text-[#E8242A] font-black text-sm mb-5">{s.num}</p>
              <h3 className="text-[#111111] font-bold text-lg mb-3">{s.title}</h3>
              <p className="text-[#666666] text-sm leading-relaxed flex-1">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease, delay: 0.35 }}
          className="mt-10 flex items-center gap-6"
        >
          <a href="#pricing"
            className="px-6 py-3 rounded-xl bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors">
            Book a Demo
          </a>
          <p className="text-[#888888] text-sm">No IT involvement. Live in 48 hours.</p>
        </motion.div>

      </div>
    </section>
  );
}
