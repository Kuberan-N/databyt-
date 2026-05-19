# DataByt — Product Deep-Dive: A to Z
### Complete product knowledge, market analysis, honest assessment
### Updated: 2026-05-19 — reflects full feature build

---

## SECTION 1: WHAT IS DATABYT?

DataByt is an AI-powered Accounts Receivable (AR) automation platform that connects to QuickBooks Online, Xero, NetSuite, or Sage Business Cloud — imports overdue invoices automatically, scores them by collection priority, sends personalized dunning emails with embedded payment links, manages disputes, auto-matches incoming payments, and tracks collection performance via a CEI dashboard — all without manual intervention.

**Target customer:** Finance directors, controllers, and CFOs at mid-market B2B companies ($3M–$100M annual revenue) who are tired of chasing invoices manually or watching their DSO creep upward.

**Core promise:** Reduce DSO by 30%, go live in 48 hours, no IT team needed.

---

## SECTION 2: HOW DATABYT WORKS — END TO END

### The Complete Data Flow

```
QuickBooks / Xero / NetSuite / Sage Business Cloud
       ↓ (OAuth + daily sync)
AR Aging Import
       ↓
Invoice Scoring Engine (AI priority ranking)
       ↓
Dunning Email Queue
       ↓
AI Email Personalization (Gemini 1.5 Flash)
       ↓
Payment Link Embedded (Dodo Payments hosted checkout)
       ↓
Email Delivery (Resend)
       ↓
Reply Detection & Tracking
       ↓
Customer Pays via Payment Portal
       ↓
Webhook → Auto-Match Payment → Invoice Marked Paid
       ↓
AR Dashboard + CEI Analytics (real-time)
       ↓
CFO PDF Reports
```

### Step-by-Step

**Step 1 — Integration**
Customer connects QuickBooks Online, Xero, NetSuite, or Sage Business Cloud via OAuth. Takes under 5 minutes. No CSV uploads. No manual exports.

**Step 2 — Daily AR Import**
DataByt pulls AR aging data daily: customer name, invoice number, amount, due date, days overdue, payment history. AR aging buckets calculated in real-time (Current / 1–30 / 31–60 / 61–90 / 90+).

**Step 3 — AI Prioritization (Invoice Scoring)**
Every overdue invoice is scored by: days overdue, invoice amount, customer payment history, customer segment (strategic / standard / at-risk). Output: daily ranked priority list.

**Step 4 — Dunning Email Generation with Payment Links**
AI generates personalized emails for each overdue invoice with the actual payment link embedded:
- **L1 (just overdue):** Polite, assumes oversight, payment link
- **L2 (15–30 days overdue):** Firm, references previous reminder, specific deadline
- **L3 (30–60 days overdue):** Serious, references multiple follow-ups, final notice before escalation

Every email includes: customer name, specific invoice number, exact amount owed, due date, days overdue, and a clickable payment link to the hosted payment portal.

**Step 5 — Email Delivery**
Emails sent via Resend on behalf of the company's domain. Deliverability 95%+.

**Step 6 — Customer Payment via Portal**
Customer clicks payment link → lands on `/pay/[invoiceId]` (public, no login required) → sees invoice details → clicks Pay → Dodo Payments hosted checkout → payment captured.

**Step 7 — Auto-Match & Cash Application**
Dodo webhook fires on payment. DataByt automatically:
- Creates a payment record
- Matches it to the correct invoice (100% match rate for portal payments)
- Marks invoice as paid in DataByt
- Stops all further dunning for that invoice

**Step 8 — Dispute Management**
Customer disputes an invoice → finance team clicks "File Dispute" in collections view → dispute workflow opens:
- Dispute reason selected (incorrect amount / goods not received / duplicate / already paid / service not rendered / other)
- Invoice paused from collections immediately
- Operator updates status (Investigating → Resolved / Rejected) with resolution notes
- Resolution re-enables collections on invoice

**Step 9 — AR Dashboard & CEI Analytics**
Real-time dashboard:
- Total AR outstanding, DSO trending, collected this month vs last month
- CEI (Collections Effectiveness Index) gauge with color-coded threshold (green ≥80, amber ≥60, red <60)
- Email performance: open rate, click rate, payment conversion rate
- Collection velocity: average / median / fastest days to pay after first reminder
- 6-month monthly collections trend (Recharts bar chart)
- AR aging by bucket, top overdue customers, full invoice table

**Step 10 — CFO PDF Report**
On-demand PDF: Executive Summary, AR Aging Breakdown, Top Overdue Customers, At-Risk Analysis. Board-ready in minutes.

---

## SECTION 3: COMPLETE FEATURE LIST

### Core AR Automation Features

| Feature | Status | Notes |
|---|---|---|
| QuickBooks Online integration | Live | OAuth, daily sync |
| Xero integration | Live | OAuth, daily sync |
| NetSuite integration | Live | OAuth 2.0, SuiteQL invoice/customer sync |
| Sage Business Cloud integration | Live | OAuth, REST API sales invoice sync |
| AI invoice scoring / prioritization | Live | Multi-factor ranking |
| L1 dunning email (polite reminder) | Live | AI-personalized, payment link embedded |
| L2 dunning email (firm notice) | Live | AI-personalized, payment link embedded |
| L3 dunning email (final notice) | Live | AI-personalized, payment link embedded |
| Reply detection & tracking | Live | Stops auto-follow-up on replied invoices |
| Email deliverability tracking | Live | Via Resend |
| AR aging dashboard | Live | Real-time |
| DSO tracking and trending | Live | Calculated from actual AR data |
| Collected this month vs. last month | Live | Auto-comparison |
| AR aging bar chart | Live | Recharts |
| AR distribution pie chart | Live | By aging bucket |
| Top overdue customers list | Live | Ranked by amount at risk |
| Customer segmentation | Live | Strategic / standard / at-risk |
| Full invoice table | Live | Search, filter by status, paginate |
| Mark invoice as paid | Live | Manual override |
| Add customer manually | Live | Modal with form |
| Add invoice manually | Live | Modal with form |
| CSV import | Live | Bulk invoice import |
| CFO PDF report | Live | Professional formatting |

### Payment Portal (Dodo Payments)

| Feature | Status | Notes |
|---|---|---|
| Hosted payment page `/pay/[invoiceId]` | Live | Public, no login required, shows invoice details |
| Dodo Payments checkout | Live | Dynamically creates product + checkout session per invoice |
| Payment confirmation page | Live | `/pay/success` after Dodo redirect |
| Webhook auto-match | Live | `payment.succeeded` → invoice marked paid, payment record created |
| Payment link in dunning emails | Live | Every L1/L2/L3 email includes the invoice-specific pay link |
| Payment link stored on invoice | Live | `payment_link_url` on invoices table |

### Dispute Management

| Feature | Status | Notes |
|---|---|---|
| File dispute on invoice | Live | DisputeModal component with 6 reason options |
| Collections pause on dispute | Live | Invoice status → "disputed", stops all auto-emails |
| Dispute dashboard | Live | Status cards (open/investigating/resolved/rejected), filter, search |
| Dispute status update workflow | Live | Operator updates with resolution notes |
| Resolution notes | Live | Free-text, saved per dispute |
| Auto-resume collections on resolution | Live | Invoice reverts to "overdue" on resolve/reject |

### Analytics & CEI

| Feature | Status | Notes |
|---|---|---|
| CEI (Collections Effectiveness Index) gauge | Live | SVG circular gauge, color-coded, capped at 100 |
| Email effectiveness metrics | Live | Open rate, click rate, payment conversion rate |
| Collection velocity | Live | Avg / median / fastest / slowest days to pay after first reminder |
| 6-month monthly collections bar chart | Live | Recharts, real DB data |
| Bad debt rate | Live | Written-off invoices as % of total |

### Dashboard & Admin Features

| Feature | Status | Notes |
|---|---|---|
| Multi-organization support | Live | Row-level security via Supabase |
| Admin dashboard | Live | Full org health overview |
| Admin collections view | Live | Cross-org invoice monitoring |
| Admin org switcher | Live | Manage multiple client organizations |
| Admin onboarding flow | Live | /admin/onboarding |
| CSV data import (admin) | Live | Bulk import for client data |
| Org health metrics | Live | Users, customers, invoices, AR summary per org |

### Infrastructure & Security

| Feature | Status |
|---|---|
| Supabase PostgreSQL | Live |
| Row-Level Security (RLS) | Live — org-scoped for users, service role for admin |
| Data encrypted in transit | Live (HTTPS) |
| Data encrypted at rest | Supabase handles |
| No model training on customer data | By architecture |
| Auth (email + password) | Live via Supabase Auth |
| Responsive design (mobile + desktop) | Live |

### Planned / Not Yet Built

| Feature | Notes |
|---|---|
| AP automation (AI Invoice Processor) | CashFlow Command plan — not yet started |
| Cash flow forecasting dashboard | CashFlow Command plan — not yet started |
| Custom date range reports | Coming soon |
| SMS / WhatsApp dunning | Future tier |
| Credit risk scoring | Future enterprise tier |
| ERP: SAP, Oracle, Microsoft Dynamics | Long-term roadmap |

**Honest note:** The CashFlow Command plan ($6,000/month) lists AP automation and cash flow forecasting. These are NOT in the current codebase. Do not sell CashFlow Command until built, or explicitly disclose it's in development.

---

## SECTION 4: MARKET DEMAND — THE REAL NUMBERS

### Market Size

The global AR automation market is valued at approximately **$3.4B–$4.8B in 2025**, growing at **11–14% CAGR**, projected to reach **$6–13B by 2030–2033**. (Sources: Mordor Intelligence, Grand View Research, Research and Markets, Coherent Market Insights.)

U.S. market: approximately **$844M in 2025**, growing to **$1.87B by 2033** at ~10.5% CAGR. (Source: Grand View Research)

### The Addressable Gap

Of U.S. mid-market companies ($10M–$1B revenue):
- **Only 4.13%** use any dedicated AR automation tool (Source: PYMNTS Intelligence)
- **53%** manage AR via spreadsheets
- **35%** rely entirely on manual processes
- **95%** have not completely automated AR or AP

**~96% of the target market is currently manual.** The available market is beginning to open up.

### Demand Signals

- **80%** of finance executives rate AR automation as important, high priority, or critical
- **49%** are currently considering AR automation solutions
- **67%** are evaluating AI's role in AR (only 14% have deployed it)
- **39%** are actively implementing something

### QuickBooks, Xero, NetSuite, Sage TAM

- QuickBooks: ~7 million businesses globally
- Xero: **4.41 million subscribers** (FY25)
- NetSuite: ~38,000 enterprise/mid-market accounts
- Sage Business Cloud: ~3 million subscribers

Combined: ~14+ million businesses using platforms DataByt now integrates with.

---

## SECTION 5: THE PAIN POINTS AND HOW DATABYT SOLVES EACH

### Pain Point 1 — Manual AR collection is time-intensive and inconsistent
**DataByt:** Automates L1/L2/L3 dunning for every invoice. No human forgets. Finance staff time reduced from ~20 hours/week to 3–5 hours.

### Pain Point 2 — High DSO and poor cash flow visibility
**DataByt:** Systematic dunning accelerates payment velocity. CEI gauge and DSO trending give CFOs real-time visibility.

### Pain Point 3 — Emails sound robotic and damage relationships
**DataByt:** AI generates emails using actual customer name, invoice number, exact amounts, due date. Each email is unique. Tone adapts per escalation level.

### Pain Point 4 — No visibility into which customers are highest risk
**DataByt:** Multi-factor invoice scoring (amount × days overdue × customer history × segment). Daily ranked priority list.

### Pain Point 5 — CFO can't report AR performance to the board
**DataByt:** Live AR dashboard, CEI analytics, one-click PDF report generation. Board-ready in minutes.

### Pain Point 6 — Existing AR tools are too expensive or too complex
**DataByt:** $3,000/month vs HighRadius $100K+/year. Live in 48 hours. No IT team. Month-to-month.

### Pain Point 7 — Customers can't pay easily when they receive dunning emails
**DataByt:** Every dunning email includes a direct Dodo Payments hosted checkout link. Customer clicks, sees invoice, pays in under 60 seconds.

### Pain Point 8 — Disputed invoices block cash flow and lack workflow
**DataByt:** Full dispute management: file → pause collections → investigate → resolve → auto-resume.

---

## SECTION 6: USP (UNIQUE SELLING PROPOSITION)

DataByt's USP is the combination of five things no mid-market competitor currently offers together:

### 1. Speed to Value: 48 Hours
HighRadius: 6–12 months. Billtrust: 3–6 months. DataByt: 48 hours.

### 2. Price Point: $3,000/month vs. $8,000–$12,000/month
Category-creating price point — 70–80% cheaper than the next comparable solution.

### 3. Zero IT Involvement
QuickBooks/Xero/NetSuite/Sage OAuth connection, 5-minute setup, live. No IT tickets.

### 4. AI-Native, Not Bolted On
Built AI-first. Scoring, personalization, and prioritization are the core product.

### 5. Full Collections Loop — End to End
Most tools stop at "send the email." DataByt closes the loop: email → payment portal → auto-match → dispute management → analytics. No other mid-market tool in the $3K/month range does all five.

### The Positioning Statement
**"HighRadius for mid-market, at 10% of the cost, live in 48 hours."**

---

## SECTION 7: HOW TO TEST THE PRODUCT

### Functional Testing

**1. Integration Test**
- Connect QuickBooks/Xero/NetSuite/Sage sandbox account
- Verify: AR aging data imports correctly (amounts, dates, names)
- Verify: Newly added invoices appear in next sync

**2. Dunning Flow Test**
- Create test overdue invoice → trigger email generation → verify AI content accuracy
- Verify payment link in email resolves to correct `/pay/[invoiceId]` page
- Reply to email → verify reply detection flags invoice, stops further auto-emails

**3. Payment Portal Test**
- Navigate to `/pay/[invoiceId]` (unauthenticated) → verify correct invoice data displayed
- Click Pay → verify redirect to Dodo checkout
- Simulate `payment.succeeded` webhook → verify invoice marked paid, payment record created

**4. Dispute Management Test**
- File dispute on overdue invoice → verify invoice status changes to "disputed"
- Verify dunning emails stop for that invoice
- Resolve dispute → verify invoice reverts to "overdue", collections resume

**5. Dashboard Accuracy Test**
- Cross-reference CEI calculation: (collected ÷ collectible) × 100
- Cross-reference DSO: (Total AR ÷ Total Credit Sales last 90 days) × 90

**6. Analytics Test**
- Verify CEI gauge thresholds (green ≥80, amber ≥60, red <60)
- Verify 6-month bar chart data matches payments table
- Verify email effectiveness metrics match communications table

### Accuracy Testing (Is the AI Good?)

For 20 AI-generated dunning emails, verify:

| Check | Pass Criteria |
|---|---|
| Correct customer name | 100% pass required |
| Correct invoice number(s) | 100% pass required |
| Correct amount owed | 100% pass required |
| Payment link is correct `/pay/[invoiceId]` | 100% pass required |
| Tone matches dunning tier | > 95% pass |
| Grammar/readability | > 95% pass |
| Sounds human, not templated | > 90% pass |
| No hallucinated data | 100% pass required — critical |

### Stress Testing

- 1,000 invoice import → dashboard < 3 seconds
- RLS test: 10+ orgs simultaneously, Org A cannot see Org B data
- Webhook idempotency: same `payment.succeeded` event twice → invoice only marked paid once
- Concurrent sync + manual invoice add → no data corruption

### Deliverability Testing

- [ ] SPF, DKIM, DMARC configured
- [ ] Spam score > 8/10 on mail-tester.com
- [ ] Bounce rate < 2%
- [ ] Unsubscribe/opt-out handling (CAN-SPAM compliance)

---

## SECTION 8: DATA-BACKED CLAIMS

| Claim | Source | Confidence |
|---|---|---|
| "30% average DSO reduction" | Internal target — needs real customer data | Unverified — need 5+ live customers |
| "48 hours to go live" | Product design | Testable |
| "95%+ email deliverability" | Resend SLA | Resend's published data |
| "10× cheaper than HighRadius" | HighRadius ~$100K+/year vs $41K/year | Accurate |
| "$3K/month flat fee" | Pricing page | Accurate |
| "44–55% of B2B invoices paid late" | Atradius 2025, PYMNTS June 2025 | High confidence |
| "83% haven't automated AR" | PYMNTS Intelligence June 2025 | High confidence |

---

## SECTION 9: HONEST ASSESSMENT — WHERE DATABYT STANDS TODAY

### What DataByt Has Right ✓

1. **Price point is a genuine moat.** $3K/month into a segment priced out of HighRadius/Billtrust.
2. **QuickBooks + Xero + NetSuite + Sage = 80%+ of mid-market covered.**
3. **48-hour activation collapses the biggest objection** to AR automation.
4. **End-to-end loop is now closed.** Email → payment portal → auto-match → dispute management → CEI analytics. No mid-market competitor offers all of this at this price.
5. **Dispute management built properly.** Pause → investigate → resolve → resume is the correct workflow.
6. **Payment portal with Dodo is live.** Every dunning email includes a working payment link.
7. **CEI dashboard gives CFOs a real performance metric**, not just AR aging numbers.

### What DataByt Still Needs ✓

**1. Verified customer outcomes — the single most important thing.**
The 30% DSO reduction claim has no real customer data behind it. Get 10 paying customers. Measure before/after DSO rigorously. One case study ("Acme Manufacturing reduced DSO from 67 to 44 days, freeing $350K in working capital") is worth more than any feature. This is the entire sales foundation.

**2. Email batching per customer.**
If a customer has 10 overdue invoices, they should receive one email listing all of them — not 10 separate emails. This is a UX and deliverability requirement.

**3. SMS / WhatsApp dunning option.**
Industries where email open rates are low (construction, trucking, retail distribution) need additional channels. Would justify a higher-tier plan.

**4. Credit risk scoring.**
Flag customers showing payment distress signals before they go overdue. Moves DataByt from reactive to proactive. Required for upper-mid-market ($50M+ revenue) sales.

**5. ERP connectivity beyond current four.**
SAP, Oracle, Microsoft Dynamics unlock $50K–$200K/year enterprise contracts.

---

## SECTION 10: WHAT DATABYT NEEDS TO DOMINATE — UPDATED ROADMAP

### Built ✓ (This Session)

| Item | Status |
|---|---|
| NetSuite OAuth + SuiteQL sync | Done |
| Sage Business Cloud OAuth + REST sync | Done |
| Dodo Payments hosted checkout portal | Done |
| Payment auto-match (cash application) | Done |
| Dispute management end-to-end | Done |
| CEI analytics dashboard | Done |
| Payment links in all dunning emails | Done |

### Must-Have for Market Leadership (Next 3–6 Months)

**1. Verified customer outcomes**
Still the #1 priority. No product feature substitutes for real before/after DSO data.

**2. Email batching per customer**
One email per customer per batch listing all overdue invoices. Critical for enterprise customers with many overdue accounts.

**3. Weekly automated CFO report delivery**
Noted as "coming soon" in the dashboard. Auto-send PDF report to CFO inbox every Monday morning.

### High Impact for Competitive Differentiation (6–12 Months)

**4. SMS / WhatsApp dunning**
Opens construction, trucking, retail distribution verticals.

**5. Credit risk scoring**
Prevent bad debt before it happens. Required for upper-mid-market positioning.

**6. Custom date range reports**
CFOs want to report for specific quarters, fiscal years, not just "last 6 months."

### Long-Term for Industry Dominance (12–36 Months)

**7. ERP connectivity: SAP, Oracle, Dynamics**
Enterprise contracts at $50K–$200K/year.

**8. Two-sided payment network**
Both buyer and seller on DataByt — real-time payment status, automated confirmations.

**9. Embedded financing**
Offer buyers extended terms. Sellers get paid today. DataByt takes transaction fee.

**10. AP automation (CashFlow Command)**
Completes the full cash flow picture: AR in, AP out.

---

## SECTION 11: COMPETITIVE RISK

**Risk 1: HighRadius moves downmarket** — They launched outcome-based pricing in February 2026. Monitor. DataByt's advantage narrows if they package under $5K/month.

**Risk 2: QuickBooks / Xero builds this natively** — Intuit has the data and distribution. Mitigation: build value that accounting platforms won't (multi-ERP, payment portal, CEI analytics, dispute management).

**Risk 3: Chaser, Paidnice, or Kolleno gets funded** — Any of these getting a $10M Series A could shift the competitive dynamic. DataByt needs customer proof points before this happens.

**Risk 4: No customer outcomes** — If early customers don't see DSO improvement in 90 days, the product story collapses.

**Risk 5: Email deliverability degradation** — Active monitoring of bounce rates and spam scores is non-negotiable.

---

## SECTION 12: REVENUE POTENTIAL

### Conservative (Year 1–2)
- 50 customers × $3,000/month = $150K MRR = **$1.8M ARR**
- Plus $5,000 setup fees: 50 × $5,000 = $250K one-time

### Mid-Case (Year 2–3, full platform)
- 200 customers × $4,000/month average = $800K MRR = **$9.6M ARR** (real Series A company)

### Aggressive (Year 3–4)
- 500+ customers, blended ACV ~$60K/year = **$30M ARR** (serious mid-market competitor)

---

## SECTION 13: THE BOTTOM LINE

DataByt is now a materially more complete product than it was 24 hours ago. The core gap list (no payment portal, no dispute management, no NetSuite/Sage, no CEI analytics) is closed. The full AR collections loop — from import to email to payment to cash application to dispute resolution — is now functional.

**What is real and strong:**
- Market size and timing
- Price point vs. incumbents
- Setup speed (48 hours)
- QuickBooks + Xero + NetSuite + Sage (four platforms live)
- AI-personalized dunning with embedded payment links
- Dodo Payments hosted checkout, auto-match, cash application
- Dispute management end-to-end
- CEI analytics with real DB data
- Admin infrastructure (multi-org, RLS, proper security)

**What still needs real-world validation:**
- The 30% DSO improvement claim (needs 5+ paying customers with before/after data)
- Pricing (could be too low — collect willingness-to-pay data early)
- Retention at 90 days (the real metric, not just activation)

**The honest frontier:**
DataByt can compete for the mid-market ($5M–$100M revenue) on every major buying criterion except one: real customer proof points. No product feature fixes the absence of case studies. Get 10 customers on the platform this quarter, measure rigorously, and publish the outcomes. Everything else is in place to tell a compelling story.

---

*Sources: Mordor Intelligence; Grand View Research; Research and Markets; Coherent Market Insights; BillingPlatform 2025 State of AR Automation Survey (June 2025); PYMNTS Intelligence June 2025; Growfin DSO Benchmarks 2025; CreditPulse 2025; IOFM; Xero FY25 Annual Report; Intuit FY2025 10-K; Atradius 2025; Versapay/PYMNTS Research; Transformance.ai; Vendr; Tracxn; QuickBooks 2025 Small Business Late Payments Report; RSM Middle Market AI Survey 2025; Commercial Law League of America.*
