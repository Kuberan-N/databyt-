"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Building2, Users, DollarSign, AlertTriangle, Mail,
  TrendingUp, RefreshCw, ChevronRight, Send, Zap, Tags, AlertCircle,
} from "lucide-react";
import { useAdminOrg } from "@/components/AdminShell";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const PLAN_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  starter: { color: "text-[#64748B]",   bg: "bg-[#F1F5F9]",         border: "border-[#E2E8F0]" },
  growth:  { color: "text-[#4B5FA8]",   bg: "bg-[#EEF2FF]",         border: "border-[#3730A3]/20" },
  scale:   { color: "text-[#4F46E5]",   bg: "bg-[#FFF1F2]",         border: "border-[#4F46E5]/20" },
};

const adminSecret = process.env.ADMIN_SECRET ?? "databyt-admin-2024";

export default function AdminDashboard() {
  const { orgs, orgsLoading, selectedOrg, setSelectedOrg, refreshOrgs } = useAdminOrg();
  const [sendingReports, setSendingReports] = useState(false);
  const [reportResult, setReportResult] = useState<string | null>(null);
  const [scoring, setScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<string | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [classifyResult, setClassifyResult] = useState<string | null>(null);
  const [failedJobsCount, setFailedJobsCount] = useState<number | null>(null);

  const totalAR = orgs.reduce((s, o) => s + o.totalOutstanding, 0);
  const totalCustomers = orgs.reduce((s, o) => s + o.customerCount, 0);
  const totalEmails = orgs.reduce((s, o) => s + o.emailsSentThisMonth, 0);
  const totalOverdue = orgs.reduce((s, o) => s + o.overdueCount, 0);

  useEffect(() => {
    fetch("/api/admin/failed-jobs?count=true", {
      headers: { "x-admin-secret": adminSecret },
    })
      .then(r => r.json())
      .then(d => setFailedJobsCount(d.count ?? 0))
      .catch(() => setFailedJobsCount(null));
  }, []);

  const btnBase = "flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] text-sm hover:text-[#3730A3] hover:border-[#3730A3]/30 bg-white transition-all disabled:opacity-50";
  const spinner = <div className="w-4 h-4 border-2 border-[#94A3B8]/30 border-t-[#94A3B8] rounded-full animate-spin" />;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Overview</h2>
          <p className="text-[#64748B] text-sm mt-1">Cross-client AR health and activity.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={async () => {
              setSendingReports(true); setReportResult(null);
              try {
                const r = await fetch("/api/reports/send-weekly", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
                  body: JSON.stringify({}),
                });
                const d = await r.json();
                setReportResult(`Sent ${d.sent}/${d.total} reports`);
              } catch { setReportResult("Failed to send reports"); }
              finally { setSendingReports(false); }
            }}
            disabled={sendingReports}
            className={btnBase}>
            {sendingReports ? spinner : <Send className="w-4 h-4" />}
            Send Weekly Reports
          </button>
          <button
            onClick={async () => {
              setScoring(true); setScoreResult(null);
              try {
                const r = await fetch("/api/admin/score-invoices", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
                  body: JSON.stringify({}),
                });
                const d = await r.json();
                setScoreResult(`Scored ${d.invoicesScored} invoices · ${d.statusUpdated} status updates`);
                await refreshOrgs();
              } catch { setScoreResult("Scoring failed"); }
              finally { setScoring(false); }
            }}
            disabled={scoring}
            className={btnBase}>
            {scoring ? spinner : <Zap className="w-4 h-4" />}
            Score Now
          </button>
          <button
            onClick={async () => {
              setClassifying(true); setClassifyResult(null);
              try {
                const r = await fetch("/api/admin/classify-customers", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
                  body: JSON.stringify({}),
                });
                const d = await r.json();
                setClassifyResult(`Classified ${d.classified} customers across ${d.orgsProcessed} org${d.orgsProcessed !== 1 ? "s" : ""}`);
              } catch { setClassifyResult("Classification failed"); }
              finally { setClassifying(false); }
            }}
            disabled={classifying}
            className={btnBase}>
            {classifying ? spinner : <Tags className="w-4 h-4" />}
            Classify
          </button>
          <button onClick={refreshOrgs} className={btnBase}>
            <RefreshCw className={`w-4 h-4 ${orgsLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Clients",    value: orgs.length.toString(),         icon: Building2,  color: "from-primary-500 to-primary-600" },
          { label: "Total Customers",   value: totalCustomers.toLocaleString(), icon: Users,      color: "from-accent-500 to-accent-600" },
          { label: "Total AR Managed",  value: fmt(totalAR),                   icon: DollarSign, color: "from-success-400 to-success-500" },
          { label: "Emails This Month", value: totalEmails.toLocaleString(),    icon: Mail,       color: "from-warning-400 to-warning-500" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{orgsLoading ? "—" : s.value}</p>
            <p className="text-[#64748B] text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Action results */}
      {(reportResult || scoreResult || classifyResult) && (
        <div className="flex gap-3 flex-wrap">
          {[scoreResult, classifyResult, reportResult].filter(Boolean).map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-sm text-[#475569] text-center">
              {msg}
            </motion.div>
          ))}
        </div>
      )}

      {/* Failed jobs alert */}
      {failedJobsCount !== null && failedJobsCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#FFFBEB] border border-[#F59E0B]/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
            <p className="text-sm text-[#92400E]">
              <span className="font-semibold">{failedJobsCount} failed job{failedJobsCount !== 1 ? "s" : ""}</span>
              {" "}in the error queue. Email sends or reports may have failed.
            </p>
          </div>
          <a href="/api/admin/failed-jobs" target="_blank"
            className="text-xs font-medium text-[#D97706] hover:text-[#92400E] flex items-center gap-1 shrink-0">
            View jobs <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      )}

      {/* Overdue alert */}
      {!orgsLoading && totalOverdue > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#EEF2FF] border border-[#EF4444]/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <p className="text-sm text-[#991B1B]">
              <span className="font-semibold">{totalOverdue} overdue invoice{totalOverdue !== 1 ? "s" : ""}</span>
              {" "}across {orgs.filter(o => o.overdueCount > 0).length} client{orgs.filter(o => o.overdueCount > 0).length !== 1 ? "s" : ""} need attention.
            </p>
          </div>
          <a href="/admin/collections" className="text-xs font-medium text-[#DC2626] hover:text-[#991B1B] flex items-center gap-1 shrink-0">
            View queue <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      )}

      {/* Client table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0F172A]">Client Organizations</h3>
          <span className="text-xs text-[#94A3B8]">{orgs.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                {["Organization", "Status", "MRR", "Plan", "AR Outstanding", "Overdue", "Emails/mo", "Joined"].map(h => (
                  <th key={h} className="text-left text-[#94A3B8] px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orgsLoading ? (
                <tr><td colSpan={8} className="text-center py-12 text-[#94A3B8]">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#3730A3]/20 border-t-[#3730A3] rounded-full animate-spin" />
                    Loading clients...
                  </div>
                </td></tr>
              ) : orgs.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-[#94A3B8]">No client organizations yet</td></tr>
              ) : orgs.map(org => {
                const planStyle = PLAN_STYLE[org.plan_tier] ?? PLAN_STYLE.starter;
                const isSelected = selectedOrg?.id === org.id;
                return (
                  <tr key={org.id}
                    className={`border-t border-[#F1F5F9] hover:bg-[#F8F9FC] transition-colors cursor-pointer ${isSelected ? "bg-[#EEF2FF]" : ""}`}
                    onClick={() => setSelectedOrg(isSelected ? org : org)}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] border border-[#3730A3]/20 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-[#3730A3]">{org.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A] text-xs">{org.name}</p>
                          <p className="text-[#94A3B8] text-[10px] mt-0.5">{org.userCount} user{org.userCount !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${
                        org.status === "active"     ? "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20" :
                        org.status === "onboarding" ? "bg-[#EEF2FF] text-[#3730A3] border-[#3730A3]/20" :
                        org.status === "paused"     ? "bg-[#FFFBEB] text-[#D97706] border-[#F59E0B]/20" :
                        "bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]"
                      }`}>{org.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-[#475569]">
                      {org.mrr != null ? fmt(org.mrr) : <span className="text-[#94A3B8]">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${planStyle.color} ${planStyle.bg} ${planStyle.border}`}>
                        {org.plan_tier}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#0F172A] font-semibold">{fmt(org.totalOutstanding)}</td>
                    <td className="px-4 py-3.5">
                      {org.overdueCount > 0 ? (
                        <span className="flex items-center gap-1 text-[#DC2626] font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          {org.overdueCount} · {fmt(org.overdueAmount)}
                        </span>
                      ) : (
                        <span className="text-[#16A34A]">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-[#64748B]">{org.emailsSentThisMonth}</td>
                    <td className="px-4 py-3.5 text-[#94A3B8]">
                      {new Date(org.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Plan breakdown */}
      {!orgsLoading && orgs.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {Object.entries(
            orgs.reduce((acc, o) => { acc[o.plan_tier] = (acc[o.plan_tier] ?? 0) + 1; return acc; }, {} as Record<string, number>)
          ).map(([plan, count]) => {
            const style = PLAN_STYLE[plan] ?? PLAN_STYLE.starter;
            return (
              <div key={plan} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${style.color} ${style.bg} ${style.border}`}>
                <TrendingUp className="w-3 h-3" />
                {plan.charAt(0).toUpperCase() + plan.slice(1)} · {count} org{count !== 1 ? "s" : ""}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
