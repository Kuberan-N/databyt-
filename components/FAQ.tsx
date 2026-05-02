"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Why does pricing start at ₹30K for the pilot?",
    a: "We want you to see the system work before committing ₹7L. The pilot proves ROI on YOUR data in 7–14 days. If it works, upgrade to the full system. If not, walk away with working automation anyway.",
  },
  {
    q: "Why are your prices lower than Accenture or boutique agencies?",
    a: "Because we don't have 50 people in an office charging you for project management overhead. You get a senior engineer directly on your account for the full project. No junior consultants. No account managers. The price is what the work actually costs at our cost structure, not what the market can bear.",
  },
  {
    q: "Will my agent actually work in production, or is this another demo?",
    a: "Before we write a single line of production code, we build an evaluation suite of 50–100 real test cases from your actual data. We design every failure mode. We build monitoring. The evaluation suite runs continuously. You see the score before launch. Most agencies ship demos hoping production works. We ship proof that production works.",
  },
  {
    q: "What's the difference between the Pilot and the Full System?",
    a: "The pilot is a single workflow — one task, automated end-to-end. Ideal for proving the concept first. The full system is multi-step with memory, tool calling, multiple integrations, and reinforcement loops. Most clients start with the pilot and upgrade within 90 days.",
  },
  {
    q: "How fast can you start?",
    a: "The free 90-minute audit can happen this week. After the audit, if we're a good fit, we can start the pilot within 7 days. Full production is 8–10 weeks from kickoff. Most clients see a working demo of their agent by Week 4.",
  },
  {
    q: "What if the agent breaks at 3 AM?",
    a: "All Full System clients receive real-time monitoring dashboards with drift detection and latency alerts. If something breaks within 30 days of launch, we fix it for free — no support tickets, no hourly billing. After 30 days, the AR System Support retainer covers ongoing incident response.",
  },
  {
    q: "Do I need to give you full access to my data warehouse?",
    a: "We work inside your workspace with the minimum permissions required for the project. We never ask for admin access. Everything is governed through your existing access controls — you control who can see what. After handoff, you can revoke our access entirely. We recommend you do.",
  },
  {
    q: "Why should I trust a solo founder with a production AI system?",
    a: "Three answers: First, every line of code we write lives in your repo and runs in your workspace — you're not trusting us with production, you're trusting yourself with code we wrote. Second, the evaluation suite means you can independently verify the agent works before it goes live. Third, our guarantees are contractual — if we miss, we work for free.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[860px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">FAQ</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-4 leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Questions? <span style={{ color: "#0066FF" }}>We&apos;ve got answers.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border-b transition-colors duration-300"
                style={{ borderColor: "#E8E8E8" }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span
                    className="font-heading font-semibold text-[16px] pr-4 leading-relaxed transition-colors duration-300"
                    style={{ color: isOpen ? "#0066FF" : "#0A0A0A", letterSpacing: "-0.01em" }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-shrink-0"
                  >
                    <Plus size={20} style={{ color: isOpen ? "#0066FF" : "#999" }} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="pb-6 text-[14px] text-[#666] leading-relaxed pr-10">{faq.a}</p>
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
