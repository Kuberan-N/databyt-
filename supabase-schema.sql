-- DataByt CashFlow AI — Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/kpozjrxspqwqomdlkhht/sql)

-- ============================================
-- 1. ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'scale')),
  subscription_id TEXT,
  subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'paused')),
  quickbooks_token JSONB,
  xero_token JSONB,
  invoice_count_this_month INTEGER DEFAULT 0,
  dunning_email_from TEXT,
  company_website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_id);

-- ============================================
-- 2. INVOICES TABLE (AP side)
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  vendor_name TEXT,
  invoice_number TEXT,
  amount DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  due_date DATE,
  invoice_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'extracting', 'extracted', 'reviewed', 'synced', 'error')),
  extracted_data JSONB,
  confidence_score DECIMAL(5,4),
  file_url TEXT,
  file_name TEXT,
  erp_bill_id TEXT,
  error_message TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_org ON invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(org_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices(org_id, created_at DESC);

-- ============================================
-- 3. RECEIVABLES TABLE (AR side)
-- ============================================
CREATE TABLE IF NOT EXISTS receivables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_email TEXT,
  invoice_number TEXT,
  amount DECIMAL(12,2),
  amount_paid DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  due_date DATE,
  days_overdue INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reminded', 'overdue', 'paid', 'partial', 'written_off', 'disputed')),
  priority_score DECIMAL(5,2) DEFAULT 0,
  last_reminded_at TIMESTAMPTZ,
  next_reminder_at TIMESTAMPTZ,
  reminder_count INTEGER DEFAULT 0,
  dunning_sequence TEXT DEFAULT 'default',
  erp_invoice_id TEXT,
  payment_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for receivables
CREATE INDEX IF NOT EXISTS idx_receivables_org ON receivables(org_id);
CREATE INDEX IF NOT EXISTS idx_receivables_status ON receivables(org_id, status);
CREATE INDEX IF NOT EXISTS idx_receivables_overdue ON receivables(org_id, days_overdue DESC);
CREATE INDEX IF NOT EXISTS idx_receivables_priority ON receivables(org_id, priority_score DESC);

-- ============================================
-- 4. DUNNING LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS dunning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receivable_id UUID NOT NULL REFERENCES receivables(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email_to TEXT,
  email_subject TEXT,
  email_body TEXT,
  email_provider_id TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  response TEXT CHECK (response IN ('paid', 'replied', 'bounced', 'no_response', 'unsubscribed'))
);

CREATE INDEX IF NOT EXISTS idx_dunning_receivable ON dunning_logs(receivable_id);
CREATE INDEX IF NOT EXISTS idx_dunning_org ON dunning_logs(org_id);

-- ============================================
-- 5. VENDOR PATTERNS TABLE (Vendor Learning Agent)
-- ============================================
CREATE TABLE IF NOT EXISTS vendor_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  field_mappings JSONB,
  extraction_overrides JSONB,
  success_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_patterns_unique ON vendor_patterns(org_id, vendor_name);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE receivables ENABLE ROW LEVEL SECURITY;
ALTER TABLE dunning_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_patterns ENABLE ROW LEVEL SECURITY;

-- Organizations: users can only see their own
CREATE POLICY "Users can view own organizations" ON organizations
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own organizations" ON organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own organizations" ON organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- Invoices: users can only see invoices from their organization
CREATE POLICY "Users can view org invoices" ON invoices
  FOR SELECT USING (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can insert org invoices" ON invoices
  FOR INSERT WITH CHECK (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can update org invoices" ON invoices
  FOR UPDATE USING (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

-- Receivables: same org-based policy
CREATE POLICY "Users can view org receivables" ON receivables
  FOR SELECT USING (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can insert org receivables" ON receivables
  FOR INSERT WITH CHECK (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can update org receivables" ON receivables
  FOR UPDATE USING (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

-- Dunning logs: same org-based policy
CREATE POLICY "Users can view org dunning" ON dunning_logs
  FOR SELECT USING (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can insert org dunning" ON dunning_logs
  FOR INSERT WITH CHECK (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

-- Vendor patterns: same org-based policy
CREATE POLICY "Users can view org vendor patterns" ON vendor_patterns
  FOR SELECT USING (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can manage org vendor patterns" ON vendor_patterns
  FOR ALL USING (
    org_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
  );

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_receivables_updated_at
  BEFORE UPDATE ON receivables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
