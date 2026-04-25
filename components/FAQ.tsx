"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Why $749 and not more?",
    a: "Because you haven't worked with me yet. The audit is priced as a low-risk way to see if we're a fit. If the audit delivers value, we can discuss larger engagements after.",
  },
  {
    q: "How fast can you start?",
    a: "Within 48 hours of booking. The audit itself takes 7 days from kickoff to delivery.",
  },
  {
    q: "What access do you need?",
    a: "Read-only access to your Databricks workspace — specifically to system tables (billing, lakeflow, access). We never touch production data or write anything to your workspace.",
  },
  {
    q: "What about security?",
    a: "Signed NDA before any access. Read-only permissions. SOC 2 practices (not certified yet — we're transparent about that). Your data never leaves your cloud.",
  },
  {
    q: "Will the audit really find enough to justify $749?",
    a: "If it doesn't find at least $5K/year in waste, you get your money back. In most workspaces with >$10K/month Databricks spend, we find significantly more.",
  },
  {
    q: "What happens if I want ongoing help?",
    a: "We discuss advisory packages only after the audit is complete. No pressure during the engagement.",
  },
  {
    q: "Are you a solo founder or an agency?",
    a: "I'm a solo founder. You work directly with me, not a junior consultant.",
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
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
            Questions?{" "}
            <span className="text-gradient-blue">We&apos;ve Got Answers.</span>
          </h2>
        </motion.div>

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
                className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-base font-medium text-white pr-4">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={20} className="text-slate-500" />
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
                      <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
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
