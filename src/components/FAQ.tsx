"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "How is DataByt different from HighRadius?",
    a: "HighRadius starts at $30,000+/year with a 6-month implementation for enterprise IT teams. DataByt is live in 48 hours, starts at $3,000/month, and requires zero IT involvement. Same AI-driven outcome.",
  },
  {
    q: "How does the AI Collections Agent work?",
    a: "It imports your AR aging from QuickBooks or Xero daily, scores every overdue invoice by priority, drafts a personalized dunning email for each one, and sends it automatically. Tone is calibrated to days overdue — polite reminder, firm notice, or final notice.",
  },
  {
    q: "Will the emails sound robotic to my customers?",
    a: "No. The AI uses the customer's name, specific invoice numbers, amounts, and payment history. Finance teams routinely tell us customers respond without realizing the email was AI-generated.",
  },
  {
    q: "How long does setup take?",
    a: "48 hours. We handle the QuickBooks/Xero connection, AR aging import, and configuration. You don't touch any code or configure any workflows.",
  },
  {
    q: "What accounting software do you support?",
    a: "QuickBooks Online and Xero. Sage and NetSuite coming Q3 2026.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted at rest and in transit, stored in PostgreSQL with row-level security. We never train models on your data. Full data export available at any time.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-[#FAFAFA] py-28 border-y border-[#EBEBEB]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#111111] leading-tight">
            FAQ
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.05 }}
              className="rounded-2xl bg-white border border-[#EBEBEB] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-7 py-5 text-left"
              >
                <span className="text-[#111111] font-semibold text-base pr-8">{faq.q}</span>
                {open === i
                  ? <Minus className="w-4 h-4 text-[#E8242A] shrink-0" />
                  : <Plus className="w-4 h-4 text-[#AAAAAA] shrink-0" />
                }
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="overflow-hidden"
                  >
                    <p className="px-7 pb-6 text-[#666666] text-sm leading-relaxed">{faq.a}</p>
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
