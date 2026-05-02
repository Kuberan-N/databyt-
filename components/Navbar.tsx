"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";
import Logo from "./Logo";

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
    const handleScroll = () => setScrolled(window.scrollY > 12);
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
        className="fixed top-0 left-0 right-0 transition-all duration-500 ease-ios"
        style={{
          zIndex: 999,
          background: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${scrolled ? "#E8E8E8" : "rgba(232,232,232,0.5)"}`,
        }}
      >
        <div className="flex items-center justify-between h-[64px] px-6 md:px-10 max-w-[1400px] mx-auto">
          <Logo size={22} />

          <div className="hidden md:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-[#0A0A0A] hover:text-[#0066FF] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <button onClick={openDemo} className="btn-primary" style={{ padding: "10px 22px", fontSize: "14px" }}>
              Book audit →
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#0A0A0A] hover:text-[#0066FF] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 998 }}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-[#E8E8E8] transform transition-transform duration-500 ease-ios md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 999 }}
      >
        <div className="flex items-center justify-between px-6 h-[64px] border-b border-[#E8E8E8]">
          <Logo size={20} />
          <button onClick={() => setMobileOpen(false)} className="text-[#0A0A0A] hover:text-[#0066FF]">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col px-6 pt-8 gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-medium text-[#0A0A0A] hover:text-[#0066FF] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); openDemo(); }}
            className="btn-primary mt-3"
            style={{ width: "100%", justifyContent: "center", padding: "12px 22px", fontSize: "14px" }}
          >
            Book audit →
          </button>
        </div>
      </div>
    </>
  );
}
