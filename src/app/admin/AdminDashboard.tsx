"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Users, Building2, DollarSign, AlertTriangle,
  RefreshCw, Mail, TrendingUp, Zap, LogOut,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import type { OrgHealthRow } from "@/app/api/admin/orgs/route";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const PLAN_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  starter: { color: "text-surface-400", bg: "bg-surface-700",    border: "border-surface-600" },
  growth:  { color: "text-primary-400", bg: "bg-primary-500/10", border: "border-primary-500/20" },
  scale:   { color: "text-accent-400",  bg: "bg-accent-500/10",  border: "border-accent-500/20" },
};

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const [orgs, setOrgs] = useState<OrgHealthRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const isAdmin = user?.email === adminEmail;

  useEffect(() => {
    if (!loading && !user) { router.push("/auth"); return; }
    if (!loading && user && !isAdmin) { router.push("/dashboard"); return; }
  }, [user, loading, isAdmin, router]);

  async function loadOrgs() {
    setFetching(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orgs");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setOrgs(data.orgs);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => { if (isAdmin) loadOrgs(); }, [isAdmin]);

  if (loading || (!user && !loading)) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-danger-400 mx-auto mb-4" />
          <p className="text-white font-semibold">Access Denied</p>
          <p className="text-surface-400 text-sm mt-1">Admin access required.</p>
        </div>
      </div>
    );
  }

  const totalAR = orgs.reduce((s, o) => s + o.totalOutstanding, 0);
  const totalOrgs = orgs.length;
  const totalCustomers = orgs.reduce((s, o) => s + o.customerCount, 0);
  const totalEmails = orgs.reduce((s, o) => s + o.emailsSentThisMonth, 0);

  const planCounts = orgs.reduce((acc, o) => {
    acc[o.plan_tier] = (acc[o.plan_tier] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const selected = selectedOrg ? orgs.find(o => o.id === selectedOrg) : null;

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Top bar */}
      <header className="h-16 bg-surface-900 border-b border-surface-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold">data<span className="text-primary-400">byt</span></span>
          <span className="text-surface-600 text-sm mx-2">/</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-500/10 border border-danger-500/20">
            <Shield className="w-3 h-3 text-danger-400" />
            <span className="text-xs text-danger-400 font-semibold">Super Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-surface-500 text-sm">{user?.email}</span>
          <button onClick={() => { signOut(); router.push("/auth"); }}
            className="flex items-center gap-1.5 text-surface-400 hover:text-danger-400 text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-surface-400 text-sm mt-0.5">All client organizations and health metrics</p>
          </div>
          <button onClick={loadOrgs} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all">
            <RefreshCw className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Client Orgs",       value: totalOrgs.toString(),       icon: Building2,    color: "from-primary-500 to-primary-600" },
            { label: "Total Customers",   value: totalCustomers.toLocaleString(), icon: Users,   color: "from-accent-500 to-accent-600" },
            { label: "Total AR Managed",  value: fmt(totalAR),               icon: DollarSign,   color: "from-success-400 to-success-500" },
            { label: "Emails This Month", value: totalEmails.toLocaleString(), icon: Mail,       color: "from-warning-400 to-warning-500" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold">{fetching ? "—" : s.value}</p>
              <p className="text-surface-500 text-xs mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Plan breakdown */}
        {!fetching && Object.keys(planCounts).length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {Object.entries(planCounts).map(([plan, count]) => {
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

        {error && (
          <div className="px-4 py-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">{error}</div>
        )}

        {/* Org table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-surface-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Client Organizations</h2>
            <span className="text-xs text-surface-500">{orgs.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-800">
                  {["Organization", "Plan", "Customers", "AR Outstanding", "Overdue", "Emails/mo", "Joined", ""].map(h => (
                    <th key={h} className="text-left text-surface-500 px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  <tr><td colSpan={8} className="text-center py-12 text-surface-600">Loading...</td></tr>
                ) : orgs.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-surface-600">No organizations yet</td></tr>
                ) : orgs.map(org => {
                  const planStyle = PLAN_STYLE[org.plan_tier] ?? PLAN_STYLE.starter;
                  return (
                    <tr key={org.id}
                      className={`border-t border-surface-800/50 hover:bg-surface-800/20 transition-colors cursor-pointer ${selectedOrg === org.id ? "bg-surface-800/30" : ""}`}
                      onClick={() => setSelectedOrg(selectedOrg === org.id ? null : org.id)}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{org.name}</p>
                        <p className="text-surface-600 text-xs mt-0.5">{org.userCount} user{org.userCount !== 1 ? "s" : ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${planStyle.color} ${planStyle.bg} ${planStyle.border}`}>
                          {org.plan_tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-surface-300">{org.customerCount}</td>
                      <td className="px-4 py-3 text-white font-semibold">{fmt(org.totalOutstanding)}</td>
                      <td className="px-4 py-3">
                        <span className={org.overdueCount > 0 ? "text-danger-400 font-medium" : "text-surface-500"}>
                          {org.overdueCount > 0 ? `${org.overdueCount} · ${fmt(org.overdueAmount)}` : "None"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-surface-400">{org.emailsSentThisMonth}</td>
                      <td className="px-4 py-3 text-surface-500">{new Date(org.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {org.overdueCount > 0 && <AlertTriangle className="w-3.5 h-3.5 text-danger-400" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Expanded org detail */}
        {selected && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold">{selected.name}</h3>
                <p className="text-surface-400 text-xs mt-0.5">org id: {selected.id}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border capitalize font-medium ${(PLAN_STYLE[selected.plan_tier] ?? PLAN_STYLE.starter).color} ${(PLAN_STYLE[selected.plan_tier] ?? PLAN_STYLE.starter).bg} ${(PLAN_STYLE[selected.plan_tier] ?? PLAN_STYLE.starter).border}`}>
                {selected.plan_tier}
              </span>
            </div>
            <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Users",         value: selected.userCount },
                { label: "Customers",     value: selected.customerCount },
                { label: "Open Invoices", value: selected.invoiceCount },
                { label: "Total AR",      value: fmt(selected.totalOutstanding) },
                { label: "Overdue",       value: `${selected.overdueCount} (${fmt(selected.overdueAmount)})` },
                { label: "Emails/Month",  value: selected.emailsSentThisMonth },
              ].map((m, i) => (
                <div key={i} className="bg-surface-800/40 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold">{m.value}</p>
                  <p className="text-surface-500 text-xs mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-surface-800">
              <p className="text-xs text-surface-500">
                Member since: {new Date(selected.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </motion.div>
        )}

        <div className="pt-2">
          <a href="/dashboard" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            → Go to Client Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
