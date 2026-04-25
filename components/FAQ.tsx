"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Why are your agent prices lower than Accenture or boutique agencies?",
    a: "Founding client pricing. We're collecting our first 5 case studies at this rate. After 5 case studies are published, pricing rises to market rate ($35K-$65K). You get senior-engineer delivery at early-stage pricing — for now.",
  },
  {
    q: "Will my agent actually work in production, or is this another demo?",
    a: "Every build includes a full evaluation suite, failure mode design, and human-in-the-loop checkpoints — the 5 disciplines that separate production AI from prototypes. We commit to 30 days of post-launch iteration if anything breaks.",
  },
  {
    q: "What's the difference between Starter Agent and Production Agent?",
    a: "Starter is single-task, 1-2 integrations, great for testing your first workflow. Production is multi-step, 3-5 integrations, with memory + tool use, built for complex logic. Most clients start with Starter, then upgrade after seeing it work.",
  },
  {
    q: "How fast can you start?",
    a: "We are currently accepting 5 clients for the May cohort. Once you book a workshop and we agree on scope, builds begin within 1-2 weeks depending on your data readiness.",
  },
  {
    q: "What if the agent breaks at 3 AM?",
    a: "Production monitoring is included in every build. With the optional retainer, we respond within 24 business hours. We design fallback paths into every agent — so it fails gracefully, not catastrophically.",
  },
  {
    q: "Do I need to give you full access to my Databricks workspace?",
    a: "We work IN your workspace, with scoped write access only to specific schemas you designate. Your data never leaves your cloud, and we never train our own models on your data.",
  },
  {
    q: "Why should I trust a solo founder with a production AI system?",
    a: "Senior engineer delivery (8+ years data engineering). No junior consultants. Documented 5-disciplines methodology. Full code ownership transfers to you. We're transparent about being early-stage — that's why founding-client pricing exists.",
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
          <span className="inline-block text-sm font-semibold tracking-wider text-blue-400 uppercase mb-4">
            Clear Answers
          </span>
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
