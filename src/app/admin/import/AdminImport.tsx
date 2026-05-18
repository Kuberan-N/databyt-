"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, CheckCircle, XCircle, AlertTriangle, FileText,
  ArrowRight, ArrowLeft, RefreshCw, Download,
} from "lucide-react";
import { useAdminOrg } from "@/components/AdminShell";
import type { ImportRow, ImportResult } from "@/app/api/admin/import/route";

type Step = "upload" | "map" | "preview" | "done";

interface MappedColumns {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  invoiceNumber: string;
  amount: string;
  issueDate: string;
  dueDate: string;
}

const FIELD_LABELS: Record<keyof MappedColumns, string> = {
  customerName:  "Customer Name *",
  customerEmail: "Customer Email",
  customerPhone: "Customer Phone",
  invoiceNumber: "Invoice Number *",
  amount:        "Amount *",
  issueDate:     "Issue Date *",
  dueDate:       "Due Date *",
};

const REQUIRED_FIELDS: Array<keyof MappedColumns> = ["customerName", "invoiceNumber", "amount", "issueDate", "dueDate"];

function autoMap(headers: string[]): MappedColumns {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
  const find = (...patterns: string[]) =>
    headers.find(h => patterns.some(p => norm(h).includes(p))) ?? "";

  return {
    customerName:  find("customer", "client", "company", "name"),
    customerEmail: find("email", "mail"),
    customerPhone: find("phone", "tel", "mobile"),
    invoiceNumber: find("invoice", "inv", "number", "num", "id"),
    amount:        find("amount", "total", "balance", "outstanding", "owing"),
    issueDate:     find("issue", "invoice date", "invoicedate", "date"),
    dueDate:       find("due", "duedate", "paymentdue"),
  };
}

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let cell = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        if (inQuotes && line[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (line[i] === "," && !inQuotes) {
        result.push(cell.trim()); cell = "";
      } else {
        cell += line[i];
      }
    }
    result.push(cell.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = parseRow(line);
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? ""]));
  });

  return { headers, rows };
}

function rowsToImport(csvRows: Record<string, string>[], mapping: MappedColumns): ImportRow[] {
  return csvRows
    .filter(r => r[mapping.customerName] && r[mapping.invoiceNumber] && r[mapping.amount])
    .map(r => ({
      customerName:  r[mapping.customerName] ?? "",
      customerEmail: mapping.customerEmail ? r[mapping.customerEmail] : undefined,
      customerPhone: mapping.customerPhone ? r[mapping.customerPhone] : undefined,
      invoiceNumber: r[mapping.invoiceNumber] ?? "",
      amount:        parseFloat((r[mapping.amount] ?? "0").replace(/[$,]/g, "")) || 0,
      issueDate:     r[mapping.issueDate] ?? "",
      dueDate:       r[mapping.dueDate] ?? "",
    }));
}

const EXAMPLE_CSV = `Customer Name,Email,Invoice Number,Amount,Issue Date,Due Date
Acme Corp,ar@acme.com,INV-001,15000,2025-01-01,2025-01-31
Widget Co,pay@widget.io,INV-002,8500,2025-01-15,2025-02-14`;

export default function AdminImport() {
  const { selectedOrg } = useAdminOrg();
  const [step, setStep] = useState<Step>("upload");
  const [csvText, setCsvText] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<MappedColumns>({
    customerName: "", customerEmail: "", customerPhone: "",
    invoiceNumber: "", amount: "", issueDate: "", dueDate: "",
  });
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const { headers: h, rows: r } = parseCSV(text);
      setCsvText(text);
      setHeaders(h);
      setCsvRows(r);
      setMapping(autoMap(h));
      setStep("map");
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "text/csv" || file?.name.endsWith(".csv")) handleFile(file);
  }, [handleFile]);

  const requiredMapped = REQUIRED_FIELDS.every(f => mapping[f]);
  const previewRows = rowsToImport(csvRows, mapping);

  async function runImport() {
    if (!selectedOrg || !previewRows.length) return;
    setImporting(true);
    const res = await fetch("/api/admin/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": process.env.ADMIN_SECRET ?? "databyt-admin-2024",
      },
      body: JSON.stringify({ orgId: selectedOrg.id, rows: previewRows }),
    });
    const data: ImportResult = await res.json();
    setImportResult(data);
    setImporting(false);
    setStep("done");
  }

  function reset() {
    setStep("upload");
    setCsvText("");
    setHeaders([]);
    setCsvRows([]);
    setImportResult(null);
  }

  if (!selectedOrg) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="w-10 h-10 text-surface-600 mb-4" />
        <p className="text-white font-medium">No client selected</p>
        <p className="text-surface-500 text-sm mt-1">Select a client from the org switcher in the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Import AR Data</h2>
        <p className="text-surface-400 text-sm mt-1">
          {selectedOrg.name} — import customers and invoices from a CSV export.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {(["upload", "map", "preview", "done"] as Step[]).map((s, i) => {
          const stepIndex = ["upload", "map", "preview", "done"].indexOf(step);
          const thisIndex = i;
          const done = thisIndex < stepIndex;
          const active = s === step;
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done ? "bg-success-500 text-white" : active ? "bg-primary-500 text-white" : "bg-surface-800 text-surface-500"
              }`}>
                {done ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs font-medium capitalize ${active ? "text-white" : "text-surface-500"}`}>{s}</span>
              {i < 3 && <div className="w-8 h-px bg-surface-800" />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">

        {/* Step 1: Upload */}
        {step === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`glass rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 border-dashed ${
                dragOver ? "border-primary-500 bg-primary-500/5" : "border-surface-700 hover:border-surface-600"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5">
                <Upload className="w-6 h-6 text-primary-400" />
              </div>
              <p className="text-white font-semibold mb-1">Drop CSV file here</p>
              <p className="text-surface-400 text-sm">or click to browse</p>
              <p className="text-surface-600 text-xs mt-3">QuickBooks, Xero, or any AR aging export</p>
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>

            {/* Example download */}
            <div className="mt-4 glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-surface-500" />
                <div>
                  <p className="text-sm text-white">Need a template?</p>
                  <p className="text-xs text-surface-500">Download our example CSV format</p>
                </div>
              </div>
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(EXAMPLE_CSV)}`}
                download="databyt-import-template.csv"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-700 text-surface-300 text-xs font-medium hover:bg-surface-600 transition-all"
              >
                <Download className="w-3 h-3" /> Download
              </a>
            </div>
          </motion.div>
        )}

        {/* Step 2: Map columns */}
        {step === "map" && (
          <motion.div key="map" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Map CSV Columns</h3>
                  <p className="text-xs text-surface-500 mt-0.5">{csvRows.length} rows detected. Fields marked * are required.</p>
                </div>
                <button onClick={reset} className="text-xs text-surface-500 hover:text-surface-300 flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Change file
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {(Object.keys(FIELD_LABELS) as Array<keyof MappedColumns>).map(field => (
                  <div key={field}>
                    <label className="block text-[10px] font-medium text-surface-400 uppercase tracking-wider mb-1.5">
                      {FIELD_LABELS[field]}
                    </label>
                    <select
                      value={mapping[field]}
                      onChange={e => setMapping(m => ({ ...m, [field]: e.target.value }))}
                      className="w-full bg-surface-800 border border-surface-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
                    >
                      <option value="">— skip —</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {!requiredMapped && (
                <p className="mt-4 text-xs text-warning-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Map all required fields (*) to continue.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep("preview")}
                disabled={!requiredMapped}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all disabled:opacity-40"
              >
                Preview <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Preview */}
        {step === "preview" && (
          <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-surface-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Import Preview</h3>
                  <p className="text-xs text-surface-500 mt-0.5">{previewRows.length} invoices ready to import into {selectedOrg.name}</p>
                </div>
                <button onClick={() => setStep("map")} className="text-xs text-surface-500 hover:text-surface-300 flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-surface-900">
                    <tr className="border-b border-surface-800">
                      {["Customer", "Invoice #", "Amount", "Issue Date", "Due Date"].map(h => (
                        <th key={h} className="text-left text-surface-500 px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.slice(0, 50).map((row, i) => (
                      <tr key={i} className="border-t border-surface-800/50 hover:bg-surface-800/20">
                        <td className="px-4 py-2.5">
                          <p className="text-surface-200 font-medium">{row.customerName}</p>
                          {row.customerEmail && <p className="text-surface-500 text-[10px]">{row.customerEmail}</p>}
                        </td>
                        <td className="px-4 py-2.5 text-surface-400">{row.invoiceNumber}</td>
                        <td className="px-4 py-2.5 text-white font-semibold">
                          ${row.amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2.5 text-surface-400">{row.issueDate}</td>
                        <td className="px-4 py-2.5 text-surface-400">{row.dueDate}</td>
                      </tr>
                    ))}
                    {previewRows.length > 50 && (
                      <tr className="border-t border-surface-800/50">
                        <td colSpan={5} className="px-4 py-3 text-surface-600 text-center">
                          + {previewRows.length - 50} more rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={runImport}
                disabled={importing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all disabled:opacity-50"
              >
                {importing ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Importing...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Import {previewRows.length} invoices</>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Done */}
        {step === "done" && importResult && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-8 text-center space-y-4">
            {importResult.imported > 0 ? (
              <CheckCircle className="w-14 h-14 text-success-400 mx-auto" />
            ) : (
              <XCircle className="w-14 h-14 text-danger-400 mx-auto" />
            )}
            <div>
              <h3 className="text-lg font-bold text-white">Import Complete</h3>
              <p className="text-surface-400 text-sm mt-1">{selectedOrg.name}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {[
                { label: "Invoices", value: importResult.imported, color: "text-success-400" },
                { label: "Customers", value: importResult.customersCreated, color: "text-primary-400" },
                { label: "Errors", value: importResult.errors.length, color: importResult.errors.length > 0 ? "text-danger-400" : "text-surface-500" },
              ].map(s => (
                <div key={s.label} className="bg-surface-800/50 rounded-xl p-3">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            {importResult.errors.length > 0 && (
              <div className="text-left bg-danger-500/8 border border-danger-500/20 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-xs font-semibold text-danger-400 mb-2">Errors</p>
                {importResult.errors.slice(0, 5).map((e, i) => (
                  <p key={i} className="text-xs text-surface-400 mb-1">{e}</p>
                ))}
                {importResult.errors.length > 5 && (
                  <p className="text-xs text-surface-600">+ {importResult.errors.length - 5} more</p>
                )}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> Import Another File
              </button>
              <a href="/admin/collections"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all">
                Go to Collections <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
