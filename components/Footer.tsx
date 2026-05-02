export default function Footer() {
  const links = ["How We Work", "Services", "Pricing", "FAQ", "Contact"];

  return (
    <footer className="border-t border-white/5 py-12 px-6" style={{ background: "#0A0A0A" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-0 font-heading font-extrabold text-xl tracking-tight">
            <span className="text-white">Data</span>
            <span style={{ color: "#E8321A" }}>Byt</span>
            <span className="w-1.5 h-1.5 rounded-full ml-0.5 mb-3 flex-shrink-0" style={{ background: "#E8321A" }} />
          </a>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-white/40 hover:text-white transition-colors duration-200"
              >
                {l}
              </a>
            ))}
          </div>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/kuberan-n-843013246/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">© 2026 DataByt · Production AI Agent Studio</p>
          <div className="flex items-center gap-5 text-xs text-white/25">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
            <a href="mailto:kuberan@databyt.in" className="hover:text-white/50 transition-colors">kuberan@databyt.in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
