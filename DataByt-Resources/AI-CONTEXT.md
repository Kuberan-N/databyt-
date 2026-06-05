# DataByt — Complete AI Context (A–Z)

> **This is the single source of truth for any AI tool (Antigravity, Cursor, Windsurf, Copilot, Claude Code).**
> Read this one document and you will understand the entire product, codebase, architecture, and conventions.
> **Last verified against the codebase: June 2026.** If a detail here contradicts the actual code, the code wins — flag the drift and update this file.

---

## 0. TL;DR (60 seconds)

**DataByt** is an AI-powered **Accounts Receivable (AR) collections** SaaS for **mid-market B2B** companies. It automatically chases overdue invoices so finance teams stop sending reminder emails by hand.

- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Supabase (Postgres + Auth + RLS). Deployed on Vercel.
- **AI, two separate systems:**
  1. **In-app email AI** — Google Gemini drafts dunning emails (daily cron + manual draft).
  2. **Support Agent** — a separate **Google ADK** multi-agent (Python) on **Cloud Run**, surfaced as the in-dashboard chat widget.
- **Market:** **PRIMARY = USA + EU.** India is secondary. Currency is IP-based (USD for US/EU, ₹ for India) — do **not** hardcode currency.
- **Brand:** Indigo `#4F46E5` / violet `#7C3AED`. **Grey is banned** — use the slate palette + indigo (§9).
- **Repo:** Next app in `src/`, the ADK agent in `agents/`, written playbooks in `DataByt-Guide/`.

---

## 1. The Product & Business

**Problem:** ~82% of failed businesses were profitable — they ran out of cash waiting on unpaid invoices. Most mid-market finance teams chase overdue invoices manually (≈10 hrs/week), inconsistently, pushing DSO up.

**Solution — the closed AR loop:** import → score → email (L1→L2→L3) → pay → match → dispute → analyse.

**ICP:** CFOs / VP Finance / Controllers at B2B companies, ~$3M–$100M revenue, 20–500 employees, with DSO pain and no modern AR tooling. Best-fit sectors: IT services, manufacturing/distribution, professional services, staffing, healthcare B2B.

**Positioning:** The AR tool built for the mid-market that enterprise giants (HighRadius, Billtrust) ignore — automated, affordable, live in 48 hours, runnable by a finance team of 1–3.

**Pricing:** One flat plan ("DataByt Pro"), no per-seat fees, founding-customer rate for early customers, 30-day free trial. Currently onboarding founding customers free for feedback + testimonials.

---

## 2. System Architecture

```
                         ┌─────────────────────────────────────────┐
   Browser (CFO)  ─────► │  Next.js 16 app on Vercel (src/)         │
                         │   • Landing page (marketing)             │
                         │   • Dashboard (AR aging, collections…)   │
                         │   • API routes (/api/*)                  │
                         └───────┬───────────────┬─────────────────┘
                                 │               │
              ┌──────────────────┘               └────────────────────┐
              ▼                                                        ▼
   ┌────────────────────┐                              ┌──────────────────────────┐
   │ Supabase           │                              │ External services        │
   │  • Postgres + RLS  │                              │  • Gemini (email drafting)│
   │  • Auth            │                              │  • Resend (email send)    │
   │  • per-org isolation│                             │  • Dodo Payments (billing)│
   └────────────────────┘                              │  • QB/Xero/NetSuite/Sage  │
                                                        └──────────────────────────┘
              ▲
              │  reads org data (service key)
   ┌──────────┴───────────────────────────┐
   │ Support Agent — Google ADK (Python)   │   ◄── chat widget (SupportChat.tsx)
   │ deployed to Cloud Run                 │       via /api/support/chat proxy
   │  agents/support_agent/ (multi-agent)  │
   └───────────────────────────────────────┘
```

**Two independent AI systems — don't confuse them:**
- **(A) Email AI** lives *inside* the Next app: `@google/generative-ai` (Gemini `gemini-3.5-flash`) drafts dunning emails in `/api/collections/draft-email` and `/api/cron/collections`.
- **(B) Support Agent** is a *separate deployable* in `agents/` (Google ADK, Python). It runs on Cloud Run and is reached by the dashboard chat widget through `/api/support/chat`, which injects the logged-in `org_id` so the agent never asks who you are.

---

## 3. Tech Stack (exact)

| Layer | Choice |
|---|---|
| Framework | **Next.js 16.2.6** (App Router, Turbopack). ⚠️ Breaking changes vs older Next — read `node_modules/next/dist/docs/` before writing Next code. |
| UI | React 19, TypeScript, **Tailwind CSS v4** (`@import "tailwindcss"` in `globals.css`, theme via `@theme`) |
| Animation | framer-motion |
| Charts | recharts |
| Icons | lucide-react |
| DB / Auth | Supabase (`@supabase/supabase-js`) — Postgres + RLS + Auth |
| Email send | Resend |
| Email draft AI | `@google/generative-ai` (Gemini 3.5-flash) |
| Billing | Dodo Payments (`dodopayments`, `standardwebhooks`) |
| PDF | `@react-pdf/renderer` |
| CSV | papaparse |
| Support agent | Google ADK 2.1 + Python 3.12, `supabase`, `resend` (in `agents/`) |
| Hosting | Vercel (web) + Google Cloud Run (agent) |

Scripts: `npm run dev` / `build` / `start` / `lint`.

---

## 4. Codebase Map

```
databyt-saas/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page (assembles marketing sections)
│   │   ├── layout.tsx                # Root layout + metadata + OG image config
│   │   ├── opengraph-image.tsx       # Generated branded OG card (next/og)
│   │   ├── globals.css               # Tailwind v4 theme, brand tokens
│   │   ├── auth/                     # Sign in / sign up / reset password
│   │   ├── dashboard/                # The product (see §7)
│   │   │   ├── layout.tsx            # AuthProvider + DashboardShell
│   │   │   ├── page.tsx              # Dashboard overview (8 metrics, 2 tiers)
│   │   │   ├── ar-aging/             # AgingDashboard — invoice table + actions
│   │   │   ├── collections/          # Customer pipeline + email activity
│   │   │   ├── disputes/ analytics/ customers/ reports/ settings/ integrations/ billing/ invoices/
│   │   ├── admin/                    # Operator/admin console (onboarding, imports)
│   │   ├── pay/[invoiceId]/          # Public payment page
│   │   ├── privacy/ terms/ security/ # Legal pages (LegalPage component)
│   │   └── api/                      # All backend routes (see §6)
│   ├── components/                   # React components (see §7)
│   ├── lib/                          # Data + utilities (see below)
│   └── types/database.ts             # All DB entity TypeScript types
├── agents/                           # Google ADK support agent (Python) — see §8
│   ├── support_agent/agent.py        # Multi-agent: manager → knowledge/account/action/escalation
│   ├── knowledge_agent/agent.py      # Standalone knowledge agent (aux)
│   ├── Dockerfile  requirements.txt  deploy.ps1
├── DataByt-Guide/                    # 6 PDF playbooks (user manual, AR mastery, LinkedIn, sales…)
├── DataByt-Resources/AI-CONTEXT.md   # ← THIS FILE
├── supabase/schema.sql               # DB schema (also supabase-schema.sql at root)
├── AGENTS.md / CLAUDE.md             # Point AI tools to this file
└── .env.local                        # Secrets (not committed)
```

**`src/lib/`:** `supabase.ts` (client), `ar-data.ts` (AR metrics: DSO, CEI, aging, overdue customers), `analytics-data.ts`, `database.types.ts`, `csv-parser.ts`, `pdf-report.tsx` (CFO PDF), `geo.ts` (IP→locale/currency), `failed-jobs.ts`, `retry.ts`.

---

## 5. Database Schema (Supabase / Postgres)

Full DDL in `supabase/schema.sql`. Types in `src/types/database.ts`. Every table is **org-scoped via `org_id` and protected by RLS** — a user only ever sees their own organization's rows.

| Table | Purpose | Key columns |
|---|---|---|
| `organizations` | A customer company (tenant) | id, name, status, created_at |
| `users` (`OrgUser`) | A person in an org | id, org_id, email, role |
| `org_settings` | Per-org config | org_id, email_signature, currency, payment_link_template, dunning_l1/l2/l3_days, dunning_cooldown_days |
| `customers` | Companies that owe the org money | id, org_id, name, email, segment (standard/strategic/at_risk), payment_terms |
| `invoices` | Invoices owed to the org | id, org_id, customer_id, invoice_number, amount, currency, due_date, days_overdue, status (open/overdue/reminded/disputed/paid), payment_link_url |
| `payments` | Recorded payments | id, org_id, invoice_id, amount, payment_date, method |
| `communications` | Emails/notes sent | id, org_id, customer_id, invoice_id, type, subject, content, status, direction, sent_at, sent_by_ai |
| `disputes` | Invoice disputes | id, org_id, invoice_id, customer_id, reason, status (open/investigating/resolved/rejected) |
| `payment_links` | Generated pay links | id, org_id, invoice_id, status |
| `integrations` | Accounting connections | org_id, provider (quickbooks/xero/netsuite/sage), status, last_sync_at |

**Data model rule that trips people up:** "Organisation" = the DataByt *user's* company. "Customer" = a company that owes *them* money. Queries and the support agent must keep these separate.

---

## 6. API Reference (`src/app/api/`)

**Collections / email**
- `POST /api/collections/draft-email` — Gemini drafts a dunning email for one invoice at a chosen escalation level.
- `POST /api/collections/send-email` — sends a drafted email via Resend, logs a communication.
- `GET /api/cron/collections` — **the engine.** Mon–Fri 8am. Per org: finds overdue invoices, batches by customer, picks L1/L2/L3 by days overdue, respects cooldown + opt-outs, drafts via Gemini, sends via Resend, logs, marks invoices `reminded`. Auth via `CRON_SECRET`.

**Demo / data** — `POST /api/demo/seed` (loads 15 customers + 70+ invoices, disputes, comms, settings; guarded against double-seed; powers "Load Sample Data"). `POST /api/admin/import` (CSV).

**Disputes** — `GET/POST /api/disputes`, `PATCH /api/disputes/[id]`. Filing sets invoice `disputed` (pauses collections); resolving resumes.

**Integrations** — `/api/integrations/{quickbooks,xero,netsuite,sage}/` each with `route` + `callback` + `sync` (OAuth connect, callback, daily sync).

**Payments / billing** — `POST /api/payments/checkout` (Dodo), `POST /api/webhooks/dodo` (billing webhook).

**Support agent (chat widget)** — `POST /api/support/chat`: proxy to the Cloud Run ADK agent. Injects `org_id`/`org_name` from the session, creates the ADK session, calls `/run`, parses the event array, returns `reply`. Fires an escalation email when the message looks like an escalation. Returns a graceful message if `SUPPORT_AGENT_URL` is unset.

**Reports** — `POST /api/reports/cfo-pdf` (board PDF), `/api/reports/send-weekly`.

**Webhooks** — `/api/webhooks/resend` (open/click), `/api/webhooks/inbound-email` (reply detection), `/api/webhooks/dodo` (billing).

**Other** — `/api/unsubscribe`, `/api/feature-request`, `/api/health`, `/api/admin/*` (orgs, onboard, score-invoices, classify-customers, daily-summary, failed-jobs).

---

## 7. Frontend — Pages & Components

**Landing (`src/app/page.tsx`)** assembles: `Navbar` → `Hero` → `PainSection` → `ResearchSection` → `HowItWorks` → `ROICalculator` → `ValueStack` → `Testimonials` (now a **Founding Customer** section — no fake reviews) → `Pricing` → `FAQ` → `FinalCTA` + `Footer`. Locale/currency comes from IP via `geo.ts`; pass `locale`/`cfg` down. The `Hero` `DashboardMockup` mirrors the real dashboard (Financial Health metrics + AR Aging Buckets + Top Overdue Customers).

**Dashboard (`src/app/dashboard/`)** — wrapped by `DashboardShell` (sidebar nav + trial banner + mounts `SupportChat`):
- **Overview** (`page.tsx`): 8 metrics in 2 tiers — *Financial Health* (Total AR, DSO, CEI, Overdue % of AR) and *Operations This Month* (Collected, Avg Days Delinquent, Active Disputes, Emails Sent). Count-up animation; empty state when no data.
- **AR Aging** (`ar-aging/AgingDashboard.tsx`): metrics, aging bar + pie, top overdue customers, invoice table with **Email / Pay link / Mark Paid** actions (Mark Paid is optimistic + instant).
- **Collections**: two tabs — **Customer Pipeline** (stage badges: Not Contacted → L1 → L2 → L3 Final → Disputed → Paid; totals, last-email, email-count) and **Email Activity**.
- **Disputes / Analytics / Customers / Reports / Settings / Integrations / Billing / Invoices**. Settings holds email signature, collection rules, payment link template, currency.

**Key components:** `SupportChat.tsx` (AI chat widget: minimize/close, localStorage history, quick chips, escalate + feature-request drawers, markdown rendering, 90+ day alert badge), `DashboardShell`, `AuthProvider` (Supabase auth + org context), `EmailDraftModal`, `DisputeModal`, `AddCustomerModal`, `AddInvoiceModal`, `LegalPage`, plus the landing sections.

---

## 8. The AI Layer (read carefully)

**(A) In-app email AI** — `@google/generative-ai`, model `gemini-3.5-flash`, key `GEMINI_API_KEY`. Used in `draft-email` and `cron/collections` to write dunning emails with L1/L2/L3 tone + segment awareness.

**(B) Support Agent — Google ADK** (`agents/support_agent/agent.py`):
- **Multi-agent:** a `support_manager` (root) routes to specialists — `knowledge_agent` (product Q&A), `account_agent` (read tools: invoice counts, balances, totals, overdue list, comms history), `action_agent` (write tools: `send_dunning_email`, `file_dispute` — always confirms first), `escalation_agent`.
- **Tools** are Python functions hitting Supabase with the service key. Model `gemini-3.5-flash`.
- **Deploy:** `agents/Dockerfile` → Cloud Run via `agents/deploy.ps1` (reads secrets from `agents/support_agent/.env`, never hardcoded). Endpoint pattern: create session `POST /apps/support_agent/users/{uid}/sessions/{sid}`, then `POST /run`. The web app calls it through `/api/support/chat` with `SUPPORT_AGENT_URL`.
- **ADK gotcha:** instruction strings must not contain bare `{word}` — ADK treats `{}` as template vars and crashes. Avoid curly braces in prompts.

---

## 9. Branding & Design System

- **Brand:** indigo `#4F46E5` (primary), `#6366F1`, `#4338CA`; violet `#7C3AED`; gradient `linear-gradient(135deg,#4F46E5,#7C3AED)`.
- **Dark:** `#0F172A` (ink), `#130E25` (deep). **Slate text:** `#475569` (body), `#64748B` (muted), `#94A3B8` (light). **Borders/surfaces:** `#E2E8F0`, `#F1F5F9`, `#F8FAFC`. **Indigo tints:** `#EEF2FF`, `#F5F3FF`, `#C7D2FE`.
- **Status:** success `#16A34A`, warning `#D97706`, danger `#DC2626`.
- **🚫 GREY IS BANNED.** Never use dull mid-greys (`#F5F5F5`, `#F3F3F3`, `#E5E5E5`, `#999999`, `#555555`, `#333333`, etc.). Use the slate family + indigo above. Hard rule the founder enforces.
- Tokens live in `src/app/globals.css` (`@theme` + `.glass`, `.gradient-text`, `.brand-gradient`, `.metric-icon-*`). `gradient-text` = indigo→violet→pink.

---

## 10. Conventions & Gotchas (READ BEFORE EDITING)

1. **Next.js 16 is not the Next you know** — APIs/conventions differ. Read `node_modules/next/dist/docs/` for the relevant feature first.
2. **Currency is IP-based** (`src/lib/geo.ts`). US/EU → USD, India → ₹. Never hardcode `$`/`₹`; use the locale config. Don't "fix" currency — it's working as designed.
3. **Market = USA + EU primary**, India secondary. Frame copy, pricing examples, and channels for US/EU first.
4. **No grey** (§9).
5. **RLS everywhere** — all tables org-scoped by `org_id`. Server routes use the service key (`SUPABASE_SERVICE_ROLE_KEY`); never leak it to the client.
6. **Mark as Paid is manual** — DataByt can't see bank accounts. When a customer pays, the user clicks Mark Paid (AR Aging) or QuickBooks/Xero sync updates it. No auto-bank reconciliation.
7. **Dunning runs Mon–Fri 8am** with a cooldown; new overdue invoices show "Not Contacted" until the next run.
8. **Don't fabricate testimonials** — the Testimonials slot is an honest founding-customer section (FTC/ASA rules apply for US/EU).
9. **ADK prompts:** no bare `{}` (§8).
10. **Code references are clickable** — use `file_path:line`.

---

## 11. Environment Variables

Web (`.env.local`) + agent (Cloud Run env / `agents/support_agent/.env`):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only — never client
# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_ADMIN_EMAIL=
ADMIN_SECRET=
CRON_SECRET=                        # protects /api/cron/collections
# AI
GEMINI_API_KEY=                     # Gemini (email drafting); agent uses GOOGLE_API_KEY
SUPPORT_AGENT_URL=                  # Cloud Run URL of the ADK agent
# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_INBOUND_DOMAIN=
# Billing
DODO_PAYMENTS_API_KEY= / webhook secret
# Integrations (per provider): client id + secret + redirect for QuickBooks, Xero, NetSuite, Sage
```

Agent `.env` (`agents/support_agent/.env`): `GOOGLE_GENAI_USE_VERTEXAI=FALSE`, `GOOGLE_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.

---

## 12. How to Run / Build / Deploy

**Web app**
```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```
Deploy: push to `main` → Vercel auto-deploys. Set all env vars in Vercel (esp. `SUPPORT_AGENT_URL`, `GEMINI_API_KEY`).

**Support agent (Cloud Run)**
```bash
cd agents
# venv: python -m venv .venv ; .venv\Scripts\Activate.ps1 ; pip install -r requirements.txt
.\deploy.ps1 -ProjectId <gcp-project>   # builds Docker, deploys, reads secrets from support_agent/.env
# Local test: python -m google.adk.cli web   (http://127.0.0.1:8000)
```
After deploy, copy the Cloud Run URL into `SUPPORT_AGENT_URL` (web env).

---

## 13. Glossary (finance)

- **AR** — Accounts Receivable: money owed to you, unpaid.
- **DSO** — Days Sales Outstanding: avg days to collect. Healthy < 45.
- **CEI** — Collection Effectiveness Index: % of collectible cash actually collected. Healthy 80%+.
- **Dunning** — systematic reminders to pay. Escalates L1 (friendly) → L2 (firm) → L3 (final notice).
- **Aging buckets** — Current / 1–30 / 31–60 / 61–90 / 90+ days overdue.
- **Segment** — customer risk tier: standard / strategic / at_risk (changes email tone).
- **Net 30/60/90** — invoice due 30/60/90 days after issue.

> Deeper finance + product knowledge lives in `DataByt-Guide/` (User Manual, AR Mastery Guide, Sales Playbook, LinkedIn Playbook, Demo Script, Sales Sheet).

---

## 14. Project Status & Next

**Done:** full dashboard (8 metrics), AR aging + actions, collections pipeline, disputes, analytics, reports/PDF, integrations scaffolding (QB/Xero/NetSuite/Sage), Gemini email cron, ADK support agent on Cloud Run + chat widget, demo seeder, legal pages, branded OG image, indigo design system.

**Next candidates:** complete real OAuth for each integration, wire Resend open/reply webhooks into the pipeline, payment-provider webhooks for auto-reconciliation, RAG for the knowledge agent, evals/guardrails on the agent.
