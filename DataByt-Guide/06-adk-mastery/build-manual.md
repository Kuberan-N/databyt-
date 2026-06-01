# DataByt Support Agent — The Build Manual
### A complete, copy-paste, do-it-without-help guide

> **This manual assumes you are alone.** No Claude Code, no Google searches needed. Every command, every file, every screen you will see, and every error with its fix is written here. Follow it top to bottom. Don't skip. Don't improvise. By the end you have a working AI support agent — first running on your laptop, then live on the internet, then answering inside DataByt.

> **Windows note:** all commands are written for **PowerShell** (your shell). Where Mac/Linux differs, it's marked.

---

## How this manual works

You build in **7 parts**. Each part ends with a **✅ CHECKPOINT** — a thing you can see with your own eyes that proves it worked. **Do not move to the next part until the checkpoint passes.** If it fails, the **🔧 IF IT BROKE** box right below it tells you exactly what to do.

```
Part 0  Setup                    (15 min)  → tools installed
Part 1  Hello Agent              (20 min)  → an agent talks to you in a browser
Part 2  Agent + Tool             (30 min)  → it calls a function and uses the result
Part 3  Knowledge Agent          (30 min)  → it answers "how do I..." questions
Part 4  The Manager (multi-agent)(45 min)  → it routes tickets to specialists
Part 5  Real DataByt Data        (45 min)  → it reads your actual Supabase invoices
Part 6  Deploy to the Internet   (45 min)  → it's live on a public URL
Part 7  Wire into DataByt        (30 min)  → dashboard form → agent → reply
```

Total: about one focused day. Take breaks at checkpoints.

---

# PART 0 — Setup (do this once)

## 0.1 — Check Python is installed
In PowerShell, type:
```powershell
python --version
```
**You should see** something like `Python 3.11.x` (any 3.10+ is fine).

🔧 **IF IT BROKE** — "python is not recognized": install Python from python.org/downloads, and during install **tick the box "Add Python to PATH"**. Close PowerShell, open a new one, try again.

## 0.2 — Make your agent folder
We put it next to DataByt but separate from the app code.
```powershell
cd d:\AI\DP\databyt-saas
mkdir agents
cd agents
```

## 0.3 — Create a virtual environment
A venv is a clean sandbox so Python packages don't clash.
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```
**You should see** your prompt now starts with `(.venv)`.

🔧 **IF IT BROKE** — "running scripts is disabled on this system": run this once, then try activating again:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 0.4 — Install ADK
```powershell
pip install google-adk
```
**You should see** a lot of lines ending in `Successfully installed google-adk-...` and many other packages. This takes a minute.

## 0.5 — Get your free Gemini API key
1. Open **https://aistudio.google.com/apikey** in your browser
2. Sign in with your Google account
3. Click **"Create API key"** → **"Create API key in new project"**
4. Copy the key (looks like `AIzaSy....`) — keep it somewhere for the next step

## ✅ CHECKPOINT 0
Run:
```powershell
adk --version
```
**You should see** a version number like `1.x.x`. If you do, Part 0 is done.

🔧 **IF IT BROKE** — "adk is not recognized": your venv isn't active. Re-run `.venv\Scripts\Activate.ps1` (prompt must show `(.venv)`), then try again.

---

# PART 1 — Hello Agent

We build the simplest possible agent and talk to it in a browser. No tools yet, just proving the pipeline works.

## 1.1 — Create the folder for this agent
```powershell
mkdir support_agent
cd support_agent
```

## 1.2 — Create three files

**File 1 — `__init__.py`** (tells ADK this folder is an agent)
Create a file named exactly `__init__.py` containing one line:
```python
from . import agent
```

**File 2 — `.env`** (your secret key — never share this file)
Create a file named exactly `.env` containing (paste your real key):
```
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=AIzaSy_paste_your_real_key_here
```

**File 3 — `agent.py`** (the agent itself)
```python
from google.adk.agents import Agent

root_agent = Agent(
    name="support_agent",
    model="gemini-2.0-flash",
    description="DataByt customer support assistant.",
    instruction="""
    You are DataByt's friendly support assistant.
    DataByt is an AI tool that automates accounts-receivable collections
    for finance teams. Greet the user warmly and answer their questions
    in a clear, professional, concise way. If you don't know something,
    say so honestly — never make up facts.
    """,
)
```

## 1.3 — Your folder should now look like this
```
agents/
├── .venv/
└── support_agent/
    ├── __init__.py
    ├── .env
    └── agent.py
```

## 1.4 — Run the visual UI
Go UP one folder to `agents` (the parent of `support_agent`), then launch:
```powershell
cd ..
adk web
```
**You should see** in PowerShell:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## ✅ CHECKPOINT 1
1. Open **http://localhost:8000** in your browser (Chrome).
2. Top-left, there's a **dropdown** — select **`support_agent`**.
3. In the chat box at the bottom, type: **`Hi, what is DataByt?`** and press Enter.
4. **You should see** the agent reply with a friendly explanation of DataByt.

If the agent replied — **you just built and ran your first AI agent.** 🎉

🔧 **IF IT BROKE:**
- **Dropdown is empty / no agent listed** → you ran `adk web` from the wrong folder. Stop it (Ctrl-C), make sure you're in `agents` (the folder that *contains* `support_agent`), run `adk web` again.
- **Reply says something about API key / 403 / permission** → your `.env` key is wrong or has a typo. Re-copy it from aistudio.google.com/apikey. The line must be exactly `GOOGLE_API_KEY=AIza...` with no spaces or quotes.
- **"ModuleNotFoundError"** → venv not active. Ctrl-C, run `.venv\Scripts\Activate.ps1`, run `adk web` again.

To stop the server any time: click in PowerShell and press **Ctrl-C**.

---

# PART 2 — Agent + Tool (giving it hands)

Now the agent learns to *do* something — call a function. We'll use fake data first so it works instantly with no other setup.

## 2.1 — Replace `agent.py` with this
(Stop the server first with Ctrl-C if it's running.)
```python
from google.adk.agents import Agent

def get_invoice_count(status: str) -> dict:
    """Returns how many invoices have a given status.

    Args:
        status: One of 'open', 'overdue', or 'paid'.

    Returns:
        A dict with the count of invoices.
    """
    # Fake data for now — we connect real data in Part 5.
    fake = {"open": 12, "overdue": 5, "paid": 240}
    if status not in fake:
        return {"status": "error", "message": f"Unknown status '{status}'."}
    return {"status": "success", "count": fake[status]}

root_agent = Agent(
    name="support_agent",
    model="gemini-2.0-flash",
    description="DataByt support assistant that can check invoice counts.",
    instruction="""
    You are DataByt's support assistant.
    When the user asks how many invoices are open, overdue, or paid,
    ALWAYS use the get_invoice_count tool to find the number.
    Never guess a number. Report what the tool returns in a friendly sentence.
    """,
    tools=[get_invoice_count],
)
```

## 2.2 — Run it again
```powershell
adk web
```

## ✅ CHECKPOINT 2
1. Open localhost:8000, pick `support_agent`.
2. Ask: **`How many invoices are overdue?`**
3. **You should see** it reply with **5** ("You currently have 5 overdue invoices.").
4. Now click the **Events** tab/panel (usually right side). **You should see** an entry showing the agent called `get_invoice_count` with `status: "overdue"` and got back `count: 5`.

Seeing that tool call in the Events panel = you understand how the agent *thinks*. This panel is how you debug everything from now on.

🔧 **IF IT BROKE:**
- **It made up a number without calling the tool** → your instruction wasn't firm enough, OR the docstring is unclear. Make sure the docstring is exactly as above. The agent reads the docstring to know what the tool does.
- **Error about the tool** → check the function has type hints (`status: str`) and returns a dict. Both are required.

---

# PART 3 — The Knowledge Agent (answers "how do I…")

This agent answers product questions. For v1 we put the key knowledge directly in its instruction — simple and it works immediately. (Later you can upgrade to searching all your docs; noted at the end.)

## 3.1 — Create a second agent folder
Stop the server. From `agents`:
```powershell
mkdir knowledge_agent
cd knowledge_agent
```
Create `__init__.py`:
```python
from . import agent
```
Copy your `.env` from the first agent (same key). In PowerShell from inside `knowledge_agent`:
```powershell
copy ..\support_agent\.env .env
```
Create `agent.py`:
```python
from google.adk.agents import Agent

root_agent = Agent(
    name="knowledge_agent",
    model="gemini-2.0-flash",
    description="Answers how-to and product questions about DataByt.",
    instruction="""
    You answer 'how do I...' and product questions about DataByt.
    Use ONLY the knowledge below. If the answer isn't here, say you're
    not sure and offer to connect them with a human. Never invent steps.

    === DATABYT KNOWLEDGE ===

    CONNECTING QUICKBOOKS / XERO:
    Go to Dashboard > Integrations. Click "Connect QuickBooks" (or Xero),
    log in to your accounting account, click Allow. DataByt then imports
    your overdue invoices automatically every day. Setup takes ~5 minutes.

    DUNNING EMAILS (reminders):
    DataByt sends one email per customer covering all their overdue invoices.
    Tone escalates by how late the invoice is: L1 (polite, 1+ days late),
    L2 (firm, 10+ days), L3 (final notice, 30+ days). You can change these
    day thresholds in Settings > Collection Rules.

    PAYMENT LINKS:
    Every email includes your own payment link (Stripe, Razorpay, bank
    transfer — any URL). Set it in Settings > Payment Collection. DataByt
    fills in the invoice number automatically.

    DISPUTES:
    If a customer disputes an invoice, file it in the AR Aging page.
    Collections pause for that customer while you investigate. Resolve or
    reject the dispute and collections resume.

    REPORTS:
    Dashboard > Reports > "Generate PDF Report" gives a board-ready PDF
    with DSO, CEI, AR aging, and top overdue customers.

    PRICING:
    One plan, everything included. Founding rate is locked for the first
    20 customers. 30-day free trial, no credit card needed.

    === END KNOWLEDGE ===
    """,
)
```

## ✅ CHECKPOINT 3
```powershell
cd ..
adk web
```
1. Pick `knowledge_agent` from the dropdown.
2. Ask: **`How do I connect QuickBooks?`** → **You should see** the 5-minute Integrations steps.
3. Ask: **`What is the capital of France?`** → **You should see** it politely say it's not sure / offers a human (because that's not in its knowledge). That "I don't know" behaviour is **correct and important** — it means it won't lie to your customers.

🔧 **IF IT BROKE:**
- **It answered the France question with "Paris"** → the instruction's "use ONLY the knowledge below" isn't being followed. Make sure you pasted the full instruction including the "Never invent" line.

---

# PART 4 — The Manager (multi-agent routing)

Now the big one: a manager agent that reads each ticket and routes it to the right specialist. This is the heart of the whole system.

## 4.1 — Build it all in the `support_agent` folder
We'll turn `support_agent` into the manager and define the specialists in the same file (simplest for now). Stop the server. Replace `support_agent/agent.py` with:

```python
from google.adk.agents import Agent

# ── Tool for the account specialist (fake data for now) ──
def get_invoice_count(status: str) -> dict:
    """Returns how many invoices have a given status.

    Args:
        status: One of 'open', 'overdue', or 'paid'.
    """
    fake = {"open": 12, "overdue": 5, "paid": 240}
    if status not in fake:
        return {"status": "error", "message": f"Unknown status '{status}'."}
    return {"status": "success", "count": fake[status]}


# ── SPECIALIST 1: Knowledge (how-to questions) ──
knowledge_agent = Agent(
    name="knowledge_agent",
    model="gemini-2.0-flash",
    description="Answers how-to and product questions about DataByt.",
    instruction="""
    Answer 'how do I...' and product questions using ONLY this knowledge.
    If it's not here, say you're not sure. Never invent steps.

    - CONNECT QUICKBOOKS/XERO: Dashboard > Integrations > Connect, log in,
      Allow. Auto-imports overdue invoices daily. ~5 min.
    - DUNNING: one email per customer, tone escalates L1/L2/L3 by days late.
      Change thresholds in Settings > Collection Rules.
    - PAYMENT LINKS: set your own link in Settings > Payment Collection.
    - DISPUTES: file on AR Aging page; collections pause; resolve to resume.
    - REPORTS: Dashboard > Reports > Generate PDF Report.
    - PRICING: one plan, founding rate locked for first 20, 30-day free trial.
    """,
)

# ── SPECIALIST 2: Account (real data questions) ──
account_agent = Agent(
    name="account_agent",
    model="gemini-2.0-flash",
    description="Checks the customer's invoice and account data.",
    instruction="""
    You check account data. When asked how many invoices are open/overdue/paid,
    ALWAYS call get_invoice_count. Never guess. Report the number plainly.
    """,
    tools=[get_invoice_count],
)

# ── SPECIALIST 3: Escalation (hard tickets) ──
escalation_agent = Agent(
    name="escalation_agent",
    model="gemini-2.0-flash",
    description="Handles refunds, billing disputes, bugs, and upset customers.",
    instruction="""
    You handle anything the others can't: refunds, billing disputes, bugs,
    angry customers, or anything unclear. Apologise briefly, say a human
    teammate will follow up shortly, and ask for any detail that would help.
    """,
)

# ── THE MANAGER (routes to the right specialist) ──
root_agent = Agent(
    name="support_manager",
    model="gemini-2.0-flash",
    description="DataByt front-line support manager.",
    instruction="""
    You are DataByt's support manager. Read the user's message and route it:
    - 'How do I...', product/feature/pricing questions  -> knowledge_agent
    - 'How many invoices...', status of data            -> account_agent
    - refunds, billing disputes, bugs, anger, or unclear-> escalation_agent
    Always route to a specialist. Do not answer specialist questions yourself.
    """,
    sub_agents=[knowledge_agent, account_agent, escalation_agent],
)
```

## ✅ CHECKPOINT 4
```powershell
cd ..
adk web
```
Pick `support_agent` (it's now the manager). Send these three and watch the **Events** panel each time:
1. **`How do I connect QuickBooks?`** → Events shows transfer to **knowledge_agent** → gives steps.
2. **`How many invoices are overdue?`** → transfer to **account_agent** → calls tool → says **5**.
3. **`I want a refund`** → transfer to **escalation_agent** → apologises, promises human follow-up.

If all three route to the right specialist — **you have built a real multi-agent system.** This is the same architecture used by serious AI products.

🔧 **IF IT BROKE:**
- **Everything goes to one specialist** → the manager's instruction routing rules aren't clear enough, OR a specialist's `description` is too vague (the manager uses the descriptions to decide). Make each `description` clearly state what that specialist handles.
- **It answers without transferring** → strengthen "Always route to a specialist. Do not answer specialist questions yourself."

---

# PART 5 — Real DataByt Data (read your live invoices)

Now we replace the fake `get_invoice_count` with a real query to your Supabase database. The agent will read your actual invoice data.

## 5.1 — Install the Supabase client
Stop the server.
```powershell
pip install supabase
```

## 5.2 — Add your Supabase keys to `.env`
Open `support_agent/.env` and add two lines (get these values from your DataByt Vercel project's environment variables, or your Supabase project settings → API):
```
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=AIza_your_key
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```
> The **service role key** lets the agent read all data. Keep `.env` private — never commit it to git.

## 5.3 — Replace the `get_invoice_count` function
In `support_agent/agent.py`, replace ONLY the `get_invoice_count` function (leave everything else) with:
```python
import os
from supabase import create_client

_supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_KEY"],
)

def get_invoice_count(status: str, org_id: str) -> dict:
    """Returns how many invoices an organisation has with a given status.

    Args:
        status: One of 'open', 'overdue', 'paid'.
        org_id: The organisation's ID.
    """
    try:
        res = (_supabase.table("invoices")
               .select("id", count="exact")
               .eq("org_id", org_id)
               .eq("status", status)
               .execute())
        return {"status": "success", "count": res.count or 0}
    except Exception as e:
        return {"status": "error", "message": str(e)}
```
Also update the `account_agent` instruction to mention it needs an org id:
```python
account_agent = Agent(
    name="account_agent",
    model="gemini-2.0-flash",
    description="Checks the customer's invoice and account data.",
    instruction="""
    You check real account data. When asked about invoice counts, call
    get_invoice_count with the status and the org_id. If you don't know the
    org_id, ask for it. Never guess numbers — always call the tool.
    """,
    tools=[get_invoice_count],
)
```

## ✅ CHECKPOINT 5
```powershell
cd ..
adk web
```
Pick `support_agent`. Ask: **`How many overdue invoices does org abc-123 have?`** (use a real org_id from your Supabase `organizations` table).
**You should see** it call the tool and return the **real** count from your database.

🔧 **IF IT BROKE:**
- **"KeyError: SUPABASE_URL"** → the `.env` lines are missing or misspelled. They must be in `support_agent/.env`.
- **Error mentioning auth / permission** → wrong service key. Copy the **service_role** key (not the anon key) from Supabase → Project Settings → API.
- **count is 0 but you expected more** → that org_id has no invoices with that status. Try `open` or a different org_id.

---

# PART 6 — Deploy to the Internet (Cloud Run)

Your agent works on your laptop. Now we put it on a public URL so DataByt can reach it. We use Google Cloud Run — it **scales to zero**, meaning it costs nothing when nobody's using it.

## 6.1 — Install the Google Cloud CLI
1. Download from **https://cloud.google.com/sdk/docs/install** (Windows installer).
2. Run the installer, accept defaults.
3. Close and reopen PowerShell. Re-activate your venv: `cd d:\AI\DP\databyt-saas\agents` then `.venv\Scripts\Activate.ps1`.

## 6.2 — Log in and pick a project
```powershell
gcloud auth login
```
A browser opens — sign in with the Google account that has your free credits.
```powershell
gcloud projects list
```
**You should see** your project(s). Note the **PROJECT_ID** (not the name). Then:
```powershell
gcloud config set project YOUR_PROJECT_ID
```

## 6.3 — Turn on the services you need (one time)
```powershell
gcloud services enable run.googleapis.com aiplatform.googleapis.com
```
**You should see** `Operation finished successfully` (takes a minute).

## 6.4 — Deploy the agent
From the `agents` folder (the parent of `support_agent`):
```powershell
adk deploy cloud_run --project YOUR_PROJECT_ID --region us-central1 .\support_agent
```
This takes 3–5 minutes. It builds your agent into a container and ships it.

When asked **"Allow unauthenticated invocations?"** type **`y`** (so DataByt can call it).

## ✅ CHECKPOINT 6
When it finishes, **you should see** a line like:
```
Service URL: https://support-agent-xxxxxxxx-uc.a.run.app
```
Copy that URL. Open it in your browser and add `/dev-ui` is not needed — instead test the API:

Open a **new** PowerShell window and run (paste your real URL):
```powershell
curl https://support-agent-xxxxxxxx-uc.a.run.app/list-apps
```
**You should see** a JSON list containing `support_agent`. That means your agent is **live on the internet**. 🎉

🔧 **IF IT BROKE:**
- **"Permission denied" / billing** → your project needs billing enabled (your free credits count as billing). In console.cloud.google.com → Billing → link your credits to the project.
- **Build failed** → almost always a missing package. Make sure you ran `pip install supabase` and that there's a `requirements.txt`. If ADK didn't make one, create `support_agent/requirements.txt` containing:
  ```
  google-adk
  supabase
  ```
  Then deploy again.
- **Env vars missing in production** → Cloud Run doesn't read your local `.env`. Set them after deploy:
  ```powershell
  gcloud run services update support-agent --region us-central1 `
    --set-env-vars GOOGLE_API_KEY=AIza...,SUPABASE_URL=https://...,SUPABASE_SERVICE_KEY=...
  ```

---

# PART 7 — Wire It Into DataByt

Final step: DataByt's dashboard sends a ticket to your live agent and shows the reply. This is TypeScript, inside your existing app.

## 7.1 — Add the agent URL to DataByt's environment
1. Go to your Vercel project → Settings → Environment Variables.
2. Add: **Name** `SUPPORT_AGENT_URL`, **Value** your Cloud Run URL (no trailing slash).
3. Save.

## 7.2 — Create the API route
In the DataByt repo, create the file `src/app/api/support/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";

const AGENT_URL = process.env.SUPPORT_AGENT_URL!;

export async function POST(req: NextRequest) {
  let body: { message?: string; orgId?: string; ticketId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { message, orgId, ticketId } = body;
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  // ADK needs a session before you can run. Create one (id = ticketId).
  const sessionId = ticketId ?? crypto.randomUUID();
  const userId = orgId ?? "anonymous";

  await fetch(
    `${AGENT_URL}/apps/support_agent/users/${userId}/sessions/${sessionId}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }
  ).catch(() => {});

  // Run the agent with the user's message.
  const r = await fetch(`${AGENT_URL}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_name: "support_agent",
      user_id: userId,
      session_id: sessionId,
      new_message: { role: "user", parts: [{ text: message }] },
    }),
  });

  if (!r.ok) {
    return NextResponse.json({ error: "Agent unavailable" }, { status: 502 });
  }

  const events = await r.json();
  // The agent's reply is the text in the last event.
  const last = Array.isArray(events) ? events[events.length - 1] : events;
  const reply =
    last?.content?.parts?.map((p: { text?: string }) => p.text).join("") ??
    "Sorry, I couldn't generate a reply.";

  return NextResponse.json({ reply });
}
```

## 7.3 — Test it locally first
In the DataByt repo:
```powershell
npm run dev
```
In another PowerShell:
```powershell
curl -Method POST http://localhost:3000/api/support `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"message":"How do I connect QuickBooks?","orgId":"test","ticketId":"t1"}'
```
**You should see** a JSON reply with the QuickBooks steps.

## ✅ CHECKPOINT 7
1. Commit and push so Vercel deploys:
   ```powershell
   git add src/app/api/support/route.ts
   git commit -m "feat: support agent API route"
   git push
   ```
2. After Vercel finishes (~1 min), test the live site:
   ```powershell
   curl -Method POST https://www.databyt.in/api/support `
     -Headers @{ "Content-Type" = "application/json" } `
     -Body '{"message":"I want a refund","orgId":"test","ticketId":"t2"}'
   ```
3. **You should see** the escalation reply ("a human teammate will follow up").

If you get a sensible reply from the live site — **your AI support agent is in production, end to end.** A message goes: DataByt → your agent on Cloud Run → Gemini → back to DataByt. You built that. 🎉🎉

🔧 **IF IT BROKE:**
- **502 Agent unavailable** → `SUPPORT_AGENT_URL` is wrong or missing in Vercel. Check it has no trailing slash and matches your Cloud Run URL exactly.
- **Reply is empty** → the event-parsing fell through. Log `events` (`console.log(JSON.stringify(events))`) and look at the shape; adjust the last-event extraction. The reply text is always in some event's `content.parts[].text`.

---

# PART 8 — The Troubleshooting Bible

When you're alone and something breaks, work through this in order.

### The universal 4-step debug
1. **Read the actual error text.** Not the vibe — the exact words. The fix is usually in the last line.
2. **Is the venv active?** Your prompt must show `(.venv)`. 80% of "it suddenly broke" is this. Re-run `.venv\Scripts\Activate.ps1`.
3. **Are you in the right folder?** `adk web` runs from the folder that *contains* your agent folders, never from inside one.
4. **Did you save the file?** Edits don't count until saved. ADK auto-reloads on save.

### Common errors → exact fix
| Error text contains | Meaning | Fix |
|---------------------|---------|-----|
| `adk is not recognized` | venv not active | `.venv\Scripts\Activate.ps1` |
| `ModuleNotFoundError: google` | ADK not installed in this venv | `pip install google-adk` |
| `API key not valid` / `403` | bad Gemini key | re-copy from aistudio.google.com/apikey into `.env` |
| dropdown empty in `adk web` | wrong launch folder | `cd` to the parent of your agent folder |
| `KeyError: SUPABASE_URL` | env var missing | add it to that agent's `.env` |
| agent invents data | weak instruction/docstring | add "always use the tool / never guess" |
| Cloud Run `billing` error | credits not linked | console → Billing → link project |
| `502` from /api/support | wrong agent URL in Vercel | fix `SUPPORT_AGENT_URL` |

### How to read a Python traceback
The error is a stack of lines. **Read the LAST line first** — it names the problem (`KeyError`, `ModuleNotFoundError`, etc.). The line above it shows which file and line number. That's where to look.

---

# PART 9 — When You're Stuck Without Help

1. **Copy the exact error line into Google.** Someone has hit it before. The first Stack Overflow result usually has it.
2. **Official ADK docs:** `google.github.io/adk-docs` — the "Get Started" and "Tutorials" sections mirror this manual.
3. **Re-read the relevant ✅ CHECKPOINT.** If a later part fails, an earlier checkpoint probably regressed (venv, env var, folder).
4. **Change one thing at a time.** Never change three things then run — you won't know which fixed or broke it.
5. **The Events panel in `adk web` is truth.** When the agent does something weird, the Events panel shows exactly which tool it called with what arguments. Read it before guessing.

---

# What You'll Have Built

```
A real AI support agent that:
✅ Runs in a visual UI on your laptop (adk web)
✅ Routes tickets to 3 specialists (knowledge, account, escalation)
✅ Reads your REAL invoice data from Supabase
✅ Is deployed live on Cloud Run (scales to zero — near-free)
✅ Is wired into DataByt at /api/support
✅ Answers a customer end-to-end: DataByt → agent → Gemini → reply
```

## Where to go next (after these 2 days, on your own)
- **Add a chat UI** in the dashboard (`src/app/dashboard/support/page.tsx`) that POSTs to `/api/support` and shows replies.
- **Upgrade the knowledge agent** from instruction-knowledge to real RAG over all your `DataByt-Guide` docs using pgvector (the ADK Mastery PDF, Lesson 8, explains the concept).
- **Add the `resend_email` and `escalate_to_human` tools** so the agent takes real actions, not just answers.
- **Watch it in production** via the Cloud Run logs (`gcloud run services logs read support-agent --region us-central1`).

---

*You don't need Claude Code to follow this. You need to go top to bottom, pass every checkpoint, and read every error out loud. That's the whole skill. Build it.*
