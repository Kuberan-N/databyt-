"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Why are your prices lower than Accenture or boutique agencies?",
    a: "Because we don't have 50 people in an office in Bangalore charging you for their project management overhead. You get a senior data engineer and AI engineer — Kuberan — directly on your account for the full project. No junior consultants. No account managers. The $4,200 is what the work actually costs at our cost structure, not what the market can bear.",
  },
  {
    q: "Will my agent actually work in production, or is this another demo?",
    a: "This is the most important question. The entire DataByt methodology exists to answer this. Before we write a single line of production code, we build an evaluation suite of 50–100 real test cases from your actual data. We design every failure mode. We build monitoring. The evaluation suite runs continuously. You see the score before launch. Most agencies ship demos hoping production works. We ship proof that production works.",
  },
  {
    q: "What's the difference between Starter Agent and Production Agent?",
    a: "Starter Agent is a single workflow — one task, automated end-to-end. It's ideal for teams that want to prove the concept with a focused use case before scaling. Production Agent is a multi-step system with memory, tool calling, multiple system integrations, and reinforcement loops. It's for teams that have a critical workflow and cannot afford to fail. Most clients start with Starter and upgrade to Production within 90 days.",
  },
  {
    q: "How fast can you start?",
    a: "The free 90-minute workshop can happen this week. After the workshop, if we're a good fit, we can start the Architecture and Evaluation phase within 7 days. Full production is 8–10 weeks from kickoff. Most clients see a working demo of their agent by Week 4.",
  },
  {
    q: "What if the agent breaks at 3 AM?",
    a: "All Production Agent clients receive real-time monitoring dashboards with drift detection and latency alerts. If something breaks within 30 days of launch, we fix it for free — no support tickets, no hourly billing. After 30 days, the AI Ops Retainer covers ongoing incident response at ₹95,000/month.",
  },
  {
    q: "Do I need to give you full access to my Databricks workspace?",
    a: "We work inside your workspace with the minimum permissions required for the project. We never ask for admin access. Everything is governed through Unity Catalog — you control who can see what. After handoff, you can revoke our access entirely. We recommend you do.",
  },
  {
    q: "Why should I trust a solo founder with a production AI system?",
    a: "Fair question. Three answers: First, every line of code we write lives in your GitHub and runs in your workspace — you're not trusting us with production, you're trusting yourself with code we wrote. Second, the evaluation suite means you can independently verify the agent works before it goes live. Third, our guarantees are contractual — if we miss, we work for free. You have more protection from DataByt than you do from a ₹5 crore Accenture contract.",
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
    <section id="faq" className="py-32 md:py-40 px-6 bg-[#F5F4F0]">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">Clear Answers</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            Questions?{" "}
            <span style={{ color: "#E8321A" }}>We&apos;ve Got Answers.</span>
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
                className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
                style={{ border: isOpen ? "0.5px solid #E8321A" : "0.5px solid rgba(0,0,0,0.08)" }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-6 text-left"
                >
                  <span className="text-[15px] font-medium text-[#0A0A0A] pr-4 leading-relaxed">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={18} style={{ color: isOpen ? "#E8321A" : "#9ca3af" }} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <p className="px-7 pb-7 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
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
