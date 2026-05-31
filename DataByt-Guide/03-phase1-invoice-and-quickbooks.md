# Phase 1 — Invoice & QuickBooks
> What happens before DataByt even touches anything.

---

## The Real World Scenario

Your client is a logistics company. They deliver goods to a retailer.
After delivery, their finance team opens QuickBooks and creates an invoice.

That invoice is a **formal request for payment.**

---

## What an Invoice Contains

| Field | Example | Why It Matters |
|-------|---------|----------------|
| Invoice Number | INV-1042 | Unique ID — DataByt tracks this |
| Customer Name | Retailer Ltd | Who owes the money |
| Customer Email | accounts@retailer.com | Where DataByt sends the dunning email |
| Amount | ₹85,000 | What is owed |
| Issue Date | 1 May 2026 | When invoice was created |
| Due Date | 31 May 2026 | When payment is expected |
| Payment Terms | Net 30 | 30 days to pay |
| Status | Unpaid | DataByt monitors this |

---

## What is QuickBooks?

QuickBooks is accounting software — the financial brain of a business.

```
Finance team uses QB to:
→ Create and send invoices
→ Record payments received
→ See who has paid and who hasn't
→ Track the AR aging (how old each unpaid invoice is)
→ Generate financial reports
```

DataByt connects to QuickBooks like a **read-only assistant.**
It reads. It never writes, modifies, or deletes anything in QB.

---

## What is AR Aging?

AR = Accounts Receivable = money people owe you.
Aging = how long it has been outstanding.

```
QuickBooks AR Aging Report looks like this:

Customer         | Current | 1-30d | 31-60d | 61-90d | 90d+
-----------------|---------|-------|--------|--------|------
Retailer Ltd     |         | 85K   |        |        |
Acme Corp        |         |       | 42K    |        |
TechFlow Ltd     |         |       |        | 28K    |
BuildRight       |         |       |        |        | 15K
```

The older the invoice, the harder it is to collect.
DataByt's job: move everything back to "Current" or "Paid."

---

## What is DSO?

**Days Sales Outstanding** — the average number of days it takes to get paid.

```
Example:
You sent 10 invoices.
They were paid after: 20, 35, 45, 60, 30, 25, 50, 40, 55, 70 days.
Average = 43 days → DSO = 43

Industry target: 30-45 days
Mid-market average: 60-90 days
DataByt reduces DSO by ~30%
```

---

## What is CEI?

**Collections Effectiveness Index** — how good you are at collecting what's owed.

```
CEI = (Collected / Total Collectable) × 100

Example:
Total owed this month: ₹10,00,000
Actually collected:    ₹8,70,000
CEI = 87%

Above 80% = Excellent
60-80%     = Needs improvement
Below 60%  = Serious problem
```

---

## How DataByt Fits Into Phase 1

```
BEFORE DataByt:
Finance team creates invoice in QB → sends it → waits → chases manually

AFTER DataByt:
Finance team creates invoice in QB → DataByt takes over from here
→ Monitors daily
→ Chases automatically
→ Finance team only deals with disputes and exceptions
```

---

## What You (as DataByt) Pull From QuickBooks

Every morning DataByt imports:

```
From QB → DataByt Database (Supabase):

invoices table:
  invoice_number, customer_id, amount, due_date,
  days_overdue, status, currency

customers table:
  name, email, payment_terms, segment

payments table:
  invoice_id, amount_paid, payment_date
```

---

## How to See This in the Codebase

```
QB sync happens here:
src/app/api/integrations/quickbooks/sync/route.ts

Data lands here in Supabase:
→ invoices table
→ customers table
→ payments table

AR Aging page reads from:
src/app/dashboard/ar-aging/page.tsx
```

---

## Self-Test for Phase 1

Before moving to Phase 2, you should be able to answer:

- [ ] What is an invoice and what fields does it have?
- [ ] What is AR Aging and what does the report look like?
- [ ] What is DSO and how is it calculated?
- [ ] What is CEI?
- [ ] What does DataByt read from QuickBooks? Does it write anything?
- [ ] Where does the invoice data go after it's imported?

---

*Next: Phase 2 — How DataByt connects to QuickBooks via OAuth*
