"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What data sources do you support?",
    a: "Razorpay, Google Sheets, HubSpot, Zoho CRM, and LeadSquared. If you use something else, we'll scope it within 48 hours.",
  },
  {
    q: "How long does setup take?",
    a: "5 business days from the day you share access to your data sources.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. We use read-only access to your data sources. Your data is processed and stored securely. We never share it with third parties.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No lock-in contracts. Cancel with 30 days notice.",
  },
  {
    q: "What if I need custom metrics?",
    a: "The Full Data Pipeline plan includes custom metric definitions. We'll work with you to define exactly what you need.",
  },
  {
    q: "Do you work with pre-revenue startups?",
    a: "Our services are designed for startups with at least ₹50K/month in revenue, as you need transaction data for meaningful metrics.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto" ref={ref}>
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Questions? We&apos;ve Got Answers.
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          className="space-y-3"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden transition-colors hover:border-zinc-700"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-base font-medium text-white pr-4">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={20} className="text-zinc-500" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
