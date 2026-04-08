"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openDemo } = useDemoForm();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-zinc-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-0 text-xl font-extrabold tracking-tight">
            <span className="text-white">data</span>
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">byt</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 ml-0.5 mb-3"></span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={openDemo}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-semibold rounded-full px-6 py-2.5 transition-all hover:scale-[1.02]"
            >
              Request Demo
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#111111] border-l border-zinc-800 transform transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-zinc-800">
          <span className="flex items-center gap-0 text-lg font-extrabold tracking-tight">
            <span className="text-white">data</span>
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">byt</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 ml-0.5 mb-2"></span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col px-6 pt-8 gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); openDemo(); }}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-semibold rounded-full px-6 py-3 text-center transition-all mt-2"
          >
            Request Demo
          </button>
        </div>
      </div>
    </>
  );
}
