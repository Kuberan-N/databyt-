"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "30%",   label: "Average DSO reduction" },
  { value: "48 hrs", label: "Time to go live" },
  { value: "95%+",  label: "Email deliverability" },
];

export default function Hero() {
  return (
    <section className="bg-white pt-32 pb-24 border-b border-[#111111]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#111111] leading-[1.0] tracking-tight mb-6">
            Stop chasing<br />
            invoices.<br />
            <span className="text-[#E8242A]">Get paid faster.</span>
          </h1>

          <p className="text-lg text-[#555555] max-w-xl mb-10 leading-relaxed">
            DataByt&apos;s AI sends personalized dunning emails, prioritizes overdue accounts, and reduces your DSO — automatically. No IT setup. Live in 48 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors">
              Book Free AR Audit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#111111] text-[#111111] text-sm font-bold hover:bg-[#111111] hover:text-white transition-colors">
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-16 flex flex-wrap gap-0 border border-[#111111]"
        >
          {stats.map((s, i) => (
            <div key={i} className={`flex-1 min-w-[160px] px-8 py-6 ${i < stats.length - 1 ? "border-r border-[#111111]" : ""}`}>
              <p className="text-3xl font-black text-[#111111]">{s.value}</p>
              <p className="text-sm text-[#555555] mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
