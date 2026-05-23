"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Logo } from "@/components/Navbar";

const ease = [0.22, 1, 0.36, 1] as const;

const urgency = [
  { value: "7 days",  label: "Every week you wait, your invoices age this much more" },
  { value: "$2,700",  label: "Opportunity cost of one extra DSO day at $10M revenue" },
  { value: "48 hrs",  label: "From signup to fully automated collections" },
];

export default function FinalCTA() {
  return (
    <section className="bg-[#070707] py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Urgency stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="grid sm:grid-cols-3 gap-3 mb-14"
        >
          {urgency.map((u, i) => (
            <div key={i} className="px-5 py-5 rounded-xl border border-white/[0.07] bg-white/[0.03]">
              <p className="text-[28px] font-bold text-[#2563EB] mb-1.5 leading-none">{u.value}</p>
              <p className="text-white/40 text-[13px] leading-snug">{u.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Headline + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
          className="max-w-2xl"
        >
          <p className="text-[#2563EB] text-[11px] font-semibold uppercase tracking-widest mb-4">
            Free AR Audit — No commitment
          </p>
          <h2 className="text-[32px] sm:text-[42px] font-bold text-white leading-[1.1] tracking-[-0.025em] mb-5">
            Every week you wait,<br />
            your invoices age{" "}
            <span className="text-[#2563EB]">7 more days.</span>
          </h2>
          <p className="text-white/45 text-[15px] mb-7 max-w-lg leading-relaxed">
            30-minute call. We&apos;ll audit your current AR process, calculate your DSO cost,
            and show you exactly where cash is leaking.
            You get the analysis regardless of whether you sign up.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-7">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#2563EB] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] transition-colors"
            >
              Book Free AR Audit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/15 text-white/70 text-[14px] font-medium hover:border-white/30 hover:text-white transition-colors"
            >
              See How It Works
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-white/30 text-[12px]">
            <span>✓ No IT setup required</span>
            <span>✓ Live in 48 hours</span>
            <span>✓ Month-to-month</span>
            <span>✓ CAN-SPAM compliant</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <Logo className="text-[16px]" />

        <div className="flex flex-wrap items-center gap-6 text-[#888888] text-[13px]">
          <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">How It Works</a>
          <a href="#roi"          className="hover:text-[#2563EB] transition-colors">ROI Calculator</a>
          <a href="#pricing"      className="hover:text-[#2563EB] transition-colors">Pricing</a>
          <a href="#faq"          className="hover:text-[#2563EB] transition-colors">FAQ</a>
          <a href="/dashboard"    className="hover:text-[#2563EB] transition-colors">Dashboard</a>
        </div>

        <a href="mailto:kuberan@databyt.in"
          className="flex items-center gap-2 text-[#888888] text-[13px] hover:text-[#2563EB] transition-colors">
          <Mail className="w-3.5 h-3.5" />
          kuberan@databyt.in
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6 pt-5 border-t border-[#F0F0F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#CCCCCC] text-[12px]">
        <p>© 2026 DataByt. AR automation for mid-market B2B.</p>
        <div className="flex gap-5">
          <a href="#" className="hover:text-[#777777] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#777777] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#777777] transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
}
