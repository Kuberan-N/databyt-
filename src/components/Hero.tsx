"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Clock, CheckCircle } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "30%",    label: "Average DSO reduction",  icon: TrendingDown },
  { value: "48 hrs", label: "Time to go live",         icon: Clock },
  { value: "95%+",   label: "Email deliverability",    icon: CheckCircle },
];

export default function Hero() {
  return (
    <section className="bg-white pt-32 pb-28">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#111111] leading-[1.0] tracking-tight mb-6">
            Stop chasing<br />
            invoices.<br />
            <span className="text-[#E8242A]">Get paid faster.</span>
          </h1>

          <p className="text-lg text-[#555555] max-w-xl mb-10 leading-relaxed">
            DataByt&apos;s AI sends personalized dunning emails, prioritizes overdue accounts,
            and reduces your DSO — automatically. No IT setup. Live in 48 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors">
              Book Free AR Audit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[#DDDDDD] text-[#333333] text-sm font-bold hover:border-[#111111] hover:text-[#111111] transition-colors">
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mt-16 grid sm:grid-cols-3 gap-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.25 + i * 0.08 }}
              className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-[#EBEBEB] bg-[#FAFAFA]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-[#E8242A]" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#111111] leading-none">{s.value}</p>
                <p className="text-xs text-[#777777] mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
