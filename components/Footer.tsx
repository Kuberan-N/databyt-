export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-8 px-6 bg-[#050A14]">
      <div className="max-w-6xl mx-auto">
        {/* Trust signals row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <span className="text-xs text-slate-600">SOC 2 practices</span>
          <span className="text-xs text-slate-700">·</span>
          <span className="text-xs text-slate-600">GDPR ready</span>
          <span className="text-xs text-slate-700">·</span>
          <span className="text-xs text-slate-600">Scoped API access</span>
          <span className="text-xs text-slate-700">·</span>
          <span className="text-xs text-slate-600">You own all code + models</span>
          <span className="text-xs text-slate-700">·</span>
          <span className="text-xs text-slate-600">10-week delivery guarantee</span>
        </div>

        {/* Main footer row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; 2026 DataByt. Production AI Agent Studio.</p>

          <div className="flex items-center gap-6">
            <a
              href="mailto:kuberan@databyt.in"
              className="hover:text-white transition-colors"
            >
              kuberan@databyt.in
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
