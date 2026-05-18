-- ============================================================
-- DataByt Phase 1 Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- ============================================================
-- CORE TABLES
-- ============================================================

create table if not exists public.organizations (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  plan_tier       text not null default 'starter' check (plan_tier in ('starter', 'growth', 'scale')),
  mrr             numeric(10,2),
  contract_start  date,
  contract_end    date,
  status          text not null default 'active' check (status in ('active', 'onboarding', 'paused', 'churned')),
  created_at      timestamptz not null default now()
);

create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  org_id      uuid not null references public.organizations(id) on delete cascade,
  email       text not null,
  role        text not null default 'admin' check (role in ('admin', 'operator', 'viewer')),
  created_at  timestamptz not null default now()
);

create table if not exists public.org_settings (
  org_id           uuid primary key references public.organizations(id) on delete cascade,
  timezone         text not null default 'America/New_York',
  currency         text not null default 'USD',
  business_hours   jsonb default '{"start": "09:00", "end": "17:00", "days": [1,2,3,4,5]}',
  email_signature  text default '',
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- AR TABLES (Phase 3 — created now so RLS is set up correctly)
-- ============================================================

create table if not exists public.customers (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references public.organizations(id) on delete cascade,
  name             text not null,
  email            text,
  phone            text,
  payment_terms    int not null default 30,
  credit_limit     numeric(15,2),
  segment          text default 'standard' check (segment in ('strategic', 'standard', 'at_risk')),
  created_at       timestamptz not null default now()
);

create table if not exists public.invoices (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid not null references public.organizations(id) on delete cascade,
  customer_id           uuid not null references public.customers(id) on delete cascade,
  invoice_number        text not null,
  amount                numeric(15,2) not null,
  currency              text not null default 'USD',
  issue_date            date not null,
  due_date              date not null,
  status                text not null default 'open' check (status in ('open', 'reminded', 'overdue', 'paid', 'written_off')),
  days_overdue          int not null default 0,
  priority_score        numeric(6,2) default 0,
  payment_received_date date,
  customer_segment      text,
  created_at            timestamptz not null default now()
);

create table if not exists public.payments (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations(id) on delete cascade,
  invoice_id    uuid not null references public.invoices(id) on delete cascade,
  amount        numeric(15,2) not null,
  payment_date  date not null,
  method        text default 'unknown',
  created_at    timestamptz not null default now()
);

create table if not exists public.communications (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.organizations(id) on delete cascade,
  customer_id  uuid references public.customers(id) on delete set null,
  invoice_id   uuid references public.invoices(id) on delete set null,
  type         text not null check (type in ('email', 'call', 'note')),
  subject      text,
  content      text not null,
  sent_at      timestamptz not null default now(),
  status       text default 'sent' check (status in ('draft', 'sent', 'opened', 'clicked', 'bounced', 'failed')),
  direction         text not null default 'outbound' check (direction in ('outbound', 'inbound')),
  sent_by_ai        boolean not null default false,
  approved_by       text,
  opened_at         timestamptz,
  clicked_at        timestamptz,
  resend_message_id text
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_users_org_id           on public.users(org_id);
create index if not exists idx_customers_org_id       on public.customers(org_id);
create index if not exists idx_invoices_org_id        on public.invoices(org_id);
create index if not exists idx_invoices_customer_id   on public.invoices(customer_id);
create index if not exists idx_invoices_status        on public.invoices(status);
create index if not exists idx_payments_org_id        on public.payments(org_id);
create index if not exists idx_payments_invoice_id    on public.payments(invoice_id);
create index if not exists idx_communications_org_id  on public.communications(org_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.organizations   enable row level security;
alter table public.users           enable row level security;
alter table public.org_settings    enable row level security;
alter table public.customers       enable row level security;
alter table public.invoices        enable row level security;
alter table public.payments        enable row level security;
alter table public.communications  enable row level security;

-- Helper: get org_id for the current authenticated user
create or replace function public.current_user_org_id()
returns uuid
language sql
stable
security definer
as $$
  select org_id from public.users where id = auth.uid() limit 1;
$$;

-- organizations: user can only see their own org
create policy "org_select" on public.organizations
  for select using (id = public.current_user_org_id());

create policy "org_update" on public.organizations
  for update using (id = public.current_user_org_id());

-- users: can only see users in same org
create policy "users_select" on public.users
  for select using (org_id = public.current_user_org_id());

create policy "users_insert" on public.users
  for insert with check (id = auth.uid());

create policy "users_update" on public.users
  for update using (id = auth.uid());

-- org_settings
create policy "org_settings_select" on public.org_settings
  for select using (org_id = public.current_user_org_id());

create policy "org_settings_upsert" on public.org_settings
  for all using (org_id = public.current_user_org_id());

-- customers
create policy "customers_select" on public.customers
  for select using (org_id = public.current_user_org_id());

create policy "customers_insert" on public.customers
  for insert with check (org_id = public.current_user_org_id());

create policy "customers_update" on public.customers
  for update using (org_id = public.current_user_org_id());

create policy "customers_delete" on public.customers
  for delete using (org_id = public.current_user_org_id());

-- invoices
create policy "invoices_select" on public.invoices
  for select using (org_id = public.current_user_org_id());

create policy "invoices_insert" on public.invoices
  for insert with check (org_id = public.current_user_org_id());

create policy "invoices_update" on public.invoices
  for update using (org_id = public.current_user_org_id());

create policy "invoices_delete" on public.invoices
  for delete using (org_id = public.current_user_org_id());

-- payments
create policy "payments_select" on public.payments
  for select using (org_id = public.current_user_org_id());

create policy "payments_insert" on public.payments
  for insert with check (org_id = public.current_user_org_id());

create policy "payments_update" on public.payments
  for update using (org_id = public.current_user_org_id());

-- communications
create policy "communications_select" on public.communications
  for select using (org_id = public.current_user_org_id());

create policy "communications_insert" on public.communications
  for insert with check (org_id = public.current_user_org_id());

create policy "communications_update" on public.communications
  for update using (org_id = public.current_user_org_id());

-- ============================================================
-- TRIGGER: auto-create users row when invited client signs up
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  if new.raw_user_meta_data->>'org_id' is not null then
    insert into public.users (id, org_id, email, role)
    values (
      new.id,
      (new.raw_user_meta_data->>'org_id')::uuid,
      new.email,
      coalesce(new.raw_user_meta_data->>'role', 'admin')
    )
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TRIGGER: auto-create org_settings row when org is created
-- ============================================================

create or replace function public.handle_new_organization()
returns trigger language plpgsql security definer as $$
begin
  insert into public.org_settings (org_id)
  values (new.id)
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_organization_created on public.organizations;
create trigger on_organization_created
  after insert on public.organizations
  for each row execute procedure public.handle_new_organization();
