# DataByt — Agent Instructions

## 📖 Read this first: the single source of truth

**[`DataByt-Resources/AI-CONTEXT.md`](DataByt-Resources/AI-CONTEXT.md)** is the complete A–Z context for this product — business, architecture, every table, every API route, every page, conventions, gotchas, env vars, and how to run/deploy. **Read it before doing anything in this repo.** One document, everything you need.

## Hard rules (do not break)

1. **Next.js 16 is NOT the Next.js you know.** APIs, conventions, and file structure differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next code. Heed deprecation notices.
2. **🚫 Grey is banned.** Use the indigo + slate brand palette only (see AI-CONTEXT §9). Never use dull mid-greys (`#F5F5F5`, `#F3F3F3`, `#999999`, `#555555`, `#333333`, etc.).
3. **Currency is IP-based** (`src/lib/geo.ts`) — never hardcode `$`/`₹`. Market is **USA + EU first**, India secondary.
4. **RLS everywhere** — every table is org-scoped by `org_id`; never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
5. **No fake testimonials / fabricated data** on the marketing site (FTC/ASA rules for US/EU).

When you change architecture, schema, routes, or conventions, **update `DataByt-Resources/AI-CONTEXT.md`** so it stays the source of truth.
