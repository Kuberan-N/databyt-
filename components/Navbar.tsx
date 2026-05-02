"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const navLinks = [
  { label: "How We Work", href: "#how-it-works" },
  { label: "Platforms", href: "#platforms" },
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Floating pill badge */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex">
        <span className="flex items-center gap-2 text-[11px] font-semibold text-white bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8321A] animate-pulse" />
          Production AI Engineering on Databricks
        </span>
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-0 font-heading text-xl font-extrabold tracking-tight">
            <span className="text-white">Data</span>
            <span style={{ color: "#E8321A" }}>Byt</span>
            <span className="w-1.5 h-1.5 rounded-full ml-0.5 mb-3 flex-shrink-0" style={{ background: "#E8321A" }} />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={openDemo}
              className="text-white text-sm font-semibold rounded-full px-6 py-2.5 transition-all duration-200 hover:opacity-90 btn-pulse"
              style={{ background: "#E8321A" }}
            >
              Book Free Workshop →
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#0A0A0A] border-l border-white/10 transform transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
          <span className="flex items-center gap-0 font-heading text-lg font-extrabold tracking-tight">
            <span className="text-white">Data</span>
            <span style={{ color: "#E8321A" }}>Byt</span>
            <span className="w-1.5 h-1.5 rounded-full ml-0.5 mb-2 flex-shrink-0" style={{ background: "#E8321A" }} />
          </span>
          <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col px-6 pt-10 gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-white/60 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); openDemo(); }}
            className="text-white text-sm font-semibold rounded-full px-6 py-3 text-center"
            style={{ background: "#E8321A" }}
          >
            Book Free Workshop →
          </button>
        </div>
      </div>
    </>
  );
}
