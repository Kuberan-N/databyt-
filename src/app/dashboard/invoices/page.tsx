"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Download,
  X,
  Brain,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

type InvoiceStatus = "pending" | "extracting" | "extracted" | "reviewed" | "synced" | "error";

interface DemoInvoice {
  id: string;
  vendor_name: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: InvoiceStatus;
  confidence: number;
  created_at: string;
}

const statusConfig: Record<
  InvoiceStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: "Pending", color: "text-[#333333] bg-surface-700/50", icon: Clock },
  extracting: { label: "Extracting", color: "text-primary-400 bg-primary-500/10", icon: Brain },
  extracted: { label: "Extracted", color: "text-accent-400 bg-accent-500/10", icon: CheckCircle2 },
  reviewed: { label: "Reviewed", color: "text-success-400 bg-success-500/10", icon: CheckCircle2 },
  synced: { label: "Synced", color: "text-success-400 bg-success-500/10", icon: RefreshCw },
  error: { label: "Error", color: "text-danger-400 bg-danger-500/10", icon: AlertCircle },
};

export default function InvoicesPage() {
  const { organization } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [invoices, setInvoices] = useState<DemoInvoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    []
  );

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      setUploadingFile(file.name);

      // Simulate AI extraction with a demo invoice
      const demoInvoice: DemoInvoice = {
        id: crypto.randomUUID(),
        vendor_name: "Processing...",
        invoice_number: "?€”",
        amount: 0,
        due_date: new Date().toISOString().split("T")[0],
        status: "extracting",
        confidence: 0,
        created_at: new Date().toISOString(),
      };
      setInvoices((prev) => [demoInvoice, ...prev]);

      // Simulate extraction completing
      setTimeout(() => {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === demoInvoice.id
              ? {
                  ...inv,
                  vendor_name: `Vendor-${file.name.split(".")[0]}`,
                  invoice_number: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
                  amount: Math.floor(Math.random() * 9000) + 500,
                  status: "extracted" as InvoiceStatus,
                  confidence: 0.92 + Math.random() * 0.07,
                }
              : inv
          )
        );
        setUploadingFile(null);
      }, 2500);
    });
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Invoice Processing{" "}
            <span className="text-[#333333] text-sm font-normal">(AP)</span>
          </h2>
          <p className="text-[#333333] text-sm">
            Upload invoices and let AI extract the data automatically.
          </p>
        </div>
        <label
          htmlFor="file-upload"
          className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-sm font-semibold hover:from-primary-500 hover:to-accent-500 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Upload Invoice
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(Array.from(e.target.files));
            }}
          />
        </label>
      </div>

      {/* Drop Zone */}
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
          isDragging
            ? "border-primary-500 bg-primary-500/5"
            : "border-surface-700 hover:border-surface-600 bg-surface-900/30"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
              isDragging
                ? "bg-primary-500/20 text-primary-400"
                : "bg-surface-800 text-[#333333]"
            }`}
          >
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <p className="text-white font-medium">
              {isDragging
                ? "Drop your invoices here"
                : "Drag & drop invoices here"}
            </p>
            <p className="text-[#333333] text-sm mt-1">
              PDF, Excel, PNG, JPG ?€” any format. AI extracts data at 95%+ accuracy.
            </p>
          </div>
          {uploadingFile && (
            <div className="flex items-center gap-2 text-primary-400 text-sm mt-2">
              <div className="w-4 h-4 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
              Processing {uploadingFile}...
            </div>
          )}
        </div>
      </motion.div>

      {/* Search & Filter */}
      {invoices.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]" />
            <input
              type="text"
              placeholder="Search vendors or invoice numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
            />
          </div>
        </div>
      )}

      {/* Invoices Table */}
      {filteredInvoices.length > 0 ? (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800">
                  <th className="text-left text-[#333333] text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Vendor
                  </th>
                  <th className="text-left text-[#333333] text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Invoice #
                  </th>
                  <th className="text-left text-[#333333] text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-[#333333] text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-[#333333] text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Confidence
                  </th>
                  <th className="text-right text-[#333333] text-xs font-medium uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv, i) => {
                  const config = statusConfig[inv.status];
                  return (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[#333333]" />
                          </div>
                          <span className="text-white text-sm font-medium">
                            {inv.vendor_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#444444] text-sm font-mono">
                        {inv.invoice_number}
                      </td>
                      <td className="px-6 py-4 text-white text-sm font-semibold">
                        {inv.amount > 0
                          ? `$${new Intl.NumberFormat("en-US").format(inv.amount)}`
                          : "?€”"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.color}`}
                        >
                          <config.icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {inv.confidence > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-surface-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  inv.confidence >= 0.95
                                    ? "bg-success-400"
                                    : inv.confidence >= 0.85
                                    ? "bg-warning-400"
                                    : "bg-danger-400"
                                }`}
                                style={{
                                  width: `${inv.confidence * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[#333333] text-xs">
                              {(inv.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#222222] text-xs">?€”</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-2 text-[#333333] hover:text-white hover:bg-surface-700 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-[#333333] hover:text-danger-400 hover:bg-danger-500/10 rounded-lg transition-colors"
                            title="Delete"
                            onClick={() =>
                              setInvoices((prev) =>
                                prev.filter((x) => x.id !== inv.id)
                              )
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        invoices.length === 0 && (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-[#222222]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No invoices yet
            </h3>
            <p className="text-[#333333] text-sm max-w-md mx-auto mb-6">
              Upload your first invoice above to see AI-powered data extraction
              in action. We support PDF, Excel, PNG, and JPG formats.
            </p>
            <div className="flex items-center justify-center gap-4 text-[#333333] text-xs">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-success-400" />
                95%+ accuracy
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary-400" />
                ~3 sec per invoice
              </span>
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3 text-accent-400" />
                Gets smarter over time
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
