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
      db.from("invoices").select("amount").eq("org_id", organization.id)
        .in("status", ["overdue"]),
      db.from("invoices").select("id", { count: "exact", head: true })
        .eq("org_id", organization.id).eq("status", "reminded"),
      db.from("communications").select("subject, sent_at, status")
        .eq("org_id", organization.id).order("sent_at", { ascending: false }).limit(5),
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

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Collections</h2>
        <p className="text-surface-400 text-sm mt-1">
          Your DataByt operator manages collections on your behalf. Here's the current status.
        </p>
      </div>

      {/* Active status banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 rounded-2xl border border-success-500/20 bg-success-500/5">
        <div className="w-10 h-10 rounded-xl bg-success-500/15 border border-success-500/20 flex items-center justify-center shrink-0">
          <div className="w-3 h-3 rounded-full bg-success-400 animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AI Collections Agent Active</p>
          <p className="text-xs text-surface-400 mt-0.5">
            Your operator reviews and approves every email before it sends. Nothing goes out without human sign-off.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Emails Sent This Month", value: loading ? "—" : stats?.emailsSentThisMonth.toString() ?? "0", icon: Mail, color: "from-primary-500 to-primary-600" },
          { label: "In Reminder Stage", value: loading ? "—" : stats?.remindedCount.toString() ?? "0", icon: Clock, color: "from-warning-400 to-warning-500" },
          { label: "Overdue Amount", value: loading ? "—" : fmt(stats?.overdueAmount ?? 0), icon: TrendingUp, color: "from-danger-400 to-danger-500" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-surface-500 text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent communications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-surface-800 flex items-center gap-2">
          <Send className="w-4 h-4 text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Recent Outreach</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : !stats?.recentComms.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="w-8 h-8 text-surface-600 mb-3" />
            <p className="text-surface-400 text-sm">No emails sent yet.</p>
            <p className="text-surface-600 text-xs mt-1">Your operator will begin outreach shortly.</p>
          </div>
        ) : (
          <div>
            {stats.recentComms.map((c, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-t border-surface-800/50">
                <div className="w-7 h-7 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-200 truncate">{c.subject ?? "Collections email"}</p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {new Date(c.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                  c.status === "sent" ? "bg-primary-500/10 text-primary-400" :
                  c.status === "opened" ? "bg-success-500/10 text-success-400" :
                  c.status === "bounced" ? "bg-danger-500/10 text-danger-400" :
                  "bg-surface-700 text-surface-400"
                }`}>{c.status}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* How it works */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">How Your Collections Process Works</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "AI Drafts Email", desc: "Our AI analyzes each overdue invoice and drafts a personalized collection email." },
            { step: "2", title: "Operator Reviews", desc: "Your DataByt operator reviews, edits if needed, and approves every email before sending." },
            { step: "3", title: "You Get Results", desc: "Payments collected are reflected in your AR dashboard. You receive a weekly report." },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-500/15 border border-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-400">{s.step}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{s.title}</p>
                <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
