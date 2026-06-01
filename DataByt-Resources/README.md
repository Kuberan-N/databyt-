# DataByt Resources — The AI Knowledge Pack

This folder makes **any AI know DataByt A–Z** — whether it's a code editor reading your repo or a chat assistant with no repo access.

## What's here

| File | What it is |
|------|-----------|
| **[AI-CONTEXT.md](AI-CONTEXT.md)** | The complete, self-contained brain of DataByt. Business, architecture, every database table, every API route, every page, conventions, gotchas, env vars, glossary, roadmap. Nothing assumed. |

> One file, on purpose. Splitting it risks an AI reading half and missing the rest. This file is built to be read whole.

---

## How to use it

### 🟦 With a CODE EDITOR (Antigravity, Cursor, Windsurf, Copilot, etc.)
The editor already sees your code. What it lacks is the *why* — business model, cross-cutting flows, and the non-obvious gotchas (Next.js 16's `proxy.ts`, client-side auth, schema drift). Point the editor at this folder:

- **Antigravity / Cursor / Windsurf:** add `DataByt-Resources/AI-CONTEXT.md` to context, or just keep the folder in the workspace — these tools index it automatically. You can also reference it in a rules file (e.g. "Always read DataByt-Resources/AI-CONTEXT.md before answering").
- **Tip:** when starting a task, tell the editor: *"Read DataByt-Resources/AI-CONTEXT.md first, then …"*

### 🟩 With a CHAT ASSISTANT (Claude, ChatGPT, Gemini — web/app)
These can't see your repo. Give them the file directly:

1. Open `AI-CONTEXT.md`, **select all, copy.**
2. Paste into the chat with a line like:
   > *"Here is the complete context for my product DataByt. Read it, then help me with [your task]. Treat this as ground truth."*
3. Or **upload the file** (Claude Projects, ChatGPT file upload, Gemini file upload all accept `.md`).

**Best results:** put it in a persistent context so you don't re-paste every time —
- **Claude:** add it to a **Project**'s knowledge.
- **ChatGPT:** add it to a **Custom GPT** or a Project's files.
- **Gemini:** upload to a **Gem** or keep it in the conversation's files.

---

## Keeping it accurate

This file was verified against the codebase in **June 2026**. When the code changes materially (new tables, new routes, new pricing), update `AI-CONTEXT.md` so the AIs stay correct. The rule stated inside the file: **if it ever disagrees with the code, the code wins — and the AI should flag the drift.**

---

## ⚠️ Security note (action required)

While building this pack, real secrets were found committed in the repo's `.env.local.example` (live Supabase service-role key, Gemini key, Resend key). **Rotate those keys** and replace the example file with placeholders. This resources folder deliberately contains **no real secrets** — only variable names and placeholders — so it's safe to share with an AI.
