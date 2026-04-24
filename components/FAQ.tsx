"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What tech stack do you work with?",
    a: "We're Databricks-native — Lakehouse, Mosaic AI, Unity Catalog, Delta Live Tables, Spark. We also use dbt, Fivetran, Airbyte, and Apache Airflow. For the AI agent layer: Claude (Anthropic), OpenAI GPT-4, LangGraph, and LangChain. If you're on a different stack, we'll assess compatibility during the audit.",
  },
  {
    q: "How fast can you start?",
    a: "Your AI Readiness Audit can be booked within 48 hours of our first call. The audit itself takes 2 weeks. Your first production agent is live 4 weeks after that — or you get a full refund.",
  },
  {
    q: "What about data security?",
    a: "Your data never leaves your workspace. We work entirely inside your Databricks environment using read-only API access to your source systems. We follow SOC 2 practices (compliance in progress) and are GDPR-ready. You control access and can revoke it anytime.",
  },
  {
    q: "How does pricing work?",
    a: "Fixed fees — no hourly billing, no surprise invoices. Every engagement starts with the $5,000 AI Readiness Audit (100% credited toward your build). The Starter Agent is $15,000 fixed-price for 4 weeks. The retainer is $10,000/month — cancel anytime with 7 days notice, you keep everything.",
  },
  {
    q: "What makes you different from a consultancy?",
    a: "We're data engineers first — most AI builders can't handle real enterprise data. Traditional consultancies (Accenture, Tiger Analytics) start at $150K+ and take 6 months. We ship a production agent in 4 weeks at a fixed price. The difference is operational maturity, not just AI tooling.",
  },
  {
    q: "Do you replace our existing tools?",
    a: "No — we enhance them. If you're on Databricks, we make your data agent-ready. If you're on a messy mix of scripts and spreadsheets, we migrate you to a production stack. We never force a re-platform unless it's genuinely the right call.",
  },
  {
    q: "What if we grow and need more agents?",
    a: "Move to our AI Operations Retainer — $10,000/month. We ship one new agent every month, handle monitoring and incident response with a 24-hour SLA, and continuously optimize your Databricks costs. Cancel any month with 7 days notice.",
  },
  {
    q: "Can we see a sample deliverable?",
    a: "Yes. Book a free 20-minute AI Readiness Check — we'll run a real diagnostic on your data stack, identify 3 agent opportunities, and flag 1 critical data gap. No obligation, no pitch. If we can't find actionable insights, we'll tell you honestly.",
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
