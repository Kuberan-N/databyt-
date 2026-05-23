"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, RefreshCw, CheckCircle, XCircle, Edit3, Mail,
  AlertTriangle, Clock, ChevronDown, ChevronUp, Eye,
  PauseCircle, PlayCircle, CheckSquare, Square, Minus,
  MessageSquare,
} from "lucide-react";
import { useAdminOrg } from "@/components/AdminShell";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const adminSecret = process.env.ADMIN_SECRET ?? "databyt-admin-2024";

interface QueueItem {
  id: string;
  invoice_number: string;
  amount: number;
  days_overdue: number;
  priority_score: number;
  status: string;
  customer: { id: string; name: string; email: string | null; segment: string };
  draftSubject?: string;
  draftBody?: string;
  drafting?: boolean;
  draftError?: string;
  expanded?: boolean;
  editedSubject?: string;
  editedBody?: string;
  selected?: boolean;
}

function getEscalationLevel(daysOverdue: number): 1 | 2 | 3 {
  if (daysOverdue <= 15) return 1;
  if (daysOverdue <= 45) return 2;
  return 3;
}

const LEVEL_STYLE = {
  1: { label: "L1", cls: "bg-[#F0FDF4] text-[#16A34A]" },
  2: { label: "L2", cls: "bg-[#FFFBEB] text-[#D97706]" },
  3: { label: "L3", cls: "bg-[#EEF2FF] text-[#DC2626]" },
};

const SEGMENT_STYLE: Record<string, string> = {
  strategic: "bg-[#EEF2FF] text-[#3730A3] border-[#3730A3]/20",
  at_risk:   "bg-[#EEF2FF] text-[#DC2626] border-[#EF4444]/20",
};

export default function AdminCollections() {
  const { selectedOrg, refreshOrgs } = useAdminOrg();
  const { user } = useAuth();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [bulkDrafting, setBulkDrafting] = useState(false);
  const [pausingOrg, setPausingOrg] = useState(false);
  const [repliedIds, setRepliedIds] = useState<Set<string>>(new Set());

  const isPaused = selectedOrg?.status === "paused";
  const selected = queue.filter(i => i.selected);
  const allSelected = queue.length > 0 && selected.length === queue.length;
  const someSelected = selected.length > 0 && !allSelected;

  const loadQueue = useCallback(async () => {
    if (!selectedOrg) return;
    setLoading(true);
    const [{ data: invoices }, { data: replies }] = await Promise.all([
      db
        .from("invoices")
        .select("id, invoice_number, amount, days_overdue, priority_score, status, customer:customers(id, name, email, segment)")
        .eq("org_id", selectedOrg.id)
        .in("status", ["overdue", "reminded"])
        .order("priority_score", { ascending: false }),
      db
        .from("communications")
        .select("invoice_id")
        .eq("org_id", selectedOrg.id)
        .eq("direction", "inbound"),
    ]);
    setQueue((invoices ?? []).map((inv: QueueItem) => ({ ...inv, expanded: false, selected: false })));
    setRepliedIds(new Set((replies ?? []).map((r: { invoice_id: string }) => r.invoice_id)));
    setLoading(false);
  }, [selectedOrg]);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  async function draftEmail(item: QueueItem) {
    const escalationLevel = getEscalationLevel(item.days_overdue);
    setQueue(q => q.map(i => i.id === item.id ? { ...i, drafting: true, draftError: undefined } : i));
    try {
      const res = await fetch("/api/collections/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: item.id, orgId: selectedOrg?.id, escalationLevel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Draft failed");
      setQueue(q => q.map(i => i.id === item.id ? {
        ...i, drafting: false,
        draftSubject: data.subject, draftBody: data.body,
        editedSubject: data.subject, editedBody: data.body,
        expanded: true,
      } : i));
    } catch (e) {
      setQueue(q => q.map(i => i.id === item.id ? { ...i, drafting: false, draftError: (e as Error).message } : i));
    }
  }

  async function bulkDraft() {
    const targets = selected.filter(i => !i.draftSubject && !i.drafting);
    if (!targets.length) return;
    setBulkDrafting(true);
    await Promise.all(targets.map(item => draftEmail(item)));
    setBulkDrafting(false);
  }

  async function sendEmail(item: QueueItem) {
    if (!item.editedSubject || !item.editedBody || !item.customer.email) return;
    setSendingId(item.id);
    try {
      const res = await fetch("/api/collections/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: item.id,
          orgId: selectedOrg?.id,
          subject: item.editedSubject,
          body: item.editedBody,
          toEmail: item.customer.email,
          toName: item.customer.name,
          approvedBy: user?.email ?? null,
          sentByAi: true,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      setQueue(q => q.filter(i => i.id !== item.id));
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSendingId(null);
    }
  }

  function skipItem(id: string) { setQueue(q => q.filter(i => i.id !== id)); }
  function bulkSkip() {
    const ids = new Set(selected.map(i => i.id));
    setQueue(q => q.filter(i => !ids.has(i.id)));
  }
  function toggleSelect(id: string) { setQueue(q => q.map(i => i.id === id ? { ...i, selected: !i.selected } : i)); }
  function toggleSelectAll() {
    const next = !allSelected;
    setQueue(q => q.map(i => ({ ...i, selected: next })));
  }
  function toggleExpand(id: string) { setQueue(q => q.map(i => i.id === id ? { ...i, expanded: !i.expanded } : i)); }

  async function togglePause() {
    if (!selectedOrg) return;
    setPausingOrg(true);
    try {
      await fetch(`/api/admin/orgs/${selectedOrg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
        body: JSON.stringify({ status: isPaused ? "active" : "paused" }),
      });
      await refreshOrgs();
    } finally {
      setPausingOrg(false);
    }
  }

  if (!selectedOrg) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="w-10 h-10 text-[#94A3B8] mb-4" />
        <p className="text-[#0F172A] font-medium">No client selected</p>
        <p className="text-[#64748B] text-sm mt-1">Select a client from the org switcher in the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Collections Queue</h2>
          <p className="text-[#64748B] text-sm mt-1">
            {selectedOrg.name} — review, edit, and approve outreach emails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={togglePause} disabled={pausingOrg}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all disabled:opacity-50 ${
              isPaused
                ? "border-[#16A34A]/30 bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7]"
                : "border-[#F59E0B]/30 bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7]"
            }`}>
            {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
            {isPaused ? "Resume Collections" : "Pause Client"}
          </button>
          <button onClick={loadQueue}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] text-xs hover:text-[#3730A3] hover:border-[#3730A3]/30 transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Paused banner */}
      {isPaused && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#FFFBEB] border border-[#F59E0B]/20">
          <PauseCircle className="w-4 h-4 text-[#D97706] shrink-0" />
          <p className="text-sm text-[#92400E]">Collections are paused for {selectedOrg.name}. No emails will be drafted or sent until resumed.</p>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#3730A3]/20 border-t-[#3730A3] rounded-full animate-spin" />
        </div>
      ) : queue.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle className="w-12 h-12 text-[#16A34A] mb-4" />
          <p className="text-[#0F172A] font-semibold text-lg">Queue is clear</p>
          <p className="text-[#64748B] text-sm mt-1">No overdue or reminded invoices for {selectedOrg.name}.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {/* Bulk action bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={toggleSelectAll} className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#3730A3] transition-colors">
                {allSelected ? (
                  <CheckSquare className="w-4 h-4 text-[#3730A3]" />
                ) : someSelected ? (
                  <Minus className="w-4 h-4 text-[#3730A3]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {allSelected ? "Deselect all" : "Select all"}
              </button>
              <span className="text-xs text-[#94A3B8]">{queue.length} invoice{queue.length !== 1 ? "s" : ""}</span>
            </div>

            <AnimatePresence>
              {selected.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2">
                  <span className="text-xs text-[#64748B]">{selected.length} selected</span>
                  <button onClick={bulkDraft} disabled={bulkDrafting || isPaused}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF2FF] border border-[#3730A3]/20 text-[#3730A3] text-xs font-medium hover:bg-[#E0E7FF] transition-all disabled:opacity-40">
                    {bulkDrafting ? (
                      <div className="w-3 h-3 border border-[#3730A3]/30 border-t-[#3730A3] rounded-full animate-spin" />
                    ) : (
                      <Edit3 className="w-3 h-3" />
                    )}
                    Draft {selected.filter(i => !i.draftSubject).length} emails
                  </button>
                  <button onClick={bulkSkip}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-[#475569] text-xs font-medium hover:bg-[#E2E8F0] transition-all">
                    <XCircle className="w-3 h-3" />
                    Skip {selected.length}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {queue.map((item) => {
              const level = getEscalationLevel(item.days_overdue);
              const levelStyle = LEVEL_STYLE[level];
              const segmentStyle = SEGMENT_STYLE[item.customer.segment];
              const hasReply = repliedIds.has(item.id);

              return (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`glass rounded-2xl overflow-hidden transition-all ${item.selected ? "ring-1 ring-[#3730A3]/30" : ""}`}>

                  {/* Row header */}
                  <div className="flex items-center gap-3 px-5 py-4">
                    <button onClick={() => toggleSelect(item.id)} className="shrink-0">
                      {item.selected
                        ? <CheckSquare className="w-4 h-4 text-[#3730A3]" />
                        : <Square className="w-4 h-4 text-[#94A3B8] hover:text-[#64748B] transition-colors" />
                      }
                    </button>

                    <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] border border-[#EF4444]/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-[#0F172A]">{item.customer.name}</p>
                        <span className="text-xs text-[#64748B]">{item.invoice_number}</span>

                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${levelStyle.cls}`}>
                          {levelStyle.label}
                        </span>

                        {item.priority_score > 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            item.priority_score >= 70 ? "bg-[#EEF2FF] text-[#DC2626]" :
                            item.priority_score >= 40 ? "bg-[#FFFBEB] text-[#D97706]" :
                            "bg-[#F1F5F9] text-[#64748B]"
                          }`}>
                            P{Math.round(item.priority_score)}
                          </span>
                        )}

                        {segmentStyle && (
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border capitalize ${segmentStyle}`}>
                            {item.customer.segment}
                          </span>
                        )}

                        {hasReply && (
                          <span className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#FFF1F2] border border-[#4F46E5]/20 text-[#4F46E5]">
                            <MessageSquare className="w-2.5 h-2.5" /> Reply
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-[#0F172A] font-medium">{fmt(item.amount)}</span>
                        <span className="flex items-center gap-1 text-xs text-[#DC2626]">
                          <Clock className="w-3 h-3" />{item.days_overdue}d overdue
                        </span>
                        {item.customer.email ? (
                          <span className="flex items-center gap-1 text-xs text-[#64748B]">
                            <Mail className="w-3 h-3" />{item.customer.email}
                          </span>
                        ) : (
                          <span className="text-xs text-[#D97706] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> No email on file
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!item.draftSubject && !item.drafting && !isPaused && (
                        <button onClick={() => draftEmail(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF2FF] border border-[#3730A3]/20 text-[#3730A3] text-xs font-medium hover:bg-[#E0E7FF] transition-all">
                          <Edit3 className="w-3 h-3" /> Draft
                        </button>
                      )}
                      {item.drafting && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#64748B]">
                          <div className="w-3 h-3 border border-[#3730A3]/30 border-t-[#3730A3] rounded-full animate-spin" />
                          Drafting...
                        </div>
                      )}
                      {item.draftSubject && (
                        <button onClick={() => toggleExpand(item.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-[#475569] text-xs font-medium hover:bg-[#E2E8F0] transition-all">
                          <Eye className="w-3 h-3" />
                          {item.expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                      <button onClick={() => skipItem(item.id)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#EEF2FF] transition-all" title="Skip">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {item.draftError && (
                    <div className="px-5 pb-4 text-xs text-[#DC2626]">{item.draftError}</div>
                  )}

                  {/* Draft preview + editor */}
                  <AnimatePresence>
                    {item.expanded && item.draftSubject && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-[#E2E8F0] overflow-hidden">
                        <div className="px-5 py-4 space-y-3">
                          <div>
                            <label className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Subject</label>
                            <input
                              value={item.editedSubject ?? item.draftSubject}
                              onChange={e => setQueue(q => q.map(i => i.id === item.id ? { ...i, editedSubject: e.target.value } : i))}
                              className="mt-1.5 w-full bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm text-[#0F172A] focus:border-[#3730A3] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Body</label>
                            <textarea
                              value={item.editedBody ?? item.draftBody}
                              onChange={e => setQueue(q => q.map(i => i.id === item.id ? { ...i, editedBody: e.target.value } : i))}
                              rows={8}
                              className="mt-1.5 w-full bg-white border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm text-[#475569] leading-relaxed focus:border-[#3730A3] focus:outline-none resize-y"
                            />
                          </div>
                          <div className="flex items-center gap-3 pt-1">
                            <button
                              onClick={() => sendEmail(item)}
                              disabled={sendingId === item.id || isPaused || !item.customer.email}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3730A3] text-white text-sm font-semibold hover:bg-[#152356] transition-all disabled:opacity-50">
                              {sendingId === item.id ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              Approve & Send
                            </button>
                            <button onClick={() => draftEmail(item)}
                              className="text-xs text-[#64748B] hover:text-[#475569] transition-colors">
                              Regenerate draft
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
