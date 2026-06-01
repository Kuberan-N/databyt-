# ADK Mastery — From Baby Steps to Master
### Learn Google's Agent Development Kit in Python, then ship a real agent into DataByt

> **How to read this:** Each lesson builds on the last. Type every code block yourself — don't just read it. By the end you will build agents, multi-agents, sub-agents, and complex pipelines, see them in a real UI, and push one into DataByt production.

---

## The 30-Second Mental Model

An **agent** is just three things glued together:

```
   ┌─────────────────────────────────────┐
   │  AGENT                               │
   │                                      │
   │   1. A BRAIN   (the LLM — Gemini)    │
   │   2. INSTRUCTIONS (what its job is)  │
   │   3. TOOLS  (things it can DO)       │
   │                                      │
   └─────────────────────────────────────┘
```

That's it. Everything else in ADK — sessions, memory, multi-agent, callbacks — is plumbing around these three things. Hold this picture in your head the whole way through.

**Analogy:** An agent is a new employee.
- The **brain** is their intelligence (Gemini).
- The **instructions** are their job description.
- The **tools** are the systems they're allowed to use (the CRM, the email account, the database).

A **multi-agent system** is a team of employees with a manager who routes work to the right specialist.

---

# PART A — LEARN ADK IN PYTHON (Baby → Master)

We learn in Python because that's where ADK is most mature, where the visual UI (`adk web`) lives, and where the whole Google ecosystem (Vertex AI) plugs in cleanly. Once you *understand* it here, moving to DataByt is easy.

---

## Lesson 0 — Setup (15 minutes, once)

### Install Python ADK
```bash
# Make a clean folder for learning
mkdir adk-learning && cd adk-learning

# Virtual environment (keeps things tidy)
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install ADK
pip install google-adk
```

### Get a Gemini API key
1. Go to **aistudio.google.com/apikey**
2. Click "Create API key"
3. Copy it

### The folder layout ADK expects
ADK wants each agent in its own folder with two files:

```
adk-learning/
└── greeting_agent/
    ├── __init__.py      ← one line: from . import agent
    ├── agent.py         ← your agent lives here
    └── .env             ← your API key
```

`__init__.py`:
```python
from . import agent
```

`.env`:
```
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=paste-your-key-here
```

That's the entire setup. You do it once.

---

## Lesson 1 — Your First Agent (the "Hello World")

`greeting_agent/agent.py`:
```python
from google.adk.agents import Agent

root_agent = Agent(
    name="greeting_agent",
    model="gemini-2.0-flash",
    description="A friendly agent that greets people.",
    instruction="""
    You are a warm, friendly assistant.
    Greet the user by name if they give it.
    Keep replies to one or two sentences.
    """,
)
```

**Three things to notice:**
- `root_agent` — ADK looks for this exact variable name. Always name your top agent `root_agent`.
- `model="gemini-2.0-flash"` — Flash is the cheap, fast model. Use it for everything until you have a reason not to.
- `instruction` — this is the job description. 90% of agent quality comes from writing this well.

### Run it in the VISUAL UI (the magic moment)
From the `adk-learning` folder (the parent, not inside greeting_agent):
```bash
adk web
```

Open **http://localhost:8000** in your browser. You'll see:
- A **dropdown** top-left → pick `greeting_agent`
- A **chat box** → type "Hi, I'm Kuberan" and watch it reply
- An **Events** panel → every step the agent took
- A **State** panel → the agent's memory (empty for now)
- A **Trace** view → timing of each call

> **This UI is your best friend.** You will build every agent here first, click around, watch what it does, before you ever touch DataByt. It turns the invisible (an LLM thinking) into something you can see.

### Run it in the terminal instead (optional)
```bash
adk run greeting_agent
```
Type messages, press Ctrl-C to quit. Same agent, no browser.

🎉 **You just built and ran your first agent.** Everything from here is adding capability.

---

## Lesson 2 — Tools (giving the agent hands)

An agent with no tools can only *talk*. A tool lets it *do*. In Python, a tool is just a normal function with a clear name, type hints, and a docstring. ADK reads the docstring to understand when to use it.

```python
from google.adk.agents import Agent

def get_invoice_count(status: str) -> dict:
    """Returns how many invoices have a given status.

    Args:
        status: One of 'open', 'overdue', or 'paid'.

    Returns:
        A dict with the count.
    """
    # (pretend this queries a database)
    fake_data = {"open": 12, "overdue": 5, "paid": 240}
    return {"status": "success", "count": fake_data.get(status, 0)}

root_agent = Agent(
    name="ar_helper",
    model="gemini-2.0-flash",
    description="Answers questions about invoices.",
    instruction="""
    You help finance teams check invoice counts.
    When asked how many invoices are open/overdue/paid,
    use the get_invoice_count tool. Never guess numbers.
    """,
    tools=[get_invoice_count],
)
```

Run `adk web`, ask: *"How many invoices are overdue?"*

Watch the **Events** panel — you'll literally see:
1. The agent decides to call `get_invoice_count(status="overdue")`
2. The tool returns `{count: 5}`
3. The agent writes a sentence using that number

**The golden rule of tools:** the docstring is the instruction manual. Write it like you're explaining to a new hire exactly what the function does and what each argument means. A vague docstring = the agent uses the tool wrong.

### What makes a good tool
- **One job per tool.** `get_invoice_count` not `do_everything_with_invoices`.
- **Return a dict with a `status` key.** `{"status": "success", ...}` or `{"status": "error", "message": "..."}`. The agent reads this to know if it worked.
- **Type hints on every argument.** `status: str` — this is how ADK tells Gemini what to pass.

---

## Lesson 3 — Sessions & State (memory within a conversation)

A **session** is one conversation. **State** is the agent's scratchpad inside that conversation — it remembers things between turns.

Think of state as a notebook the agent writes in:

```python
from google.adk.agents import Agent
from google.adk.tools.tool_context import ToolContext

def remember_company(name: str, tool_context: ToolContext) -> dict:
    """Saves the user's company name for later.

    Args:
        name: The company name to remember.
    """
    tool_context.state["company_name"] = name   # write to the notebook
    return {"status": "success", "saved": name}

root_agent = Agent(
    name="onboarding_agent",
    model="gemini-2.0-flash",
    instruction="""
    You onboard new finance teams.
    When they tell you their company name, save it with remember_company.
    Afterwards, address them by their company name.
    """,
    tools=[remember_company],
)
```

When a tool receives `tool_context: ToolContext`, ADK automatically gives it access to the session's state. Anything you put in `tool_context.state` is remembered for the rest of the conversation.

In `adk web`, after you tell it your company, open the **State** panel — you'll see `company_name` appear. That's the agent's memory, made visible.

### The `output_key` shortcut
You can auto-save an agent's whole reply into state with one line:

```python
root_agent = Agent(
    name="summarizer",
    model="gemini-2.0-flash",
    instruction="Summarize what the user said in one sentence.",
    output_key="last_summary",   # the reply is saved to state["last_summary"]
)
```

This becomes powerful in multi-agent pipelines — one agent's output becomes the next agent's input, passed through state.

### State prefixes (scope of memory)
| Prefix | Lives for | Example |
|--------|-----------|---------|
| (none) | this session only | `state["current_ticket"]` |
| `user:` | all sessions for this user | `state["user:preferred_tone"]` |
| `app:` | everyone, app-wide | `state["app:business_hours"]` |
| `temp:` | this turn only, never saved | `state["temp:raw_api_response"]` |

You won't need all of these on day one. Just know they exist for when you do.

---

## Lesson 4 — Multi-Agent: a Manager and Specialists

Here's where it gets powerful. Instead of one agent that tries to do everything (and does it poorly), you build **specialists** and a **manager** that routes to them.

```python
from google.adk.agents import Agent

# Specialist 1
billing_agent = Agent(
    name="billing_agent",
    model="gemini-2.0-flash",
    description="Handles billing, pricing, refunds, and invoice questions.",
    instruction="You are a billing specialist. Answer billing questions clearly.",
)

# Specialist 2
tech_agent = Agent(
    name="tech_agent",
    model="gemini-2.0-flash",
    description="Handles integration issues — QuickBooks, Xero, syncing, OAuth.",
    instruction="You are a technical support specialist for accounting integrations.",
)

# The MANAGER (root) — routes to the right specialist
root_agent = Agent(
    name="support_manager",
    model="gemini-2.0-flash",
    description="Front-line support manager.",
    instruction="""
    You are a support manager. Read the user's problem and route it:
    - Billing, pricing, refunds, invoices → transfer to billing_agent
    - QuickBooks, Xero, syncing, connection issues → transfer to tech_agent
    Do not answer specialist questions yourself. Route them.
    """,
    sub_agents=[billing_agent, tech_agent],   # the team
)
```

**The key line is `sub_agents=[...]`.** When you give a root agent sub-agents, ADK lets it *transfer control* to whichever specialist fits. The manager doesn't answer billing questions — it hands them to the billing agent.

In `adk web`, ask *"Why won't my QuickBooks sync?"* and watch the Events panel: the manager **transfers** to `tech_agent`, which then answers. You can see the handoff happen.

> **This is the single most important pattern in ADK.** A manager + specialists. It's how you build something that handles many kinds of requests without one giant unmaintainable instruction.

### Sub-agents vs sub-sub-agents (the tree)
A specialist can have its own specialists. This is a **tree**:

```
support_manager
├── billing_agent
│   ├── refund_agent
│   └── pricing_agent
└── tech_agent
    ├── quickbooks_agent
    └── xero_agent
```

You build this just by nesting `sub_agents`. Each level routes deeper. Don't over-nest early — two levels is plenty until you have a real reason.

---

## Lesson 5 — Workflow Agents (controlled pipelines)

Manager-routing (Lesson 4) is *LLM-decided* — the model chooses where to go. Sometimes you want a **fixed, guaranteed order**. That's what workflow agents are for. There are three:

### 5a. SequentialAgent — do these in order, every time
```python
from google.adk.agents import Agent, SequentialAgent

classifier = Agent(
    name="classifier",
    model="gemini-2.0-flash",
    instruction="Classify the ticket as: billing, technical, or how-to. Output only the category.",
    output_key="category",          # saved to state
)

responder = Agent(
    name="responder",
    model="gemini-2.0-flash",
    instruction="""
    The ticket category is: {category}
    Write a helpful reply appropriate for that category.
    """,
)

# This runs classifier, THEN responder — always in that order
pipeline = SequentialAgent(
    name="support_pipeline",
    sub_agents=[classifier, responder],
)

root_agent = pipeline
```

Notice `{category}` in the responder's instruction — that pulls the value the classifier saved via `output_key`. **State is the conveyor belt** moving data from one step to the next.

### 5b. ParallelAgent — do these at the same time
```python
from google.adk.agents import ParallelAgent

# Run three checks simultaneously, then combine
checks = ParallelAgent(
    name="health_checks",
    sub_agents=[check_quickbooks, check_email, check_payments],
)
```
Use when steps don't depend on each other — it's faster.

### 5c. LoopAgent — repeat until good enough
```python
from google.adk.agents import LoopAgent

# Keep refining a draft until a reviewer approves it
refine_loop = LoopAgent(
    name="draft_refiner",
    sub_agents=[draft_writer, quality_checker],
    max_iterations=3,
)
```

**When to use which:**
| You want… | Use |
|-----------|-----|
| The LLM to decide who handles it | `sub_agents` on a normal Agent (Lesson 4) |
| A guaranteed step-by-step order | `SequentialAgent` |
| Several independent things at once | `ParallelAgent` |
| Repeat-until-good | `LoopAgent` |

---

## Lesson 6 — Agent-as-a-Tool (the clean way to delegate)

Sometimes you don't want to *transfer* control — you want one agent to *call* another and get an answer back, like calling a function. That's `AgentTool`.

```python
from google.adk.agents import Agent
from google.adk.tools import agent_tool

# A small specialist
translator = Agent(
    name="translator",
    model="gemini-2.0-flash",
    instruction="Translate the given text to formal business English.",
)

# The main agent can CALL the translator as if it were a tool
main_agent = Agent(
    name="email_writer",
    model="gemini-2.0-flash",
    instruction="""
    Write dunning emails. If the user's draft is too casual,
    use the translator tool to make it formal, then return it.
    """,
    tools=[agent_tool.AgentTool(agent=translator)],
)

root_agent = main_agent
```

**Transfer (sub_agents) vs Agent-as-Tool — the difference:**
- **Transfer**: the specialist takes over the conversation. Good for "route this whole request to billing."
- **Agent-as-Tool**: the main agent stays in charge, calls the helper, gets a result, continues. Good for "go translate this, then come back to me."

---

## Lesson 7 — Callbacks (guardrails & control)

Callbacks are hooks that run *around* the agent's steps. They're how you add safety, logging, and cost control. Think of them as security checkpoints.

```python
from google.adk.agents import Agent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models import LlmRequest, LlmResponse
from google.genai import types

def block_bad_words(callback_context: CallbackContext,
                    llm_request: LlmRequest) -> LlmResponse | None:
    """Runs BEFORE the LLM is called. Can block the request."""
    last = llm_request.contents[-1].parts[0].text if llm_request.contents else ""
    if "delete everything" in last.lower():
        # Short-circuit: return a response without ever calling the LLM
        return LlmResponse(
            content=types.Content(
                role="model",
                parts=[types.Part(text="I can't help with that request.")],
            )
        )
    return None   # None = proceed normally

root_agent = Agent(
    name="guarded_agent",
    model="gemini-2.0-flash",
    instruction="You are a helpful assistant.",
    before_model_callback=block_bad_words,
)
```

The six callbacks (you rarely need all):
| Callback | Fires | Use it for |
|----------|-------|-----------|
| `before_agent_callback` | before the agent starts | skip the agent entirely |
| `after_agent_callback` | after it finishes | final logging |
| `before_model_callback` | before each LLM call | block/modify input, guardrails |
| `after_model_callback` | after each LLM call | filter output, redact |
| `before_tool_callback` | before a tool runs | validate args, block dangerous calls |
| `after_tool_callback` | after a tool runs | reshape results |

For DataByt the big two are **`before_model_callback`** (guardrails — don't let it promise refunds it can't give) and **`before_tool_callback`** (don't let it resend an email without org permission).

---

## Lesson 8 — Memory & RAG (knowledge across conversations)

**State** (Lesson 3) is memory *within* one conversation. **Memory** is knowledge *across* conversations and from your documents. This is how the agent learns DataByt's entire knowledge base.

The pattern is **RAG** — Retrieval-Augmented Generation:

```
   Your docs ──► chopped into chunks ──► turned into "embeddings"
   (numbers that capture meaning) ──► stored in a vector database

   User asks a question ──► question turned into an embedding ──►
   find the most similar chunks ──► hand them to the agent ──►
   agent answers using YOUR docs, not its general knowledge
```

In ADK you expose this as a `load_memory` tool, or build a search tool over your vector store. For DataByt we'll use **pgvector inside Supabase** (you already have it — no new vendor, no cost).

The concept to lock in: **the agent's knowledge is your documentation.** Every guide doc you write becomes something the agent can retrieve and answer from. The DataByt-Guide folder you already have *is* the agent's brain food.

> We build the real RAG tool in Part B. For now, just understand: RAG = "let the agent search my documents before answering."

---

## Lesson 9 — Models & the Vertex Switch

So far everything ran on the **Gemini API** (the simple `GOOGLE_API_KEY` path). That's perfect for learning and for low volume.

**Vertex AI** is the same Gemini models, but inside Google Cloud — with enterprise features (quotas, logging, IAM permissions, hosting). You flip to it by changing the `.env`:

```
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

No code changes — same agent, now running through Vertex. You'd do this when you deploy to production and want it on your Google Cloud account (and your 3-month credits).

### Using non-Gemini models (optional)
ADK can use OpenAI, Claude, etc. via `LiteLlm`:
```python
from google.adk.models.lite_llm import LiteLlm

agent = Agent(
    name="claude_agent",
    model=LiteLlm(model="anthropic/claude-sonnet-4-6"),
    instruction="...",
)
```
For DataByt, stick with Gemini Flash — it's cheapest and your credits cover it. Just know you're not locked in.

---

## Lesson 10 — Where You Are Now

If you've done Lessons 0–9, you can already:
- ✅ Build a single agent with instructions
- ✅ Give it tools (hands)
- ✅ Give it memory within a conversation (state)
- ✅ Build a manager + specialists (multi-agent)
- ✅ Build guaranteed pipelines (Sequential/Parallel/Loop)
- ✅ Have agents call each other (Agent-as-Tool)
- ✅ Add guardrails (callbacks)
- ✅ Understand RAG and Vertex

**That's the whole toolbox.** A "complex agent" is just these pieces combined. There is no Lesson 50 with secret magic — mastery is combining these well. Now let's build a real one for DataByt.

---

# PART B — BUILD THE DATABYT SUPPORT AGENT (Python)

We now assemble the pieces into the real thing: a support agent that resolves 70% of DataByt tickets.

## The design (a tree you already understand)

```
support_manager  (routes the ticket)
├── knowledge_agent   → answers "how do I…" using RAG over DataByt-Guide
├── account_agent     → checks real data (invoice status, integration health)
│      tools: get_invoice_status, get_integration_status, resend_email
└── escalation_agent  → when unsure, hands off to Kuberan with full context
       tools: escalate_to_human
```

This is exactly Lesson 4 (manager + specialists) plus Lesson 2 (tools) plus Lesson 8 (RAG). Nothing new — just combined.

## The build, step by step

### Step 1 — the action tools (account_agent's hands)
```python
# tools.py
from google.adk.tools.tool_context import ToolContext
import httpx   # to call DataByt's own API

DATABYT_API = "https://www.databyt.in/api"

def get_invoice_status(invoice_number: str, org_id: str) -> dict:
    """Looks up the current status of one invoice.

    Args:
        invoice_number: e.g. 'INV-1042'.
        org_id: the organisation's ID.
    """
    r = httpx.get(f"{DATABYT_API}/invoices/lookup",
                  params={"invoice_number": invoice_number, "org_id": org_id})
    if r.status_code != 200:
        return {"status": "error", "message": "Could not reach DataByt."}
    return {"status": "success", "invoice": r.json()}

def get_integration_status(org_id: str) -> dict:
    """Checks if QuickBooks/Xero is connected and when it last synced.

    Args:
        org_id: the organisation's ID.
    """
    r = httpx.get(f"{DATABYT_API}/integrations/quickbooks",
                  params={"orgId": org_id})
    return {"status": "success", "integration": r.json()}

def escalate_to_human(summary: str, ticket_id: str, tool_context: ToolContext) -> dict:
    """Hands the ticket to Kuberan with a summary. Use when unsure.

    Args:
        summary: a 2-line summary of the problem and what you tried.
        ticket_id: the ticket's ID.
    """
    tool_context.state["escalated"] = True
    httpx.post(f"{DATABYT_API}/support/escalate",
               json={"summary": summary, "ticket_id": ticket_id})
    return {"status": "success", "message": "Escalated to a human."}
```

### Step 2 — the specialists
```python
# agent.py
from google.adk.agents import Agent
from .tools import get_invoice_status, get_integration_status, escalate_to_human

knowledge_agent = Agent(
    name="knowledge_agent",
    model="gemini-2.0-flash",
    description="Answers how-to and product questions about DataByt.",
    instruction="""
    You answer 'how do I…' questions about DataByt using your knowledge.
    Topics: connecting QuickBooks/Xero, dunning rules, disputes, reports.
    Be concise and accurate. If you are not sure, say so — do not invent steps.
    """,
    # (RAG tool added in Part C when wired to pgvector)
)

account_agent = Agent(
    name="account_agent",
    model="gemini-2.0-flash",
    description="Checks the customer's real account data.",
    instruction="""
    You check real account data. Use get_invoice_status for invoice questions,
    get_integration_status for sync/connection questions. Never guess data —
    always call the tool. State the facts you find plainly.
    """,
    tools=[get_invoice_status, get_integration_status],
)

escalation_agent = Agent(
    name="escalation_agent",
    model="gemini-2.0-flash",
    description="Escalates hard tickets to a human.",
    instruction="""
    You handle anything the others cannot: refunds, bugs, angry customers,
    billing disputes. Summarise the problem in 2 lines and call
    escalate_to_human. Tell the customer a human will reply shortly.
    """,
    tools=[escalate_to_human],
)
```

### Step 3 — the manager
```python
root_agent = Agent(
    name="support_manager",
    model="gemini-2.0-flash",
    description="DataByt front-line support.",
    instruction="""
    You are DataByt's support manager. Route each ticket:
    - 'How do I…', product/feature questions → knowledge_agent
    - 'What's the status of my invoice / sync / connection' → account_agent
    - Refunds, billing disputes, bugs, anger, anything unclear → escalation_agent
    Always route. Never invent an answer yourself.
    """,
    sub_agents=[knowledge_agent, account_agent, escalation_agent],
)
```

### Step 4 — test it in the UI
```bash
adk web
```
Throw real tickets at it:
- *"How do I connect QuickBooks?"* → should go to knowledge_agent
- *"Is invoice INV-1042 paid?"* → should go to account_agent, call the tool
- *"I want a refund"* → should go to escalation_agent

Watch the Events panel for every routing decision. **This is your test harness** — if it routes wrong, fix the manager's instruction and try again. No code deploy needed to test.

You now have a working support agent. The only thing left is to connect it to DataByt and ship it.

---

# PART C — GET IT INTO DATABYT PRODUCTION (the easy way)

Here is the honest architecture truth, stated simply:

> **ADK is most reliable in Python. DataByt is TypeScript. The cleanest bridge is: run the Python agent as a tiny service, and have DataByt call it over HTTPS.**

This sounds scary. It is not. Google gives you a one-command deploy. Here's the whole path.

## The shape

```
   Customer ──► DataByt (Next.js on Vercel) ──► /api/support route
                                                      │
                                                      │  fetch() over HTTPS
                                                      ▼
                                          Your ADK agent (Python)
                                          running on Cloud Run
                                                      │
                                          calls back into DataByt's API
                                          (invoice status, etc.) + Gemini
```

DataByt stays exactly as it is. You add **one new API route** that forwards a ticket to the agent and returns the reply. The agent lives on **Cloud Run** — which **scales to zero**, meaning it costs ₹0 when nobody's asking it anything. Your credits are safe.

## Step 1 — make the agent callable as an API
ADK turns any agent into a web server with one command:
```bash
adk api_server
```
This serves your agent at `http://localhost:8000` with a `/run` endpoint. Locally you can `curl` it. That same server is what we deploy.

## Step 2 — deploy to Cloud Run (one command)
```bash
# one-time: install gcloud CLI and log in
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# deploy the agent — ADK has a built-in deployer
adk deploy cloud_run \
  --project YOUR_PROJECT_ID \
  --region us-central1 \
  ./support_manager
```

After ~3 minutes you get a URL like:
```
https://support-manager-xxxxx-uc.a.run.app
```
That's your agent, live on the internet, on your Google Cloud (and your credits). Scales to zero. Done.

> **Even easier alternative — Vertex AI Agent Engine.** `adk deploy agent_engine` hosts the agent fully managed by Google, *and gives you a built-in UI + tracing dashboard* in the Google Cloud console. More on that in Part D.

## Step 3 — wire DataByt to call it
Add one route to the existing Next.js app:

```typescript
// src/app/api/support/route.ts
import { NextRequest, NextResponse } from "next/server";

const AGENT_URL = process.env.SUPPORT_AGENT_URL!;  // the Cloud Run URL

export async function POST(req: NextRequest) {
  let body: { message?: string; orgId?: string; ticketId?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  const { message, orgId, ticketId } = body;
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

  // Forward the ticket to the ADK agent
  const r = await fetch(`${AGENT_URL}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_name: "support_manager",
      user_id: orgId,
      session_id: ticketId,
      new_message: { role: "user", parts: [{ text: message }] },
    }),
  });

  const data = await r.json();
  return NextResponse.json({ reply: data });
}
```

Add the URL to Vercel env vars:
```
SUPPORT_AGENT_URL=https://support-manager-xxxxx-uc.a.run.app
```

That's the entire integration. DataByt's dashboard support form `POST`s to `/api/support`, which forwards to your agent, which replies. **One route, one env var, one deploy.**

## Step 4 — push to production
```bash
# the agent
adk deploy cloud_run ...        # (re-run when you change the agent)

# DataByt (you already know this)
git add . && git commit -m "feat: support agent route" && git push
# Vercel auto-deploys
```

Two `git push`-equivalents. The agent redeploys with `adk deploy`; DataByt redeploys on `git push`. No Docker to hand-write, no Kubernetes, no servers to manage.

## "But I wanted one language / in-process"
You can — it's the alternative path. Because DataByt **already calls Gemini in TypeScript** (your `draft-email` route uses `@google/generative-ai`), you can rebuild these *same agent patterns* directly in TS with Gemini function-calling, no Python, no second service. You lose the `adk web` UI and the easy multi-agent plumbing, but you gain one language and in-process speed.

**My honest recommendation for you, right now:**
1. **Learn and prototype in Python ADK** (Parts A–B) — because the UI makes learning 10× faster.
2. **Ship to production via Cloud Run** (this part) — because it's genuinely one command and scales to zero.
3. **Later**, if the second service ever annoys you, port the proven agent to TS in-process. By then you'll understand it cold and the port is an afternoon.

Don't optimise for "one language" before you've shipped. Optimise for *understanding fast and shipping reliably*. Python ADK + Cloud Run wins on both today.

---

# PART D — THE UI & THE ECOSYSTEM (Vertex, made simple)

You said you want to *see* things and explore Vertex. Here's exactly what to look at — and what to ignore — from a pure DataByt point of view.

## The `adk web` dev UI (your daily driver)
Run `adk web` locally. This is where you live while building. It shows you:
- **Chat** — talk to your agent like a customer would
- **Events** — every decision: which sub-agent it transferred to, every tool call and its result. *This is how you debug.* When the agent misbehaves, the Events panel tells you exactly where.
- **State** — the agent's live memory notebook
- **Trace** — how long each step took (find slow tools)
- **Eval** — run a saved set of test questions and see pass/fail

> 95% of your ADK time is in `adk web`. Master this one screen and you've mastered the workflow.

## Vertex AI — only the 3 pieces DataByt needs
Vertex AI is huge. Ignore 90% of it. These three matter:

| Vertex piece | What it does for you | When |
|--------------|---------------------|------|
| **Vertex AI Studio** | Same chat UI as AI Studio, but on your Cloud project — try prompts, pick models | While tuning instructions |
| **Agent Engine** | Fully-managed hosting for your agent + a **built-in trace/monitoring UI** | When you deploy for real |
| **Cloud Logging** | See every production agent run, errors, token usage | After launch, to watch health |

That's it. You do **not** need Vertex Vector Search (use pgvector — free), Vertex Pipelines, Model Garden tuning, or Feature Store. They're for big ML teams, not a solo AR SaaS.

## Agent Engine's UI (the production cockpit)
When you `adk deploy agent_engine`, the Google Cloud console gives you a dashboard where you can:
- Chat with the live production agent
- See traces of real customer tickets (same Events view, but for production)
- Watch token usage and cost per request
- Spot failures

It's the `adk web` experience, but for your live agent, hosted by Google. This is your "is the support agent healthy?" screen once you have customers.

## The honest ecosystem map for DataByt
```
USE (learn these):
  adk web              ← build & debug locally  (Part A–B)
  Cloud Run            ← cheap hosting, scales to zero  (Part C)
  Gemini Flash         ← the model  (everywhere)
  pgvector in Supabase ← RAG memory, free  (Lesson 8)
  Agent Engine UI      ← watch production  (optional, nice)

IGNORE for now (not your problem yet):
  Vertex Vector Search · Model Garden tuning · Pipelines ·
  Feature Store · BigQuery ML · Dataflow
```

---

# PART E — YOUR LEARNING PATH & CHECKLIST

## The 3-week plan (matches the lessons)
```
WEEK 1 — Single agents & tools
  Lessons 0–3.  Build 3 toy agents in adk web.
  Goal: comfortable with Agent, instruction, tools, state.
  You can: make an agent that uses a tool and remembers something.

WEEK 2 — Multi-agent & pipelines
  Lessons 4–7.  Build the manager+specialists. Add a guardrail.
  Goal: routing and pipelines feel natural.
  You can: build the DataByt support tree and watch it route in the UI.

WEEK 3 — Knowledge & ship
  Lesson 8–9 + Parts B–C.  Add RAG over DataByt-Guide, deploy to Cloud Run,
  wire the /api/support route.
  Goal: a real agent answering real DataByt questions in production.
  You can: a customer asks 'how do I connect QuickBooks' and the live agent answers.
```

## Mastery checklist
```
Concepts
[ ] I can explain agent = brain + instructions + tools
[ ] I can write a tool with a good docstring
[ ] I know state vs memory (within-conversation vs across)
[ ] I can build a manager + specialists (sub_agents)
[ ] I know when to use Sequential / Parallel / Loop
[ ] I know transfer vs Agent-as-Tool
[ ] I can add a before_model guardrail
[ ] I understand RAG in one sentence

Doing
[ ] Ran an agent in adk web and read the Events panel
[ ] Built a multi-agent that routes correctly
[ ] Connected a tool to DataByt's real API
[ ] Deployed an agent to Cloud Run
[ ] Wired the /api/support route and got a live reply

Ecosystem
[ ] Comfortable in the adk web UI
[ ] Know the 3 Vertex pieces that matter (Studio, Agent Engine, Logging)
[ ] Know what to ignore in Vertex
```

## The one rule that makes you a master
> **Never learn for more than two days without building the thing in `adk web`.** Reading about agents teaches you nothing. Watching the Events panel show you a wrong routing decision, fixing the instruction, and seeing it route right — *that* is the learning. The UI turns abstract into obvious. Live in it.

---

## Quick glossary (when you forget a word)
| Word | Plain meaning |
|------|--------------|
| Agent | brain + instructions + tools |
| Tool | a function the agent can call |
| Instruction | the agent's job description |
| Runner | the thing that runs an agent turn |
| Session | one conversation |
| State | the agent's notebook within a conversation |
| Memory | knowledge across conversations / from docs |
| Sub-agent | a specialist a manager routes to |
| Transfer | handing the whole conversation to a sub-agent |
| AgentTool | calling another agent like a function |
| SequentialAgent | run steps in a fixed order |
| ParallelAgent | run steps at the same time |
| LoopAgent | repeat steps until good enough |
| Callback | a hook before/after a step (guardrails) |
| RAG | let the agent search your docs before answering |
| Embedding | a chunk of text turned into meaning-numbers |
| pgvector | the place we store embeddings (inside Supabase) |
| Cloud Run | cheap hosting that scales to zero |
| Agent Engine | Google's managed agent hosting + UI |
| Vertex AI | Gemini + tools inside Google Cloud |

---

*You started as a baby. If you do the three weeks and live in `adk web`, you finish a master — with a real support agent answering real CFOs in production. That is the whole game.*
