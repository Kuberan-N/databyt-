"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "ROI Calculator", href: "#roi" },
  { label: "Pricing",       href: "#pricing" },
  { label: "FAQ",           href: "#faq" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="6" fill="#D97706" />
        {/* Left vertical bar of D */}
        <rect x="7" y="7" width="3.5" height="14" fill="white" />
        {/* D arc — right bowl */}
        <path d="M10.5 7H15C18.866 7 22 10.134 22 14C22 17.866 18.866 21 15 21H10.5V7Z" fill="white" />
        {/* Inner cutout to make D hollow */}
        <path d="M13.5 10.5H15C16.933 10.5 18.5 12.067 18.5 14C18.5 15.933 16.933 17.5 15 17.5H13.5V10.5Z" fill="#D97706" />
      </svg>
      <span className="font-bold tracking-[-0.03em] text-[#111111] leading-none">
        Data<span className="text-[#D97706]">Byt</span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">

        <a href="#" className="flex items-center">
          <Logo className="text-[17px]" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              className="text-[#111111] text-[13.5px] font-medium hover:text-[#111111] transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="/auth"
            className="text-[13.5px] font-medium text-[#111111] hover:text-[#111111] transition-colors px-3 py-2">
            Sign in
          </a>
          <a href="/auth"
            className="px-4 py-2 rounded-lg bg-[#D97706] text-white text-[13.5px] font-semibold hover:bg-[#B45309] transition-colors">
            Start Free Trial
          </a>
        </div>

        <button
          className="md:hidden text-[#111111] p-2 rounded-md hover:bg-[#F5F5F5] transition-colors"
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
            className="md:hidden border-t border-[#F0F0F0] bg-white overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <a key={l.href} href={l.href}
                  className="text-[#444444] text-sm font-medium hover:text-[#D97706] transition-colors py-2.5"
                  onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
              <a href="/auth"
                className="mt-3 px-4 py-3 rounded-lg bg-[#D97706] text-white text-sm font-semibold text-center hover:bg-[#B45309] transition-colors"
                onClick={() => setOpen(false)}>
                Start Free Trial
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
