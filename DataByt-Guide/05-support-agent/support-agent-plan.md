# DataByt Support Agent — Implementation Report
### Building a Vertical AI Support Agent with Google ADK
**Goal:** A support agent that resolves 70%+ of customer tickets autonomously, so you can run DataByt solo until revenue justifies a support hire.

---

## PART 0 — The Strategy (Read This First)

### Why this matters
Customer support is where most solo-founder SaaS dies. A CFO paying ₹39,000/month expects an answer in minutes, not "I'll get back to you." You cannot be awake 24/7. An AI support agent that knows DataByt deeply is your unfair advantage.

### The bet: VERTICAL, not horizontal
Zendesk AI, Intercom Fin — these are *horizontal*. They know nothing about AR, dunning, QuickBooks OAuth, or your specific product. Your agent will know DataByt better than any human support rep, because it is trained on your docs, your past tickets, and can take real actions inside your system.

```
Horizontal support AI          Your vertical agent
─────────────────────          ───────────────────
"Let me find that for you"     "Your QuickBooks token expired
generic, hallucindates          14 days ago — I've flagged it,
                                here's the 2-click reconnect link"
knows nothing about AR          knows every DataByt workflow
can't take actions              can check invoice status, resend
                                emails, reconnect integrations
```

### The 70/30 rule
- **70% of tickets** are repetitive: "how do I connect QuickBooks", "where's my invoice data", "how do I change dunning rules", "an email didn't send". → Agent auto-resolves.
- **30% need you**: billing disputes, bugs, feature requests, angry customers. → Agent escalates with full context so your reply takes 2 minutes, not 20.

---

## PART 1 — What is Google ADK?

**ADK = Agent Development Kit.** Google's open-source framework for building AI agents. It launched official **TypeScript support (adk-js) in December 2025** — this matters because DataByt is TypeScript. You keep ONE language across your whole stack.

### Core ADK concepts you must understand

| Concept | What it is | DataByt example |
|---------|-----------|-----------------|
| **Agent** | An LLM + instructions + tools | The "Support Agent" |
| **Tool** | A function the agent can call | `getInvoiceStatus(invoiceId)` |
| **Sub-agent** | A specialised agent the main one delegates to | "Classifier", "Resolver" |
| **Runner** | Executes an agent turn | Runs when a ticket arrives |
| **Session** | One conversation thread | One support ticket |
| **State** | Memory within a session | "customer already tried reconnecting" |
| **Memory** | Long-term knowledge across sessions | "this org always has QB token issues" |
| **Callbacks** | Hooks before/after model or tool calls | Logging, guardrails, cost tracking |
| **Workflow agents** | Sequential / Parallel / Loop orchestration | Classify → Retrieve → Resolve |

### Why ADK over LangGraph for THIS
You'll use LangGraph for the *collections* agent (the core product). For *support*, ADK is the better fit because:
- Native Gemini/Vertex integration (you're already on Gemini) = cheapest path on your credits
- Built-in tool-calling + session management = less boilerplate
- Google's "Agent Engine" can host it later if you outgrow Next.js API routes
- Learning ADK + LangGraph makes you employable in BOTH ecosystems

> You are not picking one framework forever. You are learning the *concepts* (agents, tools, RAG, memory, eval) which transfer everywhere.

---

## PART 2 — The Architecture

### The full flow

```
                        CUSTOMER RAISES A TICKET
                  (dashboard form OR reply-to email)
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   1. INTAKE                │
                    │   Store ticket in Supabase │
                    │   Create a session         │
                    └──────────────┬─────────────┘
                                   ▼
                    ┌──────────────────────────┐
                    │   2. CLASSIFIER AGENT      │
                    │   category · severity ·    │
                    │   product area             │
                    └──────────────┬─────────────┘
                                   ▼
                    ┌──────────────────────────┐
                    │   3. RETRIEVAL (RAG)       │
                    │   Search KB + past tickets │
                    │   via pgvector             │
                    └──────────────┬─────────────┘
                                   ▼
                    ┌──────────────────────────┐
                    │   4. RESOLVER AGENT        │
                    │   Can I answer confidently?│
                    │   Do I need a tool/action? │
                    └──────┬──────────────┬──────┘
              CONFIDENT ✅  │              │  NOT CONFIDENT ❌
                           ▼              ▼
              ┌────────────────────┐  ┌─────────────────────┐
              │ 5A. ACTION AGENT   │  │ 5B. ESCALATE        │
              │ resend email,      │  │ Notify Kuberan      │
              │ check QB status,   │  │ with full context   │
              │ reconnect link...  │  │ (Slack/email)       │
              │ then reply         │  │                     │
              └─────────┬──────────┘  └──────────┬──────────┘
                        ▼                        ▼
              ┌──────────────────────────────────────┐
              │   6. REPLY + LOG + SLA TIMER          │
              │   Email/dashboard reply · log every   │
              │   decision · track resolution time    │
              └──────────────────────────────────────┘
```

### How it slots into your existing stack

```
EXISTING                          NEW (support agent)
────────                          ───────────────────
Next.js + TypeScript      ◄────►  ADK agents run inside API routes
Supabase (Postgres)       ◄────►  + support_tickets, ticket_messages,
                                    kb_documents tables
pgvector (in Supabase)    ◄────►  embeddings for RAG (KB + past tickets)
Gemini API                ◄────►  the LLM powering every agent
Resend                    ◄────►  inbound = email→ticket, outbound = replies
Vercel cron               ◄────►  SLA breach checker
```

**Key decision: the agent runs INSIDE your Next.js app** (in `/api/support/*` routes). No separate Python service, no Cloud Run to start. One deploy, one language, one bill.

---

## PART 3 — Tools To Learn

### A. Inside GCP (the must-knows)

| Tool | Why | Priority | Learn time |
|------|-----|----------|-----------|
| **Google ADK (adk-js)** | The agent framework itself | 🔴 Critical | 1 week |
| **Gemini API** | Already using — deepen on tool-calling, structured output | 🔴 Critical | 2 days |
| **Vertex AI (basics)** | Where Gemini lives at scale; understand Agent Engine exists | 🟡 Useful | 2 days |
| **Google Cloud credits / billing console** | Manage your 3-month runway | 🔴 Critical | 1 day |
| **Cloud Logging (basics)** | See what agents did in production | 🟢 Later | 1 day |

> **Skip for now:** Vertex AI Vector Search (expensive — use pgvector instead), Agent Engine hosting (run in Next.js first), Document AI, Dialogflow (legacy).

### B. Outside GCP (the smart-money tools)

| Tool | Why | Cost | Priority |
|------|-----|------|----------|
| **pgvector (Supabase)** | Agent memory + RAG — already in your stack, $0 extra | Free | 🔴 Critical |
| **Langfuse (self-host)** | See every agent decision, debug failures, track cost | Free self-hosted | 🔴 Critical |
| **Resend Inbound** | Turn customer email replies into tickets | Free tier | 🔴 Critical |
| **Trigger.dev** OR **Vercel Cron** | SLA breach checks, async work | Free tier | 🟡 Useful |
| **Zod** | Validate agent structured output (already in your deps) | Free | 🟡 Useful |

### The learning order (don't skip)

```
Week 1: Gemini tool-calling + structured output (you know Gemini, go deeper)
Week 2: ADK fundamentals — Agent, Tool, Runner, Session, State
Week 3: RAG with pgvector — embed docs, semantic search
Week 4: Multi-agent — Classifier → Resolver → Action (workflow agents)
Week 5: Memory + Callbacks (guardrails, cost tracking, escalation logic)
Week 6: Eval — measuring if the agent is actually correct
```

---

## PART 4 — Implementation in the Codebase

### New database tables (Supabase migration)

```sql
-- Tickets
CREATE TABLE support_tickets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       UUID NOT NULL REFERENCES organizations(id),
  subject      TEXT NOT NULL,
  status       TEXT DEFAULT 'open',      -- open | resolved | escalated | closed
  category     TEXT,                      -- integration | billing | how-to | bug
  severity     TEXT,                      -- low | medium | high | urgent
  resolved_by  TEXT,                      -- 'agent' | 'human'
  created_at   TIMESTAMPTZ DEFAULT now(),
  resolved_at  TIMESTAMPTZ,
  sla_due_at   TIMESTAMPTZ
);

-- Conversation messages
CREATE TABLE ticket_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID NOT NULL REFERENCES support_tickets(id),
  role        TEXT NOT NULL,             -- customer | agent | human
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Knowledge base with embeddings (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE kb_documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  embedding   vector(768),               -- Gemini text-embedding-004 = 768 dims
  source      TEXT,                       -- which guide doc
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS: tickets are org-scoped (same pattern as the rest of DataByt)
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
```

### New folder structure

```
src/lib/support-agent/
├── agents/
│   ├── classifier.ts      ← categorises the ticket
│   ├── resolver.ts        ← decides answer vs escalate
│   └── orchestrator.ts    ← wires them together (ADK workflow agent)
├── tools/
│   ├── getInvoiceStatus.ts    ← queries invoices table
│   ├── getIntegrationStatus.ts← checks QB/Xero connection
│   ├── resendEmail.ts         ← re-sends a dunning email
│   ├── searchKnowledge.ts     ← pgvector RAG search
│   └── escalateToHuman.ts     ← notifies you with context
├── memory/
│   └── pgvector.ts        ← embed + retrieve
├── runner.ts             ← ADK runner entrypoint
└── types.ts

src/app/api/support/
├── ticket/route.ts        ← POST: create ticket → run agent
├── reply/route.ts         ← POST: customer replies → continue session
└── sla-check/route.ts     ← GET (cron): flag SLA breaches

src/app/dashboard/support/
└── page.tsx               ← ticket queue UI for you + customers

src/app/api/webhooks/support-inbound/
└── route.ts               ← Resend inbound → creates ticket
```

### The seed step (your secret weapon)
Embed your existing `DataByt-Guide/` docs into `kb_documents`. The agent's knowledge IS your documentation. Every doc you write makes the agent smarter — for free.

```
DataByt-Guide/01-product-guide/*.md  ──embed──►  kb_documents
DataByt-Guide/03-testing/*.md        ──embed──►  kb_documents
Past resolved tickets                ──embed──►  kb_documents (grows over time)
```

---

## PART 5 — Build & Test

### Build sequence

```
Step 1 — Tables + migration (Supabase SQL editor)        [1 day]
Step 2 — Embed the guide docs into kb_documents          [1 day]
Step 3 — searchKnowledge tool (pgvector RAG)             [2 days]
Step 4 — Classifier agent (category/severity)            [2 days]
Step 5 — Resolver agent (answer vs escalate)             [3 days]
Step 6 — Action tools (invoice status, resend, etc.)     [3 days]
Step 7 — escalateToHuman (Slack/email notify)            [1 day]
Step 8 — Support dashboard page                          [2 days]
Step 9 — Resend inbound webhook (email→ticket)           [2 days]
Step 10 — SLA cron + Langfuse observability              [2 days]
```

### How to test (the discipline that makes it reliable)

**1. Golden test set** — write 30 real questions a CFO would ask:
```
"How do I connect QuickBooks?"           → expect: auto-resolve, KB answer
"My invoices aren't syncing"             → expect: check integration tool
"I want a refund"                        → expect: escalate to human
"Change my dunning to 5 days"            → expect: KB answer + settings link
"An email bounced, can you resend?"      → expect: resendEmail tool
```

**2. Run the eval** — for each, check:
- Correct category?
- Correct resolve-vs-escalate decision?
- If it answered, was the answer right?
- Did it call the right tool?

**3. Drive it like a user** — actually submit tickets through the dashboard form and reply-to email. Watch it in Langfuse. A blank reply or wrong tool call is a failure.

**4. The escalation safety net** — when confidence is low, it MUST escalate, never guess. Test this hard: a wrong confident answer to a CFO is worse than an escalation.

---

## PART 6 — Managing 3 Months on Credits

### Where money leaks (and how to stop it)

| Cost source | Risk | Mitigation |
|-------------|------|-----------|
| Gemini tokens | Medium | Use **Gemini Flash**, not Pro. Cache the system prompt. |
| Embeddings | Low | `text-embedding-004` is cheap; embed docs once, not per query |
| Vector DB | HIGH if wrong | Use **pgvector (free)**, NOT Vertex Vector Search ($$$) |
| Agent hosting | HIGH if wrong | Run in **Next.js API routes**, NOT Cloud Run / Agent Engine |
| Observability | Medium | **Langfuse self-hosted** ($5 VPS), not paid tiers |
| Over-calling the LLM | Medium | Classifier first (cheap), only deep-resolve when needed |

### The lean monthly cost (pre-first-client)

```
Gemini Flash (support volume, ~500 tickets/mo)   ~$5-15
Embeddings (one-time doc embed + queries)        ~$1
pgvector (Supabase — already paying)             $0
Langfuse (self-host on Railway/Fly)              ~$5
Resend inbound (free tier)                       $0
─────────────────────────────────────────────────────
Total NEW spend                                  ~$10-20/month
```

Your 3-month GCP credits will barely be touched by support. The credits are better spent on the *collections* agent's heavier Gemini usage.

### Credit-management discipline
- Set a **billing budget alert** at 25%, 50%, 75% in GCP console — do this day 1.
- Use **Gemini Flash** everywhere unless an answer is provably wrong (then selectively Pro).
- **Cache** the system prompt (Gemini supports context caching — big savings on repeated instructions).
- Log token usage per ticket in Langfuse → you'll see exactly what each resolution costs.

---

## PART 7 — The 6-Week Plan (Learn + Build Together)

> Rule: never learn for more than 2 days without building the thing you learned inside DataByt.

```
WEEK 1 — Foundations
  Learn:  Gemini tool-calling, structured output (Zod schemas)
  Build:  searchKnowledge tool + embed the guide docs
  Ship:   "ask a question, get a KB answer" working in a test script

WEEK 2 — ADK core
  Learn:  Agent, Tool, Runner, Session, State
  Build:  Classifier agent (category + severity)
  Ship:   Submit a ticket → it gets classified correctly

WEEK 3 — Resolution
  Learn:  ADK multi-agent (sequential workflow), confidence handling
  Build:  Resolver agent (answer vs escalate decision)
  Ship:   70% of your golden-set questions auto-answered

WEEK 4 — Actions
  Learn:  Tool design, guardrails via callbacks
  Build:  Action tools (invoice status, integration status, resend)
  Ship:   Agent takes a real action and replies

WEEK 5 — Human loop + intake
  Learn:  Memory, escalation patterns, Resend inbound
  Build:  escalateToHuman + email→ticket webhook + dashboard page
  Ship:   Full loop: email in → agent resolves or escalates → you notified

WEEK 6 — Reliability
  Learn:  Eval, Langfuse observability, cost tracking
  Build:  Golden eval set + SLA cron + budget alerts
  Ship:   Measured 70%+ auto-resolution, every decision traceable
```

---

## PART 8 — What "Monopoly" Looks Like

After 6 weeks you have something competitors at your price point do not:

```
✅ A support agent that knows AR, dunning, QuickBooks, disputes cold
✅ Resolves 70% of tickets in <2 minutes, 24/7
✅ Takes real actions (not just "here's a help article")
✅ Escalates the hard 30% to you with full context
✅ Gets smarter with every resolved ticket (they become KB)
✅ Costs ~$15/month to run
✅ Lets you serve 20+ clients solo before hiring anyone
```

A CFO who gets an instant, correct, action-taking answer at 11pm tells other CFOs. That word-of-mouth is the moat.

---

## Appendix — Skills Checklist

```
GCP
[ ] Google ADK (adk-js) — agents, tools, runner, sessions
[ ] Gemini API — tool-calling, structured output, context caching
[ ] Vertex AI — conceptual (know Agent Engine exists for later)
[ ] Cloud billing — budget alerts, credit tracking

Outside GCP
[ ] pgvector — embeddings, semantic search, RAG
[ ] Langfuse — agent tracing, debugging, cost tracking
[ ] Resend Inbound — email→ticket
[ ] Zod — structured output validation
[ ] Eval discipline — golden sets, measuring correctness

Concepts (transfer to ANY framework / job)
[ ] Multi-agent orchestration (classify → retrieve → resolve → act)
[ ] RAG (retrieval-augmented generation)
[ ] Human-in-the-loop escalation
[ ] Agent observability & evaluation
[ ] Tool/function design for agents
```

---

*Build the support agent. Resolve 70% automatically. Stay solo until revenue says otherwise. That is how a one-person SaaS competes with funded teams.*
