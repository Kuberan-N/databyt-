"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Search, Mail, Phone, CreditCard, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

interface CustomerRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  payment_terms: number;
  segment: string;
  created_at: string;
  outstanding: number;
  invoiceCount: number;
  overdueCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const SEGMENT_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  strategic: { color: "text-[#000000]",  bg: "bg-[#F3F3F3]",  border: "border-[#000000]/20" },
  standard:  { color: "text-[#16A34A]",  bg: "bg-[#F0FDF4]",  border: "border-[#BBF7D0]" },
  at_risk:   { color: "text-[#DC2626]",  bg: "bg-[#FEF2F2]",  border: "border-[#FECACA]" },
};

export default function CustomersPage() {
  const { organization } = useAuth();
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");

  const load = useCallback(async () => {
    if (!organization) return;
    setLoading(true);

    const { data: custData } = await db
      .from("customers")
      .select("id, name, email, phone, payment_terms, segment, created_at")
      .eq("org_id", organization.id)
      .order("name");

    if (!custData) { setLoading(false); return; }

    const { data: invData } = await db
      .from("invoices")
      .select("customer_id, amount, days_overdue, status")
      .eq("org_id", organization.id)
      .in("status", ["open", "reminded", "overdue"]);

    const invMap = new Map<string, { outstanding: number; invoiceCount: number; overdueCount: number }>();
    for (const inv of invData ?? []) {
      const e = invMap.get(inv.customer_id) ?? { outstanding: 0, invoiceCount: 0, overdueCount: 0 };
      e.outstanding += inv.amount;
      e.invoiceCount++;
      if (inv.days_overdue > 0) e.overdueCount++;
      invMap.set(inv.customer_id, e);
    }

    setCustomers(custData.map((c: CustomerRow) => ({
      ...c,
      ...(invMap.get(c.id) ?? { outstanding: 0, invoiceCount: 0, overdueCount: 0 }),
    })));
    setLoading(false);
  }, [organization]);

  useEffect(() => { load(); }, [load]);

  const filtered = customers.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchSeg = segmentFilter === "all" || c.segment === segmentFilter;
    return matchSearch && matchSeg;
  });

  const segmentCounts = {
    strategic: customers.filter(c => c.segment === "strategic").length,
    standard:  customers.filter(c => c.segment === "standard").length,
    at_risk:   customers.filter(c => c.segment === "at_risk").length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Customers</h2>
        <p className="text-[#222222] text-sm mt-1">Your accounts receivable customer list.</p>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search customers by name or email..."
            className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0F172A] placeholder-[#333333] focus:border-[#000000] focus:outline-none transition-colors" />
        </div>
        <div className="flex gap-1">
          {["all", "strategic", "standard", "at_risk"].map(s => (
            <button key={s} onClick={() => setSegmentFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                segmentFilter === s
                  ? "bg-[#F3F3F3] text-[#000000] border border-[#000000]/20"
                  : "border border-[#E2E8F0] text-[#333333] hover:text-[#000000]"
              }`}>
              {s === "at_risk" ? "At Risk" : s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Segment summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { key: "strategic", label: "Strategic",  desc: "High-value, long-term clients" },
          { key: "standard",  label: "Standard",   desc: "Regular payment history" },
          { key: "at_risk",   label: "At Risk",    desc: "Slow payers or overdue pattern" },
        ].map((s) => {
          const style = SEGMENT_STYLE[s.key];
          return (
            <motion.div key={s.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 border cursor-pointer transition-all hover:shadow-sm ${style.bg} ${style.border}`}
              onClick={() => setSegmentFilter(segmentFilter === s.key ? "all" : s.key)}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold ${style.color}`}>{s.label}</span>
                <span className="text-2xl font-bold text-[#0F172A]">{segmentCounts[s.key as keyof typeof segmentCounts]}</span>
              </div>
              <p className="text-xs text-[#333333]">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Customer table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-6 gap-2 px-5 py-3 border-b border-[#E2E8F0] text-xs font-medium text-[#333333] uppercase tracking-wider">
          <span className="col-span-2">Customer</span>
          <span>Outstanding</span>
          <span>Invoices</span>
          <span>Payment Terms</span>
          <span>Segment</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#000000]/20 border-t-[#000000] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-[#F3F3F3] flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-[#333333]" />
            </div>
            <p className="text-[#0F172A] font-medium mb-1">
              {customers.length === 0 ? "No customers yet" : "No customers match your search"}
            </p>
            <p className="text-[#333333] text-sm max-w-xs leading-relaxed">
              {customers.length === 0
                ? "Sync your QuickBooks account to import customers automatically."
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((c) => {
              const style = SEGMENT_STYLE[c.segment] ?? SEGMENT_STYLE.standard;
              return (
                <div key={c.id} className="grid grid-cols-6 gap-2 px-5 py-3.5 border-t border-[#F1F5F9] hover:bg-[#FAFAFA] transition-colors items-center">
                  <div className="col-span-2 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{c.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {c.email && <span className="text-xs text-[#333333] flex items-center gap-1 truncate"><Mail className="w-3 h-3 shrink-0" />{c.email}</span>}
                      {c.phone && <span className="text-xs text-[#333333] flex items-center gap-1"><Phone className="w-3 h-3 shrink-0" />{c.phone}</span>}
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${c.outstanding > 0 ? "text-[#0F172A]" : "text-[#333333]"}`}>{fmt(c.outstanding)}</p>
                    {c.overdueCount > 0 && (
                      <p className="text-xs text-[#DC2626] flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3 h-3" />{c.overdueCount} overdue
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[#0F172A]">{c.invoiceCount}</p>
                    <p className="text-xs text-[#333333]">open</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-[#333333]" />
                    <span className="text-sm text-[#333333]">Net {c.payment_terms}</span>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize border ${style.color} ${style.bg} ${style.border}`}>
                      {c.segment.replace("_", " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
