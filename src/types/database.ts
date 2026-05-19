// Database row types — mirrors supabase/schema.sql exactly.
// Update both files together when schema changes.

export interface Organization {
  id: string;
  name: string;
  plan_tier: "starter" | "growth" | "scale";
  mrr: number | null;
  contract_start: string | null;
  contract_end: string | null;
  status: "active" | "onboarding" | "paused" | "churned";
  created_at: string;
}

export interface OrgUser {
  id: string;
  org_id: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  created_at: string;
}

export interface OrgSettings {
  org_id: string;
  timezone: string;
  currency: string;
  business_hours: { start: string; end: string; days: number[] };
  email_signature: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  payment_terms: number;
  credit_limit: number | null;
  segment: "strategic" | "standard" | "at_risk";
  created_at: string;
}

export interface Invoice {
  id: string;
  org_id: string;
  customer_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  issue_date: string;
  due_date: string;
  status: "open" | "reminded" | "overdue" | "paid" | "written_off" | "disputed";
  days_overdue: number;
  priority_score: number | null;
  payment_received_date: string | null;
  customer_segment: string | null;
  payment_link_url: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  org_id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  method: string;
  dodo_payment_id: string | null;
  matched: boolean;
  created_at: string;
}

export interface Communication {
  id: string;
  org_id: string;
  customer_id: string | null;
  invoice_id: string | null;
  type: "email" | "call" | "note";
  subject: string | null;
  content: string;
  sent_at: string;
  status: "draft" | "sent" | "opened" | "clicked" | "bounced" | "failed";
  direction: "outbound" | "inbound";
  sent_by_ai: boolean;
  approved_by: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  resend_message_id: string | null;
}

// ── New tables ──────────────────────────────────────────────────────────────

export type DisputeReason =
  | "incorrect_amount"
  | "goods_not_received"
  | "duplicate_invoice"
  | "already_paid"
  | "service_not_rendered"
  | "other";

export type DisputeStatus = "open" | "investigating" | "resolved" | "rejected";

export interface Dispute {
  id: string;
  org_id: string;
  invoice_id: string;
  customer_id: string;
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  resolution_notes: string | null;
  assigned_to: string | null;
  created_at: string;
  resolved_at: string | null;
  // joined fields
  invoice_number?: string;
  invoice_amount?: number;
  customer_name?: string;
}

export type PaymentLinkStatus = "pending" | "paid" | "expired" | "cancelled";

export interface PaymentLink {
  id: string;
  org_id: string;
  invoice_id: string;
  dodo_payment_id: string | null;
  dodo_session_id: string | null;
  amount: number;
  currency: string;
  status: PaymentLinkStatus;
  payment_url: string;
  expires_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export type IntegrationProvider = "quickbooks" | "xero" | "netsuite" | "sage";
export type IntegrationStatus = "connected" | "disconnected" | "error" | "syncing";

export interface Integration {
  id: string;
  org_id: string;
  provider: IntegrationProvider;
  access_token: string | null;
  refresh_token: string | null;
  realm_id: string | null;
  token_expires_at: string | null;
  status: IntegrationStatus;
  last_sync_at: string | null;
  last_sync_count: number | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}
