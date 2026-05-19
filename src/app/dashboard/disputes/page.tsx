"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Search, RefreshCw, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import type { Dispute, DisputeStatus } from "@/types/database";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const STATUS_STYLES: Record<DisputeStatus, { bg: string; text: string; label: string }> = {
  open:          { bg: "bg-[#FFFBEB]", text: "text-[#D97706]",  label: "Open" },
  investigating: { bg: "bg-[#EFF6FF]", text: "text-[#2563EB]",  label: "Investigating" },
  resolved:      { bg: "bg-[#F0FDF4]", text: "text-[#16A34A]",  label: "Resolved" },
  rejected:      { bg: "bg-[#F1F5F9]", text: "text-[#64748B]",  label: "Rejected" },
};

const REASON_LABELS: Record<string, string> = {
  incorrect_amount:    "Incorrect amount",
  goods_not_received:  "Goods not received",
  duplicate_invoice:   "Duplicate invoice",
  already_paid:        "Already paid",
  service_not_rendered:"Service not rendered",
  other:               "Other",
};

export default function DisputesPage() {
  const { organization } = useAuth();
  const [disputes, setDisputes]   = useState<Dispute[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState<DisputeStatus | "all">("all");
  const [updating, setUpdating]   = useState<string | null>(null);
  const [resolutionNotes, setNotes] = useState<Record<string, string>>({});
  const [openDropdown, setDropdown] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    const res = await fetch(`/api/disputes?orgId=${organization.id}`);
    const json = await res.json();
    setDisputes(json.disputes ?? []);
    setLoading(false);
  }, [organization]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: DisputeStatus) {
    setUpdating(id);
    await fetch(`/api/disputes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, resolution_notes: resolutionNotes[id] }),
    });
    setUpdating(null);
    setDropdown(null);
    load();
  }

  const filtered = disputes.filter(d => {
    const matchesFilter = filter === "all" || d.status === filter;
    const matchesSearch = !search ||
      d.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.invoice_number?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    open:          disputes.filter(d => d.status === "open").length,
    investigating: disputes.filter(d => d.status === "investigating").length,
    resolved:      disputes.filter(d => d.status === "resolved").length,
    rejected:      disputes.filter(d => d.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Disputes</h2>
          <p className="text-[#64748B] text-sm mt-1">Track and resolve invoice disputes</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] text-sm hover:text-[#E8242A] hover:border-[#E8242A]/30 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Status cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { key: "open",          label: "Open",          icon: AlertTriangle, color: "#D97706" },
          { key: "investigating", label: "Investigating", icon: Clock,         color: "#2563EB" },
          { key: "resolved",      label: "Resolved",      icon: CheckCircle,   color: "#16A34A" },
          { key: "rejected",      label: "Rejected",      icon: CheckCircle,   color: "#94A3B8" },
        ].map((s, i) => (
          <motion.button key={s.key}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => setFilter(filter === s.key as DisputeStatus ? "all" : s.key as DisputeStatus)}
            className={`glass rounded-2xl p-4 text-left transition-all ${filter === s.key ? "ring-2 ring-[#E8242A]" : ""}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
              style={{ background: `${s.color}18` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-xl font-bold text-[#0F172A]">{counts[s.key as DisputeStatus]}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{s.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-[#0F172A] flex-1">All Disputes</h3>
          <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 w-48">
            <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search..." className="text-xs outline-none flex-1 text-[#0F172A] placeholder-[#94A3B8]" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                {["Customer", "Invoice", "Amount", "Reason", "Status", "Filed", "Actions"].map(h => (
                  <th key={h} className="text-left text-[#94A3B8] px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12">
                  <div className="w-5 h-5 border-2 border-[#E8242A]/20 border-t-[#E8242A] rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[#94A3B8]">
                  {disputes.length === 0 ? "No disputes filed yet" : "No disputes match your search"}
                </td></tr>
              ) : filtered.map(d => {
                const s = STATUS_STYLES[d.status];
                return (
                  <tr key={d.id} className="border-t border-[#F1F5F9] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3 text-[#0F172A] font-medium">{d.customer_name ?? "—"}</td>
                    <td className="px-4 py-3 text-[#64748B]">{d.invoice_number ?? "—"}</td>
                    <td className="px-4 py-3 text-[#0F172A] font-semibold">{d.invoice_amount ? fmt(d.invoice_amount) : "—"}</td>
                    <td className="px-4 py-3 text-[#64748B]">{REASON_LABELS[d.reason] ?? d.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3 text-[#94A3B8]">
                      {new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      {(d.status === "open" || d.status === "investigating") && (
                        <div className="relative">
                          <button onClick={() => setDropdown(openDropdown === d.id ? null : d.id)}
                            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#E8242A] transition-colors font-medium px-2 py-1 rounded-lg border border-[#E2E8F0] hover:border-[#E8242A]/30">
                            Update <ChevronDown className="w-3 h-3" />
                          </button>
                          {openDropdown === d.id && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 p-3 space-y-2">
                              <textarea
                                placeholder="Resolution notes (optional)"
                                rows={2}
                                value={resolutionNotes[d.id] ?? ""}
                                onChange={e => setNotes(n => ({ ...n, [d.id]: e.target.value }))}
                                className="w-full text-xs border border-[#E2E8F0] rounded-lg px-2 py-1.5 resize-none outline-none focus:border-[#E8242A] text-[#0F172A] placeholder-[#94A3B8]"
                              />
                              {[
                                { status: "investigating" as DisputeStatus, label: "→ Investigating", color: "text-[#2563EB]" },
                                { status: "resolved" as DisputeStatus,      label: "✓ Mark Resolved", color: "text-[#16A34A]" },
                                { status: "rejected" as DisputeStatus,      label: "✗ Reject Dispute", color: "text-[#64748B]" },
                              ].map(opt => (
                                <button key={opt.status}
                                  disabled={updating === d.id}
                                  onClick={() => updateStatus(d.id, opt.status)}
                                  className={`w-full text-left text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-[#F8F9FC] transition-colors ${opt.color} disabled:opacity-50`}>
                                  {updating === d.id ? "Updating..." : opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {(d.status === "resolved" || d.status === "rejected") && (
                        <span className="text-[#94A3B8]">
                          {d.resolved_at ? new Date(d.resolved_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
