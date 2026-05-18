import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ============================================================
// TypeScript types mirroring the database schema
// ============================================================

export type PlanTier = "starter" | "growth" | "scale";
export type UserRole = "admin" | "operator" | "viewer";
export type CustomerSegment = "strategic" | "standard" | "at_risk";
export type InvoiceStatus = "open" | "reminded" | "overdue" | "paid" | "written_off";
export type CommunicationType = "email" | "call" | "note";
export type CommunicationStatus = "draft" | "sent" | "opened" | "clicked" | "bounced" | "failed";

export interface Organization {
  id: string;
  name: string;
  plan_tier: PlanTier;
  created_at: string;
}

export interface OrgUser {
  id: string;
  org_id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface OrgSettings {
  org_id: string;
  timezone: string;
  currency: string;
  business_hours: {
    start: string;
    end: string;
    days: number[];
  };
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
  segment: CustomerSegment;
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
  status: InvoiceStatus;
  days_overdue: number;
  priority_score: number;
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
  type: CommunicationType;
  subject: string | null;
  content: string;
  sent_at: string;
  status: CommunicationStatus;
}

// ============================================================
// Auth helpers
// ============================================================

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getCurrentOrgUser(userId: string): Promise<OrgUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data as OrgUser;
}

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();
  if (error || !data) return null;
  return data as Organization;
}
