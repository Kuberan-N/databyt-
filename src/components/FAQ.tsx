"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "How is DataByt different from HighRadius or Billtrust?",
    a: "HighRadius starts at $100K+/year with a 6-month enterprise implementation. Billtrust is $50K+/year. DataByt is $3,000/month, live in 48 hours, and requires zero IT involvement. Same AI-driven outcome at 10% of the cost.",
  },
  {
    q: "How does the AI collections engine work?",
    a: "It imports your AR aging daily from QuickBooks, Xero, NetSuite, or Sage. Every overdue invoice is scored by priority. One batched email is sent per customer covering all their overdue invoices — tone escalates from polite (L1) to firm (L2) to final notice (L3) based on days overdue.",
  },
  {
    q: "Will the dunning emails sound robotic to my customers?",
    a: "No. Gemini AI uses the customer's actual name, specific invoice numbers, exact amounts owed, due dates, and payment history. Finance teams consistently tell us customers respond without realising the email was AI-generated.",
  },
  {
    q: "How do customers pay?",
    a: "Every dunning email includes a direct payment link. Customer clicks it, lands on a hosted portal (no login required), sees their invoice, and pays via Dodo Payments checkout in under 60 seconds. Payment is auto-matched to the invoice instantly.",
  },
  {
    q: "What accounting software do you support?",
    a: "QuickBooks Online, Xero, NetSuite, and Sage Business Cloud — all live today via OAuth. No CSV exports, no manual uploads. Daily sync.",
  },
  {
    q: "How long does setup take?",
    a: "48 hours. We handle the ERP connection, AR aging import, email configuration, and payment portal setup. You don't touch any code or configure any workflows.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted at rest and in transit, stored in PostgreSQL with row-level security. We never train AI models on your customer data. Full data export available at any time.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-[#F8FAFC] py-20 border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-10"
        >
          <p className="text-[#E8242A] text-[11px] font-semibold uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-[30px] sm:text-[38px] font-bold text-[#111111] leading-[1.15] tracking-[-0.02em]">
            Common questions
          </h2>
        </motion.div>

        <div className="max-w-3xl space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease, delay: i * 0.04 }}
              className="rounded-lg bg-[#FAFAFA] border border-[#EBEBEB] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
              >
                <span className="text-[#111111] font-semibold text-[14px] leading-snug">{faq.q}</span>
                {open === i
                  ? <Minus className="w-4 h-4 text-[#E8242A] shrink-0" />
                  : <Plus className="w-4 h-4 text-[#BBBBBB] shrink-0" />
                }
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[#555555] text-[13.5px] leading-relaxed border-t border-[#EBEBEB] pt-3">
                      {faq.a}
                    </p>
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
