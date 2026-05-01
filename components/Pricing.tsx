"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { open: openDemo } = useDemoForm();
  const [isINR, setIsINR] = useState(false);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && tz.startsWith("Asia/")) setIsINR(true);
    } catch { /* fallback USD */ }
  }, []);

  const arPrice = isINR ? "₹3,99,000" : "$4,900";
  const arAnchored = isINR ? "₹8,00,000 – ₹12,00,000/yr" : "$50K – $150K/yr";
  const o2cPrice = isINR ? "₹12,00,000" : "$14,900";
  const o2cAnchored = isINR ? "₹25,00,000 – ₹60,00,000/yr" : "$100K – $300K/yr";

  return (
    <section id="pricing" className="py-32 md:py-40 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] text-blue-400 uppercase mb-5">
            Transparent Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
            One Price. No Subscriptions. <br className="hidden md:block" />
            <span className="text-gradient-blue">You Own Everything.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            No annual contracts. No per-seat fees. No hidden costs.{" "}
            You pay once. You own the code forever.
          </p>

          {/* Scarcity — subtle */}
          <div className="inline-flex items-center gap-3 text-sm text-slate-400 bg-slate-800/30 border border-slate-700/30 rounded-full px-5 py-2.5">
            <div className="flex gap-1">
              {[1, 2].map((i) => (
                <div key={i} className="w-5 h-2.5 bg-blue-500/60 rounded-sm" />
              ))}
              {[3, 4, 5].map((i) => (
                <div key={i} className="w-5 h-2.5 bg-slate-700/60 rounded-sm" />
              ))}
            </div>
            <span className="text-xs font-medium">3 of 5 build slots available for May</span>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Card 1: AR Collections */}
          <motion.div
            variants={fadeUp}
            className="glass-card rounded-2xl p-10 flex flex-col"
          >
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.15em] bg-blue-500/8 text-blue-400 border border-blue-500/15 w-fit mb-6">
              The Wedge
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">AR Collections Agent</h3>
            <p className="text-sm text-slate-400 mb-8">Automates collections. Pays for itself in 8 weeks.</p>
            
            <div className="mb-3">
              <span className="text-5xl font-extrabold text-white">{arPrice}</span>
              <span className="text-sm text-slate-500 ml-3">one-time</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-cyan-400 font-medium">3 weeks</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-sm text-slate-500">Full code ownership</span>
            </div>
            
            <div className="border-t border-slate-800/40 mb-8" />
            
            <ul className="space-y-4 mb-10 flex-1">
              {[
                "AI-powered dunning email workflows",
                "Smart account prioritization",
                "Payment promise tracking",
                "Intelligent escalation rules",
                "AR aging dashboard",
                "Built inside YOUR infrastructure",
                "30-day post-launch monitoring",
                "Full code handoff",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{f}</span>
                </li>
              ))}
            </ul>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mb-8">
              <p className="text-xs text-slate-400 mb-1">Competitors charge: <span className="line-through">{arAnchored}</span></p>
              <p className="text-sm font-semibold text-emerald-400">You save 90%+ vs enterprise alternatives</p>
            </div>

            <p className="text-[11px] text-center text-slate-500 mb-6">
              <span className="font-semibold text-slate-300">Guarantee:</span> If we don&apos;t deliver in 3 weeks, you don&apos;t pay.
            </p>

            <button
              onClick={openDemo}
              className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/40 text-white rounded-full px-6 py-4 font-semibold text-sm transition-all duration-300"
            >
              Get AR Collections Agent &rarr;
            </button>
          </motion.div>

          {/* Card 2: Order-to-Cash */}
          <motion.div
            variants={fadeUp}
            className="relative rounded-2xl p-10 flex flex-col bg-[#0A1628]/80 border border-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.06)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
                Most Requested
              </span>
            </div>
            
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.15em] bg-blue-500/8 text-blue-400 border border-blue-500/15 w-fit mb-6 mt-2">
              The System
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">Order-to-Cash Automation</h3>
            <p className="text-sm text-cyan-400 mb-8">The complete finance AI stack. Invoice to cash.</p>
            
            <div className="mb-3">
              <span className="text-5xl font-extrabold text-white">{o2cPrice}</span>
              <span className="text-sm text-slate-500 ml-3">one-time</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-cyan-400 font-medium">6 weeks</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-sm text-slate-500">Full code ownership</span>
            </div>
            
            <div className="border-t border-slate-800/40 mb-8" />
            
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-3">
                <Check size={15} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-white">Everything in AR Collections, plus:</span>
              </li>
              {[
                "Automated invoice generation",
                "AI-powered cash application",
                "Bank reconciliation automation",
                "Revenue recognition and reporting",
                "Human-in-the-loop checkpoints",
                "Executive finance dashboard",
                "Multi-entity support",
                "Team training and documentation",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check size={15} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{f}</span>
                </li>
              ))}
            </ul>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mb-8">
              <p className="text-xs text-slate-400 mb-1">Competitors charge: <span className="line-through">{o2cAnchored}</span></p>
              <p className="text-sm font-semibold text-emerald-400">You save 85%+ vs enterprise alternatives</p>
            </div>

            <p className="text-[11px] text-center text-slate-500 mb-6">
              <span className="font-semibold text-slate-300">Guarantee:</span> If it doesn&apos;t reach production in 6 weeks, we work for free until it does.
            </p>

            <button
              onClick={openDemo}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full px-6 py-4 font-semibold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]"
            >
              Get Order-to-Cash System &rarr;
            </button>
          </motion.div>
        </motion.div>

        {/* Bottom trust */}
        <motion.div
          className="mt-20 max-w-3xl mx-auto glass-card p-10 rounded-2xl text-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="text-base text-slate-300 leading-relaxed">
            <span className="text-white font-semibold">Why these prices?</span> We&apos;re building a track record. These prices make the ROI so obvious that saying no would be irrational — your AR agent saves at least $5,000/month in labor alone.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
