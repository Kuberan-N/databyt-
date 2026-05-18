"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Logo } from "@/components/Navbar";

export default function FinalCTA() {
  return (
    <section className="bg-[#E8242A] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Every week you wait, your invoices age another 7 days.
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl">
            30-minute call. We&apos;ll show you exactly where cash is leaking. No commitment.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#E8242A] text-sm font-black hover:bg-[#F5F5F5] transition-colors"
          >
            Book Free AR Audit
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#111111] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <Logo className="text-xl" />

        <div className="flex items-center gap-8 text-[#555555] text-sm">
          <a href="#how-it-works" className="hover:text-[#E8242A] transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-[#E8242A] transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-[#E8242A] transition-colors">FAQ</a>
        </div>

        <a href="mailto:kuberan@databyt.in"
          className="flex items-center gap-2 text-[#555555] text-sm hover:text-[#E8242A] transition-colors">
          <Mail className="w-4 h-4" />
          kuberan@databyt.in
        </a>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-[#EBEBEB] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#AAAAAA] text-xs">
        <p>© 2026 DataByt.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#111111] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#111111] transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
