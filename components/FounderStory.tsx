"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FounderStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-8 md:p-12 relative overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/20 via-blue-600/5 to-transparent rounded-bl-full pointer-events-none transition-all duration-700 group-hover:from-cyan-400/30" />

          {/* Founder Image */}
          <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Image
              src="/founder.jpg"
              alt="Kuberan"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-heading">
            Why I Started DataByt
          </h2>

          <div className="space-y-4 text-slate-400 leading-relaxed text-base">
            <p>
              I spent 4 years as an Azure data engineer watching AI projects fail to reach production.
            </p>
            <p>
              The gap between a cool Jupyter notebook demo and a production system that survives API timeouts, handles bad data, and doesn&apos;t hallucinate is massive. Most agencies are built to sell the demo. They aren&apos;t built to engineer the failure modes.
            </p>
            <p>
              DataByt exists to bridge that gap. We apply rigid software engineering principles — rigorous evaluation, failure mode design, and monitoring — to generative AI.
            </p>
            <p>
              We don&apos;t ship demos. We ship production agents your team can actually trust. And we do it with transparent pricing, full code handoffs, and real guarantees.
            </p>
            <p className="text-slate-300 font-medium pt-2">
              Our founding client cohort is open now. If you want an agent in production by the end of next quarter, let&apos;s talk.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-white font-semibold">Kuberan</p>
            <p className="text-sm text-slate-500">Founder, DataByt · 4 years in Azure Data Engineering · Databricks-native</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
