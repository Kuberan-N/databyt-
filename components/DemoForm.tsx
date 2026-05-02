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
  "w-full bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 text-[#0A0A0A] placeholder:text-[#999] focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 outline-none transition-all duration-300 text-[14px]";

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
          className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

          <motion.div
            className="relative bg-white p-8 md:p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={{ borderRadius: "20px", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-[#999] hover:text-[#0066FF] transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {status === "success" ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} style={{ color: "#0066FF" }} className="mx-auto mb-5" />
                <h3 className="font-heading text-[20px] font-bold text-[#0A0A0A] mb-3" style={{ letterSpacing: "-0.01em" }}>
                  We&apos;ll reach out within 24 hours.
                </h3>
                <p className="text-[14px] text-[#666] mb-7">
                  Check your inbox for your AR workflow audit details.
                </p>
                <button onClick={handleClose} className="btn-ghost" style={{ color: "#0A0A0A" }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-[22px] font-extrabold text-[#0A0A0A] mb-2" style={{ letterSpacing: "-0.01em" }}>
                  Book your free audit
                </h3>
                <p className="text-[14px] text-[#666] mb-7">
                  90 minutes. No obligation. We&apos;ll show you exactly how much your manual AR is costing.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                      Full Name <span style={{ color: "#0066FF" }}>*</span>
                    </label>
                    <input type="text" required value={form.full_name} onChange={update("full_name")} placeholder="Alex Chen" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                      Work Email <span style={{ color: "#0066FF" }}>*</span>
                    </label>
                    <input type="email" required value={form.email} onChange={update("email")} placeholder="alex@company.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                      Company <span style={{ color: "#0066FF" }}>*</span>
                    </label>
                    <input type="text" required value={form.company_name} onChange={update("company_name")} placeholder="Acme Fintech" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                      Revenue <span style={{ color: "#0066FF" }}>*</span>
                    </label>
                    <select required value={form.revenue_range} onChange={update("revenue_range")} className={`${inputClass} ${!form.revenue_range ? "text-[#999]" : ""}`}>
                      <option value="" disabled>Select range</option>
                      {revenueOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                      Biggest AR challenge? <span className="text-[#999]">(optional)</span>
                    </label>
                    <textarea value={form.message} onChange={update("message")} rows={3} placeholder="e.g., DSO too high, manual collections..." className={`${inputClass} resize-none`} />
                  </div>

                  {status === "error" && (
                    <p className="text-[13px]" style={{ color: "#0066FF" }}>
                      Something went wrong. Email <a href="mailto:kuberan@databyt.in" className="underline">kuberan@databyt.in</a> directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary w-full justify-center text-[14px] disabled:opacity-60"
                  >
                    {status === "loading" ? (<><Loader2 size={16} className="animate-spin" />Submitting...</>) : "Book free audit →"}
                  </button>

                  <p className="text-[11px] text-center text-[#999]">No spam. Just a 90-min AR workflow analysis.</p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
