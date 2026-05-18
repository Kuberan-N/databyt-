"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight,
  X, ChevronDown, Loader2, BarChart2, RefreshCw, Plus,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  parseCSVFile, detectMapping, validateAndTransform,
  AR_FIELDS, ARFieldKey, ColumnMap, ParsedCSV,
} from "@/lib/csv-parser";
import AgingDashboard from "./AgingDashboard";

type Step = "upload" | "mapping" | "preview" | "importing" | "done";

const BUCKET_COLORS: Record<string, string> = {
  "Current":   "bg-success-500",
  "1–30d":     "bg-warning-400",
  "31–60d":    "bg-orange-500",
  "61–90d":    "bg-danger-400",
  "90d+":      "bg-red-600",
};

export default function ARAgingPage() {
  const { organization } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [hasData, setHasData] = useState<boolean | null>(null);
  const [showImport, setShowImport] = useState(false);

  const [step, setStep] = useState<Step>("upload");
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed] = useState<ParsedCSV | null>(null);
  const [mapping, setMapping] = useState<Partial<ColumnMap>>({});
  const [validRows, setValidRows] = useState<ReturnType<typeof validateAndTransform>["valid"]>([]);
  const [errors, setErrors] = useState<ReturnType<typeof validateAndTransform>["errors"]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState({ customers: 0, invoices: 0 });
  const [globalError, setGlobalError] = useState<string | null>(null);

  const checkHasData = useCallback(async () => {
    if (!organization) return;
    const { count } = await db
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("org_id", organization.id);
    setHasData((count ?? 0) > 0);
  }, [organization]);

  useEffect(() => { checkHasData(); }, [checkHasData]);

  // ── Drop / pick file ──────────────────────────────────────
  async function handleFile(file: File) {
    setGlobalError(null);
    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setGlobalError("Please upload a CSV or Excel file.");
      return;
    }
    try {
      const result = await parseCSVFile(file);
      setParsed(result);
      setMapping(detectMapping(result.headers));
      setStep("mapping");
    } catch (e) {
      setGlobalError((e as Error).message);
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  function handleValidate() {
    if (!parsed) return;
    const fullMap = mapping as ColumnMap;
    const { valid, errors: errs } = validateAndTransform(parsed.rows, fullMap);
    setValidRows(valid);
    setErrors(errs);
    setStep("preview");
  }

  async function handleImport() {
    if (!organization) return;
    setStep("importing");
    setImportProgress(0);

    const orgId = organization.id;

    const customerMap = new Map<string, string>();
    let customerCount = 0;
    let invoiceCount = 0;
    const total = validRows.length;

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      const key = row.customerName.toLowerCase().trim();

      if (!customerMap.has(key)) {
        const { data: existing } = await db
          .from("customers").select("id").eq("org_id", orgId).ilike("name", row.customerName).single();

        if (existing?.id) {
          customerMap.set(key, existing.id);
        } else {
          const { data: newCust } = await db
            .from("customers")
            .insert({ org_id: orgId, name: row.customerName, email: row.customerEmail || null, payment_terms: row.paymentTerms, segment: "standard" })
            .select("id").single();
          if (newCust?.id) { customerMap.set(key, newCust.id); customerCount++; }
        }
      }

      const customerId = customerMap.get(key);
      if (!customerId) continue;

      const { data: existingInv } = await db
        .from("invoices").select("id").eq("org_id", orgId).eq("invoice_number", row.invoiceNumber).single();

      if (!existingInv) {
        await db.from("invoices").insert({
          org_id: orgId, customer_id: customerId, invoice_number: row.invoiceNumber,
          amount: row.amount, currency: row.currency, issue_date: row.issueDate,
          due_date: row.dueDate, status: row.status, days_overdue: row.daysOverdue, priority_score: 0,
        });
        invoiceCount++;
      }

      setImportProgress(Math.round(((i + 1) / total) * 100));
    }

    setImportStats({ customers: customerCount, invoices: invoiceCount });
    setStep("done");
  }

  const bucketSummary = validRows.reduce<Record<string, { count: number; amount: number }>>(
    (acc, r) => {
      let bucket = "Current";
      if (r.daysOverdue > 90)      bucket = "90d+";
      else if (r.daysOverdue > 60) bucket = "61–90d";
      else if (r.daysOverdue > 30) bucket = "31–60d";
      else if (r.daysOverdue > 0)  bucket = "1–30d";
      if (!acc[bucket]) acc[bucket] = { count: 0, amount: 0 };
      acc[bucket].count++;
      acc[bucket].amount += r.amount;
      return acc;
    }, {}
  );

  const totalAmount = validRows.reduce((s, r) => s + r.amount, 0);
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  const requiredMapped = AR_FIELDS.filter((f) => f.required).every((f) => mapping[f.key]);

  // ── Loading check ─────────────────────────────────────────
  if (hasData === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Live dashboard view ───────────────────────────────────
  if (hasData && !showImport) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => { setShowImport(true); setStep("upload"); setParsed(null); setMapping({}); setValidRows([]); setErrors([]); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all"
          >
            <Plus className="w-4 h-4" /> Import More
          </button>
        </div>
        <AgingDashboard />
      </div>
    );
  }

  // ── Import UI ─────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">AR Aging</h2>
          <p className="text-surface-400 text-sm mt-1">Import your accounts receivable data to start tracking and collecting.</p>
        </div>
        <div className="flex gap-2">
          {hasData && (
            <button onClick={() => setShowImport(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Dashboard
            </button>
          )}
          {step !== "upload" && (
            <button
              onClick={() => { setStep("upload"); setParsed(null); setMapping({}); setValidRows([]); setErrors([]); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Start Over
            </button>
          )}
        </div>
      </div>

      {globalError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />{globalError}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed transition-all cursor-pointer p-12 text-center ${
                dragging ? "border-primary-500 bg-primary-500/10" : "border-surface-700 hover:border-primary-500/50 bg-surface-900/40 hover:bg-surface-900/60"
              }`}
            >
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-5">
                <Upload className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {dragging ? "Drop your file here" : "Upload AR Aging CSV"}
              </h3>
              <p className="text-surface-400 text-sm mb-5 max-w-sm mx-auto">
                Export from QuickBooks, Xero, NetSuite, or use any CSV with customer and invoice data.
              </p>
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-sm">
                <FileSpreadsheet className="w-4 h-4" /> Choose File
              </span>
              <p className="text-surface-600 text-xs mt-4">CSV, XLS, XLSX · Max 10MB</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[["📊","QuickBooks","Aging Summary"],["🟦","Xero","CSV Export"],["⚙️","NetSuite","AR Report"],["📄","Generic","Any CSV"]].map(([icon, name, type]) => (
                <div key={name} className="glass rounded-xl p-3 text-center">
                  <span className="text-xl block mb-1">{icon}</span>
                  <p className="text-xs font-medium text-white">{name}</p>
                  <p className="text-xs text-surface-500">{type}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "mapping" && parsed && (
          <motion.div key="mapping" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-1">
                <FileSpreadsheet className="w-5 h-5 text-primary-400" />
                <h3 className="text-base font-semibold text-white">Map Your Columns</h3>
                <span className="ml-auto text-xs text-surface-500">{parsed.rowCount} rows detected</span>
              </div>
              <p className="text-surface-400 text-xs mb-6">We auto-detected most columns. Fix any that look wrong.</p>
              <div className="space-y-3">
                {AR_FIELDS.map((field) => (
                  <div key={field.key} className="grid sm:grid-cols-2 gap-3 items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-surface-300 font-medium">{field.label}</span>
                      {field.required ? <span className="text-xs text-danger-400">*</span> : <span className="text-xs text-surface-600">optional</span>}
                    </div>
                    <div className="relative">
                      <select
                        value={mapping[field.key] ?? ""}
                        onChange={(e) => setMapping((m) => ({ ...m, [field.key as ARFieldKey]: e.target.value || undefined }))}
                        className={`w-full appearance-none bg-surface-800/60 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors pr-8 ${
                          mapping[field.key] ? "border-surface-600" : field.required ? "border-danger-500/40" : "border-surface-700"
                        }`}
                      >
                        <option value="">— not mapped —</option>
                        {parsed.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
              {!requiredMapped && (
                <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-warning-500/10 border border-warning-500/20 text-warning-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />Map all required fields (*) to continue.
                </div>
              )}
              <div className="flex justify-end mt-5">
                <button onClick={handleValidate} disabled={!requiredMapped}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-sm hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  Validate Data <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="glass rounded-2xl p-5 overflow-x-auto">
              <p className="text-xs text-surface-500 uppercase tracking-wider font-medium mb-3">File Preview (first 3 rows)</p>
              <table className="w-full text-xs">
                <thead><tr>{parsed.headers.map((h) => <th key={h} className="text-left text-surface-400 pb-2 pr-4 whitespace-nowrap font-medium">{h}</th>)}</tr></thead>
                <tbody>
                  {parsed.rows.slice(0, 3).map((row, i) => (
                    <tr key={i} className="border-t border-surface-800">
                      {parsed.headers.map((h) => <td key={h} className="py-2 pr-4 text-surface-300 whitespace-nowrap">{row[h] ?? "—"}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {step === "preview" && (
          <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { label: "Total AR", value: fmt(totalAmount), color: "text-white" },
                { label: "Invoices", value: validRows.length.toString(), color: "text-white" },
                { label: "Errors", value: errors.length.toString(), color: errors.length > 0 ? "text-danger-400" : "text-success-400" },
                { label: "Customers", value: new Set(validRows.map(r => r.customerName.toLowerCase())).size.toString(), color: "text-white" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-surface-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary-400" /> Aging Breakdown
              </h3>
              <div className="space-y-3">
                {["Current","1–30d","31–60d","61–90d","90d+"].map((bucket) => {
                  const b = bucketSummary[bucket] ?? { count: 0, amount: 0 };
                  const pct = totalAmount > 0 ? (b.amount / totalAmount) * 100 : 0;
                  return (
                    <div key={bucket}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-surface-300 font-medium">{bucket}</span>
                        <span className="text-surface-400">{fmt(b.amount)} · {b.count} inv</span>
                      </div>
                      <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                        <div className={`h-full ${BUCKET_COLORS[bucket]} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {errors.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-warning-400" />
                  <h3 className="text-sm font-semibold text-white">{errors.length} rows will be skipped</h3>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {errors.map((e, i) => (
                    <div key={i} className="flex gap-3 text-xs text-surface-400">
                      <span className="text-surface-600 shrink-0">Row {e.row}</span>
                      <span className="text-warning-400">{e.field}</span>
                      <span>{e.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-surface-800 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Invoice Preview</h3>
                <span className="text-xs text-surface-500">{validRows.length} valid rows</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-surface-800">
                      {["Customer","Invoice #","Amount","Due Date","Days Overdue","Status"].map((h) => (
                        <th key={h} className="text-left text-surface-500 px-4 py-2.5 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {validRows.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-t border-surface-800/50 hover:bg-surface-800/20">
                        <td className="px-4 py-2.5 text-surface-200 font-medium">{row.customerName}</td>
                        <td className="px-4 py-2.5 text-surface-400">{row.invoiceNumber}</td>
                        <td className="px-4 py-2.5 text-white font-medium">{fmt(row.amount)}</td>
                        <td className="px-4 py-2.5 text-surface-400">{row.dueDate}</td>
                        <td className="px-4 py-2.5">
                          <span className={`font-medium ${row.daysOverdue > 60 ? "text-danger-400" : row.daysOverdue > 30 ? "text-warning-400" : row.daysOverdue > 0 ? "text-yellow-400" : "text-success-400"}`}>
                            {row.daysOverdue > 0 ? `${row.daysOverdue}d` : "Current"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.status === "paid" ? "bg-success-500/15 text-success-400" :
                            row.status === "overdue" ? "bg-danger-500/15 text-danger-400" : "bg-surface-700 text-surface-400"
                          }`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {validRows.length > 20 && <p className="text-center text-xs text-surface-600 py-3">+{validRows.length - 20} more rows not shown</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setStep("mapping")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white">
                <X className="w-4 h-4" /> Back to Mapping
              </button>
              <button onClick={handleImport} disabled={validRows.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-sm hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-40">
                Import {validRows.length} Invoices <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "importing" && (
          <motion.div key="importing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 text-center">
            <Loader2 className="w-12 h-12 text-primary-400 animate-spin mb-6" />
            <h3 className="text-lg font-semibold text-white mb-2">Importing your data...</h3>
            <p className="text-surface-400 text-sm mb-6">{importProgress}% complete</p>
            <div className="w-64 h-2 bg-surface-800 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                animate={{ width: `${importProgress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-success-500/15 border border-success-500/30 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-success-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Import Complete</h3>
            <p className="text-surface-400 text-sm mb-8">
              {importStats.customers} new customers · {importStats.invoices} invoices imported
            </p>
            <button
              onClick={() => { setHasData(true); setShowImport(false); }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-sm"
            >
              View AR Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
