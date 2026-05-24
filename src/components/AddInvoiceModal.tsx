"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Customer } from "@/lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  preselectedCustomerId?: string;
}

export default function AddInvoiceModal({ open, onClose, onSaved, preselectedCustomerId }: Props) {
  const { organization } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState(preselectedCustomerId ?? "");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  useEffect(() => {
    if (!organization || !open) return;
    db.from("customers").select("id,name").eq("org_id", organization.id).order("name")
      .then(({ data }: { data: Customer[] }) => { if (data) setCustomers(data); });
  }, [organization, open]);

  useEffect(() => { if (preselectedCustomerId) setCustomerId(preselectedCustomerId); }, [preselectedCustomerId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!organization || !customerId) return;
    setSaving(true); setError(null);
    const today = new Date(); today.setHours(0,0,0,0);
    const due = new Date(dueDate);
    const daysOverdue = Math.max(0, Math.floor((today.getTime() - due.getTime()) / 86400000));
    const { error: err } = await db.from("invoices").insert({
      org_id: organization.id,
      customer_id: customerId,
      invoice_number: invoiceNumber.trim(),
      amount: parseFloat(amount),
      currency,
      issue_date: issueDate,
      due_date: dueDate,
      status: daysOverdue > 0 ? "overdue" : "open",
      days_overdue: daysOverdue,
      priority_score: 0,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setInvoiceNumber(""); setAmount(""); setDueDate("");
    onSaved(); onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white">Add Invoice</h3>
                <button onClick={onClose} className="text-[#333333] hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              {error && <div className="text-danger-400 text-sm mb-4 px-3 py-2 bg-danger-500/10 rounded-xl">{error}</div>}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-[#444444] text-sm font-medium mb-1.5 block">Customer *</label>
                  <div className="relative">
                    <select value={customerId} onChange={e => setCustomerId(e.target.value)} required
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-primary-500 outline-none appearance-none">
                      <option value="">Select customer...</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333] pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#444444] text-sm font-medium mb-1.5 block">Invoice # *</label>
                    <input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} required placeholder="INV-001"
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-surface-500 focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[#444444] text-sm font-medium mb-1.5 block">Currency</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)}
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-primary-500 outline-none appearance-none">
                      {["USD","EUR","GBP","CAD","AUD"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[#444444] text-sm font-medium mb-1.5 block">Amount *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333333] text-sm">$</span>
                    <input value={amount} onChange={e => setAmount(e.target.value)} required type="number" min="0" step="0.01" placeholder="0.00"
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-7 pr-4 py-2.5 text-white text-sm placeholder-surface-500 focus:border-primary-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#444444] text-sm font-medium mb-1.5 block">Issue Date *</label>
                    <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} required
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[#444444] text-sm font-medium mb-1.5 block">Due Date *</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-primary-500 outline-none" />
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-surface-700 text-[#333333] text-sm">Cancel</button>
                  <button type="submit" disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold disabled:opacity-50">
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" />Save</>}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
