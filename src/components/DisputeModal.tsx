"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import type { DisputeReason } from "@/types/database";

const REASONS: { value: DisputeReason; label: string }[] = [
  { value: "incorrect_amount",    label: "Incorrect amount" },
  { value: "goods_not_received",  label: "Goods / services not received" },
  { value: "duplicate_invoice",   label: "Duplicate invoice" },
  { value: "already_paid",        label: "Already paid" },
  { value: "service_not_rendered",label: "Service not rendered" },
  { value: "other",               label: "Other" },
];

interface Props {
  open: boolean;
  invoiceId: string;
  invoiceNumber: string;
  invoiceAmount: number;
  customerId: string;
  orgId: string;
  onClose: () => void;
  onSaved: () => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function DisputeModal({
  open, invoiceId, invoiceNumber, invoiceAmount, customerId, orgId, onClose, onSaved,
}: Props) {
  const [reason, setReason]           = useState<DisputeReason>("incorrect_amount");
  const [description, setDescription] = useState("");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, invoiceId, customerId, reason, description }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to file dispute");
      }
      onSaved();
      onClose();
      setReason("incorrect_amount");
      setDescription("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#E8242A] focus:ring-1 focus:ring-[#E8242A]/20 outline-none transition-all text-sm";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md pointer-events-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-[#E8242A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A]">File a Dispute</h3>
                    <p className="text-xs text-[#94A3B8]">Invoice {invoiceNumber} · {fmt(invoiceAmount)}</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-[#94A3B8] hover:text-[#64748B] transition-colors p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-[#475569] text-sm font-medium mb-2 block">Reason for dispute</label>
                  <select value={reason} onChange={e => setReason(e.target.value as DisputeReason)}
                    className={inputCls + " appearance-none"}>
                    {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[#475569] text-sm font-medium mb-2 block">
                    Description <span className="text-[#94A3B8] font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Provide any additional context..."
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#94A3B8] focus:border-[#E8242A] focus:ring-1 focus:ring-[#E8242A]/20 outline-none transition-all text-sm resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FEF08A]">
                  <p className="text-xs text-[#713F12]">
                    Filing a dispute will pause automated collections on this invoice until resolved.
                    Your DataByt operator will investigate and respond within 2 business days.
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] text-sm font-medium hover:bg-[#F8F9FC] transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#E8242A] text-white text-sm font-bold hover:bg-[#C41E23] transition-colors disabled:opacity-50">
                    {saving ? "Filing..." : "File Dispute"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
