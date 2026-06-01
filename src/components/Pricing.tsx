"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Lock } from "lucide-react";
import { getLocaleConfig } from "@/lib/geo";
import type { Locale, LocaleConfig } from "@/lib/geo";

const ease = [0.22, 1, 0.36, 1] as const;

const features = [
  "AI Collections Agent — fully automated",
  "L1 → L2 → L3 escalating dunning emails",
  "Payment links in every email (Stripe, Razorpay, any provider)",
  "Dispute management — file, pause, investigate, resolve",
  "AR aging dashboard & live CEI gauge",
  "QuickBooks Online & Xero OAuth integration",
  "Reply detection & unsubscribe handling",
  "Cash flow forecast dashboard",
  "Custom dunning sequences & cooldown rules",
  "Board-ready PDF reporting suite",
  "Live in 48 hours — full setup handled for you",
  "Dedicated onboarding + priority support",
];

export default function Pricing({ locale = "INTL", cfg }: { locale?: Locale; cfg?: LocaleConfig }) {
  const c = cfg ?? getLocaleConfig(locale === "IN" ? "IN" : "US");
  const [yearly, setYearly] = useState(true);

  // Full-number formatter with locale-correct comma grouping
  const sym = locale === "IN" ? "₹" : "$";
  const grp = locale === "IN" ? "en-IN" : "en-US";
  const m = (n: number) => `${sym}${n.toLocaleString(grp)}`;

  const MONTHLY  = c.foundingMonthly;
  const ANNUAL   = c.foundingAnnual;
  const ANN_MO   = c.annualMonthlyEffective;
  const SAVING   = c.annualSaving;
  const STANDARD = c.standardMonthly;

  const displayPrice = yearly ? ANN_MO : MONTHLY;

  // Competitor comparison labels
  const cmpHigh = locale === "IN" ? "₹80L+/yr" : "$100K+/yr";
  const cmpBill = locale === "IN" ? "₹40L+/yr" : "$50K+/yr";
  const cmpUs   = locale === "IN" ? "₹3.9L/yr" : "$20K/yr";

  return (
    <section id="pricing" className="bg-white py-20 border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-8"
        >
          <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#111111] leading-[1.15] tracking-[-0.02em]">
            One plan. Everything included.
          </h2>
          <p className="mt-3 text-[#333333] text-[15px] max-w-md">
            No feature tiers. No per-invoice charges. No surprises. 10× cheaper than HighRadius.
          </p>
        </motion.div>

        {/* Founding rate banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease }}
          className="flex items-center gap-3 mb-8 px-5 py-3.5 rounded-xl bg-[#EEF2FF] border border-[#4F46E5]/30"
        >
          <Lock className="w-4 h-4 text-[#4F46E5] shrink-0" />
          <p className="text-[13px] text-[#312E81]">
            <span className="font-bold">Founding customer rate — </span>
            first 20 clients lock in {m(MONTHLY)}/month forever. Price rises to {m(STANDARD)}/month after that.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              !yearly ? "bg-[#111111] text-white" : "text-[#333333] hover:text-[#111111]"
            }`}
          >
            Monthly
          </button>

          <div
            onClick={() => setYearly(y => !y)}
            className="relative w-11 h-6 rounded-full cursor-pointer transition-colors"
            style={{ background: yearly ? "#111111" : "#E5E5E5" }}
          >
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: yearly ? "calc(100% - 20px)" : "4px" }}
            />
          </div>

          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-2 ${
              yearly ? "bg-[#111111] text-white" : "text-[#333333] hover:text-[#111111]"
            }`}
          >
            Annual
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF2FF] border border-[#4F46E5]/40 text-[#312E81] text-[10px] font-bold">
              <Zap className="w-2.5 h-2.5" />
              Save {m(SAVING)}
            </span>
          </button>
        </motion.div>

        {/* Single plan card */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease }}
            className="relative rounded-2xl bg-[#111111] p-8 flex flex-col"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-[#4F46E5] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm whitespace-nowrap">
                Everything Included · Founding Rate
              </span>
            </div>

            <p className="text-white/50 text-[13px] mb-1 mt-2">DataByt Pro</p>
            <p className="text-white/30 text-[12px] mb-6">
              The complete AR collections platform for mid-market finance teams.
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-end gap-1.5 mb-2">
                <span className="text-[54px] font-extrabold text-white leading-none">
                  {m(displayPrice)}
                </span>
                <span className="text-[16px] text-white/40 mb-2">/month</span>
              </div>

              {yearly ? (
                <>
                  <p className="text-[13px] text-white/40 mb-4">
                    Billed {m(ANNUAL)}/year —{" "}
                    <span className="text-[#A5B4FC] font-semibold">
                      you save {m(SAVING)} (2 full months free)
                    </span>
                  </p>
                  {/* Side-by-side comparison — the Hormozi math made visible */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
                      <p className="text-[10px] text-white/30 mb-1.5 uppercase tracking-wider">Monthly billing</p>
                      <p className="text-[20px] font-bold text-white/30 line-through">
                        {m(MONTHLY * 12)}/yr
                      </p>
                      <p className="text-[10px] text-white/25 mt-0.5">You pay {m(SAVING)} more for the same product</p>
                    </div>
                    <div className="rounded-xl bg-[#4F46E5]/15 p-3.5 border border-[#4F46E5]/30">
                      <p className="text-[10px] text-[#A5B4FC] mb-1.5 uppercase tracking-wider">Annual billing ✓</p>
                      <p className="text-[20px] font-bold text-white">
                        {m(ANNUAL)}/yr
                      </p>
                      <p className="text-[10px] text-[#A5B4FC] mt-0.5">2 months free — the smart choice</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-6 p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[12px] text-white/40">
                    Switch to annual billing →{" "}
                    <span className="text-[#A5B4FC] font-semibold">
                      save {m(SAVING)}/year (2 months free)
                    </span>
                  </p>
                </div>
              )}
            </div>

            <a
              href="/auth"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white text-[#111111] text-[14px] font-bold mb-8 hover:bg-[#F3F3F3] transition-colors group"
            >
              Start 30-Day Free Trial — No Credit Card
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {features.map((f, j) => (
                <li key={j} className="flex items-start gap-2.5 text-[13px]">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#A5B4FC]" />
                  <span className="text-white/70">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[#333333] text-[12px]"
        >
          <span>&#10003; 30-day free trial</span>
          <span>&#10003; No credit card required</span>
          <span>&#10003; Cancel anytime</span>
          <span>&#10003; Live in 48 hours</span>
          <span>&#10003; CAN-SPAM compliant</span>
          <span className="text-[#333333]">
            HighRadius: <span className="line-through">{cmpHigh}</span> · Billtrust: <span className="line-through">{cmpBill}</span> · DataByt Pro: {cmpUs}
          </span>
        </motion.div>

      </div>
    </section>
  );
}
