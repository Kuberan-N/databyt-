"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Loader2, CheckCircle, Calendar, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function ReportsPage() {
  const { organization } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generatePDF() {
    if (!organization) return;
    setGenerating(true);
    setDone(false);
    setError(null);
    try {
      const res = await fetch("/api/reports/cfo-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: organization.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to generate report");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AR-Report-${new Date().toISOString().split("T")[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  const reportSections = [
    { icon: TrendingUp, title: "Executive Summary",      desc: "Total AR outstanding, DSO, monthly collections, and trend vs prior month" },
    { icon: Calendar,   title: "AR Aging Breakdown",     desc: "Visual bar breakdown of receivables by aging bucket (Current → 90+ days)" },
    { icon: Users,      title: "Top Overdue Customers",  desc: "Ranked table of customers by outstanding balance with days overdue" },
    { icon: AlertTriangle, title: "At-Risk Analysis",   desc: "Customers with escalating overdue patterns and collection status" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Reports</h2>
        <p className="text-[#222222] text-sm mt-1">Generate CFO-ready AR reports for board meetings and financial reviews.</p>
      </div>

      {/* Main report card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#059669] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#0F172A]">CFO AR Collections Report</h3>
            <p className="text-[#222222] text-sm mt-0.5">
              A professionally formatted PDF report covering all key AR metrics, aging breakdown, and top overdue customers.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {reportSections.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0]">
              <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] border border-[#059669]/20 flex items-center justify-center shrink-0 mt-0.5">
                <s.icon className="w-3.5 h-3.5 text-[#059669]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{s.title}</p>
                <p className="text-xs text-[#222222] mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">
            {error}
          </div>
        )}

        {done && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-success-500/10 border border-success-500/20 text-success-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Report downloaded successfully.
          </div>
        )}

        <button
          onClick={generatePDF}
          disabled={generating || !organization}
          className="flex items-center gap-2 px-6 py-3 bg-[#059669] text-white rounded-xl font-semibold text-sm hover:bg-[#047857] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>
          ) : (
            <><Download className="w-4 h-4" /> Generate & Download PDF</>
          )}
        </button>
      </motion.div>

      {/* Upcoming features */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Coming Soon</h3>
        <div className="space-y-3">
          {[
            "Weekly automated CFO email delivery",
            "Custom date range reports",
            "Collections velocity trend charts",
            "Forecast: projected collections next 30/60/90 days",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-[#222222]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#444444] shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
