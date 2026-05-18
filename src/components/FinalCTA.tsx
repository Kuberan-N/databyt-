"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Logo } from "@/components/Navbar";

export default function FinalCTA() {
  return (
    <section className="bg-[#1B2B6B] py-24 overflow-hidden relative">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#2d46a8_0%,_transparent_70%)] opacity-40" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6">
            Free AR Audit — No Commitment
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
            Every week you wait, overdue invoices age another 7 days.
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Book a 30-minute call. We&apos;ll show you exactly where money is leaking in your AR process — free, with zero sales pressure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="#pricing"
              id="final-cta-primary"
              className="group flex items-center gap-2 px-9 py-4 rounded-lg bg-[#E8242A] text-white text-base font-bold hover:bg-[#C41E23] transition-colors shadow-lg shadow-[#E8242A]/30"
            >
              Book Free AR Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <p className="text-white/40 text-sm">
            Live in 48 hours. No IT involvement. No credit card required to start.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo className="text-xl" />

          <div className="flex items-center gap-6 text-[#64748B] text-sm">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <a
            href="mailto:kuberan@databyt.in"
            className="flex items-center gap-2 text-[#64748B] text-sm hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
            kuberan@databyt.in
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#475569] text-xs">
          <p>© 2026 DataByt. Made in India.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#64748B] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#64748B] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
