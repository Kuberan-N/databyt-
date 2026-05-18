"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing",      href: "#pricing" },
  { label: "FAQ",          href: "#faq" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-black tracking-tight select-none ${className}`}>
      <span className="text-[#1B2B6B]">Data</span><span className="text-[#E8242A]">Byt</span>
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-10 left-0 right-0 z-40 transition-all duration-200 ${
      scrolled
        ? "bg-white border-b border-[#E2E8F0] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
        : "bg-white/95 border-b border-[#E2E8F0]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center">
          <Logo className="text-xl" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              className="text-[#64748B] hover:text-[#1B2B6B] text-sm font-medium transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/auth"
            className="text-sm font-medium text-[#64748B] hover:text-[#1B2B6B] transition-colors px-4 py-2">
            Sign in
          </a>
          <a href="#pricing"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1B2B6B] text-white text-sm font-semibold hover:bg-[#152356] transition-colors">
            Book a Demo
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#64748B] hover:text-[#1B2B6B] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#E2E8F0] bg-white overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <a key={l.href} href={l.href}
                  className="text-[#64748B] hover:text-[#1B2B6B] py-3 text-sm font-medium border-b border-[#F1F5F9] last:border-0 transition-colors"
                  onClick={() => setMobileOpen(false)}>
                  {l.label}
                </a>
              ))}
              <a href="#pricing"
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#1B2B6B] text-white text-sm font-semibold"
                onClick={() => setMobileOpen(false)}>
                Book a Demo <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
