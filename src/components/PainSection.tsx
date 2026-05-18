"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Clock, DollarSign, FileX, Users } from "lucide-react";

const painStats = [
  {
    icon: Users,
    stat: "73%",
    label: "of AP teams still manually key invoices into their accounting system.",
    source: "PLANERGY AP Automation Report, 2025",
    color: "text-danger-400",
  },
  {
    icon: DollarSign,
    stat: "$15",
    label: "average cost to process a single invoice by hand — labor, errors, rework included.",
    source: "Resolve Pay, March 2026",
    color: "text-warning-400",
  },
  {
    icon: FileX,
    stat: "12.5%",
    label: "of manually processed invoices contain at least one error — wrong amount, duplicate, or bad vendor code.",
    source: "DocuClipper, 2025",
    color: "text-danger-400",
  },
  {
    icon: Clock,
    stat: "10+ hrs",
    label: "every week — 62% of finance teams spend this much on invoice processing alone.",
    source: "IFOL AP Automation Trends, 2025",
    color: "text-accent-400",
  },
  {
    icon: TrendingDown,
    stat: "25 days",
    label: "average invoice processing cycle from receipt to payment approval in a manual workflow.",
    source: "DocuClipper, 2025",
    color: "text-primary-400",
  },
  {
    icon: AlertTriangle,
    stat: "49%",
    label: "of companies still waste time and money on manual AP — despite automation being widely available.",
    source: "HighRadius FINsider, 2025",
    color: "text-warning-400",
  },
];

export default function PainSection() {
  return (
    <section className="relative py-24 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger-500/10 text-danger-400 text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            The cost of doing nothing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Your manual process is{" "}
            <span className="text-danger-400">costing you a fortune.</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            These aren&apos;t estimates. Every stat below is from published
            2025–2026 research.
          </p>
        </motion.div>

        {/* Pain Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {painStats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-surface-800 group-hover:bg-surface-700 transition-colors">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <div className={`text-3xl font-black ${item.color} mb-2`}>
                    {item.stat}
                  </div>
                  <p className="text-surface-200 text-sm leading-relaxed mb-3">
                    {item.label}
                  </p>
                  <p className="text-surface-500 text-xs italic">
                    Source: {item.source}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 text-center glow-blue"
        >
          <p className="text-lg sm:text-xl text-surface-200 mb-2">
            If your team processes{" "}
            <span className="text-white font-bold">2,000 invoices/month</span>{" "}
            manually, you&apos;re paying
          </p>
          <p className="text-4xl sm:text-5xl font-black text-danger-400 mb-2">
            ~$30,000/month
          </p>
          <p className="text-surface-400 mb-6">in hidden labor costs alone.</p>
          <p className="text-lg text-white font-semibold">
            DataByt replaces that with{" "}
            <span className="gradient-text text-2xl font-black">$49–$149/month</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
