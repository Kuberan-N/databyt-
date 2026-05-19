# AR Collections: Complete Domain Knowledge Guide
### For DataByt Founders — Read This Before Talking to Any CFO

---

## PART 1: WHAT IS ACCOUNTS RECEIVABLE?

**Plain English:** Accounts Receivable (AR) is money your business is owed but hasn't collected yet. When a B2B company sells goods or services on credit — meaning they deliver first, invoice second, and get paid later — that unpaid amount sits in AR.

**Example:**
- January 1: Acme Corp delivers 500 units of steel to BuildCo
- January 1: Acme sends BuildCo an invoice for $50,000, due in 30 days
- January 1 → January 31: That $50,000 is **Accounts Receivable** on Acme's books
- If BuildCo pays on Feb 5 (6 days late), Acme had $50,000 sitting uncollected for 35 days

**Why it matters:** AR is cash you've already earned but can't use yet. Large AR balances create cash flow problems even for profitable businesses. A company can be highly profitable on paper but literally run out of cash because customers haven't paid.

---

## PART 2: THE FULL AR LIFECYCLE (Quote to Cash)

This is the complete journey. Every step is a potential failure point.

```
QUOTE → ORDER → DELIVERY → INVOICE → COLLECTION → PAYMENT → RECONCILIATION
```

**Step 1 — Quote & Order**
Seller quotes a price. Buyer places a purchase order (PO). Payment terms are agreed: Net 30, Net 60, Net 90 (meaning payment is due 30/60/90 days after invoice date).

**Step 2 — Delivery**
Goods or services delivered. This triggers the right to invoice. In construction, this may require a delivery acceptance signature or project milestone.

**Step 3 — Invoicing**
Finance team creates and sends the invoice. This seems simple but is where the first failures happen:
- Wrong PO number → buyer rejects the invoice
- Wrong contact person → invoice lost in someone's spam
- Missing line items → buyer disputes and delays
- Wrong payment terms → buyer claims they need 60 days, not 30

**Step 4 — Collection (where DataByt operates)**
The seller waits. If no payment arrives, someone needs to follow up. This is "dunning" — the systematic process of reminding, then pressing, then escalating to get paid. In most mid-market companies, this is done manually by 1-3 people sending emails and making calls.

**Step 5 — Payment**
Buyer pays via bank transfer, check, ACH, credit card, or payment portal. Finance records the payment.

**Step 6 — Reconciliation**
Finance matches the payment to the correct invoice in their accounting system. Partial payments, short payments, and incorrect reference numbers all create reconciliation problems.

**DataByt's position:** We automate Step 4 (Collection) and provide real-time visibility into Steps 3-5 via the AR aging dashboard.

---

## PART 3: KEY METRICS EVERY CFO TRACKS

These are the numbers CFOs live and die by. If you can't speak fluently about these, you'll lose credibility in the first five minutes.

### 1. DSO — Days Sales Outstanding

**What it is:** How many days, on average, it takes to collect payment after an invoice is issued.

**Formula:**
```
DSO = (Total Accounts Receivable ÷ Total Credit Sales) × Number of Days
```

**Example:** If you have $500,000 in AR and made $3,000,000 in credit sales over the last 90 days:
```
DSO = ($500,000 ÷ $3,000,000) × 90 = 15 days
```

**Industry Benchmarks (2025, Source: CreditPulse, Growfin, SPI Research):**

| Industry | Good DSO | Median DSO | Problem DSO |
|---|---|---|---|
| SaaS / Software | < 30 days | 30–45 days | > 60 days |
| Professional Services | < 35 days | 42 days | > 60 days |
| Manufacturing | < 45 days | 45–60 days | > 75 days |
| Construction | < 60 days | 60–90 days | > 90 days |
| Healthcare | < 40 days | 45–70 days | > 80 days |

**Why DSO matters to a CFO:** Every 1 day of DSO improvement = 1 day less of working capital needed. For a company with $10M/year in revenue, reducing DSO by 10 days frees up approximately **$275,000 in cash** ($10M ÷ 365 × 10).

DataByt's claimed impact: **30% average DSO reduction.** If their CFO says DSO is 60 days, that means you're offering to bring it to ~42 days. At $10M revenue, that's ~$500,000 of cash freed up. That's your anchor in every conversation.

---

### 2. AR Aging Report

**What it is:** A snapshot of all outstanding invoices, sorted by how long they've been unpaid.

Standard aging buckets:
- **Current** — not yet due
- **1–30 days overdue** — mild concern
- **31–60 days overdue** — follow-up urgently
- **61–90 days overdue** — escalation needed
- **90+ days overdue** — high risk of bad debt

**Why it matters:** The older an invoice gets, the less likely it is to be collected. Invoices at 90+ days have a collection rate of less than 70%. At 6 months, it drops to around 50%. At 12 months, below 25%. (Source: Commercial Law League of America)

**What DataByt does:** Shows the full AR aging in real time, auto-flags the highest-risk overdue invoices, and prioritizes them for the AI Collections Agent.

---

### 3. CEI — Collections Effectiveness Index

**What it is:** How effective your collections team is at actually getting money in.

**Formula:**
```
CEI = [(Beginning AR + Credit Sales – Ending Total AR) ÷ (Beginning AR + Credit Sales – Ending Current AR)] × 100
```

**Interpretation:** 100 = perfect (collected everything collectible). Most companies aim for 80+. Below 70 is a serious problem.

**DataByt impact:** DataByt's automated dunning directly improves CEI by systematically following up on every invoice, not just the squeaky wheels a human remembers.

---

### 4. Bad Debt Rate

**What it is:** Percentage of AR that ends up uncollectable (written off).

**Industry average:** 1–3% of total revenue. For a $20M company, that's $200,000–$600,000 written off annually. (Source: IOFM, Atradius 2025)

**DataByt impact:** Early, systematic dunning catches invoices before they age into bad debt. This is one of the strongest ROI arguments. Even a 0.5% reduction in bad debt rate on $20M revenue = $100,000 saved/year.

---

### 5. DPO — Days Payable Outstanding

**What it is:** How long a company takes to pay *its own* suppliers. High DPO = company holds cash longer (good for buyer, bad for the seller waiting).

**Why you need to know this:** When talking to CFOs, they manage both sides. They want to maximize their own DPO while minimizing their DSO. This tension is core to cash flow management.

---

## PART 4: THE COLLECTIONS PROCESS IN DETAIL

### What manual AR collections actually looks like today

In a typical mid-market company (20–500 employees, $5M–$100M revenue) this is the reality:

1. **AR Specialist (1–3 people)** pulls the aging report from QuickBooks/Xero/NetSuite every Monday
2. They look at who's overdue and decide who to email today (usually whoever they remember or whoever has the largest balance)
3. They write or copy-paste an email, change the customer name, check the invoice amount, and send
4. They log the email in a spreadsheet (if they're organized) or in their email "sent" folder (if they're not)
5. They don't have a systematic follow-up schedule — it depends on how busy they are
6. If a customer replies with a dispute, it goes into an email thread that can last weeks
7. End of month, the CFO asks "why is our DSO 65 days?" and nobody has a good answer

**The result:** Inconsistent follow-up. Some customers get chased aggressively. Some high-value slow-payers never get a firm email because the AR person is afraid to upset the relationship. Invoices age. Cash flow suffers.

### What proper dunning looks like

**L1 — Polite Reminder (Invoice due / just past due)**
Subject: "Friendly reminder — Invoice #1234 due [date]"
Tone: Helpful, assume it was oversight, make it easy to pay

**L2 — Firm Notice (15–30 days overdue)**
Subject: "Invoice #1234 is now 15 days overdue — action needed"
Tone: Direct, reference previous reminder, provide clear payment deadline

**L3 — Final Notice (30–60 days overdue)**
Subject: "FINAL NOTICE — Invoice #1234 — Account at risk"
Tone: Serious, reference potential escalation to collections agency or legal

**L4+ — Escalation (60+ days)**
Human involvement: account manager calls, legal letter, collections agency referral

DataByt automates L1, L2, L3 with AI-personalized emails that use real invoice data, customer name, specific amounts, and payment history. The emails don't sound templated because they aren't.

---

## PART 5: THE MARKET CONTEXT — WHAT'S HAPPENING RIGHT NOW

### The scale of the problem (real data, May 2026)

**44–55% of B2B invoices in the U.S. are paid late.** (Source: Atradius, PYMNTS Intelligence, June 2025)

That means if you send 100 invoices this month, roughly 50 of them won't be paid on time.

**Only 3% of companies have fully automated AR.** (Source: BillingPlatform 2025 State of AR Automation Survey, 100+ finance decision-makers, June 2025)

**83% of companies have not fully automated AR.** (Source: PYMNTS Intelligence, June 2025)

**53% of mid-market B2B companies manage AR primarily via spreadsheets.** (Source: PYMNTS Intelligence, 2025)

**Mid-market firms lose an estimated $19 million annually** due to payment delays and collection inefficiency. (Source: Versapay/PYMNTS research)

**80% of finance executives rate AR automation as important, high priority, or critical.** Yet only 3% have achieved it.

This gap — 80% say it's critical, 3% have actually done it — is the single most important statistic you need to memorize. It explains why the market is wide open. The awareness exists. The willingness to pay exists. The execution gap exists because the available tools are either too expensive (HighRadius at $100K+/year) or too simple (basic invoice reminder tools that don't integrate with their accounting stack).

---

## PART 6: THE COMPETITIVE LANDSCAPE

### The Big Players — Why They're Not Relevant to Your Customers

**HighRadius** (San Francisco, founded 2006)
- Valuation: $3.1 billion (Series C, 2021; raised $484M total)
- Clients: 600+ companies including 200+ Forbes Global 2000
- Pricing: **$100,000+ annually minimum**, custom enterprise contracts; 6–12 month implementation
- Target: Fortune 500 and very large mid-market
- Reality check: Your $5M–$100M revenue CFO has never even had a sales call from HighRadius. This is not their product.

**Billtrust** (New Jersey, founded 2001)
- Status: Taken private by EQT Private Equity at $1.7 billion (2022)
- Pricing: ~$20,000–$60,000/year
- Target: Mid-market to enterprise in manufacturing, distribution, logistics
- Limitation: Focused heavily on invoicing and cash application, less on AI-driven collections automation

**Versapay** (Atlanta, founded 2006)
- Target: Companies with $50M–$1B revenue
- Pricing: $50,000–$150,000+ annually
- Unique angle: Customer-facing payment portal ("collaborative AR"); strong in distribution
- Still too expensive for your target market

**Gaviti** (Israel-based, founded 2019)
- Funding: $11.5M total
- More accessible pricing, targets mid-market collections teams
- Less well-known brand, smaller ecosystem, no significant QuickBooks/Xero marketing presence

**Tesorio** (San Francisco, founded 2015)
- Focus: Cash flow forecasting + AR automation
- Pricing: $25,000–$120,000+/year depending on size
- Target: $10M–$200M revenue — closest competitor segment-wise to DataByt
- Limitation: Still expensive for early adopters; implementation takes time

**The gap DataByt is targeting:** No player dominates the $3M–$50M revenue segment with a QuickBooks/Xero-native, AI-first, self-serve, sub-$5,000/month solution. That's the white space.

---

## PART 7: HOW TO TALK TO A CFO

### Their language vs. your language

| Don't say | Say instead |
|---|---|
| "Our AI automates dunning" | "We reduce your DSO by 30% in 90 days" |
| "We integrate with your accounting software" | "We connect to QuickBooks/Xero in 48 hours, zero IT required" |
| "Personalized email templates" | "Your customers receive emails with their specific invoice numbers, amounts, and history — they respond because it doesn't look automated" |
| "Machine learning prioritization" | "We rank your highest-risk invoices every morning and chase them first" |
| "SaaS platform" | "A tool your AR team is using by next week" |

### The CFO's Three Questions

Every CFO evaluating a new tool asks these three questions, even if they don't say them out loud:

**1. "Will this actually work in my environment?"**
Answer: "We connect directly to QuickBooks/Xero. Your AR aging imports automatically every day. No CSV exports, no manual uploads. We're operational in 48 hours."

**2. "What's the ROI?"**
Answer: "At your revenue level [X], a 30% DSO reduction frees up approximately [Y] in cash. Our service costs $3,000/month. The cash freed up typically exceeds our annual fee in the first month alone."

DSO improvement math for the conversation:
```
Cash unlocked = (Annual Revenue ÷ 365) × Days Reduced
Example: $20M revenue, reduce DSO by 15 days:
= ($20M ÷ 365) × 15 = $821,917 in cash freed
```

**3. "What's the risk if I try this?"**
Answer: "Month-to-month contract. If we don't reduce your DSO in 90 days, you walk. We don't ask for a year upfront."

### Common CFO Objections and Honest Responses

**Objection: "Our customers are relationship-sensitive. Automated emails will damage relationships."**
Response: "The AI uses the customer's name, their specific invoice numbers, amounts owed, and their payment history. Finance teams who have used this tell us customers respond without realizing the email was automated. The emails read like they came from your AR team — because they're personalized with your data, not a generic template."

**Objection: "We already have an AR team. Why do we need this?"**
Response: "Your AR team spends 60–70% of their time on manual data pulls and writing emails they've written 100 times before. This frees them to handle escalations, disputes, and customer calls — the work that actually requires human judgment. The tool doesn't replace them. It makes them 10× more effective."

**Objection: "We're already using QuickBooks. Can't we just use their reminders feature?"**
Response: "QuickBooks' built-in reminders are generic, not personalized, and aren't prioritized by risk. They don't score your invoices, they don't adjust tone based on how overdue an invoice is, and they don't give you a dashboard showing which customers are your biggest collection risks. This is a different category of tool."

**Objection: "We tried something like this before and it didn't work."**
Response: "What did you try? [Listen carefully]. Most tools that failed were either generic email schedulers without real QuickBooks/Xero data integration, or enterprise tools that took 6 months to implement and then weren't actually used. We're different on both counts — 48-hour setup, real accounting data, AI-personalized emails."

**Objection: "This seems expensive at $3,000/month."**
Response: "Let me show you the math. [Pull up their DSO]. At your revenue, reducing DSO by 15 days — which is conservative, our average is 30% — frees up [calculate]. That's [X] per month in cash you're currently lending to your slow-paying customers for free. Our fee is $3,000. The ROI usually shows up in week one."

---

## PART 8: KEY TERMINOLOGY REFERENCE

Use these words correctly and you'll sound like an industry insider immediately.

| Term | Definition |
|---|---|
| **AR (Accounts Receivable)** | Money owed to your company by customers for goods/services already delivered |
| **AP (Accounts Payable)** | Money your company owes to suppliers |
| **DSO** | Days Sales Outstanding — how long it takes to collect payment |
| **DPO** | Days Payable Outstanding — how long your company takes to pay suppliers |
| **Aging Report** | Snapshot of AR sorted by how long invoices have been unpaid |
| **Dunning** | The process of systematically communicating with customers to collect payment |
| **CEI** | Collections Effectiveness Index — measures how well your team collects vs. what's collectible |
| **Net 30 / Net 60 / Net 90** | Payment terms — invoice due in 30/60/90 days |
| **Early Payment Discount (2/10 Net 30)** | 2% discount if paid within 10 days, otherwise due in 30 |
| **Bad Debt** | AR that can't be collected; written off as an expense |
| **Cash Application** | Matching incoming payments to the correct invoices in the system |
| **Dispute** | Customer challenges an invoice — wrong amount, wrong PO, goods not received |
| **O2C (Order-to-Cash)** | The full process from customer order to cash received |
| **Working Capital** | Current assets minus current liabilities — the cash available to run operations |
| **Cash Flow** | The actual movement of money in and out of the business |
| **Payment Terms** | Agreed conditions for when and how invoices get paid |
| **Remittance** | The document sent with a payment identifying which invoices are being paid |
| **Write-off** | Accepting that an AR balance is uncollectable |
| **Factoring** | Selling AR to a third party at a discount to get cash immediately |
| **ERP** | Enterprise Resource Planning — systems like SAP, Oracle, NetSuite, Microsoft Dynamics |
| **Mid-market** | Companies with $10M–$1B in annual revenue |
| **SMB** | Small and Medium Business — typically under $10M–$50M revenue |

---

## PART 9: THE MACRO PICTURE — WHY THIS MARKET IS EXPLODING

**Three converging forces are creating the AR automation wave:**

**1. Post-2020 labor cost pressure**
CFOs who built their AR teams during the 2010s now face 30–40% higher labor costs for the same headcount. Automating repetitive AR tasks is no longer a "nice to have" — it's a margin defense strategy.

**2. Rising interest rates mean cash flow matters more**
When interest rates were near zero, holding $500K in uncollected AR for an extra 30 days was cheap. At 4–5% rates, that same $500K costs the business approximately $20,000 annually in opportunity cost or borrowing costs. CFOs are now acutely aware of their DSO in a way they weren't before 2022.

**3. AI has made personalized automation actually possible**
The previous generation of AR tools sent generic email blasts. AI enables personalized, contextual communication at scale. A customer getting an email with their actual invoice number, payment history, and a specific payment link is 2–3× more likely to respond than a generic reminder. This is why the category is suddenly viable where it wasn't before.

**The timing:** 80% of finance leaders know they need this. 83% haven't done it yet. DataByt is entering at the exact inflection point where early adopters in the mid-market are actively shopping.

---

*Sources: BillingPlatform 2025 State of AR Automation Survey; PYMNTS Intelligence June 2025; Atradius 2025; Growfin DSO Benchmarks 2025; CreditPulse Industry Analysis 2025; Commercial Law League of America; Versapay/PYMNTS research; Xero research; IOFM.*
