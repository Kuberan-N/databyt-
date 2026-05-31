# Phase 5 — Disputes & Escalation
> What to do when a customer refuses to pay or contests the invoice.

---

## What is a Dispute?

A dispute happens when a customer says:
- "I never received the goods"
- "The amount is wrong"
- "We already paid this"
- "We are waiting for a credit note"
- "The service quality was not as agreed"

This is different from just ignoring. The customer is **actively contesting** the invoice.

---

## Real World Example

```
Timeline:

May 1   — Invoice INV-1042 sent to Retailer Ltd (₹85,000, Net 30)
May 31  — Due date passes. No payment.
Jun 3   — DataByt sends L1 email
Jun 8   — DataByt sends L2 email
Jun 10  — Customer replies:
          "We dispute this invoice. The goods arrived damaged.
           We will not pay until a credit note is issued."
Jun 10  — Finance team files a dispute in DataByt
Jun 10  — Collections PAUSE immediately
Jun 15  — Investigation complete: damage confirmed
Jun 15  — Credit note issued for ₹15,000
Jun 15  — Dispute resolved: invoice adjusted to ₹70,000
Jun 15  — Collections RESUME for ₹70,000
Jun 18  — Customer pays ₹70,000
Jun 18  — Invoice marked paid
```

---

## Dispute Statuses

| Status | Meaning |
|--------|---------|
| `open` | Dispute filed, under review |
| `investigating` | Team is actively looking into it |
| `resolved` | Dispute closed, outcome decided |
| `rejected` | Dispute found to be invalid |

---

## The Dispute Workflow in DataByt

```
Step 1 — File the Dispute
Go to AR Aging → Find the invoice → Click "Dispute"
Fill in: reason + description

Step 2 — Collections Pause
DataByt immediately stops all emails to this customer
Status changes to "in dispute" on the invoice

Step 3 — Investigate
Disputes page shows all open disputes
Assign to a team member
Add investigation notes

Step 4 — Resolve
Two outcomes:
  a) Valid dispute  → adjust invoice → collections resume for new amount
  b) Invalid dispute → reject → collections resume for full amount

Step 5 — Audit Trail
Every action is logged with timestamp + who did it
```

---

## Dispute Reasons (Categories)

```
→ Goods not received
→ Wrong amount billed
→ Already paid (proof needed)
→ Credit note pending
→ Quality issue
→ Duplicate invoice
→ Other
```

---

## What Happens to Collections During a Dispute

```
BEFORE dispute filed:
Invoice sends L1, L2, L3 emails on schedule

AFTER dispute filed:
→ ALL emails for this customer STOP
→ Invoice shows "Disputed" badge in AR Aging
→ Cooldown timer is paused
→ No further escalation

AFTER dispute resolved:
→ Collections resume from where they left off
→ If resolved in favour of customer: invoice adjusted
→ If rejected: full amount collection resumes
```

---

## Escalation Beyond DataByt (L3 Not Paid)

When L3 emails have been sent and the customer still does not pay and there is no dispute:

```
DataByt has done everything it can.
The next steps are manual:

Option 1 — Direct phone call from finance team
Option 2 — Formal demand letter from a lawyer
Option 3 — Refer to a debt collection agency
Option 4 — Small Claims Court (for smaller amounts)
Option 5 — Write off as bad debt

DataByt flags these invoices clearly:
→ "Requires manual action" badge
→ Appears at top of AR Aging sorted by risk
```

---

## The Disputes Page in DataByt

```
Dashboard → Disputes

Shows:
→ All open disputes (sorted by amount)
→ Customer name + invoice amount + reason
→ Days since dispute was filed
→ Who it is assigned to
→ Quick action: Resolve / Reject / Add Note

Filters:
→ By status (open, investigating, resolved)
→ By date range
→ By amount
```

---

## Where This Lives in the Codebase

```
Disputes API:
src/app/api/disputes/route.ts       ← GET all disputes, POST new dispute
src/app/api/disputes/[id]/route.ts  ← PATCH to update status/notes

Disputes UI:
src/app/dashboard/disputes/page.tsx

When dispute is filed:
→ invoice.status = "disputed"
→ New row in disputes table
→ All pending cron emails for this org+customer are skipped

When dispute is resolved:
→ dispute.status = "resolved"
→ invoice.status = "open" (or "paid" if settled)
→ Collections resume next cron cycle
```

---

## How to Test Disputes

```
Step 1: Go to AR Aging
Step 2: Find an overdue invoice
Step 3: Click the dispute icon / menu → "File Dispute"
Step 4: Select reason + add description → Submit
Step 5: Go to Disputes page → dispute should appear
Step 6: Click the dispute → Add a note: "Investigating with warehouse team"
Step 7: Click Resolve → Add resolution notes
Step 8: Go back to AR Aging → invoice should be back to "open"
Step 9: Confirm collections would resume next cron cycle
```

---

## Self-Test for Phase 5

- [ ] What is a dispute and what triggers one?
- [ ] What happens to emails when a dispute is filed?
- [ ] What are the four dispute statuses?
- [ ] What are the two outcomes when resolving a dispute?
- [ ] What happens after L3 and customer still doesn't pay?
- [ ] Have you filed, investigated, and resolved a test dispute?

---

*Next: Phase 6 — Analytics, Reports & the CFO Dashboard*
