"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Why is this so much cheaper than HighRadius or Billtrust?",
    a: "They\u2019re enterprise SaaS platforms \u2014 you pay for their cloud, support, sales team, and annual contracts. We build on YOUR existing Databricks or Snowflake, so there\u2019s no infrastructure cost on our side. You pay once. You own the code forever. No recurring fees.",
  },
  {
    q: "Will this actually work in production, or is this another AI demo?",
    a: "Every build includes evaluation suites, failure mode handling, and human-in-the-loop checkpoints. We deploy on your production infrastructure with 30 days of monitoring. If it breaks within 30 days, we fix it free. We ship systems, not demos.",
  },
  {
    q: "What if our data is messy or incomplete?",
    a: "That\u2019s normal. Our initial audit (Day 1-3) assesses data quality and identifies gaps. We design the agent to handle real-world data \u2014 missing fields, inconsistent formats, duplicates. If cleanup is needed first, we\u2019ll tell you exactly what to fix.",
  },
  {
    q: "How does this integrate with our existing ERP?",
    a: "We integrate with whatever your finance team uses \u2014 NetSuite, QuickBooks, Xero, SAP, or custom ERPs. The agent reads from your data platform where transaction data already lives or can be easily piped.",
  },
  {
    q: "Why should I trust a newer company with my AR process?",
    a: "Three reasons: (1) Your data never leaves your infrastructure \u2014 zero data risk. (2) You own every line of code \u2014 if you\u2019re unhappy, you keep everything. (3) We guarantee delivery \u2014 if we miss the deadline, you don\u2019t pay. The risk is entirely on us.",
  },
  {
    q: "How fast can you start?",
    a: "We\u2019re currently booking builds for May. Once scope is agreed, the audit begins within 48 hours and the full build starts within the first week. Total time to production: 3 weeks for AR Collections, 6 weeks for Order-to-Cash.",
  },
  {
    q: "What happens after the 30-day monitoring period?",
    a: "You own the agent completely. Your team can maintain and extend it using our documentation. Optional retainer support is available but never required. Most agents run autonomously after handoff.",
  },
  {
    q: "Does the agent work 24/7?",
    a: "Yes. Unlike a human AR specialist who works 8 hours, the AI agent runs continuously \u2014 sending collections at optimal times, tracking promises overnight, and flagging exceptions for your team each morning.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="py-32 md:py-40 px-6">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] text-blue-400 uppercase mb-5">
            Clear Answers
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
            Questions? <span className="text-gradient-blue">Straight Answers.</span>
          </h2>
        </motion.div>

        <motion.div
          className="space-y-4"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-6 text-left"
                >
                  <span className="text-[15px] font-medium text-white pr-4 leading-relaxed">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={18} className="text-slate-500" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <p className="px-7 pb-6 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
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
