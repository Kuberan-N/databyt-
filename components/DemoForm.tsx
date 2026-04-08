"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useDemoForm } from "./DemoFormContext";

const revenueOptions = [
  "Below ₹50K",
  "₹50K – ₹2L",
  "₹2L – ₹5L",
  "₹5L – ₹10L",
  "Above ₹10L",
];

const inputClass =
  "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors text-sm";

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

  // Lock body scroll when modal is open
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
    // Reset after animation completes
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
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {status === "success" ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Thanks! We&apos;ll reach out within 30 minutes.
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Keep an eye on your inbox.
                </p>
                <button
                  onClick={handleClose}
                  className="border border-zinc-700 hover:border-purple-500 text-zinc-300 hover:text-white rounded-full px-8 py-3 font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Request a Demo
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  We&apos;ll reach out within 30 minutes.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.full_name}
                      onChange={update("full_name")}
                      placeholder="Priya Sharma"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={update("email")}
                      placeholder="priya@yourcompany.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Company Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.company_name}
                      onChange={update("company_name")}
                      placeholder="Acme D2C"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Monthly Revenue Range <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={form.revenue_range}
                      onChange={update("revenue_range")}
                      className={`${inputClass} ${!form.revenue_range ? "text-zinc-500" : ""}`}
                    >
                      <option value="" disabled>
                        Select range
                      </option>
                      {revenueOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Message <span className="text-zinc-600">(optional)</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={update("message")}
                      rows={3}
                      placeholder="Tell us about your current reporting process..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-400">
                      Something went wrong. Please try again or email{" "}
                      <a href="mailto:kuberan811@gmail.com" className="underline">
                        kuberan811@gmail.com
                      </a>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-full px-8 py-4 font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
