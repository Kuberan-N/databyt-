export default function Footer() {
  const links = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Platforms", href: "#platforms" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Privacy", href: "#" },
    { label: "Contact", href: "mailto:kuberan@databyt.in" },
  ];

  return (
    <footer className="py-12 px-6 md:px-10" style={{ background: "#0A0A0A" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Logo + copyright */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <a href="#" className="flex items-center font-heading font-extrabold text-[22px] leading-none tracking-tight">
              <span className="text-white">Data</span>
              <span style={{ color: "#E8321A" }}>Byt</span>
            </a>
            <p className="text-[12px] text-white/50">© 2026 DataByt</p>
          </div>

          {/* Center links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right - LinkedIn + email */}
          <div className="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/kuberan-n-843013246/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#E8321A] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a
              href="mailto:kuberan@databyt.in"
              className="text-[13px] text-white/60 hover:text-white transition-colors"
            >
              kuberan@databyt.in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
