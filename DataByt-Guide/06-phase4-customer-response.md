# Phase 4 — What Happens After the Email Is Sent
> The two paths: customer pays ✅ or customer ignores ❌

---

## The Decision Point

Every dunning email leads to one of two paths:

```
Email delivered to customer
         ↓
    ┌────┴────┐
    ↓         ↓
Customer    Customer
  pays      ignores
    ✅          ❌
```

---

## Path A — Customer Pays ✅

### Step by Step

```
1. Customer receives the email
2. Customer clicks the payment link
3. Customer pays via Stripe / Razorpay / Bank Transfer
   (whichever link you configured in Settings)
4. Payment is made outside DataByt — on YOUR payment page
5. You receive the payment notification from your payment provider
6. You go to AR Aging in DataByt
7. Click "Mark Paid" on that invoice
8. DataByt updates invoice status → "paid"
9. Collections stop — no more emails for this invoice
```

### What Changes in the Database

```
Before payment:
invoice.status     = "overdue"
invoice.days_overdue = 18

After marking paid:
invoice.status              = "paid"
invoice.payment_received_date = "2026-05-31"
invoice.days_overdue         = 0
```

---

## Path B — Customer Ignores ❌

### What DataByt Does Automatically

```
Day 1:  Invoice 5 days overdue → L1 email sent → no response
Day 4:  Cooldown respected (3 days) → checking again
Day 10: Invoice now 14 days overdue → L2 email sent → no response
Day 17: Cooldown respected → checking again
Day 30: Invoice now 34 days overdue → L3 email sent
Day 33: Still no response → L3 again after cooldown
         → You are flagged for manual review
```

### Escalation Rules (Configurable Per Client)

```
Settings → Collection Rules:

L1 threshold:  1 day overdue   → first reminder
L2 threshold:  10 days overdue → firm follow-up
L3 threshold:  30 days overdue → final notice
Cooldown:      3 days between emails

These are per-organisation — each client can have different rules.
```

---

## Path C — Customer Disputes ❌⚡

### What Happens

```
Customer replies: "This invoice is wrong — we never received the goods"
         ↓
You see the reply in Collections dashboard
         ↓
You click "File Dispute" on the invoice
         ↓
Collections PAUSE immediately for this customer
(No more emails while dispute is open)
         ↓
You investigate:
→ Check with your client's delivery team
→ Contact the customer directly
→ Decide: valid dispute or not?
         ↓
If valid → adjust invoice amount → resume collections
If invalid → mark dispute rejected → collections resume
         ↓
Full audit trail logged
```

---

## What "Mark Paid" Actually Does in DataByt

When you click Mark Paid on an invoice:

```
1. invoice.status = "paid"
2. invoice.payment_received_date = today
3. A payment record is created in the payments table
4. The invoice disappears from AR Aging "overdue" view
5. It appears in "collected this month" on the analytics page
6. CEI score updates
7. DSO recalculates
8. No further emails are sent
```

---

## Partial Payments

```
Customer pays ₹40,000 on a ₹85,000 invoice.

DataByt handles this:
→ Record partial payment of ₹40,000
→ Invoice remains open with balance ₹45,000
→ Collections continue for the remaining amount
→ L1/L2/L3 emails reference the remaining balance
```

---

## How to Test Path A (Paying)

```
Step 1: Go to AR Aging
Step 2: Find an overdue test invoice
Step 3: Click the three-dot menu → "Mark as Paid"
Step 4: Invoice should disappear from overdue list
Step 5: Go to Analytics → "Collected This Month" should increase
Step 6: Go to the specific customer page → payment should appear in history
```

---

## How to Test Path B (Ignoring / Escalation)

```
Step 1: Go to Settings → Collection Rules
Step 2: Set L1 = 1 day, L2 = 2 days, L3 = 3 days (for testing)
Step 3: Set Cooldown = 1 day
Step 4: Create a test invoice in QB dated 5 days ago
Step 5: Sync from Integrations page
Step 6: Invoice appears in AR Aging as L2
Step 7: Manually trigger a collection email
Step 8: Don't mark it paid
Step 9: Next day — check if escalation level increases
```

---

## Where This Lives in the Codebase

```
Mark paid (UI):
src/app/dashboard/ar-aging/page.tsx
→ Button calls Supabase directly to update invoice status

Dispute filing:
src/app/api/disputes/route.ts       ← create dispute
src/app/api/disputes/[id]/route.ts  ← update status

Escalation logic:
src/app/api/cron/collections/route.ts
→ escalationLevel(daysOverdue, l1, l2, l3) function

Collection rules (UI):
src/app/dashboard/settings/page.tsx
→ L1/L2/L3 day sliders + cooldown setting
```

---

## Self-Test for Phase 4

- [ ] What are the two paths after an email is sent?
- [ ] What happens when you click Mark Paid?
- [ ] What is a partial payment and how is it handled?
- [ ] When do collections pause automatically?
- [ ] What is the dispute workflow?
- [ ] Can you configure different escalation rules per client?
- [ ] Have you tested marking an invoice as paid and watching the analytics update?

---

*Next: Phase 5 — Disputes & Escalation Portal*
