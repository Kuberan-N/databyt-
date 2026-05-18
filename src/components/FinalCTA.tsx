"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Mail } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-24 bg-surface-900 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 via-transparent to-accent-900/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Every day you wait, you&apos;re paying{" "}
            <span className="text-danger-400">$250+ in hidden costs.</span>
          </h2>
          <p className="text-surface-200 text-lg max-w-2xl mx-auto mb-10">
            Your competitors are already automating. The question isn&apos;t
            whether you should switch — it&apos;s how much you&apos;ll lose
            before you do.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="#pricing"
              id="final-cta-primary"
              className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full text-lg font-bold hover:from-primary-500 hover:to-accent-500 transition-all flex items-center gap-3 pulse-glow"
            >
              Start Free Trial — No Card Required
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <p className="text-surface-500 text-sm">
            15 min setup. Process your first invoice in under 60 seconds.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-surface-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">
              data<span className="text-primary-400">byt</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-surface-400 text-sm">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#calculator" className="hover:text-white transition-colors">
              Calculator
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-4 text-surface-500 text-sm">
            <a
              href="mailto:kuberan@databyt.in"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              kuberan@databyt.in
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-surface-600 text-xs">
          <p>© 2026 DataByt. Made in India 🇮🇳</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-surface-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-surface-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
