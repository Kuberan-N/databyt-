"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What tech stack do you work with?",
    a: "Databricks (Lakehouse, Unity Catalog, Spark), dbt, Fivetran, Airbyte, Snowflake, Apache Airflow, and major cloud platforms (AWS, Azure, GCP). For AI agents, we use Claude, OpenAI, LangChain, and LangGraph. If you use something else, we'll scope compatibility within 48 hours.",
  },
  {
    q: "How fast can you start?",
    a: "A working pipeline or agent lands in your account within 7 days of kickoff. Full setup takes 3 weeks for production-grade pipelines. If we don't deliver in Week 1, you get a full refund.",
  },
  {
    q: "What about data security?",
    a: "We use read-only API access to your data sources. Data never leaves your account — we work inside your Databricks/Snowflake environment. SOC 2 compliance in progress. GDPR-ready. You control access and can revoke anytime.",
  },
  {
    q: "How does pricing work?",
    a: "Fixed monthly fee, billed monthly. No 6-month SOWs, no surprise invoices. Cancel with 7 days' notice — you keep the code, the repo, and the docs. The Audit Sprint is a one-time $1,500 engagement with no ongoing commitment.",
  },
  {
    q: "What makes you different from a consultancy?",
    a: "Traditional consultancies (Accenture, Tiger Analytics) start at $50K+ and take 3–6 months. We're one senior operator, fixed monthly fee, shipping outcomes — not a team of juniors billing hours. You get the same Databricks-native expertise at a fraction of the cost.",
  },
  {
    q: "Do you replace our existing tools?",
    a: "No. We optimize what you have. If you're on Databricks, we make it faster and cheaper. If you're on a messy mix of Airflow and Python scripts, we migrate you to a production-grade stack. We never force a re-platform.",
  },
  {
    q: "What if we grow and need more?",
    a: "Start with Fractional Lite ($2,500/mo). When you're ready, upgrade to Fractional Monthly ($4,500/mo) for the full data + AI stack. The Platform Partner tier ($8,500/mo) is for Series A–B companies that need unlimited scope and SOC 2-ready governance.",
  },
  {
    q: "Can we see a sample deliverable?",
    a: "Yes. Book a free 20-minute audit — we'll run a real diagnostic on your data stack and show you exactly what we'd build. No obligation, no pitch. If we can't find at least one actionable insight, we'll tell you honestly.",
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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
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
                className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl overflow-hidden transition-colors hover:border-slate-700"
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
                      <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">
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
