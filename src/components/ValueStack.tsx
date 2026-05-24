"use client";

import { motion } from "framer-motion";
import { Gift, Check } from "lucide-react";

const stackItems = [
  { item: "AI Invoice Processor (unlimited)", value: "$3,000/yr" },
  { item: "AI Collections Agent", value: "$2,400/yr" },
  { item: "Done-for-you deployment", value: "$2,000" },
  { item: "Live invoice testing (10 invoices)", value: "$800" },
  { item: "QuickBooks/Xero integration setup", value: "$500" },
  { item: "30-day priority support", value: "$600" },
  { item: "AR Dashboard & Analytics", value: "$1,200/yr" },
  { item: "Vendor learning tuning (4 weeks)", value: "$1,200" },
];

const totalValue = 11700;

export default function ValueStack() {
  return (
    <section className="relative py-24 bg-surface-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning-500/10 text-warning-400 text-sm font-medium mb-6">
            <Gift className="w-4 h-4" />
            The Grand Slam Offer
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            An offer so good,{" "}
            <span className="gradient-text">saying no feels like a mistake.</span>
          </h2>
          <p className="text-[#333333] text-lg">
            We take on the risk. You keep the upside.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 sm:p-10 glow-blue"
        >
          {/* Stack items */}
          <div className="space-y-4 mb-8">
            {stackItems.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between py-3 border-b border-surface-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success-400 shrink-0" />
                  <span className="text-[#111111]">{s.item}</span>
                </div>
                <span className="text-[#333333] line-through text-sm font-mono">
                  {s.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-surface-800/50 rounded-2xl p-6 text-center">
            <p className="text-[#333333] text-sm mb-1">Total value</p>
            <p className="text-3xl font-black text-[#333333] line-through mb-4">
              ${totalValue.toLocaleString()}+/yr
            </p>
            <p className="text-[#111111] text-lg mb-2">Your investment</p>
            <p className="text-5xl font-black gradient-text">From $49/month</p>
            <p className="text-[#333333] text-sm mt-2">
              That&apos;s $588/yr â€” <span className="text-success-400 font-semibold">95% off</span> the total value
            </p>
          </div>

          {/* Guarantees */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="glass-light rounded-xl p-4">
              <p className="text-sm text-white font-semibold mb-1">
                ðŸ”’ Performance Guarantee
              </p>
              <p className="text-[#333333] text-xs">
                If your flagged queue doesn&apos;t drop 50% in 30 days, we work
                for free until it does.
              </p>
            </div>
            <div className="glass-light rounded-xl p-4">
              <p className="text-sm text-white font-semibold mb-1">
                ðŸ’¸ 60-Day Money Back
              </p>
              <p className="text-[#333333] text-xs">
                Not satisfied? Full refund. No questions. You keep all processed
                data.
              </p>
            </div>
            <div className="glass-light rounded-xl p-4">
              <p className="text-sm text-white font-semibold mb-1">
                ðŸ“¦ Full Data Portability
              </p>
              <p className="text-[#333333] text-xs">
                Cancel anytime. Full Postgres dump + JSON export within 24 hours.
              </p>
            </div>
            <div className="glass-light rounded-xl p-4">
              <p className="text-sm text-white font-semibold mb-1">
                ðŸ§ª Try Before You Buy
              </p>
              <p className="text-[#333333] text-xs">
                We process 10 of your real invoices live before you spend a cent.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
