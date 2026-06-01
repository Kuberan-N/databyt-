# Phase 3 — The AI Email Engine
> How DataByt writes dunning emails using Gemini AI.

---

## What is a Dunning Email?

A dunning email is a **payment reminder** sent to a customer who has not paid their invoice.

Most companies write these manually. DataByt writes them automatically using AI — personalised, professional, and escalating in tone.

---

## The Three Levels (L1 / L2 / L3)

| Level | When Triggered | Tone | Goal |
|-------|---------------|------|------|
| L1 | 1–9 days overdue | Friendly, warm | "Hey, just a reminder" |
| L2 | 10–29 days overdue | Professional, firm | "This needs attention now" |
| L3 | 30+ days overdue | Serious, final | "Last chance before escalation" |

Each level has a cooldown — DataByt won't spam. It waits the set number of days between emails.

---

## Real Email Examples (What Gemini Generates)

### L1 — Friendly Reminder (5 days overdue)

```
Subject: Invoice INV-1042 — Friendly Payment Reminder

Hi Sarah,

I hope this finds you well. I'm reaching out regarding Invoice INV-1042
for ₹85,000, which was due on 1 May 2026.

This may have simply slipped through — please find the payment details
below and feel free to reach out if you have any questions.

[Pay Now — ₹85,000]

Thank you,
DataByt Collections
On behalf of: Logistics Co.
```

---

### L2 — Firm Follow-Up (18 days overdue)

```
Subject: Invoice INV-1042 — Payment Required

Dear Sarah,

Despite our earlier reminder, Invoice INV-1042 for ₹85,000 remains
outstanding as of today, 18 days past its due date.

We request payment by 5 June 2026 to avoid further action.
Continued non-payment may affect your account standing with us.

[Pay Now — ₹85,000]

Regards,
DataByt Collections
On behalf of: Logistics Co.
```

---

### L3 — Final Notice (45 days overdue)

```
Subject: FINAL NOTICE — Invoice INV-1042 — Immediate Action Required

Dear Sarah,

This is a final notice regarding Invoice INV-1042 for ₹85,000,
now 45 days overdue.

Without payment or a confirmed payment plan by 10 June 2026,
this account will be reviewed and referred to our collections process.

We are willing to discuss a payment plan — please contact us immediately.

[Pay Now — ₹85,000]    [Request Payment Plan]

DataByt Collections
On behalf of: Logistics Co.
```

---

## How DataByt Batches Emails

**One email per customer — not one per invoice.**

```
Customer: Retailer Ltd owes 3 invoices:
  INV-1042 — ₹85,000 — 18 days overdue
  INV-1051 — ₹32,000 — 12 days overdue
  INV-1063 — ₹18,000 — 5 days overdue

DataByt sends ONE email covering all three.
The email lists all invoices with individual amounts.
One payment link per invoice.

NOT three separate emails.
This is professional and avoids annoying the customer.
```

---

## What Gemini Receives (The Prompt)

```
DataByt sends Gemini this information:

- Customer name: Retailer Ltd
- Contact: Sarah (accounts@retailer.com)
- Invoices: [list of all overdue invoices with amounts and ages]
- Escalation level: L2
- Your company name: Logistics Co.
- Payment link: https://pay.stripe.com/xyz?invoice=INV-1042

Gemini returns:
- SUBJECT: [one line]
- BODY: [the full email]
```

---

## The Payment Link

Every email includes a payment link.

This is **your** payment link — Stripe, Razorpay, bank transfer, or any URL you configure.

```
Settings → Payment Collection → Payment Link Template:

https://pay.razorpay.com/your-account?invoice={invoice_number}

DataByt replaces {invoice_number} with the actual invoice number.
So for INV-1042 the link becomes:
https://pay.razorpay.com/your-account?invoice=INV-1042
```

You are not locked into any payment processor. DataByt just embeds your link.

---

## Unsubscribe Handling

Every email includes an unsubscribe link.

```
If customer clicks Unsubscribe:
→ DataByt marks customer as unsubscribed
→ No more emails sent to that customer
→ You are notified
→ CAN-SPAM compliant
```

---

## Reply Detection

If the customer replies to the email:

```
Customer replies: "We will pay next week, please hold"
         ↓
DataByt receives the reply via Resend inbound webhook
         ↓
Reply is logged in the communications table
         ↓
You are notified in the Collections dashboard
         ↓
You decide: pause collections? file dispute?
```

---

## How to Test the Email Engine

```
Step 1: Go to AR Aging page
Step 2: Find an overdue invoice
Step 3: Click the Email button
Step 4: The EmailDraftModal opens
Step 5: You see the AI-generated email (subject + body)
Step 6: Review it — edit if needed
Step 7: Click Send
Step 8: Check your inbox (if you used your own email as customer)
Step 9: Check Collections page → email should be logged
```

---

## Where This Lives in the Codebase

```
AI email drafting:
src/app/api/collections/draft-email/route.ts
→ Calls Gemini API
→ Returns subject + body

Email sending:
src/app/api/collections/send-email/route.ts
→ Calls Resend API
→ Logs to communications table

Email draft modal (UI):
src/components/EmailDraftModal.tsx

Automated daily sending:
src/app/api/cron/collections/route.ts
→ Runs at 8am daily
→ Drafts + sends for all eligible invoices
```

---

## Self-Test for Phase 3

- [ ] What is a dunning email?
- [ ] What are L1, L2, L3 and when does each trigger?
- [ ] Why does DataByt send one email per customer not one per invoice?
- [ ] What is the payment link template and where do you configure it?
- [ ] What happens when a customer unsubscribes?
- [ ] Have you drafted and sent a test email from the AR Aging page?

---

*Next: Phase 4 — What happens after the email is sent*
