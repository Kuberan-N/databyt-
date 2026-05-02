"use client";

import { motion, type Variants } from "framer-motion";
import { useDemoForm } from "./DemoFormContext";
import { useCurrency } from "./CurrencyContext";

const proofStats = [
  { num: "18d", label: "DSO reduction" },
  { num: "40h", label: "saved weekly" },
  { num: "8–10w", label: "to production" },
  { num: "0", label: "new infrastructure", isCurrency: true },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.05 + 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const { open: openDemo } = useDemoForm();
  const { symbol } = useCurrency();

  return (
    <section className="relative bg-white pt-[140px] pb-24 px-6 md:px-10 overflow-hidden">
      <div className="relative max-w-[1100px] mx-auto text-center">
        {/* Headline */}
        <motion.h1
          className="font-heading font-extrabold text-[#0A0A0A] mb-6 leading-[1.08]"
          style={{ fontSize: "clamp(2.5rem, 6.4vw, 4rem)", letterSpacing: "-0.02em" }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Fix your invoice follow-ups<br />
          and <span style={{ color: "#0066FF" }}>collect payments faster</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-[18px] text-[#333] max-w-[640px] mx-auto mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          We automate reminders, responses, and escalation inside your existing systems.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <button onClick={openDemo} className="btn-primary text-[15px]">
            Book your AR workflow audit →
          </button>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[900px] mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          {proofStats.map(({ num, label, isCurrency }) => (
            <div key={label} className="text-center">
              <div
                className="font-heading font-extrabold text-3xl md:text-4xl mb-2 leading-none"
                style={{ color: "#0066FF", letterSpacing: "-0.02em" }}
              >
                {isCurrency ? `${symbol}${num}` : num}
              </div>
              <div className="text-[13px] text-[#666] leading-snug">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
