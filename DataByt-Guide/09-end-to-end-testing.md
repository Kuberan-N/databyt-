# End-to-End Testing Guide
> The 8-step test that proves DataByt works 100%.

---

## What You Need Before Starting

```
✅ DataByt account (your Dinemetrics login)
✅ QuickBooks Developer Sandbox (developer.intuit.com)
✅ An email inbox you can check (use your own email as test customer)
✅ Payment link configured in Settings (even a fake URL is fine for testing)
```

---

## Setup: Create Test Data in QB Sandbox

Before running the 8 steps, create these invoices in your QB Sandbox:

```
Invoice 1: INV-TEST-001
Customer:  Test Customer Ltd
Email:     your-own-email@gmail.com    ← use your real email
Amount:    ₹50,000
Due Date:  15 days ago                 ← so it's already overdue

Invoice 2: INV-TEST-002
Customer:  Test Customer Ltd
Amount:    ₹25,000
Due Date:  35 days ago                 ← L2 level

Invoice 3: INV-TEST-003
Customer:  Second Test Corp
Email:     another-email@gmail.com
Amount:    ₹80,000
Due Date:  5 days ago                  ← L1 level
```

How to create in QB Sandbox:
```
1. Go to developer.intuit.com → My Hub → Sandbox Companies
2. Open your sandbox company
3. Sales → Invoices → New Invoice
4. Fill in customer (create if new), amount, due date
5. Save
```

---

## The 8-Step Test

---

### Step 1 — Connect QuickBooks

```
Where:    www.databyt.in/dashboard/integrations
Action:   Click "Connect QuickBooks"
          Log in with your Intuit developer account
          Select the sandbox company
          Click Allow

Expected: Status shows "Connected"
          realm_id appears in Supabase integrations table

✅ Pass if: You see "Connected" and no error
❌ Fail if: Error message or redirect fails
```

---

### Step 2 — Sync Invoices

```
Where:    www.databyt.in/dashboard/integrations
Action:   Click "Sync Now" on QuickBooks

OR wait for the daily cron (8am)
OR manually trigger: GET /api/cron/collections
  (add your CRON_SECRET header)

Expected: "Last synced: just now"
          sync count shows 3 (your 3 test invoices)

✅ Pass if: Invoices appear in AR Aging
❌ Fail if: Sync count = 0 or error shown
```

---

### Step 3 — Check AR Aging

```
Where:    www.databyt.in/dashboard/ar-aging
Action:   Look for your 3 test invoices

Expected:
INV-TEST-001 → Test Customer Ltd → ₹50,000 → 15 days → L2
INV-TEST-002 → Test Customer Ltd → ₹25,000 → 35 days → L3
INV-TEST-003 → Second Test Corp  → ₹80,000 → 5 days  → L1

✅ Pass if: All 3 invoices visible with correct levels
❌ Fail if: Invoices missing or wrong days_overdue
```

---

### Step 4 — Draft an Email

```
Where:    AR Aging page → INV-TEST-001 → Click Email button
Action:   EmailDraftModal opens
          AI generates the email using Gemini

Expected:
Subject: "Invoice INV-TEST-001 — Payment Reminder" (or similar)
Body:    Personalised email with customer name, amount, due date

✅ Pass if: Subject and body are populated and professional
❌ Fail if: Modal is empty or shows error
```

---

### Step 5 — Send the Email

```
Where:    EmailDraftModal (still open from Step 4)
Action:   Review the email
          Click "Send"

Expected:
→ Modal closes
→ Success toast: "Email sent"
→ Collections page shows the sent email in the log

Check your inbox (you used your own email):
→ Email arrives within 1-2 minutes
→ Sender: collections@databyt.io (or your configured sender)
→ Content matches what you saw in the modal
→ Payment link is present and correct

✅ Pass if: Email arrives in inbox with correct content
❌ Fail if: Email doesn't arrive or content is wrong
```

---

### Step 6 — File a Dispute

```
Where:    AR Aging page → INV-TEST-002 → Dispute button
Action:   Select reason: "Wrong amount billed"
          Description: "Customer says amount should be ₹20,000 not ₹25,000"
          Click Submit

Expected:
→ Invoice shows "Disputed" badge
→ Disputes page shows the new dispute
→ Collections paused for this invoice

Go to: www.databyt.in/dashboard/disputes
→ Dispute should appear at top

✅ Pass if: Dispute visible on disputes page, badge on invoice
❌ Fail if: Error on submit or dispute not appearing
```

---

### Step 7 — Mark an Invoice as Paid

```
Where:    AR Aging page → INV-TEST-003 → Mark Paid
Action:   Click "Mark as Paid"
          Confirm: payment amount ₹80,000, today's date

Expected:
→ Invoice disappears from AR Aging "overdue" view
→ Analytics page: "Collected This Month" increases by ₹80,000
→ Customer page: Payment appears in history
→ No more emails will be sent for this invoice

✅ Pass if: Invoice gone from overdue, analytics updated
❌ Fail if: Invoice still shows or analytics not updated
```

---

### Step 8 — Generate the PDF Report

```
Where:    www.databyt.in/dashboard/reports
Action:   Click "Generate PDF Report"

Expected:
→ PDF downloads within 5 seconds
→ PDF contains:
   - Your company name (Dinemetrics)
   - Total outstanding (your remaining invoices)
   - DSO calculation
   - AR aging breakdown
   - Top overdue customers

✅ Pass if: PDF downloads with real data populated
❌ Fail if: Error, empty PDF, or timeout
```

---

## Test Results Tracker

| Step | Test | Result | Notes |
|------|------|--------|-------|
| 1 | QuickBooks connected | ⬜ Pass / ⬜ Fail | |
| 2 | Invoices synced | ⬜ Pass / ⬜ Fail | |
| 3 | AR Aging shows correct levels | ⬜ Pass / ⬜ Fail | |
| 4 | Email draft generated by AI | ⬜ Pass / ⬜ Fail | |
| 5 | Email received in inbox | ⬜ Pass / ⬜ Fail | |
| 6 | Dispute filed and visible | ⬜ Pass / ⬜ Fail | |
| 7 | Invoice marked paid + analytics updated | ⬜ Pass / ⬜ Fail | |
| 8 | PDF report downloaded with real data | ⬜ Pass / ⬜ Fail | |

**8/8 = Product is 100% working.**

---

## If Something Fails

| Symptom | Where to Look |
|---------|--------------|
| QB connect fails | Check QUICKBOOKS_CLIENT_ID in Vercel env vars |
| Sync returns 0 invoices | Check QUICKBOOKS_CLIENT_SECRET + realm_id in integrations table |
| Email not arriving | Check RESEND_API_KEY + sender domain verified in Resend |
| AI email is empty | Check GEMINI_API_KEY in Vercel env vars |
| PDF fails | Check Supabase has invoice + payment data for your org |
| Analytics all zero | No real data yet — complete steps 1-7 first |

---

## After All 8 Pass

You have a 100% working DataByt product.

```
You can now:
→ Onboard your first real client
→ Connect their real QuickBooks
→ Show them the AR Aging dashboard live
→ Let DataByt run collections automatically
→ Charge them $2,000/month
```

---

*All phases complete. You now understand and can operate DataByt end-to-end.*
