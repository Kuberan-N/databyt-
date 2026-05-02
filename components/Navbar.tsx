"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
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
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-300 bg-white ${
          scrolled ? "border-b border-[#E8E8E8] shadow-[0_1px_2px_rgba(0,0,0,0.04)]" : "border-b border-[#E8E8E8]/60"
        }`}
        style={{ zIndex: 999 }}
      >
        <div className="flex items-center justify-between h-[60px] px-6 md:px-10 max-w-[1400px] mx-auto">
          {/* Logo - left */}
          <a href="#" className="flex items-center font-heading font-extrabold text-[24px] leading-none tracking-tight">
            <span className="text-black">Data</span>
            <span style={{ color: "#E8321A" }}>Byt</span>
          </a>

          {/* Desktop nav - center */}
          <div className="hidden md:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-black hover:text-[#E8321A] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA - right */}
          <div className="hidden md:flex items-center">
            <button
              onClick={openDemo}
              className="text-white text-[14px] font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(232,50,26,0.25)]"
              style={{ background: "#E8321A" }}
            >
              Book Workshop →
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-black hover:text-[#E8321A] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 998 }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-[#E8E8E8] transform transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 999 }}
      >
        <div className="flex items-center justify-between px-6 h-[60px] border-b border-[#E8E8E8]">
          <span className="flex items-center font-heading font-extrabold text-[22px] leading-none tracking-tight">
            <span className="text-black">Data</span>
            <span style={{ color: "#E8321A" }}>Byt</span>
          </span>
          <button onClick={() => setMobileOpen(false)} className="text-black hover:text-[#E8321A]">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col px-6 pt-8 gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-medium text-black hover:text-[#E8321A] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); openDemo(); }}
            className="text-white text-[14px] font-semibold rounded-lg px-6 py-3 text-center mt-4"
            style={{ background: "#E8321A" }}
          >
            Book Workshop →
          </button>
        </div>
      </div>
    </>
  );
}
