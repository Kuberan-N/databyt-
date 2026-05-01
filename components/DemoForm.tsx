"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDemoForm } from "./DemoFormContext";

const revenueOptions = [
  "$2M – $5M ARR",
  "$5M – $20M ARR",
  "$20M – $50M ARR",
  "$50M+ ARR",
  "Pre-revenue / Below $2M",
];

const inputClass =
  "w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 outline-none transition-all duration-300 text-sm";

export default function DemoForm() {
  const { isOpen, close } = useDemoForm();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    company_name: "",
    revenue_range: "",
    message: "",
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function reset() {
    setForm({ full_name: "", email: "", company_name: "", revenue_range: "", message: "" });
    setStatus("idle");
  }

  function handleClose() {
    close();
    setTimeout(reset, 300);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("demo_requests").insert({
      full_name: form.full_name,
      email: form.email,
      company_name: form.company_name,
      revenue_range: form.revenue_range,
      message: form.message || null,
    });
    setStatus(error ? "error" : "success");
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

          <motion.div
            className="relative bg-[#0A1628] border border-slate-800/60 rounded-2xl p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {status === "success" ? (
              <div className="text-center py-10">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">
                  We&apos;ll reach out within 24 hours.
                </h3>
                <p className="text-sm text-slate-400 mb-8">
                  Check your inbox for your AR Assessment details.
                </p>
                <button
                  onClick={handleClose}
                  className="border border-slate-700/50 hover:border-blue-500/40 text-slate-300 hover:text-white rounded-full px-8 py-3 font-semibold transition-all duration-300"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2 font-heading">
                  Book Your Free AR Assessment
                </h3>
                <p className="text-sm text-slate-400 mb-8">
                  20 minutes. No obligation. We show you exactly how much your manual AR is costing.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name <span className="text-blue-400">*</span></label>
                    <input type="text" required value={form.full_name} onChange={update("full_name")} placeholder="Alex Chen" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Work Email <span className="text-blue-400">*</span></label>
                    <input type="email" required value={form.email} onChange={update("email")} placeholder="alex@company.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Company <span className="text-blue-400">*</span></label>
                    <input type="text" required value={form.company_name} onChange={update("company_name")} placeholder="Acme Fintech" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Revenue <span className="text-blue-400">*</span></label>
                    <select required value={form.revenue_range} onChange={update("revenue_range")} className={`${inputClass} ${!form.revenue_range ? "text-slate-500" : ""}`}>
                      <option value="" disabled>Select range</option>
                      {revenueOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Biggest AR challenge? <span className="text-slate-600">(optional)</span></label>
                    <textarea value={form.message} onChange={update("message")} rows={3} placeholder="e.g., DSO too high, manual collections..." className={`${inputClass} resize-none`} />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-400">
                      Something went wrong. Email <a href="mailto:kuberan@databyt.in" className="underline">kuberan@databyt.in</a> directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (<><Loader2 size={18} className="animate-spin" />Submitting...</>) : "Book Free AR Assessment →"}
                  </button>

                  <p className="text-xs text-center text-slate-500">No spam. Just a 20-min AR analysis.</p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
