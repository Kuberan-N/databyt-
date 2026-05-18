"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Zap, Clock, CheckCircle, XCircle, Edit3,
  ChevronDown, ChevronUp, RefreshCw, AlertTriangle,
  Mail, DollarSign, Calendar,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchInvoicesWithCustomers, InvoiceRow } from "@/lib/ar-data";
import type { DraftEmailResponse } from "@/app/api/collections/draft-email/route";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

interface QueueItem {
  invoice: InvoiceRow;
  draft: DraftEmailResponse | null;
  drafting: boolean;
  sending: boolean;
  sent: boolean;
  rejected: boolean;
  editedSubject: string;
  editedBody: string;
  error: string | null;
  escalationLevel: 1 | 2 | 3;
}

function getEscalationLevel(daysOverdue: number): 1 | 2 | 3 {
  if (daysOverdue > 45) return 3;
  if (daysOverdue > 15) return 2;
  return 1;
}

const LEVEL_META = {
  1: { label: "Friendly Reminder", color: "text-warning-400",  bg: "bg-warning-400/10",  border: "border-warning-400/20" },
  2: { label: "Firm Notice",       color: "text-orange-400",   bg: "bg-orange-400/10",   border: "border-orange-400/20" },
  3: { label: "Final Warning",     color: "text-danger-400",   bg: "bg-danger-400/10",   border: "border-danger-400/20" },
};

export default function CollectionsPage() {
  const { organization } = useAuth();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [draftingAll, setDraftingAll] = useState(false);

  const load = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    const invoices = await fetchInvoicesWithCustomers(organization.id, ["open", "reminded", "overdue"]);
    const overdue = invoices.filter(i => i.days_overdue > 0).slice(0, 20);
    setQueue(prev => {
      const prevMap = new Map(prev.map(q => [q.invoice.id, q]));
      return overdue.map(inv => {
        const existing = prevMap.get(inv.id);
        if (existing) return { ...existing, invoice: inv };
        return {
          invoice: inv,
          draft: null,
          drafting: false,
          sending: false,
          sent: false,
          rejected: false,
          editedSubject: "",
          editedBody: "",
          error: null,
          escalationLevel: getEscalationLevel(inv.days_overdue),
        };
      });
    });
    setLoading(false);
  }, [organization]);

  useEffect(() => { load(); }, [load]);

  function updateItem(id: string, patch: Partial<QueueItem>) {
    setQueue(q => q.map(item => item.invoice.id === id ? { ...item, ...patch } : item));
  }

  async function draftOne(item: QueueItem) {
    if (!organization) return;
    updateItem(item.invoice.id, { drafting: true, error: null });
    try {
      const res = await fetch("/api/collections/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: item.invoice.id, orgId: organization.id, escalationLevel: item.escalationLevel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Draft failed");
      updateItem(item.invoice.id, { draft: data, drafting: false, editedSubject: data.subject, editedBody: data.body });
      setExpanded(prev => new Set([...prev, item.invoice.id]));
    } catch (e) {
      updateItem(item.invoice.id, { drafting: false, error: (e as Error).message });
    }
  }

  async function draftAll() {
    const undrafted = queue.filter(i => !i.draft && !i.drafting && !i.sent && !i.rejected);
    if (undrafted.length === 0) return;
    setDraftingAll(true);
    for (const item of undrafted) await draftOne(item);
    setDraftingAll(false);
  }

  async function sendEmail(item: QueueItem) {
    if (!organization || !item.draft) return;
    updateItem(item.invoice.id, { sending: true, error: null });
    try {
      const toEmail = item.invoice.customer_email;
      if (!toEmail) throw new Error("No email address for this customer");
      const res = await fetch("/api/collections/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: item.invoice.id,
          orgId: organization.id,
          subject: item.editedSubject,
          body: item.editedBody,
          toEmail,
          toName: item.invoice.customer_name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Send failed");
      updateItem(item.invoice.id, { sending: false, sent: true });
    } catch (e) {
      updateItem(item.invoice.id, { sending: false, error: (e as Error).message });
    }
  }

  function reject(id: string) {
    updateItem(id, { rejected: true, draft: null });
    setExpanded(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  function toggleExpand(id: string) {
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const pending = queue.filter(i => !i.sent && !i.rejected);
  const sentItems = queue.filter(i => i.sent);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Collections</h2>
          <p className="text-surface-400 text-sm mt-1">AI-drafted dunning emails — review and approve before anything sends.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={draftAll} disabled={draftingAll || pending.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-semibold disabled:opacity-50 hover:from-primary-500 hover:to-accent-500 transition-all">
            <Zap className={`w-4 h-4 ${draftingAll ? "animate-pulse" : ""}`} />
            {draftingAll ? "Drafting..." : "Draft All with AI"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "In Queue", value: pending.length, icon: Clock, color: "from-warning-400 to-warning-500" },
          { label: "Drafts Ready", value: pending.filter(i => i.draft).length, icon: Edit3, color: "from-primary-500 to-primary-600" },
          { label: "Sent This Session", value: sentItems.length, icon: CheckCircle, color: "from-success-400 to-success-500" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-surface-500 text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      )}

      {!loading && pending.length === 0 && sentItems.length === 0 && (
        <div className="glass rounded-2xl flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-success-500/10 border border-success-500/20 flex items-center justify-center mb-5">
            <CheckCircle className="w-8 h-8 text-success-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No overdue invoices</h3>
          <p className="text-surface-400 text-sm max-w-xs">All invoices are current. Import AR data from the AR Aging page to start collecting.</p>
        </div>
      )}

      {/* Escalation legend */}
      {!loading && pending.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {([1, 2, 3] as const).map(level => {
            const m = LEVEL_META[level];
            const count = pending.filter(i => i.escalationLevel === level).length;
            return count > 0 ? (
              <span key={level} className={`text-xs px-3 py-1.5 rounded-full font-medium border ${m.color} ${m.bg} ${m.border}`}>
                Level {level} — {m.label} · {count}
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Queue */}
      <div className="space-y-3">
        <AnimatePresence>
          {pending.map((item) => {
            const meta = LEVEL_META[item.escalationLevel];
            const isExpanded = expanded.has(item.invoice.id);

            return (
              <motion.div key={item.invoice.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-white">{item.invoice.customer_name ?? "Unknown"}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${meta.color} ${meta.bg} ${meta.border}`}>
                        Level {item.escalationLevel} — {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="text-xs text-surface-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />{item.invoice.customer_email ?? "No email"}
                      </span>
                      <span className="text-xs text-surface-500 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />{fmt(item.invoice.amount)} · {item.invoice.invoice_number}
                      </span>
                      <span className={`text-xs font-medium flex items-center gap-1 ${item.invoice.days_overdue > 60 ? "text-danger-400" : "text-warning-400"}`}>
                        <Calendar className="w-3 h-3" />{item.invoice.days_overdue}d overdue
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.error && (
                      <span className="text-xs text-danger-400 flex items-center gap-1 max-w-[160px] truncate">
                        <AlertTriangle className="w-3 h-3 shrink-0" />{item.error}
                      </span>
                    )}

                    {!item.draft && !item.drafting && (
                      <button onClick={() => draftOne(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium hover:bg-primary-500/15 transition-all">
                        <Zap className="w-3.5 h-3.5" /> Draft
                      </button>
                    )}
                    {item.drafting && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-surface-400">
                        <div className="w-3.5 h-3.5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /> Drafting...
                      </span>
                    )}
                    {item.draft && (
                      <>
                        <button onClick={() => reject(item.invoice.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-700 text-surface-400 text-xs hover:border-danger-500/40 hover:text-danger-400 transition-all">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button onClick={() => sendEmail(item)} disabled={item.sending}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-success-600 to-success-500 text-white text-xs font-semibold disabled:opacity-50 hover:from-success-500 hover:to-success-400 transition-all">
                          {item.sending
                            ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <Send className="w-3.5 h-3.5" />}
                          {item.sending ? "Sending..." : "Approve & Send"}
                        </button>
                        <button onClick={() => toggleExpand(item.invoice.id)} className="text-surface-500 hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && item.draft && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-surface-800">
                      <div className="p-5 space-y-3">
                        <div>
                          <label className="text-xs text-surface-500 font-medium block mb-1.5">Subject</label>
                          <input value={item.editedSubject} onChange={e => updateItem(item.invoice.id, { editedSubject: e.target.value })}
                            className="w-full bg-surface-800/60 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500 outline-none" />
                        </div>
                        <div>
                          <label className="text-xs text-surface-500 font-medium block mb-1.5">Email Body</label>
                          <textarea value={item.editedBody} onChange={e => updateItem(item.invoice.id, { editedBody: e.target.value })}
                            rows={8}
                            className="w-full bg-surface-800/60 border border-surface-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary-500 outline-none resize-none font-mono leading-relaxed" />
                        </div>
                        <p className="text-xs text-surface-600">Edit above before approving. Changes are not persisted until sent.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Sent log */}
      {sentItems.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success-400" />
            <h3 className="text-sm font-semibold text-white">Sent This Session</h3>
          </div>
          {sentItems.map(item => (
            <div key={item.invoice.id} className="flex items-center gap-4 px-5 py-3 border-t border-surface-800/50">
              <CheckCircle className="w-4 h-4 text-success-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-300 font-medium">{item.invoice.customer_name}</p>
                <p className="text-xs text-surface-500 truncate">{item.editedSubject || item.draft?.subject}</p>
              </div>
              <span className="text-xs text-success-400 font-medium whitespace-nowrap">Sent</span>
            </div>
          ))}
        </div>
      )}

      {/* How it works info box */}
      {!loading && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">How AI Collections Works</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {([
              { level: 1, title: "Friendly Reminder (1–15d)", desc: "Warm, brief message. Assumes the customer forgot. Sent on first overdue." },
              { level: 2, title: "Firm Notice (16–45d)", desc: "Professional follow-up with deadline. Mentions account status impact." },
              { level: 3, title: "Final Warning (46d+)", desc: "Urgent notice. Last step before manual escalation or collections agency." },
            ] as const).map(s => {
              const m = LEVEL_META[s.level];
              return (
                <div key={s.level} className={`rounded-xl p-4 border ${m.bg} ${m.border}`}>
                  <p className={`text-xs font-semibold mb-2 ${m.color}`}>Level {s.level} — {s.title}</p>
                  <p className="text-xs text-surface-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
