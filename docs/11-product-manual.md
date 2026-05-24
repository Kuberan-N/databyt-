# DataByt Product Manual
### How to connect, use, and get results from every feature — start to finish

---

## WHO THIS IS FOR

This document is for:
- **You (the founder)** — to understand the product end to end
- **New customers** — what happens after they sign up
- **Your future support team** — what to tell customers when they have questions

---

## PART 1: BEFORE YOU START — WHAT YOU NEED

Before a customer can use DataByt, they need:

| Requirement | Why |
|---|---|
| An active account with QuickBooks / Xero / NetSuite / Sage | DataByt reads invoice data from here |
| At least 1 overdue invoice in that system | Otherwise there's nothing to collect |
| An email address on their company domain (e.g., ar@theircompany.com) | DataByt sends dunning emails from this address |
| Access to their DNS records (or their IT person) | To set up email authentication (SPF, DKIM, DMARC) |

**If they don't use any of the 4 supported systems:** DataByt cannot help them yet. See `04-competitor-battlecards.md` for what to say.

---

## PART 2: GETTING CONNECTED (STEP 1 — INTEGRATION)

### What is OAuth and why does DataByt use it?

**OAuth** is a security standard that lets DataByt read your accounting data without you giving DataByt your username and password.

Here's exactly what happens:

1. Customer logs into DataByt and goes to **Integrations**
2. Clicks "Connect QuickBooks" (or Xero / NetSuite / Sage)
3. Gets redirected to QuickBooks login page (QuickBooks' own page, not DataByt's)
4. Logs into QuickBooks with their normal credentials
5. QuickBooks shows: *"DataByt would like to read your invoices and customer data. Allow?"*
6. Customer clicks **Allow**
7. QuickBooks sends DataByt a secure access token (not the password)
8. Customer is redirected back to DataByt — connected

**What DataByt can access after this:**
- Invoice list (invoice number, amount, due date, status)
- Customer names and email addresses
- Payment history on invoices
- AR aging data

**What DataByt cannot access:**
- Bank account details
- Payroll data
- Tax returns
- The customer's login credentials (never stored)

**How long does it take?** 2–5 minutes.

**How to disconnect:** Customer goes to Integrations in DataByt → Disconnect. Or they can revoke access directly in QuickBooks/Xero at any time.

---

## PART 3: THE FIRST IMPORT (STEP 2)

### What happens after connecting?

Once connected, DataByt immediately runs the first import. This pulls:

- Every invoice marked as "overdue" in QuickBooks/Xero
- Customer name and email address for each invoice
- Invoice amount, invoice number, due date
- How many days it is past due
- Any payment history on that customer's account

### Where does this data go?

It populates the **AR Aging Dashboard** in DataByt. You'll see:

- A table of all overdue invoices
- Each invoice's bucket (1–30 days / 31–60 / 61–90 / 90+)
- Each customer's total outstanding balance
- Priority score for each invoice

### Is this automatic going forward?

Yes. After the first import, DataByt re-syncs every morning automatically. If a customer pays in QuickBooks directly, it will show as paid in DataByt at the next sync. No manual action needed.

### What if an invoice is wrong in QuickBooks?

Fix it in QuickBooks. DataByt reflects whatever is in QuickBooks — it doesn't override the source data.

---

## PART 4: AI SCORING — HOW PRIORITY WORKS (STEP 3)

### What is the scoring?

Every overdue invoice gets a priority score so your team knows which invoices to focus on first.

The score is calculated from 4 factors:

| Factor | Weight | Why |
|---|---|---|
| Days overdue | High | Older invoice = more urgent |
| Invoice amount | High | Larger amount = higher priority |
| Customer payment history | Medium | Chronic late payers get flagged higher |
| Customer segment | Medium | "At-risk" customers get higher priority than "strategic" |

### What are the customer segments?

You can tag each customer as:
- **Strategic** — key customer, handle carefully (lower auto-escalation)
- **Standard** — normal customer, normal dunning
- **At-risk** — slow payer or concern, higher priority

This is manual — you set it. By default all customers start as "Standard."

### How accurate is the scoring?

It's as accurate as the data it reads. If QuickBooks shows the right amounts and dates, the scoring is correct. There is no guessing or prediction — it's a formula applied to real data.

---

## PART 5: DUNNING EMAILS — HOW THEY WORK (STEP 4)

### When do emails send?

The dunning engine runs **Monday to Friday at 8am UTC** (automated, no one presses a button).

Each run:
1. Finds all overdue invoices that haven't been emailed in the last 3 days
2. Groups them by customer (one email per customer, all invoices listed together)
3. Determines the escalation level for each customer
4. Generates the email with AI (Gemini)
5. Sends via Resend from the company's configured email address

### What determines L1, L2, L3?

| Level | When | Tone |
|---|---|---|
| L1 | Invoice is < 10 days overdue | Friendly — "just a reminder" |
| L2 | Invoice is 10–29 days overdue | Firm — "action needed" |
| L3 | Invoice is 30+ days overdue | Serious — "final notice" |

The level is based on the **oldest invoice** in that customer's batch. If a customer has one invoice 5 days overdue and one 35 days overdue, they get an L3 email.

### What does the email actually contain?

Every AI-generated email includes:
- Customer's real name (from QuickBooks/Xero)
- Specific invoice numbers they owe
- Exact amounts per invoice
- Total amount outstanding
- Due date for each invoice
- How many days overdue
- Direct payment link (one link per invoice, or a combined link)
- Unsubscribe link at the bottom (CAN-SPAM compliance)

### Does it sound robotic?

No. The AI (Gemini) writes a unique email each time using the real data. It doesn't use a fixed template — it generates fresh text with the customer's specific details. Finance teams consistently report that customers respond thinking it came from a human.

### What is the 3-day cooldown?

DataByt won't email the same customer more than once every 3 days. This prevents over-contacting and feeling spammy. You cannot turn this off (it's a deliverability safeguard).

### What if a customer replies to the email?

DataByt detects replies (via Resend's reply detection webhook). When a reply is detected:
- That invoice is flagged as "replied"
- Auto-dunning pauses for that invoice
- Your finance team is notified to handle the reply manually

Replies mean the customer is engaged — a human should take over at this point.

### What if a customer wants to unsubscribe?

Every email has an unsubscribe link at the bottom. If the customer clicks it:
- DataByt stores their unsubscribe flag
- No more automated emails are sent to that email address
- The invoice stays overdue (collections stop, but the debt doesn't disappear)
- Your team must follow up manually or via phone

---

## PART 6: THE PAYMENT PORTAL (STEP 5)

### What does the customer see when they click the payment link?

They land on a page at `app.databyt.in/pay/[invoice-id]`. No login required.

The page shows:
- Your company name
- Invoice number
- Invoice amount
- Due date
- A "Pay Now" button

### How is the payment processed?

When the customer clicks "Pay Now":
1. They're redirected to **Dodo Payments** hosted checkout (Dodo's own secure page)
2. They enter their card or bank transfer details
3. Dodo Payments processes the payment
4. Customer is redirected to a confirmation page

**Card data never touches DataByt's servers.** It goes directly from the customer's browser to Dodo Payments. This is the same security model used by Stripe and every major payment processor.

### Is it safe?

Yes. The payment page runs on HTTPS. Dodo Payments is PCI DSS compliant. DataByt only receives a notification that payment succeeded — not the card number.

### What currencies/payment methods does it support?

This depends on Dodo Payments' supported options in the customer's region. Typically: credit cards, debit cards, and bank transfers. Check `dodopayments.com` for the current list of supported methods.

---

## PART 7: AUTO-MATCH (STEP 6)

### What happens when a customer pays?

Immediately after payment is confirmed by Dodo:

1. Dodo Payments sends a webhook (an automatic notification) to DataByt
2. DataByt receives the `payment.succeeded` event
3. DataByt creates a payment record in the database
4. DataByt marks the invoice as **Paid**
5. All further dunning emails for that invoice stop

This happens automatically, within seconds of payment. No human needed.

### What about payments made outside DataByt (e.g., direct bank transfer)?

If a customer pays via bank transfer directly (bypassing the payment link), DataByt won't know automatically. Your AR team needs to manually mark the invoice as paid in DataByt. They can do this from the AR Aging table: find the invoice → click "Mark as Paid."

This is an important gap to communicate to customers. Ask them to direct customers to the payment link whenever possible — it's the only way auto-match works.

---

## PART 8: DISPUTE MANAGEMENT (STEP 7)

### What is a dispute?

A dispute is when a customer challenges an invoice — wrong amount, goods not received, duplicate invoice, already paid, etc.

### How does a dispute work in DataByt?

**Filing a dispute:**
1. Finance team goes to the invoice in DataByt
2. Clicks "File Dispute"
3. Selects a reason:
   - Incorrect amount
   - Goods/services not received
   - Duplicate invoice
   - Already paid
   - Service not rendered
   - Other
4. Adds notes (optional)
5. Clicks Submit

**What happens immediately:**
- Invoice status changes to **Disputed**
- All automated dunning emails for that invoice stop immediately
- Invoice is added to the Disputes dashboard

**Resolving a dispute:**
1. Finance team investigates (outside DataByt — call the customer, check records)
2. Opens the dispute in DataByt
3. Changes status to **Investigating** → then **Resolved** or **Rejected**
4. Adds resolution notes (what happened, what was agreed)
5. Clicks Save

**What happens after resolution:**
- If Resolved: invoice is marked as resolved, collections stop permanently
- If Rejected: invoice returns to **Overdue** status, dunning resumes automatically

### Where can you see all disputes?

Dashboard → Disputes. Shows all disputes with status filters (Open / Investigating / Resolved / Rejected). Searchable by customer name or invoice number.

---

## PART 9: THE DASHBOARD — WHAT EVERY NUMBER MEANS (STEP 8)

### Total AR Outstanding
The total dollar value of all unpaid invoices across all customers. This is your AR balance.

### DSO (Days Sales Outstanding)
How many days, on average, it takes to collect payment.
- Formula: `(Total AR ÷ Annual Revenue) × 365`
- **Trending down = good.** DataByt is working.
- **Trending up = bad.** Something is wrong — check if dunning emails are sending.

### CEI (Collections Effectiveness Index)
Score from 0–100 showing how effectively you're collecting vs. what's collectible.
- 90–100 = Excellent
- 80–89 = Good
- 70–79 = Needs improvement
- Below 70 = Serious problem

### Email Performance
- **Open rate:** % of sent emails that were opened. 30–50% is good for dunning emails.
- **Click rate:** % of opened emails where the payment link was clicked.
- **Payment conversion:** % of payment link clicks that resulted in a payment.

### Collection Velocity
- **Average days to pay:** How many days after the first reminder email customers typically pay.
- **Fastest:** The quickest any customer paid after receiving a reminder.

### 6-Month Bar Chart
Shows total amount collected each month for the last 6 months. Should trend upward as DataByt optimizes collections.

### Top Overdue Customers
List of customers with the highest outstanding balance, ranked by amount owed. These are your biggest cash flow risks.

---

## PART 10: THE CFO PDF REPORT

### What is it?

A professionally formatted PDF report that the CFO can share at board meetings. Generated on demand — no waiting, no Excel.

### What's in it?

- Executive Summary (total AR, DSO, CEI)
- AR Aging Breakdown (by bucket)
- Top Overdue Customers table
- At-risk invoice analysis
- 6-month collections trend

### How to generate it:

Dashboard → Reports → Generate PDF → Download.

Takes about 10–15 seconds to generate.

---

## PART 11: ADMIN FEATURES (FOR DATABYT TEAM ONLY)

These features are for managing multiple customer organizations. Your customers don't see this.

### Admin Dashboard
- View all organizations (customers) on DataByt
- See health metrics for each: number of invoices, AR balance, DSO, CEI
- Switch between organizations to view their data

### Admin Onboarding
- `/admin/onboarding` — set up a new customer organization
- Connect their accounting software on their behalf (useful for white-glove onboarding)

### CSV Import
- Bulk import invoice data for a new customer who doesn't yet have accounting software connected
- Format: CSV with columns for customer name, invoice number, amount, due date

---

## PART 12: WHAT IS NOT IN DATABYT YET

These features do not exist. Do not promise them.

| Feature | Status |
|---|---|
| AP automation (managing outgoing bills) | Not built — future CashFlow Command plan |
| Cash flow forecasting | Not built — future plan |
| SAP / Oracle / Dynamics integration | Not built — long-term roadmap |
| SMS or WhatsApp dunning | Not built — future roadmap |
| Mobile app | Not built |
| Two-way sync (writing back to QuickBooks) | Not built — DataByt reads only |

**Important:** DataByt only reads from QuickBooks/Xero. It does not create, edit, or delete anything in the customer's accounting software. When an invoice is marked paid in DataByt, that does NOT automatically update QuickBooks. The customer must update QuickBooks separately (or their next sync will show the correct status).

---

## PART 13: COMMON CUSTOMER QUESTIONS

**"The payment link isn't working."**
Check that the invoice exists in DataByt and has a payment link generated. Go to AR Aging → find the invoice → click the pay link button to regenerate it.

**"My customer said they didn't get the email."**
Check the email deliverability status in DataByt (if available) or check Resend dashboard. Also check: is the customer's email address correct in QuickBooks? Is the customer marked as unsubscribed?

**"I need to stop emails to a specific customer."**
Go to AR Aging → find any invoice for that customer → there will be an option to pause collections for that customer. Alternatively, mark the customer as "Do Not Contact" in customer settings.

**"A customer paid but their invoice still shows as overdue."**
If they paid via the payment link: check if the Dodo webhook fired (check the payments table). If they paid via bank transfer: manually mark the invoice as paid in DataByt.

**"My DSO hasn't improved after 2 weeks."**
DSO is a 30–60 day metric — it takes time to show improvement. Check leading indicators instead: are emails sending? Are open rates above 30%? Are payment links being clicked? These leading indicators confirm the system is working even before DSO visibly drops.

**"Can I add a customer to an exclusion list?"**
Yes. Any customer can be excluded from automated dunning. This is important for sensitive relationships where the CFO wants to handle follow-up manually.

---

## QUICK REFERENCE: WHO DOES WHAT

| Task | Who Does It | Where |
|---|---|---|
| Connect accounting software | Customer (5 min) | DataByt → Integrations |
| Review first import | Customer + DataByt onboarding | DataByt → AR Aging |
| Set customer segments (strategic/standard/at-risk) | Customer | DataByt → Customers |
| Review and approve first dunning run | Customer (first time) | DataByt → Collections |
| File a dispute | Customer finance team | DataByt → Invoice → File Dispute |
| Resolve a dispute | Customer finance team | DataByt → Disputes |
| Manually mark invoice paid | Customer finance team | DataByt → AR Aging → Mark Paid |
| Generate CFO PDF report | Customer (CFO or finance team) | DataByt → Reports |
| View all customer organizations | DataByt admin only | /admin/dashboard |
| Onboard a new customer | DataByt founder/team | /admin/onboarding |

---

*Last updated: May 2026 — covers all live features*
