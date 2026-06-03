"use client";

import { motion } from "framer-motion";
import { Lock, Zap, Shield, Sparkles, ArrowRight, Check } from "lucide-react";
import type { Locale } from "@/lib/geo";

const ease = [0.22, 1, 0.36, 1] as const;

const guarantees = [
  {
    icon: Zap,
    title: "Live in 48 hours",
    desc: "We set it up with you. Connect your accounting system and your first AI reminders go out within two days — no IT team required.",
  },
  {
    icon: Shield,
    title: "Your data stays yours",
    desc: "Isolated per organisation, encrypted, never sold. Export everything and delete your account anytime. Zero lock-in.",
  },
  {
    icon: Lock,
    title: "You stay in control",
    desc: "Approve every email before it sends during your trial. Hand the keys to the AI only once you trust it — your call, every step.",
  },
];

const perks = [
  "Founding-customer rate, locked for life",
  "Direct line to the founder — shape the roadmap",
  "Full white-glove onboarding, done with you",
  "Cancel anytime — month-to-month, no contracts",
];

export default function Testimonials({ locale = "INTL" }: { locale?: Locale }) {
  void locale;
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] text-[#4338CA] text-[11px] font-semibold tracking-widest uppercase mb-5">
            <Sparkles className="w-3 h-3" />
            Founding Customer Program
          </span>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#0F172A] leading-[1.15] tracking-[-0.02em]">
            Be one of the first finance teams<br className="hidden sm:block" />
            to stop chasing invoices by hand.
          </h2>
          <p className="text-[#475569] text-[15px] mt-4 leading-relaxed">
            DataByt is onboarding a small group of B2B finance teams onto its founding plan.
            You get the founding rate, white-glove setup, and a direct line to shape what we build next.
          </p>
        </motion.div>

        {/* Guarantee cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-[0_12px_40px_-12px_rgba(79,70,229,0.18)] hover:border-[#C7D2FE] transition-all"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
                <g.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[#0F172A] text-[16px] font-bold mb-2">{g.title}</h3>
              <p className="text-[#475569] text-[13.5px] leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Founding perks band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center gap-8"
          style={{ background: "linear-gradient(135deg,#130E25 0%,#2A1E5C 50%,#4F46E5 100%)" }}
        >
          <div className="flex-1">
            <h3 className="text-white text-[22px] sm:text-[26px] font-extrabold leading-tight mb-4">
              What founding customers get
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {perks.map((p) => (
                <div key={p} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#A5B4FC]" />
                  </span>
                  <span className="text-white/85 text-[13.5px]">{p}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="/auth"
            className="group shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#4338CA] text-[14px] font-bold hover:bg-[#EEF2FF] hover:-translate-y-0.5 transition-all shadow-lg">
            Claim a founding spot
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
