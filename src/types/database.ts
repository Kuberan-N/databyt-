// Database row types — mirrors supabase/schema.sql exactly.
// Update both files together when schema changes.

export interface Organization {
  id: string;
  name: string;
  plan_tier: "starter" | "growth" | "scale";
  mrr: number | null;
  contract_start: string | null;  // date ISO string
  contract_end: string | null;    // date ISO string
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
  status: "open" | "reminded" | "overdue" | "paid" | "written_off";
  days_overdue: number;
  priority_score: number | null;
  payment_received_date: string | null;
  customer_segment: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  org_id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  method: string;
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
  approved_by: string | null;  // operator email
  opened_at: string | null;
  clicked_at: string | null;
  resend_message_id: string | null;
}
