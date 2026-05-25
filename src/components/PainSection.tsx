"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, X, Check, ExternalLink } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

function CounterStat({
  stat,
  context,
  problem,
  cost,
  source,
  href,
  i,
}: {
  stat: string;
  context: string;
  problem: string;
  cost: string;
  source: string;
  href: string;
  i: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-40px" });
  const isNumeric = /^\d+%$/.test(stat.trim());
  const numericPart = isNumeric ? parseFloat(stat) : 0;
  const suffix = "%";

  useEffect(() => {
    if (!inView || !isNumeric || !ref.current) return;
    const duration = 1600;
    const startTime = Date.now() + i * 80;
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) ref.current.textContent = Math.round(eased * numericPart) + suffix;
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease, delay: i * 0.07 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group p-5 rounded-xl bg-white border border-[#EBEBEB] hover:border-[#D4D4D4] hover:shadow-[0_10px_32px_-10px_rgba(0,0,0,0.1)] transition-all flex flex-col"
    >
      <div className="mb-4">
        <p
          ref={ref}
          className="text-[36px] font-extrabold text-[#111111] leading-none"
        >
          {stat}
        </p>
        <p className="text-[11px] text-[#777777] mt-1 font-medium">{context}</p>
      </div>
      <p className="text-[13.5px] text-[#333333] font-medium leading-snug mb-2 flex-1">{problem}</p>
      <p className="text-[12px] text-[#111111] font-semibold mb-3">{cost}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[11px] text-[#999999] hover:text-[#555555] transition-colors"
        onClick={e => e.stopPropagation()}
      >
        <ExternalLink className="w-3 h-3" />
        {source}
      </a>
    </motion.div>
  );
}

const pains = [
  {
    stat:    "60–70%",
    context: "of finance staff time",
    problem: "Spent chasing invoices manually — not doing actual finance work.",
    cost:    "~$36,000/year per person in wasted labor",
    source:  "PYMNTS Intelligence, 2025",
    href:    "https://www.pymnts.com/news/b2b-payments/",
  },
  {
    stat:    "42–60",
    context: "days average DSO",
    problem: "At $10M revenue, that's $1.6M you can't access or invest.",
    cost:    "Every extra DSO day costs ~$2,700 in opportunity cost",
    source:  "Atradius Payment Report, 2025",
    href:    "https://atradius.com/reports/",
  },
  {
    stat:    "83%",
    context: "of companies",
    problem: "Haven't automated AR — despite 44% of B2B invoices being paid late.",
    cost:    "Manual work that software handles 24/7 at zero marginal cost",
    source:  "PYMNTS Intelligence, June 2025",
    href:    "https://www.pymnts.com/news/b2b-payments/",
  },
  {
    stat:    "∞",
    context: "days in limbo",
    problem: "Disputed invoices halt all collections, age further, stay stuck in email threads.",
    cost:    "No workflow means no resolution means uncollected cash",
    source:  "IOFM AR Benchmark, 2025",
    href:    "https://www.iofm.com",
  },
];

const beforeAfter = [
  {
    before: "Manually pulling AR aging from QuickBooks every Monday",
    after:  "Auto-synced daily from QuickBooks, Xero, NetSuite, or Sage",
  },
  {
    before: "Writing individual dunning emails per invoice",
    after:  "AI writes one batched email per customer covering all overdue invoices",
  },
  {
    before: "Copying payment details into every email",
    after:  "Dodo Payments link embedded in every email automatically",
  },
  {
    before: "Tracking disputes in a spreadsheet",
    after:  "Dispute portal: file → pause → investigate → resolve → resume",
  },
  {
    before: "Asking 'did they pay?' and updating QuickBooks manually",
    after:  "Payment webhook auto-matches and marks invoice paid in seconds",
  },
  {
    before: "CFO asks for AR report → 2 hours of Excel",
    after:  "Live CEI dashboard + one-click PDF for the board",
  },
];

export default function PainSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-12"
        >
          <p className="text-[#000000] text-[11px] font-semibold uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#111111] leading-[1.15] tracking-[-0.02em] max-w-[560px]">
            Manual AR doesn&apos;t just cost time.<br />
            <span className="text-[#555555]">It costs working capital.</span>
          </h2>
        </motion.div>

        {/* Pain point cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
          {pains.map((p, i) => (
            <CounterStat key={i} {...p} i={i} />
          ))}
        </div>

        {/* Before / After */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
          className="mb-10"
        >
          <h3 className="text-[22px] sm:text-[28px] font-extrabold text-[#111111] tracking-[-0.015em] mb-7">
            Before DataByt vs. After DataByt
          </h3>

          <div className="rounded-xl border border-[#E5E5E5] overflow-hidden shadow-sm">
            <div className="grid grid-cols-2">
              <div className="px-5 py-3 bg-[#F9F9F9] flex items-center gap-1.5">
                <X className="w-3.5 h-3.5 text-[#DC2626]" />
                <span className="text-[11px] font-semibold text-[#DC2626] uppercase tracking-wider">Without DataByt</span>
              </div>
              <div className="px-5 py-3 bg-[#F0FDF4] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="text-[11px] font-semibold text-[#16A34A] uppercase tracking-wider">With DataByt</span>
              </div>
            </div>
            {beforeAfter.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, ease, delay: i * 0.05 }}
                className={`grid grid-cols-2 border-t border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors ${i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}`}
              >
                <div className="px-5 py-4 flex items-start gap-2.5 border-r border-[#EBEBEB]">
                  <X className="w-3 h-3 text-[#DC2626] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-[#555555] leading-snug">{row.before}</p>
                </div>
                <div className="px-5 py-4 flex items-start gap-2.5">
                  <Check className="w-3 h-3 text-[#16A34A] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-[#111111] font-medium leading-snug">{row.after}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cost anchor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease }}
          className="rounded-xl p-8 bg-[#111111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <p className="text-white/40 text-[13px] mb-1">Full AR automation, starting at</p>
            <p className="text-[46px] font-extrabold text-white leading-none">
              $20K<span className="text-[20px] text-white/30 font-medium">/year</span>
            </p>
            <p className="text-white/30 text-[13px] mt-2">
              HighRadius: $100K+/yr &nbsp;·&nbsp; Billtrust: $50K+/yr &nbsp;·&nbsp; DataByt: from $20K/yr
            </p>
          </div>
          <a href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#111111] text-[14px] font-semibold hover:bg-[#F3F3F3] hover:-translate-y-0.5 transition-all shrink-0">
            See Full Pricing
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
