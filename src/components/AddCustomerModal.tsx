"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, CreditCard, Save } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const segments = ["strategic", "standard", "at_risk"] as const;

export default function AddCustomerModal({ open, onClose, onSaved }: Props) {
  const { organization } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [segment, setSegment] = useState<typeof segments[number]>("standard");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!organization) return;
    setSaving(true);
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase as any).from("customers").insert({
      org_id: organization.id,
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      payment_terms: parseInt(paymentTerms) || 30,
      segment,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setName(""); setEmail(""); setPhone(""); setPaymentTerms("30"); setSegment("standard");
    onSaved();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white">Add Customer</h3>
                <button onClick={onClose} className="text-surface-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              {error && <div className="text-danger-400 text-sm mb-4 px-3 py-2 bg-danger-500/10 rounded-xl">{error}</div>}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-surface-300 text-sm font-medium mb-1.5 block">Company Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input value={name} onChange={e => setName(e.target.value)} required placeholder="Acme Corp"
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-surface-500 focus:border-primary-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-surface-300 text-sm font-medium mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="billing@acme.com"
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-surface-500 focus:border-primary-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-surface-300 text-sm font-medium mb-1.5 block">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000"
                        className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-surface-500 focus:border-primary-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-surface-300 text-sm font-medium mb-1.5 block">Payment Terms</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                      <select value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}
                        className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-primary-500 outline-none appearance-none">
                        {["7","14","30","45","60","90"].map(d => <option key={d} value={d}>Net {d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-surface-300 text-sm font-medium mb-1.5 block">Segment</label>
                  <div className="flex gap-2">
                    {segments.map(s => (
                      <button key={s} type="button" onClick={() => setSegment(s)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${segment === s
                          ? "bg-primary-500/15 border-primary-500/40 text-primary-400"
                          : "border-surface-700 text-surface-400 hover:border-surface-600"}`}>
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-surface-700 text-surface-400 text-sm hover:border-surface-600">Cancel</button>
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
