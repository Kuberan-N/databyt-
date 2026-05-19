"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, TrendingDown } from "lucide-react";
import { Logo } from "@/components/Navbar";

const ease = [0.22, 1, 0.36, 1] as const;

const urgencyStats = [
  { value: "7 days", label: "Your invoices age every week you wait" },
  { value: "$2,700", label: "Average cost of one extra DSO day at $10M revenue" },
  { value: "48 hrs", label: "From signup to fully automated collections" },
];

export default function FinalCTA() {
  return (
    <section className="bg-[#0A0A0A] py-28">
      <div className="max-w-6xl mx-auto px-6">

        {/* Urgency stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="grid sm:grid-cols-3 gap-4 mb-16"
        >
          {urgencyStats.map((s, i) => (
            <div key={i} className="px-6 py-5 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-3xl font-black text-[#E8242A] mb-1">{s.value}</p>
              <p className="text-white/50 text-sm">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="max-w-3xl"
        >
          <p className="text-[#E8242A] text-xs font-bold uppercase tracking-widest mb-5">
            Free AR Audit — No commitment
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Every week you wait,<br />
            your invoices age<br />
            <span className="text-[#E8242A]">7 more days.</span>
          </h2>
          <p className="text-white/50 text-lg mb-6 max-w-xl leading-relaxed">
            30-minute call. We&apos;ll audit your current AR process, calculate your DSO cost,
            and show you exactly where cash is leaking. You get the analysis regardless of whether you sign up.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors"
            >
              Book Free AR Audit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white text-sm font-bold hover:border-white/40 transition-colors"
            >
              <TrendingDown className="w-4 h-4" />
              See What DataByt Does
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-white/30 text-xs">
            <span>✓ No IT setup required</span>
            <span>✓ Live in 48 hours</span>
            <span>✓ Month-to-month, cancel anytime</span>
            <span>✓ CAN-SPAM compliant by default</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#EBEBEB] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <Logo className="text-xl" />

        <div className="flex flex-wrap items-center gap-6 text-[#777777] text-sm">
          <a href="#how-it-works" className="hover:text-[#E8242A] transition-colors">How It Works</a>
          <a href="#pricing"      className="hover:text-[#E8242A] transition-colors">Pricing</a>
          <a href="#faq"          className="hover:text-[#E8242A] transition-colors">FAQ</a>
          <a href="/dashboard"    className="hover:text-[#E8242A] transition-colors">Dashboard</a>
        </div>

        <a href="mailto:kuberan@databyt.in"
          className="flex items-center gap-2 text-[#777777] text-sm hover:text-[#E8242A] transition-colors">
          <Mail className="w-4 h-4" />
          kuberan@databyt.in
        </a>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-[#F0F0F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#BBBBBB] text-xs">
        <p>© 2026 DataByt. AR automation for mid-market B2B.</p>
        <div className="flex gap-5">
          <a href="#" className="hover:text-[#555555] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#555555] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#555555] transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
}
