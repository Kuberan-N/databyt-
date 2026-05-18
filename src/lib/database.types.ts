// Auto-generated placeholder — replace with output of `supabase gen types typescript`
// after running the schema.sql in your Supabase project.
export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          plan_tier: "starter" | "growth" | "scale";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          plan_tier?: "starter" | "growth" | "scale";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          plan_tier?: "starter" | "growth" | "scale";
        };
      };
      users: {
        Row: {
          id: string;
          org_id: string;
          email: string;
          role: "admin" | "operator" | "viewer";
          created_at: string;
        };
        Insert: {
          id: string;
          org_id: string;
          email: string;
          role?: "admin" | "operator" | "viewer";
          created_at?: string;
        };
        Update: {
          org_id?: string;
          email?: string;
          role?: "admin" | "operator" | "viewer";
        };
      };
      org_settings: {
        Row: {
          org_id: string;
          timezone: string;
          currency: string;
          business_hours: { start: string; end: string; days: number[] };
          email_signature: string;
          updated_at: string;
        };
        Insert: {
          org_id: string;
          timezone?: string;
          currency?: string;
          business_hours?: { start: string; end: string; days: number[] };
          email_signature?: string;
        };
        Update: {
          timezone?: string;
          currency?: string;
          business_hours?: { start: string; end: string; days: number[] };
          email_signature?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          payment_terms: number;
          credit_limit: number | null;
          segment: "strategic" | "standard" | "at_risk";
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          payment_terms?: number;
          credit_limit?: number | null;
          segment?: "strategic" | "standard" | "at_risk";
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string | null;
          payment_terms?: number;
          credit_limit?: number | null;
          segment?: "strategic" | "standard" | "at_risk";
        };
      };
      invoices: {
        Row: {
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
          priority_score: number;
          payment_received_date: string | null;
          customer_segment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          customer_id: string;
          invoice_number: string;
          amount: number;
          currency?: string;
          issue_date: string;
          due_date: string;
          status?: "open" | "reminded" | "overdue" | "paid" | "written_off";
          priority_score?: number;
          payment_received_date?: string | null;
          customer_segment?: string | null;
        };
        Update: {
          status?: "open" | "reminded" | "overdue" | "paid" | "written_off";
          priority_score?: number;
          payment_received_date?: string | null;
          customer_segment?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          org_id: string;
          invoice_id: string;
          amount: number;
          payment_date: string;
          method: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          invoice_id: string;
          amount: number;
          payment_date: string;
          method?: string;
        };
        Update: {
          amount?: number;
          payment_date?: string;
          method?: string;
        };
      };
      communications: {
        Row: {
          id: string;
          org_id: string;
          customer_id: string | null;
          invoice_id: string | null;
          type: "email" | "call" | "note";
          subject: string | null;
          content: string;
          sent_at: string;
          status: "draft" | "sent" | "opened" | "clicked" | "bounced" | "failed";
        };
        Insert: {
          id?: string;
          org_id: string;
          customer_id?: string | null;
          invoice_id?: string | null;
          type: "email" | "call" | "note";
          subject?: string | null;
          content: string;
          sent_at?: string;
          status?: "draft" | "sent" | "opened" | "clicked" | "bounced" | "failed";
        };
        Update: {
          status?: "draft" | "sent" | "opened" | "clicked" | "bounced" | "failed";
        };
      };
    };
    Functions: {
      current_user_org_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
};
