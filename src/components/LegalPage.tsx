import Link from "next/link";
import { Logo } from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";

export interface LegalSection {
  heading: string;
  body: string[];
}

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      {/* Top bar */}
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link href="/"><Logo className="text-[17px]" /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#475569] hover:text-[#4338CA] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="h-1 w-14 rounded-full mb-6" style={{ background: "linear-gradient(90deg,#4F46E5,#7C3AED)" }} />
        <h1 className="text-[34px] font-extrabold text-[#0F172A] tracking-[-0.02em] mb-2">{title}</h1>
        <p className="text-[#64748B] text-[13px] mb-8">Last updated: {updated}</p>
        <p className="text-[#475569] text-[15px] leading-relaxed mb-10">{intro}</p>

        <div className="space-y-9">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-[18px] font-bold text-[#0F172A] mb-3">
                <span className="text-[#4F46E5]">{String(i + 1).padStart(2, "0")}.</span> {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="text-[#475569] text-[14px] leading-relaxed mb-3">{p}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-[#E2E8F0]">
          <p className="text-[#475569] text-[14px]">
            Questions? Email{" "}
            <a href="mailto:support@databyt.in" className="text-[#4338CA] font-semibold hover:underline">support@databyt.in</a>.
          </p>
        </div>
      </article>
    </main>
  );
}
