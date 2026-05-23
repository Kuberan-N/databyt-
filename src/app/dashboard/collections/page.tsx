"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Clock, Mail, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

interface CollectionStats {
  emailsSentThisMonth: number;
  overdueCount: number;
  overdueAmount: number;
  remindedCount: number;
  recentComms: Array<{ subject: string; sent_at: string; status: string }>;
}

export default function CollectionsPage() {
  const { organization } = useAuth();
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!organization) return;
    setLoading(true);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [commsRes, overdueRes, remindedRes, recentRes] = await Promise.all([
      db.from("communications").select("id", { count: "exact", head: true })
        .eq("org_id", organization.id).gte("sent_at", startOfMonth),
      db.from("invoices").select("amount").eq("org_id", organization.id).in("status", ["overdue"]),
      db.from("invoices").select("id", { count: "exact", head: true })
        .eq("org_id", organization.id).eq("status", "reminded"),
      db.from("communications").select("subject, sent_at, status")
        .eq("org_id", organization.id).order("sent_at", { ascending: false }).limit(8),
    ]);

    const overdueInvoices = overdueRes.data ?? [];
    setStats({
      emailsSentThisMonth: commsRes.count ?? 0,
      overdueCount: overdueInvoices.length,
      overdueAmount: overdueInvoices.reduce((s: number, i: { amount: number }) => s + i.amount, 0),
      remindedCount: remindedRes.count ?? 0,
      recentComms: recentRes.data ?? [],
    });
    setLoading(false);
  }, [organization]);

  useEffect(() => { load(); }, [load]);

  const statusStyle: Record<string, string> = {
    sent:    "bg-[#F1F5F9] text-[#475569]",
    opened:  "bg-[#F0FDF4] text-[#16A34A]",
    clicked: "bg-[#ECFDF5] text-[#059669]",
    bounced: "bg-[#EEF2FF] text-[#DC2626]",
    failed:  "bg-[#EEF2FF] text-[#DC2626]",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Collections</h2>
        <p className="text-[#64748B] text-sm mt-1">
          Your DataByt AI agent manages collections on your behalf. Here&apos;s the live status.
        </p>
      </div>

      {/* Active status banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4]">
        <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#16A34A] animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#15803D]">AI Collections Agent Active</p>
          <p className="text-xs text-[#16A34A]/70 mt-0.5">
            Monitoring all overdue invoices. Personalized dunning emails sent automatically.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Emails Sent This Month", value: loading ? "—" : (stats?.emailsSentThisMonth.toString() ?? "0"), icon: Mail, color: "#4F46E5" },
          { label: "In Reminder Stage", value: loading ? "—" : (stats?.remindedCount.toString() ?? "0"), icon: Clock, color: "#D97706" },
          { label: "Overdue Amount", value: loading ? "—" : fmt(stats?.overdueAmount ?? 0), icon: TrendingUp, color: "#DC2626" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.color}18` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{s.value}</p>
            <p className="text-[#64748B] text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent communications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2">
          <Send className="w-4 h-4 text-[#4F46E5]" />
          <h3 className="text-sm font-semibold text-[#0F172A]">Recent Outreach</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin" />
          </div>
        ) : !stats?.recentComms.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="w-8 h-8 text-[#CBD5E1] mb-3" />
            <p className="text-[#94A3B8] text-sm">No emails sent yet.</p>
            <p className="text-[#CBD5E1] text-xs mt-1">AI will begin outreach on overdue invoices shortly.</p>
          </div>
        ) : (
          <div>
            {stats.recentComms.map((c, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-t border-[#F1F5F9] hover:bg-[#FAFAFA] transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] border border-[#4F46E5]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-[#4F46E5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0F172A] truncate">{c.subject ?? "Collections email"}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {new Date(c.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusStyle[c.status] ?? "bg-[#F1F5F9] text-[#64748B]"}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* How it works */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-5">How Your Collections Process Works</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "AI Drafts Email", desc: "Our AI analyses each overdue invoice and drafts a personalized dunning email with the correct tone." },
            { step: "02", title: "Sent Automatically", desc: "L1/L2/L3 emails sent based on days overdue. Reply detection pauses automation when customers respond." },
            { step: "03", title: "Dashboard Updates", desc: "Payments are reflected in your AR dashboard instantly. View DSO improvement in real time." },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#EEF2FF] border border-[#4F46E5]/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[#4F46E5]">{s.step}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{s.title}</p>
                <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
