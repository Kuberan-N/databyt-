# DataByt — Complete AI Context (A–Z)

> **Purpose of this file.** This is the single, self-contained source of truth about DataByt for any AI — a code editor (Antigravity, Cursor, Windsurf, Copilot) reading the repo, or a chat assistant (Claude, ChatGPT, Gemini) with no repo access. Read this and you know everything: the business, the architecture, every table, every API route, every page, every convention, every gotcha. Nothing is assumed; everything is stated.
>
> **Last verified against the codebase:** June 2026. If a detail here contradicts the actual code, the code wins — but flag the drift.

---

## 0. TL;DR (the 60-second version)

- **What:** DataByt is an **AI-powered Accounts Receivable (AR) collections platform** for mid-market B2B finance teams. It connects to a company's accounting software, imports overdue invoices daily, and sends AI-written dunning (payment-reminder) emails that escalate in tone — turning a manual chase into an automated system. It also handles disputes, payment collection, analytics, and board reporting.
- **Who it's for:** CFOs / finance teams at B2B companies doing roughly **$5M–$100M revenue (₹40Cr–₹800Cr)**, using QuickBooks Online or Xero, with a DSO (Days Sales Outstanding) above ~40 days.
- **Business model:** One flat SaaS plan. **INTL: $2,000/mo founding (→$4,000 standard), $20,000/yr.** **India: ₹39,000/mo founding (→₹79,000 standard), ₹3,90,000/yr.** 30-day free trial. Founding rate locked for first 20 customers.
- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, Supabase (Postgres + Auth + RLS), Gemini 2.0 Flash (the AI), Resend (email), Dodo Payments (billing), deployed on Vercel.
- **Owner / solo founder:** Kuberan (email kuberanoh@gmail.com). Admin routes are gated to this email.
- **Live site:** www.databyt.in (currently `.in`; brand strategy targets EU/US, a `.io` is planned).
- **Stage:** Built end-to-end, build passing. Pre-first-customer. Goal: 100 CFO LinkedIn followers → 5 clients in 90 days.

---

## 1. The Product & Business

### 1.1 The problem DataByt solves
B2B companies invoice customers on terms (e.g. Net 30). Many customers pay late — industry data: ~55% of B2B invoices are paid late; mid-market DSO averages 60–90 days. Late payment locks up working capital and forces finance teams to chase manually (writing reminder emails one invoice at a time, tracking in spreadsheets). This is slow, inconsistent, and expensive (~$39K/yr overhead per company; ~16 hrs/week of staff time).

### 1.2 What DataByt does (the full loop)
```
import → score → email → pay → match → dispute → analyse
```
1. **Import** — Connects via OAuth to the customer's accounting system (QuickBooks Online / Xero / NetSuite / Sage). Imports overdue invoices automatically, daily. No CSV.
2. **Score** — Every overdue invoice is scored by amount + days overdue + customer segment to prioritise.
3. **Email** — An AI agent (Gemini) writes a personalised dunning email. **One email per customer** covering ALL their overdue invoices (not one per invoice). Tone escalates by how late: **L1** (polite, ≥1 day), **L2** (firm, ≥10 days), **L3** (final notice, ≥30 days).
4. **Pay** — Every email includes a payment link. The customer pays through the org's own payment URL.
5. **Match** — Payment is recorded against the invoice; invoice marked paid; it leaves the overdue queue.
6. **Dispute** — If a customer contests an invoice, a dispute is filed; collections pause for that customer; finance investigates; resolve/reject; collections resume.
7. **Analyse** — Live dashboards: DSO trend, CEI gauge, cash-flow forecast, email performance, plus a one-click board PDF.

### 1.3 Key finance terms (the domain)
- **AR (Accounts Receivable):** money customers owe the business for delivered goods/services.
- **AR Aging:** a report bucketing unpaid invoices by how overdue they are (Current, 1–30, 31–60, 61–90, 90+).
- **DSO (Days Sales Outstanding):** average days to get paid. Lower = better. DataByt targets ~30% reduction.
- **CEI (Collections Effectiveness Index):** % of collectible money actually collected in a period. Higher = better. 85%+ is strong.
- **Dunning:** the process of sending escalating payment reminders.
- **L1 / L2 / L3:** the three escalation levels (polite → firm → final notice).

### 1.4 Pricing (exact, both markets)
Defined in code at `src/lib/geo.ts`. Geo-detected via the `x-vercel-ip-country` header in `src/app/page.tsx`.

| | International (USD) | India (INR) |
|---|---|---|
| Founding monthly | $2,000 | ₹39,000 |
| Standard monthly (after 20 clients) | $4,000 | ₹79,000 |
| Annual | $20,000 ( = $1,667/mo) | ₹3,90,000 ( = ₹32,500/mo) |
| Annual saving | $4,000 (2 months free) | ₹78,000 (2 months free) |
| Free trial | 30 days, no credit card | same |

Positioning vs competitors: HighRadius $100K+/yr, Billtrust $50K+/yr → DataByt from $20K/yr. "One plan, everything included."

### 1.5 Go-to-market
- **Channel:** LinkedIn — build trust with CFO audience via educational content, then launch. Plan: 100 CFO followers in 30 days, 5 clients in 90 days, ≥1 annual client. (Full plan + 30 post scripts in `DataByt-Guide/04-marketing/`.)
- **ICP:** B2B, $5M–$100M revenue, QuickBooks/Xero, DSO > 40 days, finance team spending >5 hrs/week on manual AR. NOT for D2C or sub-$2M revenue.

---

## 2. System Architecture

### 2.1 High-level shape
```
                         ┌──────────────────────────────┐
   Customer's            │   DataByt (Next.js on Vercel) │
   accounting system     │                              │
   (QuickBooks/Xero/ ───►│  OAuth + daily sync          │
    NetSuite/Sage)       │       │                       │
                         │       ▼                       │
                         │  Supabase (Postgres + Auth)   │
                         │   invoices, customers,        │
                         │   payments, communications,   │
                         │   disputes, integrations...   │
                         │       │                       │
   Vercel Cron ─8am M–F─►│  /api/cron/collections        │
                         │       │                       │
                         │       ├─► Gemini (writes email)│
                         │       └─► Resend (sends email) │──► Customer inbox
                         │                               │
   Dodo Payments ◄──────►│  billing + payment webhooks   │
                         └──────────────────────────────┘
```

### 2.2 The two surfaces
- **Public marketing site** (`/`) — landing page, geo-aware pricing, auth.
- **Authenticated app** (`/dashboard/*`) — the product, used by client finance teams.
- **Admin** (`/admin/*`) — internal ops, gated to the founder's email (`NEXT_PUBLIC_ADMIN_EMAIL`). Used to onboard orgs, import data, score invoices, run collections manually, view failed jobs.

### 2.3 The collections engine (the heart)
`src/app/api/cron/collections/route.ts` runs daily at 08:00 Mon–Fri (Vercel Cron, see `vercel.json`). For each org with collections enabled it:
1. Loads overdue invoices grouped by customer.
2. Computes escalation level per customer from the oldest overdue invoice (defaults: L1≥1, L2≥10, L3≥30 days; cooldown 3 days between emails — all overridable per-org via `org_settings`).
3. Builds one batched email per customer with Gemini 2.0 Flash, injecting tone, segment notes (strategic/at_risk), invoice lines, and payment links.
4. Sends via Resend, logs to `communications`, respects cooldown and unsubscribe.
- Protected by `CRON_SECRET` (returns 401 without it). Returns 405 to ordinary HTTP clients — it's meant for Vercel Cron.

### 2.4 Auth & multi-tenancy
- **Auth:** Supabase Auth. **The session is stored in localStorage, NOT cookies.** Therefore route protection is **client-side** (in `DashboardShell` and the admin layout) — there is no server middleware guarding routes. (`src/proxy.ts` exists for Next.js 16 but only does static-asset exclusions; it does NOT auth-guard, because it can't read a localStorage session.)
- **Multi-tenancy:** every domain table has an `org_id`. **Row Level Security (RLS)** enforces that a user only sees their own org's rows, via the `current_user_org_id()` SQL function (looks up `org_id` from `public.users` by `auth.uid()`).
- **Signup flow:** `AuthProvider.signUp()` calls `supabase.auth.signUp` then an RPC `create_org_for_user(p_user_id, p_email, p_org_name)` (a security-definer function that creates the org + user row before email confirmation). A DB trigger `handle_new_user` also creates a `public.users` row when `raw_user_meta_data.org_id` is set (used for invited users). A trigger `handle_new_organization` auto-creates an `org_settings` row.

---

## 3. Tech Stack (exact versions)

From `package.json`:

| Package | Version | Role |
|---|---|---|
| `next` | 16.2.6 | Framework (App Router). **Note: Next.js 16 — see gotchas.** |
| `react` / `react-dom` | 19.2.4 | UI |
| `typescript` | ^5 | Language (strict mode on) |
| `tailwindcss` | ^4 | Styling (Tailwind v4, via `@tailwindcss/postcss`) |
| `@supabase/supabase-js` | ^2.105.4 | DB + Auth client |
| `@google/generative-ai` | ^0.24.1 | Gemini SDK (model: `gemini-2.0-flash`) |
| `@anthropic-ai/sdk` | ^0.96.0 | Anthropic SDK (present; Gemini is primary) |
| `resend` | ^6.12.3 | Transactional + inbound email |
| `dodopayments` | ^2.31.2 | Payments/billing processor |
| `standardwebhooks` | ^1.0.0 | Verify Dodo webhooks |
| `@react-pdf/renderer` | ^4.5.1 | Board PDF report generation |
| `recharts` | ^3.8.1 | Dashboard charts |
| `framer-motion` | ^12.38.0 | Landing-page animation |
| `lucide-react` | ^1.16.0 | Icons |
| `papaparse` | ^5.5.3 | CSV import parsing |
| `playwright` | ^1.60.0 (dev) | E2E testing |
| `puppeteer-core` | ^25.1.0 (dev) | PDF generation for guide docs |

- **Config files:** `next.config.ts` (marks `dodopayments`, `standardwebhooks`, `@react-pdf/renderer` as `serverExternalPackages`), `vercel.json` (the cron), `tsconfig.json` (path alias `@/* → ./src/*`), `eslint.config.mjs`, `postcss.config.mjs`.
- **Deploy:** Vercel. Auto-deploys on push to `main`.

---

## 4. Codebase Map

```
databyt-saas/
├── src/
│   ├── app/                          ← Next.js App Router
│   │   ├── page.tsx                  ← landing page (geo-aware, assembles all sections)
│   │   ├── layout.tsx                ← root layout, metadata, Bricolage Grotesque font
│   │   ├── auth/
│   │   │   ├── page.tsx              ← login / signup
│   │   │   └── reset-password/page.tsx
│   │   ├── dashboard/                ← the authenticated product (client finance teams)
│   │   │   ├── layout.tsx            ← wraps children in AuthProvider + DashboardShell
│   │   │   ├── page.tsx              ← dashboard home
│   │   │   ├── ar-aging/page.tsx     ← AR aging table, email + mark-paid + dispute actions
│   │   │   ├── collections/page.tsx  ← sent/queued communications log
│   │   │   ├── analytics/page.tsx    ← DSO trend, CEI gauge, cash-flow forecast
│   │   │   ├── customers/page.tsx    ← customer list + segments
│   │   │   ├── invoices/page.tsx     ← invoice list
│   │   │   ├── disputes/page.tsx     ← dispute queue
│   │   │   ├── reports/page.tsx      ← generate board PDF
│   │   │   ├── integrations/page.tsx ← connect QuickBooks/Xero/NetSuite/Sage
│   │   │   ├── billing/page.tsx      ← subscription/billing (Dodo)
│   │   │   └── settings/page.tsx     ← org settings, collection rules, payment link template
│   │   ├── admin/                    ← internal ops, gated to founder email
│   │   │   ├── page.tsx              ← admin home (org list)
│   │   │   ├── collections/page.tsx  ← run/inspect collections
│   │   │   ├── import/page.tsx       ← CSV import
│   │   │   └── onboarding/page.tsx   ← onboard a new org
│   │   ├── pay/
│   │   │   ├── [invoiceId]/page.tsx  ← public payment page for an invoice
│   │   │   └── success/page.tsx      ← post-payment success
│   │   ├── unsubscribe/page.tsx      ← email unsubscribe landing
│   │   └── api/                      ← see Section 6 (full API reference)
│   ├── components/                   ← see Section 7
│   ├── lib/                          ← shared logic (see below)
│   ├── types/database.ts             ← TypeScript row types (mirrors DB)
│   └── proxy.ts                      ← Next.js 16 proxy (static excl. only; NOT auth)
├── supabase/schema.sql               ← Phase-1 schema (core tables + RLS + triggers)
├── supabase-schema.sql               ← additional schema file (see gotchas)
├── DataByt-Guide/                    ← learning/marketing docs (product, ADK, LinkedIn)
├── DataByt-Resources/                ← THIS folder (AI context)
├── next.config.ts, vercel.json, tsconfig.json, package.json, .env.local.example
```

**`src/lib/` contents:**
- `supabase.ts` — Supabase client + auth helpers (`getCurrentUser`, `getCurrentOrgUser`, `getOrganization`) + legacy type mirror.
- `geo.ts` — locale/currency config (IN vs INTL), pricing, ROI calculator ranges, `getLocaleConfig`, `fmtCurrency`.
- `ar-data.ts` — `fetchARMetrics`, `fetchOverdueCustomers`, `fetchInvoicesWithCustomers`, `updateInvoicePriorityScores`.
- `analytics-data.ts` — `fetchAnalyticsData` (DSO, CEI), `fetchCashFlowForecast`.
- `pdf-report.tsx` — the `CFOReport` React-PDF component + `ReportData` type.
- `csv-parser.ts` — CSV import parsing (papaparse).
- `failed-jobs.ts` — `logFailedJob` (records failed sends/jobs).
- `retry.ts` — `withRetry` helper (retries flaky external calls).
- `database.types.ts` — generated-style Supabase Database type.

---

## 5. Database Schema (Supabase / Postgres)

> Canonical core schema: `supabase/schema.sql`. **IMPORTANT drift:** the TypeScript types in `src/types/database.ts` are AHEAD of `supabase/schema.sql` — they include extra tables (`disputes`, `payment_links`, `integrations`) and extra columns (`invoices.payment_link_url`, the `disputed` invoice status, the extended `communications` fields) that were added by later migrations applied directly in Supabase. Treat `src/types/database.ts` as the most complete picture of the live DB. See Section 8 (gotchas).

### Core tables

**organizations** — a client company (tenant).
`id uuid pk · name text · plan_tier ('starter'|'growth'|'scale') · mrr numeric · contract_start date · contract_end date · status ('active'|'onboarding'|'paused'|'churned') · created_at`

**users** (`public.users`) — app users, 1:1 with `auth.users`.
`id uuid pk (= auth.users.id) · org_id fk · email · role ('admin'|'operator'|'viewer') · created_at`

**org_settings** — per-org config (auto-created on org insert).
`org_id pk/fk · timezone · currency · business_hours jsonb · email_signature · updated_at`. (Collection-rule thresholds & payment-link template are managed here / in settings.)

**customers** — the client's customers (the debtors).
`id · org_id · name · email · phone · payment_terms int (default 30) · credit_limit · segment ('strategic'|'standard'|'at_risk') · created_at`

**invoices** — the core object.
`id · org_id · customer_id · invoice_number · amount · currency · issue_date · due_date · status ('open'|'reminded'|'overdue'|'paid'|'written_off'|'disputed') · days_overdue · priority_score · payment_received_date · customer_segment · payment_link_url · created_at`

**payments** — recorded payments.
`id · org_id · invoice_id · amount · payment_date · method · dodo_payment_id · matched bool · created_at`

**communications** — every email/call/note.
`id · org_id · customer_id · invoice_id · type ('email'|'call'|'note') · subject · content · sent_at · status ('draft'|'sent'|'opened'|'clicked'|'bounced'|'failed') · direction ('outbound'|'inbound') · sent_by_ai bool · approved_by · opened_at · clicked_at · resend_message_id`

### Later tables (in types, added via migration)

**disputes** — `id · org_id · invoice_id · customer_id · reason ('incorrect_amount'|'goods_not_received'|'duplicate_invoice'|'already_paid'|'service_not_rendered'|'other') · description · status ('open'|'investigating'|'resolved'|'rejected') · resolution_notes · assigned_to · created_at · resolved_at`

**payment_links** — `id · org_id · invoice_id · dodo_payment_id · dodo_session_id · amount · currency · status ('pending'|'paid'|'expired'|'cancelled') · payment_url · expires_at · paid_at · created_at`

**integrations** — `id · org_id · provider ('quickbooks'|'xero'|'netsuite'|'sage') · access_token · refresh_token · realm_id · token_expires_at · status ('connected'|'disconnected'|'error'|'syncing') · last_sync_at · last_sync_count · error_message · created_at · updated_at`

(There are likely also `failed_jobs` and `feature_requests` tables backing `lib/failed-jobs.ts` and `/api/feature-request`.)

### Security & automation
- **RLS** on all core tables. Pattern: `org_id = current_user_org_id()` for select/insert/update/delete. `current_user_org_id()` is a `security definer` SQL function returning the caller's `org_id`.
- **Triggers:** `on_auth_user_created → handle_new_user` (creates `users` row from `raw_user_meta_data.org_id`); `on_organization_created → handle_new_organization` (creates `org_settings`).
- **RPC:** `create_org_for_user(p_user_id, p_email, p_org_name)` — used at signup to create org+user before email confirmation.
- **Indexes:** on every `org_id`, plus `invoices.customer_id`, `invoices.status`, `payments.invoice_id`, `communications.org_id`.
- **Service role:** server routes use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS) for cron/admin/integration work.

---

## 6. API Reference (every route)

All under `src/app/api/`. Method conventions: routes parse JSON bodies inside a `try/catch` that returns **400** on invalid/empty body (this was a deliberate fix — previously they 500'd). Org-scoped routes require `orgId` and return **400** `"orgId required"` if missing.

### Health & misc
- **`GET /api/health`** — service health. Returns `{database, gemini, resend, ...}` booleans. Use to verify env wiring.
- **`POST /api/feature-request`** — logs a feature request.
- **`GET|POST /api/unsubscribe`** — unsubscribe a customer from collection emails (token-based).

### Collections (AI email)
- **`POST /api/collections/draft-email`** — body `{invoiceId, orgId, escalationLevel:1|2|3}`. Drafts a dunning email with Gemini for one invoice. Returns `{subject, body, escalationLevel, invoiceId}`. 400 on bad body, 404 if invoice not found.
- **`POST /api/collections/send-email`** — body `{invoiceId, orgId, subject, body, toEmail, toName, approvedBy?, sentByAi?}`. Sends via Resend (with `withRetry`), logs to `communications`, logs failures via `logFailedJob`. Reply-To uses `RESEND_INBOUND_DOMAIN` if set (`reply+{invoiceId}@…`).

### Cron
- **`GET /api/cron/collections`** — the daily engine (Section 2.3). Requires `CRON_SECRET`. 401 without it. Scheduled `0 8 * * 1-5` (08:00 Mon–Fri).

### Disputes
- **`GET /api/disputes?orgId=`** — list disputes for an org (joined with invoice + customer). Returns `{disputes:[]}` even if the table is missing (handles `42P01`).
- **`POST /api/disputes`** — create a dispute.
- **`PATCH /api/disputes/[id]`** — update status/notes/assignee. Sets `resolved_at` when resolved/rejected. 400 on bad body, 503 if disputes table absent.

### Integrations (QuickBooks, Xero, NetSuite, Sage — same shape each)
- **`GET /api/integrations/{provider}?orgId=`** — current connection status (`status, last_sync_at, last_sync_count, error_message`).
- **`POST /api/integrations/{provider}`** — body `{orgId}`. Builds the OAuth URL (uses `{PROVIDER}_CLIENT_ID`). Returns `{url}`. 503 if credentials not configured. 400 on bad body.
- **`DELETE /api/integrations/{provider}?orgId=`** — disconnect (clears tokens).
- **`GET /api/integrations/{provider}/callback`** — OAuth redirect target; exchanges code for tokens, saves to `integrations`. Returns 307 redirect.
- **`POST /api/integrations/{provider}/sync`** — pull invoices/customers from the provider into Supabase. Returns 405 to GET.
- Providers: `quickbooks` (Intuit, `QUICKBOOKS_CLIENT_ID/SECRET`, `QUICKBOOKS_SANDBOX`), `xero`, `netsuite` (`NETSUITE_ACCOUNT_ID/CLIENT_ID/SECRET`), `sage`.

### Payments & billing (Dodo Payments)
- **`POST /api/payments/checkout`** — create a Dodo checkout session for an invoice/subscription.
- **`POST /api/webhooks/dodo`** — Dodo webhook receiver, verified with `standardwebhooks` + `DODO_WEBHOOK_KEY`. Updates `payments`/`payment_links` on payment events.

### Email webhooks (Resend)
- **`POST /api/webhooks/resend`** — Resend delivery events (opened/clicked/bounced) → updates `communications` (`opened_at`, `clicked_at`, `status`).
- **`POST /api/webhooks/inbound-email`** — inbound email (customer replies) → logged as inbound `communications`; used for reply detection / pausing.

### Reports
- **`POST /api/reports/cfo-pdf`** — body `{orgId}`. Builds a board-ready PDF (outstanding, DSO, aging buckets, top overdue customers, recent collections) via `@react-pdf/renderer` + `lib/pdf-report.tsx`. Returns the PDF binary. 400 on bad body.
- **`POST /api/reports/send-weekly`** — emails the weekly report.

### Admin (gated to founder; many use `ADMIN_SECRET`)
- **`GET /api/admin/orgs`**, **`GET|PATCH /api/admin/orgs/[id]`** — list/manage orgs.
- **`POST /api/admin/onboard`** — onboard a new org (creates org, settings, user).
- **`POST /api/admin/import`** — CSV import of customers/invoices.
- **`POST /api/admin/score-invoices`** — recompute `priority_score`.
- **`POST /api/admin/classify-customers`** — assign segments (strategic/standard/at_risk).
- **`POST /api/admin/daily-summary`** — internal daily summary.
- **`GET /api/admin/failed-jobs`** — list failed jobs (from `failed-jobs.ts`).

---

## 7. Frontend — Pages & Components

### 7.1 Landing page (`src/app/page.tsx`)
Server component. Reads `x-vercel-ip-country` header → builds `locale` (`IN` | `INTL`) + `cfg` from `lib/geo.ts`, passes them to sections. Order:
`Navbar → Hero → PainSection → ResearchSection → HowItWorks → ROICalculator → ValueStack → Testimonials → Pricing → FAQ → FinalCTA → Footer`

### 7.2 Components (`src/components/`)
- **Navbar** — top nav + `Logo` export.
- **Hero** — headline, animated stats, `DashboardMockup` (a fake dashboard preview). Locale-aware (₹/$).
- **PainSection** — the problem, stat counters, before/after, research strip. Locale-aware.
- **ResearchSection** — cited industry stats (PYMNTS, Atradius). Locale-aware DSO-cost stat.
- **HowItWorks** — the 6-step loop.
- **ROICalculator** — interactive sliders (revenue, DSO) → cash freed, ROI. Locale-aware ranges/currency.
- **ValueStack** — itemised value vs price (Hormozi-style). Locale-aware.
- **Testimonials** — 3 quotes; INTL set (US names/$) vs IN set (Indian names/₹).
- **Pricing** — single plan card, monthly/annual toggle, founding banner, competitor comparison. Locale-aware.
- **FAQ** — accordion; one entry has locale-aware competitor pricing.
- **FinalCTA** + **Footer** (exported from `FinalCTA.tsx`) — closing CTA + footer. Locale-aware urgency stat.
- **StickyBanner**, **CostCalculator** — supporting marketing components (CostCalculator not currently on the page).

### 7.3 App shell & modals
- **AuthProvider** (`components/AuthProvider.tsx`) — React context for auth. Exposes `user, session, orgUser, organization, loading, signUp, signIn, signOut, requestPasswordReset, refreshOrganization`. Loads session from Supabase (localStorage), listens to `onAuthStateChange`, loads the `users` + `organizations` rows. `signUp` calls the `create_org_for_user` RPC.
- **DashboardShell** (`components/DashboardShell.tsx`) — sidebar + top bar + **client-side auth guard** (`if (!loading && !user) router.push("/auth")`). Sidebar links: Dashboard, AR Aging, Collections, Disputes, Analytics, Customers, Reports, Integrations, Settings. Shows trial days left (30 − days since org `created_at`).
- **AdminShell** — admin layout + founder-email gate.
- **Modals:** `EmailDraftModal` (review/edit/send AI email), `DisputeModal` (file a dispute), `AddCustomerModal`, `AddInvoiceModal`.

---

## 8. Conventions & Gotchas (READ BEFORE EDITING)

> The project's own `AGENTS.md` warns: **"This is NOT the Next.js you know."** Next.js 16 has breaking changes vs training data. Always check `node_modules/next/dist/docs/` before writing Next.js code.

1. **Next.js 16, App Router.** Route handlers are `route.ts` exporting `GET/POST/...`. Dynamic params are async: `{ params }: { params: Promise<{ id: string }> }` then `const { id } = await params;`. `headers()` is async: `await headers()`.
2. **No middleware — use `proxy.ts`.** Next.js 16 uses `src/proxy.ts` (not `middleware.ts`). Creating `middleware.ts` alongside `proxy.ts` **breaks the build**. The proxy does NOT auth-guard (can't read localStorage sessions).
3. **Auth is client-side.** Supabase v2 stores the session in **localStorage, not cookies**. Server can't read it. Route protection lives in `DashboardShell` / admin layout. Do not assume a server-side session exists.
4. **Always guard `req.json()`.** Wrap body parsing in `try/catch` and return **400** on failure — never let an empty/invalid body 500 the route. (This was fixed across all routes; keep the pattern.)
5. **Org scoping is mandatory.** Every domain query filters by `org_id`. Server routes use the service-role key and must pass `org_id` explicitly (RLS is bypassed with the service key). Client queries rely on RLS.
6. **One email per customer, not per invoice.** Collections batch all of a customer's overdue invoices into a single email. Don't regress this.
7. **Gemini model is `gemini-2.0-flash`.** Cheapest frontier model; used for all AI. Keep using Flash unless there's a proven need.
8. **Schema drift.** `supabase/schema.sql` is Phase-1 only. The live DB also has `disputes`, `payment_links`, `integrations` (and likely `failed_jobs`, `feature_requests`) added via later migrations. `src/types/database.ts` is the most complete reference. There are **two** schema files (`supabase/schema.sql` and `supabase-schema.sql`) — reconcile carefully; prefer the types + live DB.
9. **Currency/locale.** All user-facing currency must route through `lib/geo.ts` (IN → ₹ with Cr/L formatting and `en-IN` grouping; INTL → $). The landing page is geo-detected; don't hardcode `$` in shared UI.
10. **Styling.** Tailwind v4. Brand accent is **#4F46E5 (Electric Indigo)**. Avoid grey body text (use #111/#222/#333). Headline font is Bricolage Grotesque (in `layout.tsx`).
11. **Commits.** Branch off `main` for risky work. Co-author trailer is used on commits/PRs. Vercel auto-deploys `main`.
12. **Windows/PowerShell dev environment.** Primary dir `d:\AI\DP\databyt-saas`. Use PowerShell syntax. Bash tool also available.

### ⚠️ Security issue to fix
`.env.local.example` (committed to the repo) contains **real secrets** — a live Supabase URL, anon key, **service-role key**, Gemini API key, and Resend API key. These should be **rotated immediately** and the example file replaced with placeholder values. Never copy real keys into docs or examples. (This `AI-CONTEXT.md` intentionally uses placeholders only.)

---

## 9. Environment Variables (every one)

Referenced across the codebase. **Values are secrets — set in `.env.local` (dev) and Vercel (prod). Placeholders shown.**

**Supabase**
- `NEXT_PUBLIC_SUPABASE_URL` — project URL (public).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/publishable key (public, RLS applies).
- `SUPABASE_SERVICE_ROLE_KEY` — service role (server only, bypasses RLS). **Secret.**

**AI & email**
- `GEMINI_API_KEY` — Gemini (the AI). **Secret.**
- `RESEND_API_KEY` — Resend email. **Secret.**
- `RESEND_FROM_EMAIL` — from address (e.g. `collections@databyt.io`).
- `RESEND_INBOUND_DOMAIN` — domain for reply-to / inbound parsing (optional).

**Payments (Dodo)**
- `DODO_PAYMENTS_API_KEY` — Dodo API. **Secret.**
- `DODO_WEBHOOK_KEY` — webhook signature verification. **Secret.**
- `DODO_ENVIRONMENT` — `test` | `live`.

**Integrations (OAuth credentials per provider)**
- `QUICKBOOKS_CLIENT_ID`, `QUICKBOOKS_CLIENT_SECRET`, `QUICKBOOKS_SANDBOX`
- `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET`
- `NETSUITE_ACCOUNT_ID`, `NETSUITE_CLIENT_ID`, `NETSUITE_CLIENT_SECRET`
- `SAGE_CLIENT_ID`, `SAGE_CLIENT_SECRET`

**App & security**
- `NEXT_PUBLIC_APP_URL` — canonical app URL.
- `NEXT_PUBLIC_ADMIN_EMAIL` — founder email; gates `/admin/*`.
- `CRON_SECRET` — protects `/api/cron/collections`. **Secret.**
- `ADMIN_SECRET` — protects some admin API routes. **Secret.**
- `NODE_ENV` — standard.

---

## 10. Glossary (finance + technical)

| Term | Meaning |
|---|---|
| AR | Accounts Receivable — money owed to the business |
| AR Aging | unpaid invoices bucketed by how overdue |
| DSO | Days Sales Outstanding — avg days to get paid (lower better) |
| CEI | Collections Effectiveness Index — % of collectible actually collected |
| Dunning | escalating payment-reminder process |
| L1/L2/L3 | escalation levels: polite / firm / final notice |
| Net 30 | payment due 30 days after invoice |
| Strategic / Standard / At-risk | customer segments (affect email tone) |
| Org / tenant | a client company in DataByt (the `organizations` table) |
| RLS | Row Level Security — Postgres per-row access control by `org_id` |
| Service role | Supabase key that bypasses RLS (server only) |
| Cron | scheduled job (Vercel Cron) — runs collections daily |
| OAuth | how DataByt connects to accounting systems without passwords |
| Dodo Payments | the payment processor used for billing & links |
| Resend | the email-sending service |
| Gemini 2.0 Flash | the LLM that writes the emails |
| Vercel | the hosting platform (auto-deploys `main`) |
| Supabase | Postgres database + auth + RLS |

---

## 11. Project Status & Roadmap

- **Done:** full product end-to-end (landing, auth, dashboard, AR aging, collections engine, disputes, analytics, reports, integrations scaffolding, billing). Build passing. Geo-aware pricing (IN/INTL) shipped.
- **In progress / next:** finalise brand/domain (`.io`), connect a real QuickBooks sandbox and run the 8-step end-to-end test with live data, LinkedIn launch (100 CFOs → 5 clients), build an **AI support agent with Google ADK** (see `DataByt-Guide/06-adk-mastery/` — a Python ADK agent on Cloud Run, called from `/api/support`).
- **Known issues:** schema drift between `supabase/schema.sql` and live DB; committed real secrets in `.env.local.example` (rotate); OAuth flows for integrations need end-to-end testing with real provider accounts.

---

## 12. Where to Learn More (in this repo)
- `DataByt-Guide/01-product-guide/` — deep product/phase explanations + architecture diagram.
- `DataByt-Guide/03-testing/` — the 8-step end-to-end test.
- `DataByt-Guide/04-marketing/` — the 30-day LinkedIn launch plan + 30 post scripts.
- `DataByt-Guide/06-adk-mastery/` — the ADK support-agent master guide (build + deploy).
- `supabase/schema.sql` — canonical core SQL.
- `src/types/database.ts` — most complete type picture of the DB.

---

*This file is the complete brain. If you are an AI reading it: you now know DataByt A–Z. When in doubt, the code in `src/` is the final authority — and if you find drift from this document, point it out.*
