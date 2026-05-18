import Papa from "papaparse";

export interface RawRow {
  [key: string]: string;
}

export interface ParsedCSV {
  headers: string[];
  rows: RawRow[];
  rowCount: number;
}

// Our canonical AR fields — what we need from the CSV
export const AR_FIELDS = [
  { key: "customer_name",    label: "Customer Name",    required: true  },
  { key: "customer_email",   label: "Customer Email",   required: false },
  { key: "invoice_number",   label: "Invoice Number",   required: true  },
  { key: "invoice_amount",   label: "Invoice Amount",   required: true  },
  { key: "issue_date",       label: "Issue Date",       required: false },
  { key: "due_date",         label: "Due Date",         required: true  },
  { key: "status",           label: "Status",           required: false },
  { key: "payment_terms",    label: "Payment Terms",    required: false },
  { key: "currency",         label: "Currency",         required: false },
] as const;

export type ARFieldKey = typeof AR_FIELDS[number]["key"];
export type ColumnMap = Record<ARFieldKey, string>; // fieldKey → CSV header

// Auto-detect column mapping from CSV headers
const ALIASES: Record<ARFieldKey, string[]> = {
  customer_name:  ["customer", "customer name", "client", "client name", "name", "company"],
  customer_email: ["email", "customer email", "client email", "e-mail"],
  invoice_number: ["invoice number", "invoice no", "invoice #", "inv #", "inv no", "number", "invoice"],
  invoice_amount: ["amount", "total", "balance", "open balance", "amount due", "total due", "invoice amount", "outstanding"],
  issue_date:     ["date", "invoice date", "issue date", "created date", "transaction date"],
  due_date:       ["due date", "due", "payment due", "due by"],
  status:         ["status", "invoice status", "payment status"],
  payment_terms:  ["terms", "payment terms", "net"],
  currency:       ["currency", "curr"],
};

export function detectMapping(headers: string[]): Partial<ColumnMap> {
  const lower = headers.map((h) => h.toLowerCase().trim());
  const map: Partial<ColumnMap> = {};

  for (const field of AR_FIELDS) {
    const aliases = ALIASES[field.key];
    for (const alias of aliases) {
      const idx = lower.findIndex((h) => h === alias || h.includes(alias));
      if (idx !== -1) {
        map[field.key] = headers[idx];
        break;
      }
    }
  }
  return map;
}

export function parseCSVFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        resolve({
          headers,
          rows: results.data,
          rowCount: results.data.length,
        });
      },
      error: (err) => reject(new Error(err.message)),
    });
  });
}

// ── Validation ──────────────────────────────────────────────

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ImportRow {
  customerName: string;
  customerEmail: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: string;
  paymentTerms: number;
  daysOverdue: number;
}

function parseDate(val: string): string | null {
  if (!val?.trim()) return null;
  // Try common formats: MM/DD/YYYY, YYYY-MM-DD, DD/MM/YYYY, "Jan 15, 2025"
  const cleaned = val.trim();
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return null;
}

function parseAmount(val: string): number | null {
  if (!val?.trim()) return null;
  const cleaned = val.replace(/[$,\s€£]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : Math.abs(n);
}

function parseDays(val: string): number {
  const match = val?.match(/\d+/);
  return match ? parseInt(match[0]) : 30;
}

export function validateAndTransform(
  rows: RawRow[],
  mapping: ColumnMap
): { valid: ImportRow[]; errors: ValidationError[] } {
  const valid: ImportRow[] = [];
  const errors: ValidationError[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  rows.forEach((row, i) => {
    const rowNum = i + 2; // 1-indexed + header row
    const rowErrors: ValidationError[] = [];

    const customerName = row[mapping.customer_name]?.trim() ?? "";
    const invoiceNumber = row[mapping.invoice_number]?.trim() ?? "";
    const rawAmount = row[mapping.invoice_amount] ?? "";
    const rawDue = row[mapping.due_date] ?? "";
    const rawIssue = row[mapping.issue_date] ?? "";
    const rawStatus = row[mapping.status] ?? "";
    const rawTerms = row[mapping.payment_terms] ?? "30";
    const rawCurrency = row[mapping.currency]?.trim() ?? "USD";
    const customerEmail = row[mapping.customer_email]?.trim() ?? "";

    if (!customerName) rowErrors.push({ row: rowNum, field: "Customer Name", message: "Required" });
    if (!invoiceNumber) rowErrors.push({ row: rowNum, field: "Invoice Number", message: "Required" });

    const amount = parseAmount(rawAmount);
    if (amount === null) rowErrors.push({ row: rowNum, field: "Amount", message: `Cannot parse "${rawAmount}"` });

    const dueDate = parseDate(rawDue);
    if (!dueDate) rowErrors.push({ row: rowNum, field: "Due Date", message: `Cannot parse "${rawDue}"` });

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      return;
    }

    const dueDateObj = new Date(dueDate!);
    const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDateObj.getTime()) / 86400000));

    let normalizedStatus = "open";
    const s = rawStatus.toLowerCase().trim();
    if (s.includes("paid")) normalizedStatus = "paid";
    else if (daysOverdue > 0) normalizedStatus = "overdue";

    valid.push({
      customerName,
      customerEmail,
      invoiceNumber,
      amount: amount!,
      currency: rawCurrency || "USD",
      issueDate: parseDate(rawIssue) ?? new Date().toISOString().split("T")[0],
      dueDate: dueDate!,
      status: normalizedStatus,
      paymentTerms: parseDays(rawTerms),
      daysOverdue,
    });
  });

  return { valid, errors };
}
