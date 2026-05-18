"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How is DataByt different from HighRadius or Tesorio?",
    a: "HighRadius starts at $30,000+/year with a 6-month implementation cycle built for enterprises with dedicated IT teams. DataByt is live in 48 hours with no IT involvement, and starts at $3,000/month — the same AI-driven outcome at a fraction of the cost. We're built specifically for mid-market CFOs who don't have enterprise procurement budgets.",
  },
  {
    q: "How does the AI Collections Agent actually work?",
    a: "It imports your AR aging from QuickBooks or Xero daily. Then it scores every overdue invoice — factoring in amount, days overdue, customer segment, and payment history — to determine priority. It drafts a personalized dunning email for each, calibrating the tone to the invoice age (polite reminder → firm notice → final notice). You review and approve, or turn on full autopilot.",
  },
  {
    q: "Will the AI emails sound robotic to my customers?",
    a: "No. The AI is given context about your customer relationship and writes emails that read like a senior AR manager drafted them. Every email uses the customer's name, references specific invoice numbers and amounts, and is adapted to their payment history. Customers regularly respond without realizing the email was AI-generated.",
  },
  {
    q: "How long does setup take?",
    a: "48 hours for most businesses. We handle onboarding: QuickBooks/Xero connection, AR aging import, and first-run configuration. You don't touch a line of code or configure a workflow. By day 2, your queue is live and emails are ready to send.",
  },
  {
    q: "What accounting software do you integrate with?",
    a: "QuickBooks Online and Xero for both AR and AP data. Invoices and customers sync automatically. We're adding Sage and NetSuite in Q3 2026.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted at rest and in transit. We use PostgreSQL with row-level security — your data is completely isolated from other customers. We never train AI models on your data. You can export everything and delete your account at any time.",
  },
  {
    q: "What's included in the free AR Audit?",
    a: "A 30-minute call where we review your current AR process, calculate your monthly hidden cost of manual collections (labor, DSO drag, write-offs), and show you exactly where money is leaking. No sales pressure. You leave with a clear picture of your numbers whether you sign up or not.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#F8F9FC] py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#E8242A] mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
            Common questions
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F8F9FC] transition-colors"
              >
                <span className="text-[#0F172A] font-semibold text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#1B2B6B] shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-[#64748B] text-sm leading-relaxed border-t border-[#F1F5F9]">
                      <div className="pt-4">{faq.a}</div>
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
