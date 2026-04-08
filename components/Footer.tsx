export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <p>&copy; 2026 Databyt. Built for Indian founders.</p>
        <a
          href="mailto:kuberan811@gmail.com"
          className="hover:text-white transition-colors"
        >
          kuberan811@gmail.com
        </a>
      </div>
    </footer>
  );
}
