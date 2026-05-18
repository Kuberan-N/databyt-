"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How is DataByt different from HighRadius or Bill.com?",
    a: "HighRadius charges $8,000–$15,000+/year and is built for enterprises with 6-month implementation cycles. Bill.com locks you into their ecosystem with per-invoice fees. DataByt gives you enterprise-grade AI at 95% less cost, deploys in 1 hour, and you own your data. Plus, we include an AI Collections Agent that HighRadius charges separately for.",
  },
  {
    q: "What if the AI makes mistakes on my invoices?",
    a: "Our AI achieves 95%+ accuracy out of the box using Azure Document Intelligence + Claude AI. Uncertain extractions are automatically flagged for human review — your team sees them in 30 seconds. Our Vendor Learning Agent gets smarter with every correction, so accuracy only improves over time.",
  },
  {
    q: "How does the AI Collections Agent work?",
    a: "It imports your AR aging from QuickBooks/Xero daily, then uses AI to: (1) prioritize which customers to chase first based on amount, days overdue, and payment history, (2) draft personalized, professional reminder emails, (3) send them at optimal times via automated dunning sequences, and (4) include payment links for instant payment. You see everything in your AR dashboard.",
  },
  {
    q: "Can I try before I buy?",
    a: "Absolutely. We'll process 10 of your real invoices live during your demo — before you pay anything. No credit card required to start your free trial. And there's a 60-day unconditional money-back guarantee.",
  },
  {
    q: "What accounting software do you integrate with?",
    a: "We integrate with QuickBooks Online (Starter plan and up) and Xero (Growth plan and up). Invoices are synced as Bills in your accounting system. We're adding Sage and NetSuite in Q3 2026.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your data is encrypted at rest and in transit. We use Supabase (PostgreSQL) with row-level security. Invoice files are stored in encrypted cloud storage. We never share your data. You can export everything and delete your account at any time.",
  },
  {
    q: "What happens if I cancel?",
    a: "You get a full Postgres dump and JSON export of all your data within 24 hours. No exit fees. No data hostage. We even keep your processed invoices accessible for 30 days after cancellation.",
  },
  {
    q: "How long does setup take?",
    a: "Under 1 hour for most businesses. Sign up → connect QuickBooks/Xero → upload or forward your first invoice. The AI starts extracting immediately. Collections Agent activates once your AR aging is imported.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 bg-surface-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Got questions? We&apos;ve got{" "}
            <span className="gradient-text">answers.</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-surface-400 shrink-0 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-surface-400 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
