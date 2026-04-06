"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { open } = useDemoForm();

  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background gradient orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center" ref={ref}>
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-6"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Ready to Automate Your Investor Reporting?
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-zinc-400 mb-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Join Indian founders who stopped spending Sundays in Excel.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <button
            onClick={open}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-full px-10 py-4 text-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            Request a Free Demo
            <ArrowRight
              size={20}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
