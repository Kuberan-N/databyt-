"use client";

import { motion } from "framer-motion";
import {
  FileUp,
  Brain,
  CheckCircle2,
  RefreshCw,
  Mail,
  BarChart3,
  BellRing,
  DollarSign,
} from "lucide-react";

const apSteps = [
  {
    icon: FileUp,
    title: "Invoice Received",
    desc: "PDF, Excel, email attachment, SFTP — any format your vendors use. Forward or upload.",
    color: "from-primary-400 to-primary-600",
  },
  {
    icon: Brain,
    title: "AI Extracts Data",
    desc: "Azure Document Intelligence reads every field at 95%+ accuracy. Claude AI catches the rest.",
    color: "from-accent-400 to-accent-600",
  },
  {
    icon: CheckCircle2,
    title: "Reviewed & Approved",
    desc: "Clean invoices pass through automatically. Ambiguous ones queue for your team in 30 seconds.",
    color: "from-success-400 to-success-500",
  },
  {
    icon: RefreshCw,
    title: "Synced to QuickBooks",
    desc: "Approved invoices post as Bills in QuickBooks Online or Xero. No copy-paste. Ever.",
    color: "from-warning-400 to-warning-500",
  },
];

const arSteps = [
  {
    icon: BarChart3,
    title: "AR Aging Imported",
    desc: "Your overdue invoices are pulled from QuickBooks/Xero automatically every day.",
    color: "from-primary-400 to-primary-600",
  },
  {
    icon: Brain,
    title: "AI Prioritizes",
    desc: "Smart scoring: who to chase first based on amount, days overdue, and payment history.",
    color: "from-accent-400 to-accent-600",
  },
  {
    icon: Mail,
    title: "AI Sends Reminders",
    desc: "Personalized dunning emails sent at the right time. Professional, persistent, polite.",
    color: "from-success-400 to-success-500",
  },
  {
    icon: DollarSign,
    title: "Cash Collected",
    desc: "Payment links in every email. Real-time dashboard shows recovered cash and DSO improvement.",
    color: "from-warning-400 to-warning-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Two AI agents.{" "}
            <span className="gradient-text">One cash flow command center.</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            Invoice processing handles what comes in. Collections agent chases
            what&apos;s owed. Both run on autopilot.
          </p>
        </motion.div>

        {/* AP Module */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold">
              Module 1
            </div>
            <h3 className="text-2xl font-bold">AI Invoice Processor</h3>
            <span className="text-surface-500 text-sm">(Accounts Payable)</span>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < 3 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%+4px)] w-[calc(100%-40px)] border-t border-dashed border-surface-700 z-0" />
                )}
                <div className="relative glass rounded-2xl p-6 hover:scale-[1.03] transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
                    >
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-surface-500 text-sm font-mono">
                      0{i + 1}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AR Module */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-semibold flex items-center gap-2">
              Module 2 <BellRing className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-2xl font-bold">AI Collections Agent</h3>
            <span className="text-surface-500 text-sm">
              (Accounts Receivable)
            </span>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {arSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < 3 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%+4px)] w-[calc(100%-40px)] border-t border-dashed border-surface-700 z-0" />
                )}
                <div className="relative glass rounded-2xl p-6 hover:scale-[1.03] transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
                    >
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-surface-500 text-sm font-mono">
                      0{i + 1}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
