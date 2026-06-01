# DataByt — Master Guide

Read in order. Each file builds on the previous.

---

## 📁 01-product-guide — Learn the Product

| File | What You Learn |
|------|---------------|
| [architecture.md](01-product-guide/architecture.md) | Full system flow diagram (open in VSCode preview) |
| [02-tech-stack-story.md](01-product-guide/02-tech-stack-story.md) | TypeScript + Next.js + Supabase as a story |
| [03-phase1-invoice-and-quickbooks.md](01-product-guide/03-phase1-invoice-and-quickbooks.md) | Invoice basics, QuickBooks, DSO, CEI, AR Aging |
| [04-phase2-oauth-and-sync.md](01-product-guide/04-phase2-oauth-and-sync.md) | OAuth connection, daily sync, real QB JSON |
| [05-phase3-ai-email-engine.md](01-product-guide/05-phase3-ai-email-engine.md) | AI email engine, L1/L2/L3, payment links |
| [06-phase4-customer-response.md](01-product-guide/06-phase4-customer-response.md) | Customer pays vs ignores, escalation, partial payment |
| [07-phase5-disputes.md](01-product-guide/07-phase5-disputes.md) | Dispute workflow, pause collections, resolution |
| [08-phase6-analytics-and-reports.md](01-product-guide/08-phase6-analytics-and-reports.md) | DSO, CEI, cash flow forecast, board PDF |

---

## 📁 02-diagrams — Visual Diagrams

| File | What It Is |
|------|-----------|
| [DataByt-Flow-Diagram.pdf](02-diagrams/DataByt-Flow-Diagram.pdf) | FRS-style flow diagram — open to view |
| [flow-diagram.html](02-diagrams/flow-diagram.html) | Same diagram as HTML — open in browser |
| [generate-pdf.js](02-diagrams/generate-pdf.js) | Script to regenerate the PDF |

---

## 📁 03-testing — Test the Product

| File | What It Is |
|------|-----------|
| [09-end-to-end-testing.md](03-testing/09-end-to-end-testing.md) | 8-step test that proves 100% working product |

---

## 📁 04-marketing — Launch Strategy

| File | What It Is |
|------|-----------|
| [linkedin-30day-launch.md](04-marketing/linkedin-30day-launch.md) | 30-day LinkedIn plan — 100 CFO followers + 30 full post scripts |

---

## 📁 05-support-agent — AI Support Agent (Google ADK)

| File | What It Is |
|------|-----------|
| [support-agent-plan.md](05-support-agent/support-agent-plan.md) | Full implementation report — ADK, tools to learn, codebase plan, 6-week build, cost management |
| [DataByt-Support-Agent-Plan.pdf](05-support-agent/DataByt-Support-Agent-Plan.pdf) | Same report as a styled PDF |

---

## 📁 06-adk-mastery — Learn ADK (Baby → Master)

| File | What It Is |
|------|-----------|
| [adk-mastery.md](06-adk-mastery/adk-mastery.md) | Full ADK course — 10 Python lessons (agents, tools, multi-agent, pipelines, callbacks, RAG), build the DataByt support agent, deploy to Cloud Run, wire into the codebase, Vertex ecosystem |
| [DataByt-ADK-Mastery.pdf](06-adk-mastery/DataByt-ADK-Mastery.pdf) | Same course as a styled PDF |

---

## How to Use This Guide

```
1. Read 01-product-guide/ in order (start with architecture.md)
2. Do the self-test at the bottom of each phase doc
3. Run the 8-step test in 03-testing/
4. Start the 30-day LinkedIn plan in 04-marketing/
```

---

## Quick Reference

| I want to know... | Go to |
|-------------------|-------|
| What is an invoice? | 01-product-guide/03-phase1 |
| How does QB OAuth work? | 01-product-guide/04-phase2 |
| How does the AI email work? | 01-product-guide/05-phase3 |
| What happens when customer pays? | 01-product-guide/06-phase4 |
| How do I handle a dispute? | 01-product-guide/07-phase5 |
| What do analytics mean? | 01-product-guide/08-phase6 |
| How do I test everything? | 03-testing/09-end-to-end-testing |
| How do I get first clients? | 04-marketing/linkedin-30day-launch |
