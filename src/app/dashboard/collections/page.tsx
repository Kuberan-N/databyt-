"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Clock, Mail, TrendingUp, RefreshCw, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

type Tab = "pipeline" | "activity";

interface PipelineCustomer {
  id: string;
  name: string;
  email: string | null;
  segment: string;
  totalOwed: number;
  overdueInvoices: number;
  maxDaysOverdue: number;
  stage: "not_contacted" | "l1_sent" | "l2_sent" | "l3_sent" | "disputed" | "paid";
  lastEmailSent: string | null;
  emailCount: number;
}

interface RecentComm {
  subject: string;
  sent_at: string;
  status: string;
  customer_name?: string;
}

const STAGE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; order: number }> = {
  not_contacted: { label: "Not Contacted", color: "#F59E0B", bg: "#FFF8F0", border: "#F59E0B/30", order: 0 },
  l1_sent:       { label: "L1 Sent",       color: "#4F46E5", bg: "#EEF2FF", border: "#4F46E5/30", order: 1 },
  l2_sent:       { label: "L2 Sent",       color: "#EA580C", bg: "#FFF7ED", border: "#EA580C/30", order: 2 },
  l3_sent:       { label: "L3 Final",      color: "#DC2626", bg: "#FEF2F2", border: "#DC2626/30", order: 3 },
  disputed:      { label: "Disputed",      color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED/30", order: 4 },
  paid:          { label: "Paid",          color: "#16A34A", bg: "#F0FDF4", border: "#16A34A/30", order: 5 },
};

export default function CollectionsPage() {
  const { organization } = useAuth();
  const [tab, setTab] = useState<Tab>("pipeline");
  const [pipeline, setPipeline] = useState<PipelineCustomer[]>([]);
  const [recentComms, setRecentComms] = useState<RecentComm[]>([]);
  const [stats, setStats] = useState({ emailsSentThisMonth: 0, overdueAmount: 0, remindedCount: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    const orgId = organization.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Fetch all active invoices with customer info
    const [invoicesRes, commsRes, monthCommsRes] = await Promise.all([
      db.from("invoices")
        .select("id, customer_id, amount, days_overdue, status, customers(id, name, email, segment)")
        .eq("org_id", orgId)
        .in("status", ["open", "overdue", "reminded", "disputed", "paid"]),
      db.from("communications")
        .select("customer_id, sent_at, subject, status, customers(name)")
        .eq("org_id", orgId).eq("type", "email").eq("direction", "outbound")
        .order("sent_at", { ascending: false }).limit(50),
      db.from("communications")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId).gte("sent_at", startOfMonth),
    ]);

    const invoices = invoicesRes.data ?? [];
    const comms = commsRes.data ?? [];

    // Track per-customer invoice state correctly
    const custMeta = new Map<string, { hasOutstanding: boolean; hasDisputed: boolean }>();
    for (const inv of invoices) {
      const c = inv.customers;
      if (!c) continue;
      if (!custMeta.has(c.id)) custMeta.set(c.id, { hasOutstanding: false, hasDisputed: false });
      const meta = custMeta.get(c.id)!;
      if (inv.status === "disputed") meta.hasDisputed = true;
      if (["open", "overdue", "reminded"].includes(inv.status)) meta.hasOutstanding = true;
    }

    // Build pipeline: group invoices by customer, determine stage
    const custMap = new Map<string, PipelineCustomer>();
    for (const inv of invoices) {
      const c = inv.customers;
      if (!c) continue;
      if (!custMap.has(c.id)) {
        custMap.set(c.id, {
          id: c.id, name: c.name, email: c.email, segment: c.segment ?? "standard",
          totalOwed: 0, overdueInvoices: 0, maxDaysOverdue: 0,
          stage: "not_contacted", lastEmailSent: null, emailCount: 0,
        });
      }
      const entry = custMap.get(c.id)!;
      // Only count outstanding invoices toward totalOwed
      if (["open", "overdue", "reminded"].includes(inv.status)) {
        entry.totalOwed += inv.amount;
        if (inv.days_overdue > 0) entry.overdueInvoices++;
        entry.maxDaysOverdue = Math.max(entry.maxDaysOverdue, inv.days_overdue);
      }
    }

    // Set initial stage based on invoice state
    for (const [cid, entry] of custMap) {
      const meta = custMeta.get(cid);
      if (meta?.hasDisputed) { entry.stage = "disputed"; continue; }
      // Only "paid" if customer has NO outstanding invoices at all
      if (!meta?.hasOutstanding) { entry.stage = "paid"; }
    }

    // Layer in email history to refine stage for non-disputed, non-paid customers
    const emailCountByCustomer = new Map<string, { count: number; lastSent: string }>();
    for (const comm of comms) {
      const cid = comm.customer_id;
      if (!emailCountByCustomer.has(cid)) emailCountByCustomer.set(cid, { count: 0, lastSent: "" });
      const e = emailCountByCustomer.get(cid)!;
      e.count++;
      if (!e.lastSent || comm.sent_at > e.lastSent) e.lastSent = comm.sent_at;
    }

    for (const [cid, entry] of custMap) {
      if (entry.stage === "disputed" || entry.stage === "paid") continue;
      const emailData = emailCountByCustomer.get(cid);
      entry.emailCount = emailData?.count ?? 0;
      entry.lastEmailSent = emailData?.lastSent ?? null;
      if (!emailData) {
        entry.stage = entry.overdueInvoices > 0 ? "not_contacted" : "paid";
      } else if (entry.maxDaysOverdue >= 30) {
        entry.stage = "l3_sent";
      } else if (entry.maxDaysOverdue >= 10) {
        entry.stage = "l2_sent";
      } else {
        entry.stage = "l1_sent";
      }
    }

    const pipelineList = Array.from(custMap.values())
      .sort((a, b) => b.totalOwed - a.totalOwed);

    const overdueAmt = invoices
      .filter((i: { status: string }) => ["overdue", "reminded"].includes(i.status))
      .reduce((s: number, i: { amount: number }) => s + i.amount, 0);

    const remindedCount = invoices.filter((i: { status: string }) => i.status === "reminded").length;

    const recentList: RecentComm[] = comms.slice(0, 20).map((c: {
      subject: string; sent_at: string; status: string; customers?: { name: string };
    }) => ({
      subject: c.subject,
      sent_at: c.sent_at,
      status: c.status,
      customer_name: c.customers?.name,
    }));

    setPipeline(pipelineList);
    setRecentComms(recentList);
    setStats({ emailsSentThisMonth: monthCommsRes.count ?? 0, overdueAmount: overdueAmt, remindedCount });
    setLoading(false);
  }, [organization]);

  useEffect(() => { load(); }, [load]);

  const statusStyle: Record<string, string> = {
    sent:    "bg-[#F1F5F9] text-[#111111]",
    opened:  "bg-[#F0FDF4] text-[#16A34A]",
    clicked: "bg-[#F1F5F9] text-[#000000]",
    bounced: "bg-[#FEF2F2] text-[#DC2626]",
    failed:  "bg-[#FEF2F2] text-[#DC2626]",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Collections</h2>
          <p className="text-[#222222] text-sm mt-1">Customer pipeline and email activity</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#222222] hover:text-[#000000] transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Active banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#15803D]">AI Collections Agent Active</p>
          <p className="text-xs text-[#16A34A]/70 mt-0.5">Dunning emails run automatically Mon–Fri at 8am. New customers appear as &quot;Not Contacted&quot; until the next scheduled run.</p>
        </div>
      </motion.div>

      {/* Mark as Paid tip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex items-center gap-4 p-4 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4]">
        <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#15803D]">Got a payment? Mark it as paid in AR Aging</p>
          <p className="text-xs text-[#16A34A]/80 mt-0.5">
            Once you confirm a payment in your bank, head to AR Aging and click <strong>Mark Paid</strong> on that invoice — takes 5 seconds and keeps your collections accurate.
          </p>
        </div>
        <a href="/dashboard/ar-aging"
          className="shrink-0 text-xs font-semibold px-3 py-1.5 bg-[#16A34A] text-white rounded-lg hover:bg-[#15803D] transition-colors">
          Go to AR Aging
        </a>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Emails Sent This Month", value: stats.emailsSentThisMonth.toString(), icon: Mail, bg: "#111111" },
          { label: "In Reminder Stage", value: stats.remindedCount.toString(), icon: Clock, bg: "#111111" },
          { label: "Overdue Amount", value: fmt(stats.overdueAmount), icon: TrendingUp, bg: "#DC2626" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{s.value}</p>
            <p className="text-[#222222] text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E2E8F0]">
        {([["pipeline", "Customer Pipeline"], ["activity", "Email Activity"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === key ? "border-[#111111] text-[#0F172A]" : "border-transparent text-[#64748B] hover:text-[#222222]"
            }`}>{label}
          </button>
        ))}
      </div>

      {/* Pipeline tab */}
      {tab === "pipeline" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#FAFAFA]">
            <div className="flex flex-wrap gap-2">
              {Object.entries(STAGE_CONFIG)
                .sort(([,a],[,b]) => a.order - b.order)
                .map(([key, cfg]) => {
                  const count = pipeline.filter(c => c.stage === key).length;
                  return (
                    <span key={key} className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-medium"
                      style={{ color: cfg.color, borderColor: cfg.color + "40", background: cfg.bg }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                      {cfg.label} ({count})
                    </span>
                  );
                })}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#000]/20 border-t-[#000] rounded-full animate-spin" />
            </div>
          ) : pipeline.length === 0 ? (
            <div className="text-center py-12 text-[#555] text-sm">No customer data yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    {["Customer", "Stage", "Total Owed", "Overdue Invoices", "Max Days Late", "Last Email", "Emails Sent"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[#555] font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pipeline.map(c => {
                    const cfg = STAGE_CONFIG[c.stage];
                    return (
                      <tr key={c.id} className="border-t border-[#F1F5F9] hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-[#0F172A]">{c.name}</p>
                            <p className="text-[#888] text-[11px]">{c.email ?? "—"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-medium w-fit"
                            style={{ color: cfg.color, borderColor: cfg.color + "40", background: cfg.bg }}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.color }} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#0F172A]">
                          {c.totalOwed > 0 ? fmt(c.totalOwed) : "—"}
                        </td>
                        <td className="px-4 py-3 text-[#444]">{c.overdueInvoices > 0 ? c.overdueInvoices : "—"}</td>
                        <td className="px-4 py-3">
                          {c.maxDaysOverdue > 0 ? (
                            <span className={`font-semibold ${c.maxDaysOverdue > 60 ? "text-[#DC2626]" : c.maxDaysOverdue > 30 ? "text-[#EA580C]" : "text-[#F59E0B]"}`}>
                              {c.maxDaysOverdue}d
                            </span>
                          ) : <span className="text-[#16A34A]">Current</span>}
                        </td>
                        <td className="px-4 py-3 text-[#555]">
                          {c.lastEmailSent
                            ? new Date(c.lastEmailSent).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : <span className="text-[#F59E0B]">Never</span>}
                        </td>
                        <td className="px-4 py-3">
                          {c.emailCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[#4F46E5] font-semibold">
                              <Mail className="w-3 h-3" />{c.emailCount}
                            </span>
                          ) : <span className="text-[#CCC]">0</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Activity tab */}
      {tab === "activity" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
            <Send className="w-4 h-4 text-[#000]" />
            <h3 className="text-sm font-semibold text-[#0F172A]">Recent Outreach</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 border-2 border-[#000]/20 border-t-[#000] rounded-full animate-spin" />
            </div>
          ) : !recentComms.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-8 h-8 text-[#444] mb-3" />
              <p className="text-[#333] text-sm">No emails sent yet.</p>
              <p className="text-[#555] text-xs mt-1">AI will begin outreach on overdue invoices automatically.</p>
            </div>
          ) : (
            <div>
              {recentComms.map((c, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-t border-[#F1F5F9] hover:bg-[#FAFAFA] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] border border-[#000]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-[#000]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0F172A] truncate">{c.subject ?? "Collections email"}</p>
                    <p className="text-xs text-[#555] mt-0.5">
                      {c.customer_name && <span className="font-medium text-[#222]">{c.customer_name} · </span>}
                      {new Date(c.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusStyle[c.status] ?? "bg-[#F1F5F9] text-[#222]"}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Stage legend */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Collection Stage Guide</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { stage: "not_contacted", desc: "Overdue but no email sent yet. Will be contacted in next automated run." },
            { stage: "l1_sent",       desc: "Polite first reminder sent. 1–9 days overdue. Friendly tone." },
            { stage: "l2_sent",       desc: "Second reminder sent. 10–29 days overdue. Firm and direct." },
            { stage: "l3_sent",       desc: "Final notice sent. 30+ days overdue. Serious escalation tone." },
            { stage: "disputed",      desc: "Customer raised a dispute. Collections paused until resolved." },
            { stage: "paid",          desc: "All invoices settled. Customer is up to date." },
          ].map(({ stage, desc }) => {
            const cfg = STAGE_CONFIG[stage];
            return (
              <div key={stage} className="flex gap-3 items-start">
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium shrink-0 mt-0.5"
                  style={{ color: cfg.color, borderColor: cfg.color + "40", background: cfg.bg }}>
                  {cfg.label}
                </span>
                <p className="text-xs text-[#555] leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
