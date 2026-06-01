# Phase 2 — How DataByt Connects to QuickBooks
> OAuth explained simply. What syncs. How to test it.

---

## What is OAuth? (Simple Version)

You know "Sign in with Google" on websites?

That's OAuth. You click a button, Google asks "Allow this app?", you say yes, done.

DataByt uses the exact same system with QuickBooks:

```
1. Your client clicks "Connect QuickBooks" in DataByt
2. QuickBooks opens and asks "Allow DataByt to read your data?"
3. Client clicks Allow
4. QuickBooks gives DataByt a secret key (token)
5. DataByt uses that key to read invoices every day
6. No password is ever shared
```

---

## The Exact Flow in DataByt

```
Client opens Settings → Integrations
         ↓
Clicks "Connect QuickBooks"
         ↓
DataByt calls:
POST /api/integrations/quickbooks
→ builds QuickBooks OAuth URL
         ↓
Browser redirects to QuickBooks login
         ↓
Client logs in to their QuickBooks
Clicks "Allow"
         ↓
QuickBooks redirects back to:
/api/integrations/quickbooks/callback
         ↓
DataByt receives the auth code
Exchanges it for access_token + refresh_token
Saves both to Supabase integrations table
         ↓
Connection = LIVE
Status shows "Connected" in dashboard
```

---

## What Gets Stored After Connection

```
Supabase → integrations table:
{
  org_id:        "uuid-of-client",
  provider:      "quickbooks",
  status:        "connected",
  access_token:  "eyJhb...",     ← expires in 1 hour
  refresh_token: "AB11x...",     ← expires in 100 days, auto-renewed
  realm_id:      "1234567890",   ← their QuickBooks company ID
  last_sync_at:  "2026-05-31"
}
```

---

## What Syncs Every Morning

At 8am every day, the cron job runs:

```
/api/cron/collections (GET, secured by CRON_SECRET)
         ↓
For each connected organisation:
  1. Refresh access token if needed
  2. Call QB API: GET /v3/company/{realmId}/query
     → SELECT * FROM Invoice WHERE Balance > 0
  3. Calculate days_overdue for each invoice
  4. Upsert into Supabase invoices table
  5. Score each invoice (priority_score)
  6. Send dunning emails where due
```

---

## What a Real QuickBooks Invoice Looks Like

This is the actual JSON QuickBooks returns:

```json
{
  "Id": "1042",
  "DocNumber": "INV-1042",
  "TxnDate": "2026-04-01",
  "DueDate": "2026-05-01",
  "Balance": 85000.00,
  "TotalAmt": 85000.00,
  "CustomerRef": {
    "value": "42",
    "name": "Retailer Ltd"
  },
  "BillEmail": {
    "Address": "accounts@retailer.com"
  },
  "Line": [
    {
      "Description": "Freight Services April 2026",
      "Amount": 85000.00
    }
  ]
}
```

DataByt maps this to:

```
invoice_number → "INV-1042"
amount         → 85000
due_date       → "2026-05-01"
days_overdue   → (today - due_date) = 30 days
status         → "overdue"
customer email → "accounts@retailer.com"
```

---

## Token Refresh — How It Stays Connected

```
Access token expires every 60 minutes.
DataByt handles this automatically:

Before every sync:
→ Check if access_token is expired
→ If yes: use refresh_token to get a new access_token
→ Save new access_token to Supabase
→ Continue with sync

Refresh token expires after 100 days.
→ Client must reconnect QB after 100 days
→ DataByt shows warning 7 days before expiry
```

---

## How to Test This (Your 8-Step Test)

```
Step 1: Go to www.databyt.in/dashboard/integrations
Step 2: Click "Connect QuickBooks"
Step 3: Log in with your QB developer sandbox account
        (developer.intuit.com → My Hub → Sandbox Companies)
Step 4: Click "Allow"
Step 5: You should land back on DataByt with "Connected" status
Step 6: Check Supabase → integrations table → row should appear
Step 7: Click "Sync Now" button (if available) OR wait for cron
Step 8: Go to AR Aging page → your QB invoices should appear
```

---

## Where This Lives in the Codebase

```
Connection flow:
src/app/api/integrations/quickbooks/route.ts        ← builds OAuth URL
src/app/api/integrations/quickbooks/callback/route.ts ← receives token
src/app/api/integrations/quickbooks/sync/route.ts   ← syncs invoices

Integrations dashboard page:
src/app/dashboard/integrations/page.tsx

Token storage:
Supabase → integrations table
```

---

## Self-Test for Phase 2

- [ ] Can you explain OAuth in one sentence?
- [ ] What is an access_token vs a refresh_token?
- [ ] What QB data gets pulled during sync?
- [ ] What does a real QB invoice JSON look like?
- [ ] What happens when the access token expires?
- [ ] Have you connected QB sandbox and seen invoices appear in AR Aging?

---

*Next: Phase 3 — How the AI writes the dunning email*
