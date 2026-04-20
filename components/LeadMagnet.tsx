"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function LeadMagnet() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    const { error } = await supabase.from("demo_requests").insert({
      full_name: "Lead Magnet",
      email,
      company_name: "Free Audit Request",
      revenue_range: "Not specified",
      message: "Free Databricks Cost Audit request from lead magnet section",
    });

    setStatus(error ? "error" : "success");
  }

  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="gradient-orb-warm" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center" ref={ref}>
        {/* Brunson hook: irresistible free offer */}
        <motion.div
          className="bg-[#0A1628]/80 border border-amber-500/20 rounded-2xl p-8 md:p-12 shadow-[0_0_40px_rgba(245,158,11,0.08)]"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            Free · No obligation · 20 minutes
          </span>

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 font-heading">
            Free Databricks Cost Audit
          </h2>

          <p className="text-base text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            We&apos;ll analyze your Databricks or Snowflake spend and find
            20–40% in wasted compute. Takes 20 minutes. Most audits find at
            least $15K in annual savings.
          </p>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <CheckCircle2 size={20} />
              <span className="font-medium">We&apos;ll reach out within 24 hours!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-5 py-3 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold rounded-full px-6 py-3 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
              >
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Get Free Audit
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-sm text-red-400 mt-3">
              Something went wrong. Email us at kuberan@databyt.in
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
