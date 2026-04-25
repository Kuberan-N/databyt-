"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  // Existing relevant ones
  {
    q: "Why $749 for an audit?",
    a: "Because you haven't worked with me yet. The audit is priced as a low-risk way to see if we're a fit.",
  },
  {
    q: "How fast can you start?",
    a: "Within 48 hours of booking. The audit itself takes 7 days from kickoff to delivery. Agent builds start in 1-2 weeks.",
  },
  {
    q: "What about security?",
    a: "Signed NDA before any access. Read-only permissions for audits. SOC 2 practices. Your data never leaves your cloud.",
  },
  {
    q: "Will the audit really find enough to justify $749?",
    a: "If it doesn't find at least $5K/year in waste, you get your money back. In most workspaces with >$10K/month Databricks spend, we find significantly more.",
  },
  // New ones
  {
    q: "Why are your agent prices lower than Accenture or boutique agencies?",
    a: "Founding client pricing. We're collecting our first 5 case studies at this rate. After 5 case studies published, pricing rises to market rate ($40K-$80K). You get senior-engineer delivery at boutique pricing — for now.",
  },
  {
    q: "Will my agent actually work in production, or is this another demo?",
    a: "Every build includes a full evaluation suite, failure mode design, and human-in-the-loop checkpoints — the 5 disciplines that separate production AI from prototypes. We commit to 30 days of post-launch iteration if anything breaks.",
  },
  {
    q: "What's the difference between Starter Agent and Production Agent?",
    a: "Starter is single-task, 1-2 integrations, great for testing. Production is multi-step, 3-5 integrations, with memory + tool use. Many clients start with Starter, then upgrade to Production after seeing it work.",
  },
  {
    q: "What if the agent breaks at 3 AM?",
    a: "Production monitoring is included in every build. With the optional retainer, we respond within 24 business hours. We design fallback paths into every agent — so it fails gracefully, not catastrophically.",
  },
  {
    q: "Do I need to give you full access to my Databricks workspace?",
    a: "We work IN your workspace, with read-only access to system tables for the audit, and scoped write access only to specific schemas you designate. Your data never leaves your cloud.",
  },
  {
    q: "Why should I trust a solo founder with a production AI system?",
    a: "Senior engineer delivery (8+ years Databricks/Spark/Delta Lake). No junior consultants. Documented 5-disciplines methodology. Code ownership transfers to you. 30-day refund window. We're transparent about being early-stage — that's why founding-client pricing exists.",
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
