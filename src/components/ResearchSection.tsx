"use client";

import { motion } from "framer-motion";
import { ExternalLink, TrendingDown, Clock, Users, AlertCircle } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const findings = [
  {
    stat:    "60–70%",
    finding: "of finance staff time is consumed by manual AR tasks — not strategic finance work.",
    source:  "PYMNTS Intelligence",
    year:    "2025",
    href:    "https://www.pymnts.com/news/b2b-payments/",
    icon:    Users,
  },
  {
    stat:    "44%",
    finding: "of B2B invoices are paid late globally, directly impacting cash flow and working capital.",
    source:  "Atradius Payment Practices Barometer",
    year:    "2025",
    href:    "https://atradius.com/reports/",
    icon:    AlertCircle,
  },
  {
    stat:    "42–60",
    finding: "days is the average DSO for mid-market B2B companies. Every extra day costs ~$2,700 at $10M revenue.",
    source:  "Atradius Payment Report",
    year:    "2025",
    href:    "https://atradius.com/reports/",
    icon:    Clock,
  },
  {
    stat:    "83%",
    finding: "of companies have not yet automated AR collections — a significant competitive gap.",
    source:  "PYMNTS Intelligence",
    year:    "June 2025",
    href:    "https://www.pymnts.com/news/b2b-payments/",
    icon:    TrendingDown,
  },
];

const sources = [
  {
    name:  "PYMNTS Intelligence",
    desc:  "Global leader in B2B payments research",
    href:  "https://www.pymnts.com",
    badge: "Research partner",
  },
  {
    name:  "Atradius",
    desc:  "Annual Payment Practices Barometer, 100+ countries",
    href:  "https://atradius.com",
    badge: "Annual report",
  },
  {
    name:  "IOFM",
    desc:  "Institute of Finance & Management — AR benchmarks",
    href:  "https://www.iofm.com",
    badge: "Industry benchmarks",
  },
  {
    name:  "CFO Dive",
    desc:  "Finance leadership coverage on AR automation trends",
    href:  "https://www.cfodive.com",
    badge: "Trade press",
  },
];

export default function ResearchSection() {
  return (
    <section className="bg-white py-20 border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
          className="mb-12"
        >
          <p className="text-[#000000] text-[11px] font-semibold uppercase tracking-widest mb-3">Research & Data</p>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#111111] leading-[1.15] tracking-[-0.02em] max-w-[560px]">
            The AR crisis is documented.
            <br />
            <span className="text-[#555555]">The solution is DataByt.</span>
          </h2>
          <p className="mt-3 text-[#555555] text-[15px] max-w-[480px] leading-relaxed">
            Every claim we make is backed by independent research from the institutions that track B2B payments.
          </p>
        </motion.div>

        {/* Stat findings */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {findings.map((f, i) => (
            <motion.a
              key={i}
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.07 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group p-6 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA] hover:border-[#D4D4D4] hover:bg-white transition-all cursor-pointer block"
            >
              <div className="flex items-start justify-between mb-4 gap-3">
                <p className="text-[40px] font-extrabold text-[#111111] leading-none">{f.stat}</p>
                <div className="w-9 h-9 rounded-lg bg-[#F3F3F3] flex items-center justify-center shrink-0 group-hover:bg-[#111111] transition-colors">
                  <f.icon className="w-4 h-4 text-[#555555] group-hover:text-white transition-colors" />
                </div>
              </div>
              <p className="text-[14px] text-[#333333] leading-snug mb-4">{f.finding}</p>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3 h-3 text-[#999999] group-hover:text-[#111111] transition-colors" />
                <span className="text-[12px] text-[#777777] group-hover:text-[#111111] transition-colors">
                  {f.source} · {f.year}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Sources row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="text-[11px] text-[#999999] uppercase tracking-widest font-semibold mb-5">Primary sources</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sources.map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease, delay: i * 0.05 }}
                className="group p-4 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA] hover:border-[#D4D4D4] hover:bg-white transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest">{s.badge}</span>
                  <ExternalLink className="w-3 h-3 text-[#CCCCCC] group-hover:text-[#555555] transition-colors" />
                </div>
                <p className="text-[13px] font-semibold text-[#111111] leading-tight group-hover:text-[#000000] transition-colors">
                  {s.name}
                </p>
                <p className="text-[11px] text-[#777777] leading-snug">{s.desc}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
