# DataByt Tech Stack — Explained as a Story

> Read this like a storybook. No jargon. No skipping.
> Come back to this every time the code confuses you.

---

## Chapter 1 — TypeScript (The Language)

Imagine you run a restaurant kitchen.

You tell your chef: **"Make a dish."**

The chef asks: *"What dish? For how many people? Hot or cold?"*

That's TypeScript. It **forces you to be specific** before anything gets cooked.

```
Without TypeScript (JavaScript):
"Make a dish" → chef guesses → wrong dish arrives

With TypeScript:
"Make pasta, for 2 people, served hot" → exactly right
```

In DataByt, when we write:

```typescript
type Invoice = {
  id: string
  amount: number
  daysOverdue: number
  customer: string
}
```

We're telling the kitchen exactly what an invoice looks like.
If someone tries to pass a phone number as an invoice —
TypeScript catches it **before** it even runs.

**That's it. TypeScript = being forced to describe your data before using it.**

---

## Chapter 2 — Next.js (The Restaurant)

Your restaurant has two parts:

**The dining room** — what customers see
(the UI, the dashboard, the landing page)

**The kitchen** — where the real work happens
(fetching data, sending emails, connecting to QuickBooks)

Next.js runs **both in one building.**

```
src/app/page.tsx                   → dining room (landing page)
src/app/dashboard/page.tsx         → dining room (dashboard)
src/app/api/invoices/route.ts      → kitchen (fetches invoices from DB)
src/app/api/email/route.ts         → kitchen (sends dunning emails)
src/app/api/cron/collections/      → kitchen (runs every morning at 8am)
```

When your client opens the dashboard:

```
1. Their browser asks the dining room for the page
2. The dining room asks the kitchen for invoice data
3. The kitchen fetches from the database
4. The dining room displays it on screen
```

**The dining room never touches the database directly.
It always goes through the kitchen.**

That's why you see `fetch('/api/invoices')` in the frontend —
the dining room placing an order with the kitchen.

---

## Chapter 3 — Supabase (The Warehouse)

Behind the kitchen is a massive warehouse where everything is stored.

The warehouse has shelves:

```
Shelf: organisations  → your clients (Dinemetrics, Acme Corp)
Shelf: invoices       → all their overdue invoices
Shelf: customers      → their customers who owe money
Shelf: email_logs     → every email ever sent
Shelf: org_settings   → each client's dunning rules
```

But here's the critical rule in this warehouse:

> **Every shelf has a lock. Each client can only see their own items.**

That's called **RLS — Row Level Security.**

When Dinemetrics logs in, they see only Dinemetrics invoices.
Not yours, not anyone else's.
The warehouse enforces this automatically — you don't have to code it every time.

```
Dinemetrics logs in
       ↓
Supabase checks: "which org is this user?"
       ↓
Returns only rows where org_id = Dinemetrics
       ↓
Other clients' data never even leaves the warehouse
```

**Supabase = the warehouse + the locks + the security guard. All in one.**

---

## Chapter 4 — How All Three Work Together

Here's the full journey when you open the AR Aging page:

```
YOU open /dashboard/ar-aging in your browser
              ↓
Next.js serves the dining room (renders the page)
              ↓
The page asks the kitchen:
"GET /api/invoices"
              ↓
The kitchen asks Supabase:
"Give me all invoices for this organisation"
              ↓
Supabase checks the lock (RLS):
"This user = org X → returning only org X invoices"
              ↓
TypeScript checks the shape:
"Invoice has id, amount, daysOverdue ✓ — not garbage"
              ↓
Kitchen sends clean data back to dining room
              ↓
Dining room displays it as a table on your screen
```

The whole journey takes less than 1 second.

---

## The One Sentence Version

| Tool | What it does | Restaurant analogy |
|------|--------------|--------------------|
| **TypeScript** | Makes sure your data is described correctly | The recipe card format |
| **Next.js** | Runs the frontend and backend in one place | The restaurant building |
| **Supabase** | Stores everything, enforces client isolation | The locked warehouse |

---

## How to Make This Stick

Open these three files in DataByt right now.
**Just read — don't change anything. Top to bottom.**

1. `src/app/dashboard/ar-aging/page.tsx` → the dining room
2. `src/app/api/invoices/route.ts`       → the kitchen
3. `src/lib/supabase.ts`                 → the warehouse connection

You'll see the exact story playing out in real code.
Don't Google anything yet. Just read and see how much of the story you recognise.

Come back with what confused you. We go chapter by chapter.

---

## What Comes Next (After You Get This)

```
TypeScript + Next.js + Supabase    ← you are here
         ↓
LangGraph Multi-Agent System       ← replaces the single Gemini call
         ↓
BigQuery Data Pipeline             ← payment prediction intelligence
         ↓
Monopoly product                   ← nobody can copy this
```

---

*DataByt Technologies · Internal Learning Guide · v1.0*
