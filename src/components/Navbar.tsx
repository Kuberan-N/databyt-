"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing",      href: "#pricing" },
  { label: "FAQ",          href: "#faq" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-black tracking-tight select-none ${className}`}>
      <span className="text-[#111111]">Data</span><span className="text-[#E8242A]">Byt</span>
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#111111]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <a href="#" className="flex items-center">
          <Logo className="text-xl" />
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              className="text-[#111111] text-sm font-medium hover:text-[#E8242A] transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="/auth" className="text-sm font-medium text-[#111111] hover:text-[#E8242A] transition-colors">
            Sign in
          </a>
          <a href="#pricing"
            className="px-5 py-2.5 bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors">
            Book a Demo
          </a>
        </div>

        <button
          className="md:hidden text-[#111111] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#111111] bg-white overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map(l => (
                <a key={l.href} href={l.href}
                  className="text-[#111111] text-sm font-medium hover:text-[#E8242A] transition-colors"
                  onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
              <a href="#pricing"
                className="mt-2 px-5 py-3 bg-[#E8242A] text-white text-sm font-bold text-center"
                onClick={() => setOpen(false)}>
                Book a Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
