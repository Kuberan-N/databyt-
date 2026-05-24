# DataByt — Test & Learn Guide
### Learn the full system by being your own first customer

---

## BEFORE YOU START — What You Are About To Do

You are going to play **two roles at the same time:**

1. **You as DataByt (the product)** — watching what the system does
2. **You as the customer (a finance team)** — doing what a real customer would do

You will use **two free accounts** — one connected to Xero, one connected to QuickBooks.

By the end of this guide, you will understand:
- Why every screen exists
- Why every number matters
- What your customer will feel when they use this

---

## PART 1 — SET UP YOUR TWO TEST ACCOUNTS

### Why two accounts?
Because you sell two plans. You need to feel what each customer feels. Also, different customers use different accounting software — so you need to test both.

---

### Account 1 — Xero (AR Engine plan, $3,000/month)

**Step 1: Sign up on DataByt**
- Go to `www.databyt.in/auth`
- Click "Get started"
- Use your main email (kuberanoh@gmail.com)
- Company name: `Test Company Xero`
- Create account

**Why this matters:** This is exactly what your customer does on day 1. You are feeling the signup flow they will feel.

---

**Step 2: Create fake invoices in Xero**

Before connecting, you need something to collect. Go to your Xero account (`go.xero.com`) and create 5 fake invoices:

Go to **Sales → Invoices → New Invoice**

Create these 5 invoices:

| Customer Name | Customer Email | Amount | Due Date |
|---|---|---|---|
| Acme Corp | acme@test.com | $5,000 | 45 days ago |
| BlueSky Ltd | bluesky@test.com | $12,000 | 20 days ago |
| TechStart Inc | techstart@test.com | $3,500 | 8 days ago |
| Metro Services | metro@test.com | $28,000 | 65 days ago |
| Sunrise Foods | sunrise@test.com | $7,200 | 12 days ago |

**How to make them overdue:**
- Set the due date to a date in the past (e.g., if today is May 24, set due date to April 9 for "45 days ago")
- Set status to **Approved** (not Draft)
- Click **Approve** on each invoice

**Why fake invoices?** DataByt only pulls invoices that are overdue. If there are no invoices in Xero, there is nothing to collect. These fake invoices simulate a real company's unpaid bills.

---

**Step 3: Connect Xero to DataByt**

- Log into DataByt (Account 1)
- Go to **Dashboard → Integrations**
- Click **Connect** next to Xero
- You will be sent to Xero's login page (Xero's own page — DataByt never sees your password)
- Log in with your Xero credentials
- Xero asks: "DataByt wants to read your data. Allow?" — click **Allow**
- You are sent back to DataByt

**What just happened:** DataByt now has a secure token (like a key card) that lets it read your Xero invoices. It does NOT have your username or password. This is called OAuth.

---

**Step 4: Sync your invoices**

- On the Integrations page, click **Sync now** next to Xero
- Wait 10–15 seconds
- You will see: "Synced 5 records from Xero"

**What just happened:** DataByt read all 5 overdue invoices from Xero and stored them in its own database. It also created customer records for Acme Corp, BlueSky Ltd, etc.

---

**Step 5: Check the AR Aging Dashboard**

- Go to **Dashboard → AR Aging**
- You should see all 5 invoices listed
- Each invoice shows: customer name, amount, due date, days overdue

**What is AR Aging?**
"Aging" means how old the debt is. A 65-day overdue invoice is more urgent than an 8-day overdue one. DataByt groups invoices into buckets:
- 1–30 days overdue
- 31–60 days overdue
- 61–90 days overdue
- 90+ days overdue

The older the invoice, the harder it is to collect. This is why the dashboard shows aging — so your customer knows where to focus.

**Look at your dashboard now:**
- Metro Services ($28,000 — 65 days) should be at the top
- TechStart Inc ($3,500 — 8 days) should be at the bottom
- The total AR outstanding at the top shows your total unpaid balance

---

**Step 6: Check the main Dashboard**

- Go to **Dashboard** (home)
- You will see:
  - **Total AR Outstanding** — sum of all 5 invoices
  - **DSO** — Days Sales Outstanding (how many days on average to get paid)
  - **CEI** — Collections Effectiveness Index (0–100 score)

**What is DSO?**
If a company sends an invoice and gets paid in 30 days on average — their DSO is 30. If it takes 60 days — DSO is 60. Lower is better. DataByt's job is to reduce this number.

**What is CEI?**
A score from 0 to 100. 100 means you collected everything collectible. 70 means you collected 70% of what you should have. DataByt's job is to push this toward 100.

Right now your DSO will be high (because all invoices are overdue) and CEI will be low. This is exactly what a new customer's dashboard looks like on day 1 — before DataByt starts working.

---

**Step 7: Look at the Collections page**

- Go to **Dashboard → Collections**
- This shows which invoices are ready to be emailed and at what level

**The three email levels:**
- **L1** — Invoice is less than 10 days overdue → friendly reminder
- **L2** — Invoice is 10–29 days overdue → firm, action needed
- **L3** — Invoice is 30+ days overdue → serious, final notice

**Look at your 5 invoices:**
- TechStart Inc (8 days) → L1
- BlueSky Ltd (20 days) → L2
- Sunrise Foods (12 days) → L2
- Acme Corp (45 days) → L3
- Metro Services (65 days) → L3

**Why different levels?** Because you do not chase a customer the same way on day 8 vs day 65. Day 8 — they probably just forgot. Day 65 — something is wrong. The tone of the email changes accordingly.

---

**Step 8: Watch the dunning engine**

The AI sends emails automatically every weekday at 8am UTC. But you can trigger it manually to test.

- Go to **Dashboard → Collections**
- Find the option to trigger a manual run (or wait until the next morning)

When the dunning engine runs:
1. It finds all overdue invoices not emailed in the last 3 days
2. It groups all invoices per customer into ONE email (so Acme Corp gets one email listing all their invoices, not one email per invoice)
3. AI (Gemini) writes a unique email for each customer
4. The email is sent via Resend from your configured email address
5. Every email contains a payment link

**Why one email per customer?** Because if a customer owes you on 3 invoices and gets 3 separate emails, they feel harassed. One email with all invoices listed is professional and clear.

---

**Step 9: Check your email (as the customer)**

The dunning emails were sent to the email addresses on your fake invoices (acme@test.com, etc.). Those are fake so you won't receive them.

**To see what the email looks like:**
- Go to your Resend dashboard (resend.com → log in)
- Go to Logs
- You will see the emails that were sent
- Click on one to see the full email content

This is what your real customers' customers will receive. Read it carefully. Does it sound professional? Does it sound like it came from a human?

---

**Step 10: Test the payment link**

In the sent email, there is a payment link. Click it.

You will land on: `www.databyt.in/pay/[invoice-id]`

This page shows:
- Company name
- Invoice number
- Amount owed
- A "Pay Now" button

Click "Pay Now" — you will be sent to Dodo Payments' checkout page. This is where the customer enters their card details.

**Important:** Card data never touches DataByt. It goes directly from the customer's browser to Dodo Payments. DataByt only receives a notification saying "payment succeeded."

**Why Dodo Payments and not Stripe?** Dodo Payments works better for Indian-incorporated companies and supports international payments.

---

**Step 11: Test a dispute**

Imagine Acme Corp calls you and says "that invoice is wrong — you charged us twice."

- Go to **AR Aging**
- Find the Acme Corp invoice
- Click **File Dispute**
- Select reason: "Duplicate invoice"
- Click Submit

**What happens immediately:**
- Invoice status changes to "Disputed"
- All dunning emails for this invoice stop immediately
- It appears in the Disputes dashboard

This is important. If you keep emailing a customer who is disputing an invoice, you will damage the relationship. DataByt stops automatically the moment a dispute is filed.

- Go to **Dashboard → Disputes** to see it

**Resolve the dispute:**
- Open the dispute
- Change status to "Resolved"
- Add note: "Confirmed duplicate — invoice cancelled"
- Save

Now go back to AR Aging — the invoice is resolved and will no longer be chased.

---

**Step 12: Generate the CFO PDF**

- Go to **Dashboard → Reports**
- Click **Generate PDF**
- Wait 10–15 seconds
- Download the PDF

Open it. This is what your customer's CFO will show at their board meeting. It includes:
- Total AR outstanding
- DSO and CEI
- AR aging breakdown
- Top overdue customers
- 6-month collections trend

**Why does this matter?** Most finance teams spend hours making this in Excel every month. DataByt generates it in 15 seconds. This alone is worth thousands of dollars to a CFO.

---

## PART 2 — ACCOUNT 2 (QuickBooks)

Now repeat the same process with QuickBooks. The experience should be identical — that is how you know the product is consistent.

**Step 1:** Sign up at `www.databyt.in/auth`
- Use a second email address (e.g., kuberanoh+qb@gmail.com — Gmail ignores the +qb part)
- Company name: `Test Company QuickBooks`

**Step 2:** Sign up for QuickBooks free trial at `quickbooks.intuit.com`
- No card required for 30 days
- Create the same 5 fake invoices (same amounts, same overdue dates)
- Mark them as approved/sent

**Step 3:** Connect QuickBooks
- Go to Integrations → Connect QuickBooks
- Log in with your Intuit account
- Allow access
- Sync

**Step 4:** Do Steps 5–12 again from Account 1

**What you are looking for:** Does everything work the same way? Does the dashboard look the same? Do the emails go out? Do the payment links work?

If yes — both integrations are working correctly.

---

## PART 3 — WHAT TO MEASURE

After 3–4 days of testing, check these numbers on both accounts:

| What to check | Where to find it | What good looks like |
|---|---|---|
| Did emails send? | Collections page / Resend logs | Yes, every weekday |
| Email open rate | Analytics | 30–50% |
| Payment link clicked? | Analytics | At least 1–2 clicks |
| DSO trending? | Dashboard | Should be going down |
| CEI score? | Dashboard | Should be going up |
| Disputes working? | Disputes page | Dispute stops emails immediately |
| PDF generates? | Reports | Downloads in 15 seconds |

---

## PART 4 — THE QUESTIONS YOUR CUSTOMER WILL ASK

After testing, you will know the answer to every one of these from experience:

**"How long does setup take?"**
You just did it. How long did it take you? That is your honest answer.

**"Will the emails sound like they came from us?"**
You just read the emails. Did they sound professional? Generic? Human?

**"What happens if my customer disputes an invoice?"**
You just tested it. Dunning stops immediately. Dispute is tracked. You resolved it.

**"Is our data safe?"**
You just connected via OAuth. DataByt never saw your Xero/QuickBooks password.

**"What if a customer pays by bank transfer instead of the payment link?"**
You now know: you have to manually mark it as paid in DataByt (AR Aging → Mark as Paid). The auto-match only works for payments through the payment link.

**"How fast will our DSO improve?"**
You now know: DSO takes 30–60 days to visibly drop. But you can show them leading indicators — emails sending, open rates, payment link clicks — as proof the system is working before DSO moves.

---

## PART 5 — THE ONE THING THAT WILL SURPRISE YOU

When you read the AI-generated dunning emails, you will notice they do not sound robotic.

They include the customer's real name, specific invoice numbers, exact amounts, and due dates. Gemini writes a fresh email each time — not a template.

This is the product's biggest hidden strength. Finance teams tell us customers reply thinking the email came from a human. That is the goal.

---

## QUICK REFERENCE — WHAT EVERY PAGE DOES

| Page | What it shows | Why it exists |
|---|---|---|
| Dashboard (home) | Total AR, DSO, CEI, charts | CFO's morning view — is the business healthy? |
| AR Aging | Every overdue invoice, bucketed | Where to focus collections effort |
| Collections | Which invoices will be emailed next | Control over the dunning engine |
| Disputes | All disputed invoices and their status | Stop chasing customers who have a valid issue |
| Analytics | Email open rates, click rates, conversion | Proof the system is working before DSO drops |
| Customers | All customer profiles and segments | Tag customers as Strategic / Standard / At-risk |
| Reports | CFO PDF generator | Board-ready report in 15 seconds |
| Integrations | Connect accounting software | The source of all invoice data |
| Settings | Email configuration, company details | Set up the sending email address |

---

## WHAT TO DO AFTER FINISHING THIS GUIDE

1. Write down 3 things that surprised you
2. Write down 1 thing that confused you (that is a product bug to fix)
3. Write down what you would tell a CFO in 2 minutes based on what you just experienced
4. That 2-minute answer = your sales pitch

---

*Last updated: May 2026 — use this guide every time you onboard a new customer*
