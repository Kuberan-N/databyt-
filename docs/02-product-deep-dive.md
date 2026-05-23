# DataByt — Product Deep Dive
### What it is, how it works, and what makes it different

---

## START HERE: What Is Accounting Software?

Before understanding DataByt, you need to understand what it connects to.

**Accounting software = the financial operating system of a business.**

Most businesses use one of these four:

| Software | Who Uses It | Size |
|---|---|---|
| **QuickBooks Online** | Small to mid-market businesses | ~7M businesses globally |
| **Xero** | Small to mid-market, popular in UK/ANZ/India | ~4.4M businesses |
| **NetSuite** | Mid-market to enterprise | ~38,000 businesses |
| **Sage Business Cloud** | Mid-market, popular in UK/Europe | ~3M businesses |

These tools handle: invoices, bills, payroll, bank reconciliation, tax reporting.

**The problem:** They track that invoices are unpaid. They don't automatically chase customers to pay them.

That's the gap DataByt fills.

---

## What Is DataByt?

**One sentence:** DataByt connects to your accounting software, finds all your overdue invoices, and automatically sends personalized payment reminder emails until your customers pay — with a payment link embedded in every email.

**Who it's for:** Finance directors, controllers, and CFOs at B2B companies with $3M–$100M annual revenue who are tired of chasing invoices manually.

**Core promise:** Reduce DSO by 30%. Live in 48 hours. No IT team.

---

## How It Works — Step by Step

### Step 1 — Connect (5 minutes)
You connect your QuickBooks/Xero/NetSuite/Sage account via OAuth (like "Sign in with Google" but for accounting software).

DataByt pulls your AR data automatically. No CSV exports. No manual uploads.

### Step 2 — Import (Daily, automatic)
Every morning, DataByt imports:
- Every overdue invoice
- Customer name and contact info
- Amount owed
- Days overdue
- Payment history

### Step 3 — Score (AI prioritization)
Every overdue invoice gets a priority score based on:
- How overdue it is
- How much is owed
- Customer's payment history
- Customer risk level (strategic / standard / at-risk)

Output: A ranked list of your highest-risk invoices, every morning.

### Step 4 — Email (Automated, Monday–Friday)
AI generates one personalized email per customer, listing all their overdue invoices.

**Three escalation levels:**

| Level | When | Tone |
|---|---|---|
| L1 | Just overdue (< 10 days) | Friendly — "just a reminder" |
| L2 | 10–29 days overdue | Firm — "action needed" |
| L3 | 30+ days overdue | Serious — "final notice" |

Every email contains: customer name, specific invoice numbers, exact amounts, due dates, and a **direct payment link**.

### Step 5 — Customer Pays (One click)
Customer clicks the payment link → sees their invoice → pays via card/bank transfer → done.

No login required. Takes under 60 seconds.

### Step 6 — Auto-match (Instant)
When payment arrives, DataByt:
- Creates a payment record
- Matches it to the correct invoice
- Marks invoice as paid
- Stops all further emails to that customer for that invoice

### Step 7 — Disputes (Structured, not email threads)
If a customer disputes an invoice:
- Finance team clicks "File Dispute" in DataByt
- Collections immediately paused on that invoice
- Dispute tracked: reason, status (open → investigating → resolved)
- When resolved → collections automatically resume

### Step 8 — Dashboard (Live for CFO)
CFO sees in real-time:
- Total AR outstanding
- DSO trending (getting better or worse?)
- CEI score (how effective is your collections team?)
- Email open rates, click rates, payment conversion
- 6-month collections trend chart
- Top overdue customers ranked by amount
- One-click PDF report for board meetings

---

## What DataByt Has Built

| Feature | Status |
|---|---|
| QuickBooks Online integration | Live |
| Xero integration | Live |
| NetSuite integration | Live |
| Sage Business Cloud integration | Live |
| AI invoice scoring + prioritization | Live |
| L1/L2/L3 automated dunning emails | Live |
| One email per customer (all invoices batched) | Live |
| 3-day cooldown (no over-contacting) | Live |
| Payment link in every email | Live |
| Hosted payment portal (no login needed) | Live |
| Dodo Payments checkout | Live |
| Auto-match payment to invoice | Live |
| Dispute management portal | Live |
| AR aging dashboard (real-time) | Live |
| CEI analytics dashboard | Live |
| DSO tracking and trending | Live |
| 6-month collections bar chart | Live |
| CFO PDF report | Live |
| Admin dashboard (multi-client support) | Live |
| CAN-SPAM compliant unsubscribe | Live |
| CSV bulk import | Live |

---

## What Is NOT Built Yet

| Feature | When |
|---|---|
| AP automation (accounts payable) | Not started — future CashFlow Command plan |
| Cash flow forecasting | Not started — future CashFlow Command plan |
| SMS / WhatsApp dunning | Future roadmap |
| SAP / Oracle / Dynamics integrations | Long-term |

**Important:** Do not sell the CashFlow Command plan ($6,000/month) until AP automation is built. The AR Engine ($3,000/month) is what's live and working today.

---

## Pricing

| Plan | Price | What's Included |
|---|---|---|
| AR Engine | $3,000/month + $5,000 setup | Everything above (full AR automation) |
| CashFlow Command | $6,000/month + $10,000 setup | AR Engine + AP + forecasting (NOT YET BUILT) |

Month-to-month. No annual commitment required.

---

## Why DataByt Wins

| Comparison | Competitor | DataByt |
|---|---|---|
| Price | HighRadius: $100K+/year | $36K/year |
| Setup time | HighRadius: 6–12 months | 48 hours |
| IT needed? | Yes | No |
| QuickBooks native? | No (enterprise ERP focus) | Yes |
| End-to-end loop? | Partial (email only) | Yes (email → pay → match → dispute → analytics) |

**Positioning:** "HighRadius for mid-market, at 10% of the cost, live in 48 hours."

---

## The One Thing DataByt Still Needs

**Real customer outcomes.**

The 30% DSO reduction claim is a target, not a proven result. It needs 5–10 paying customers with before/after DSO data.

One real case study — "Acme Manufacturing reduced DSO from 67 to 44 days, freeing $350K in cash" — is worth more than any feature. Getting those first customers and measuring rigorously is the single most important next step.

---

## Tech Stack (For Reference)

| Layer | Tool |
|---|---|
| Frontend + Backend | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI (email generation) | Gemini 1.5 Flash |
| Payments | Dodo Payments |
| Email delivery | Resend |
| Hosting | Vercel |
| Automation (cron) | Vercel Cron (Mon–Fri, 8am UTC) |

---

*Last updated: May 2026. Build status: production-ready. Missing: real customer proof points.*
