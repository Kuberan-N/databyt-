# DataByt — Master Guide Index

Read in order. Each file builds on the previous one.

---

| # | File | What You Learn |
|---|------|---------------|
| 0 | [architecture.md](architecture.md) | Full system flow diagram (Mermaid — open preview in VSCode) |
| 1 | [02-tech-stack-story.md](02-tech-stack-story.md) | TypeScript + Next.js + Supabase explained as a story |
| 2 | [03-phase1-invoice-and-quickbooks.md](03-phase1-invoice-and-quickbooks.md) | What an invoice is, what QuickBooks is, what DSO and CEI mean |
| 3 | [04-phase2-oauth-and-sync.md](04-phase2-oauth-and-sync.md) | How DataByt connects to QuickBooks, what syncs daily |
| 4 | [05-phase3-ai-email-engine.md](05-phase3-ai-email-engine.md) | How Gemini writes dunning emails, L1/L2/L3, payment links |
| 5 | [06-phase4-customer-response.md](06-phase4-customer-response.md) | What happens after email — customer pays or ignores |
| 6 | [07-phase5-disputes.md](07-phase5-disputes.md) | Dispute workflow, escalation, what happens at L3 |
| 7 | [08-phase6-analytics-and-reports.md](08-phase6-analytics-and-reports.md) | DSO, CEI, cash flow forecast, board PDF report |
| 8 | [09-end-to-end-testing.md](09-end-to-end-testing.md) | The 8-step test that proves 100% product |

---

## How to Use This Guide

```
Step 1: Read architecture.md first (the full picture)
Step 2: Read each phase document in order
Step 3: After each phase — do the self-test at the bottom
Step 4: Run the 8-step test in 09-end-to-end-testing.md
Step 5: You now own and understand DataByt completely
```

---

## Quick Reference

| I want to know... | Go to |
|-------------------|-------|
| What is an invoice? | 03-phase1 |
| How does QB connect? | 04-phase2 |
| How does the AI email work? | 05-phase3 |
| What happens when customer pays? | 06-phase4 |
| How do I handle a dispute? | 07-phase5 |
| What do the analytics mean? | 08-phase6 |
| How do I test everything? | 09-end-to-end |
| What is DSO? | 03-phase1 + 08-phase6 |
| What is CEI? | 08-phase6 |
| Where is the code for X? | Each phase doc has a "Where in Codebase" section |
