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
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* SVG logomark: red rounded square with white "D" */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="7" fill="#E8242A" />
        <path
          d="M8 8H14.5C18.6421 8 22 11.134 22 15C22 18.866 18.6421 22 14.5 22H8V8Z"
          fill="white"
        />
        <rect x="8" y="8" width="4" height="14" fill="#E8242A" />
      </svg>
      <span className="font-black tracking-tight leading-none">
        <span className="text-[#111111]">Data</span><span className="text-[#E8242A]">Byt</span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <a href="#" className="flex items-center">
          <Logo className="text-xl" />
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              className="text-[#444444] text-sm font-medium hover:text-[#E8242A] transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="/auth" className="text-sm font-medium text-[#555555] hover:text-[#111111] transition-colors">
            Sign in
          </a>
          <a href="#pricing"
            className="px-5 py-2.5 rounded-lg bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors">
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
            className="md:hidden border-t border-[#EBEBEB] bg-white overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {navLinks.map(l => (
                <a key={l.href} href={l.href}
                  className="text-[#333333] text-sm font-medium hover:text-[#E8242A] transition-colors"
                  onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
              <a href="#pricing"
                className="mt-2 px-5 py-3 rounded-lg bg-[#E8242A] text-white text-sm font-bold text-center hover:bg-[#C41E23] transition-colors"
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
