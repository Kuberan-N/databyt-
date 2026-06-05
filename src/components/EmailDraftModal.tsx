"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RefreshCw, AlertCircle, CheckCircle, ChevronRight } from "lucide-react";

interface Props {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  daysOverdue: number;
  orgId: string;
  onClose: () => void;
  onSent: () => void;
}

function autoLevel(days: number): 1 | 2 | 3 {
  if (days > 60) return 3;
  if (days > 30) return 2;
  return 1;
}

const LEVEL_LABELS: Record<number, { label: string; desc: string; color: string }> = {
  1: { label: "L1 — Friendly",    desc: "Polite reminder",          color: "text-[#16A34A]" },
  2: { label: "L2 — Direct",      desc: "Firm with deadline",       color: "text-[#000000]" },
  3: { label: "L3 — Final notice", desc: "Pre-escalation warning",  color: "text-[#DC2626]" },
};

export default function EmailDraftModal({ invoiceId, invoiceNumber, customerName, customerEmail, daysOverdue, orgId, onClose, onSent }: Props) {
  const [level, setLevel]       = useState<1 | 2 | 3>(autoLevel(daysOverdue));
  const [drafting, setDrafting] = useState(false);
  const [sending, setSending]   = useState(false);
  const [subject, setSubject]   = useState("");
  const [body, setBody]         = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [sent, setSent]         = useState(false);

  useEffect(() => { draft(level); }, [level]);

  async function draft(l: 1 | 2 | 3) {
    setDrafting(true);
    setError(null);
    try {
      const res = await fetch("/api/collections/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, orgId, escalationLevel: l }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to draft email");
      setSubject(json.subject ?? "");
      setBody(json.body ?? "");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDrafting(false);
    }
  }

  async function send() {
    if (!subject || !body || !customerEmail) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/collections/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, orgId, subject, body, toEmail: customerEmail, toName: customerName, sentByAi: false, approvedBy: "user" }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Failed to send");
      }
      setSent(true);
      setTimeout(() => { onSent(); onClose(); }, 1800);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A]">Draft Collections Email</h3>
              <p className="text-xs text-[#475569] mt-0.5">
                {customerName} · Invoice {invoiceNumber} · {daysOverdue}d overdue
              </p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#F1F5F9] transition-colors">
              <X className="w-4 h-4 text-[#475569]" />
            </button>
          </div>

          {/* Level selector */}
          <div className="px-5 py-3 border-b border-[#F1F5F9] flex gap-2">
            {([1, 2, 3] as const).map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  level === l ? "bg-[#F1F5F9] border-[#000000]/20 text-[#000000]" : "border-[#E2E8F0] text-[#475569] hover:text-[#000000]"
                }`}>
                <span className={level === l ? LEVEL_LABELS[l].color : ""}>{LEVEL_LABELS[l].label}</span>
              </button>
            ))}
            <button onClick={() => draft(level)} disabled={drafting}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[#475569] hover:text-[#000000] transition-colors disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${drafting ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3 max-h-[360px] overflow-y-auto">
            {drafting ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-6 h-6 border-2 border-[#000000]/20 border-t-[#000000] rounded-full animate-spin" />
                <p className="text-xs text-[#475569]">AI is drafting your email…</p>
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Draft failed</p>
                  <p className="mt-0.5 text-[#DC2626]/80">{error}</p>
                  {error.includes("quota") || error.includes("429") || error.includes("rate") ? (
                    <p className="mt-1 text-[#DC2626]/70">Enable Gemini billing at aistudio.google.com to remove rate limits.</p>
                  ) : null}
                </div>
              </div>
            ) : sent ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#16A34A]">
                <CheckCircle className="w-8 h-8" />
                <p className="text-sm font-medium">Email sent to {customerEmail}</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider">To</label>
                  <p className="text-xs text-[#0F172A] mt-0.5">{customerEmail}</p>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider">Subject</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full mt-1 text-xs border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#0F172A] outline-none focus:border-[#000000] transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider">Body</label>
                  <textarea value={body} onChange={e => setBody(e.target.value)} rows={10}
                    className="w-full mt-1 text-xs border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#0F172A] outline-none focus:border-[#000000] transition-colors resize-none font-mono leading-relaxed" />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!sent && !drafting && !error && (
            <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
              <p className="text-[10px] text-[#64748B]">{LEVEL_LABELS[level].desc} · Sent via Resend</p>
              <button onClick={send} disabled={sending || !subject || !body || !customerEmail}
                className="flex items-center gap-2 px-4 py-2 bg-[#000000] text-white rounded-lg text-xs font-semibold hover:bg-[#111111] transition-colors disabled:opacity-50">
                {sending ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Sending…</> : <><Send className="w-3.5 h-3.5" />Send Email</>}
              </button>
            </div>
          )}
          {!sent && !drafting && error && (
            <div className="px-5 py-4 border-t border-[#E2E8F0] flex justify-end">
              <button onClick={() => draft(level)}
                className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] text-[#222222] rounded-lg text-xs font-medium hover:border-[#000000]/30 hover:text-[#000000] transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Try again
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
