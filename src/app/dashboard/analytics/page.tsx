"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  Mail,
} from "lucide-react";

export default function AnalyticsPage() {
  const kpis = [
    {
      label: "Days Sales Outstanding",
      value: "— days",
      target: "22 days",
      icon: Clock,
      color: "from-primary-500 to-primary-600",
      desc: "Average time to collect payment",
    },
    {
      label: "AP Processing Time",
      value: "— min",
      target: "0.5 min",
      icon: FileText,
      color: "from-accent-500 to-accent-600",
      desc: "Average time per invoice",
    },
    {
      label: "Collection Rate",
      value: "—%",
      target: "95%",
      icon: DollarSign,
      color: "from-success-400 to-success-500",
      desc: "Percentage of invoices collected on time",
    },
    {
      label: "Dunning Effectiveness",
      value: "—%",
      target: "65%",
      icon: Mail,
      color: "from-warning-400 to-warning-500",
      desc: "Percentage of reminders that result in payment",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-surface-400 text-sm">
          Track your cash flow KPIs and AI agent performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}
              >
                <kpi.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
            <p className="text-surface-400 text-xs mb-2">{kpi.label}</p>
            <p className="text-surface-600 text-xs">
              Target: <span className="text-success-400">{kpi.target}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            DSO Trend (30 days)
          </h3>
          <div className="h-48 flex items-center justify-center border border-dashed border-surface-700 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-surface-600 mx-auto mb-2" />
              <p className="text-surface-500 text-sm">
                Charts will appear once you have data.
              </p>
              <p className="text-surface-600 text-xs mt-1">
                Connect QuickBooks to import AR data.
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Invoice Volume (30 days)
          </h3>
          <div className="h-48 flex items-center justify-center border border-dashed border-surface-700 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-surface-600 mx-auto mb-2" />
              <p className="text-surface-500 text-sm">
                Upload invoices to see processing trends.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AR Aging Over Time */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          AR Aging Distribution Over Time
        </h3>
        <div className="h-48 flex items-center justify-center border border-dashed border-surface-700 rounded-xl">
          <div className="text-center">
            <TrendingDown className="w-10 h-10 text-surface-600 mx-auto mb-2" />
            <p className="text-surface-500 text-sm">
              Track how your aging buckets improve as the AI agent collects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
