from google.adk.agents import Agent
from google import genai as google_genai
import os
import resend
from supabase import create_client

_supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
_genai = google_genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
resend.api_key = os.environ.get("RESEND_API_KEY", "")
_FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "collections@databyt.in")

# ── HELPERS ──────────────────────────────────────────────────────────────────

def _find_customer(name: str, org_id: str):
    r = (_supabase.table("customers").select("id, name, email")
         .eq("org_id", org_id).ilike("name", f"%{name}%").limit(1).execute())
    return r.data[0] if r.data else None

def _find_invoice(invoice_number: str, org_id: str):
    r = (_supabase.table("invoices")
         .select("id, invoice_number, amount, currency, status, days_overdue, customer_id")
         .eq("org_id", org_id).eq("invoice_number", invoice_number).limit(1).execute())
    return r.data[0] if r.data else None

# ── READ TOOLS ───────────────────────────────────────────────────────────────

def get_org_id(org_name: str) -> dict:
    """Looks up an organisation UUID by name.

    Args:
        org_name: The organisation name (e.g. 'Dinemetrics').
    """
    try:
        r = (_supabase.table("organizations").select("id, name")
             .ilike("name", f"%{org_name}%").limit(1).execute())
        if r.data:
            return {"status": "success", "org_id": r.data[0]["id"], "org_name": r.data[0]["name"]}
        return {"status": "not_found", "message": f"No organisation found matching '{org_name}'."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_invoice_count(status: str, org_id: str) -> dict:
    """Returns how many invoices an org has with a given status.

    Args:
        status: One of 'open', 'overdue', 'paid', 'reminded', or 'disputed'.
        org_id: The organisation UUID.
    """
    try:
        r = (_supabase.table("invoices").select("id", count="exact")
             .eq("org_id", org_id).eq("status", status).execute())
        return {"status": "success", "count": r.count or 0}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_total_ar_outstanding(org_id: str) -> dict:
    """Returns the total outstanding AR amount for an org.

    Args:
        org_id: The organisation UUID.
    """
    try:
        r = (_supabase.table("invoices").select("amount")
             .eq("org_id", org_id).in_("status", ["open", "overdue", "reminded"]).execute())
        total = sum(row["amount"] for row in (r.data or []))
        return {"status": "success", "total_outstanding": total, "invoice_count": len(r.data or [])}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_customer_balance(customer_name: str, org_id: str) -> dict:
    """Returns the outstanding balance and overdue invoices for a specific customer.

    Args:
        customer_name: The customer company name (e.g. 'Sunrise Foods').
        org_id: The organisation UUID.
    """
    try:
        cust = _find_customer(customer_name, org_id)
        if not cust:
            return {"status": "not_found", "message": f"No customer found matching '{customer_name}'."}
        rows = (_supabase.table("invoices")
                .select("invoice_number, amount, currency, status, days_overdue, due_date")
                .eq("org_id", org_id).eq("customer_id", cust["id"]).execute()).data or []
        outstanding = sum(r["amount"] for r in rows if r["status"] in ["open", "overdue", "reminded"])
        overdue = [r for r in rows if r["status"] in ["overdue", "reminded"]]
        return {
            "status": "success",
            "customer_name": cust["name"],
            "total_outstanding": outstanding,
            "total_invoices": len(rows),
            "overdue_invoices": len(overdue),
            "paid_invoices": len([r for r in rows if r["status"] == "paid"]),
            "overdue_details": [{"invoice_number": r["invoice_number"], "amount": r["amount"],
                                  "days_overdue": r["days_overdue"]} for r in overdue],
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


def list_overdue_customers(org_id: str) -> dict:
    """Lists all customers with overdue invoices, sorted by total amount owed.

    Args:
        org_id: The organisation UUID.
    """
    try:
        rows = (_supabase.table("invoices")
                .select("amount, days_overdue, customers(id, name)")
                .eq("org_id", org_id).in_("status", ["overdue", "reminded"]).execute()).data or []
        by_customer: dict = {}
        for r in rows:
            c = r.get("customers") or {}
            cid = c.get("id", "unknown")
            if cid not in by_customer:
                by_customer[cid] = {"name": c.get("name", "Unknown"), "total": 0, "invoices": 0, "max_days": 0}
            by_customer[cid]["total"] += r["amount"]
            by_customer[cid]["invoices"] += 1
            by_customer[cid]["max_days"] = max(by_customer[cid]["max_days"], r.get("days_overdue", 0))
        sorted_list = sorted(by_customer.values(), key=lambda x: x["total"], reverse=True)
        return {"status": "success", "customers": sorted_list[:10], "total_customers": len(sorted_list)}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_last_communication(customer_name: str, org_id: str) -> dict:
    """Returns when the last dunning email was sent to a customer.

    Args:
        customer_name: The customer company name.
        org_id: The organisation UUID.
    """
    try:
        cust = _find_customer(customer_name, org_id)
        if not cust:
            return {"status": "not_found", "message": f"No customer found matching '{customer_name}'."}
        comms = (_supabase.table("communications")
                 .select("sent_at, subject, status, direction")
                 .eq("org_id", org_id).eq("customer_id", cust["id"])
                 .eq("type", "email").eq("direction", "outbound")
                 .order("sent_at", desc=True).limit(3).execute()).data or []
        if not comms:
            return {"status": "success", "customer_name": cust["name"], "last_email": None,
                    "message": "No emails sent to this customer yet."}
        return {"status": "success", "customer_name": cust["name"],
                "last_email": comms[0]["sent_at"], "subject": comms[0]["subject"],
                "recent_emails": comms}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_customer_invoices(customer_name: str, org_id: str) -> dict:
    """Lists all invoices for a specific customer with full details.

    Args:
        customer_name: The customer company name.
        org_id: The organisation UUID.
    """
    try:
        cust = _find_customer(customer_name, org_id)
        if not cust:
            return {"status": "not_found", "message": f"No customer found matching '{customer_name}'."}
        rows = (_supabase.table("invoices")
                .select("invoice_number, amount, currency, status, days_overdue, due_date")
                .eq("org_id", org_id).eq("customer_id", cust["id"])
                .order("days_overdue", desc=True).execute()).data or []
        return {"status": "success", "customer_name": cust["name"],
                "invoice_count": len(rows), "invoices": rows}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_disputed_invoices(org_id: str) -> dict:
    """Lists all invoices with active disputes for an org.

    Args:
        org_id: The organisation UUID.
    """
    try:
        rows = (_supabase.table("disputes")
                .select("id, reason, status, created_at, invoices(invoice_number, amount), customers(name)")
                .eq("org_id", org_id).eq("status", "open").order("created_at", desc=True).execute()).data or []
        result = [{
            "invoice_number": r.get("invoices", {}).get("invoice_number"),
            "amount": r.get("invoices", {}).get("amount"),
            "customer": r.get("customers", {}).get("name"),
            "reason": r.get("reason"),
            "opened": r.get("created_at", "")[:10],
        } for r in rows]
        return {"status": "success", "disputes": result, "total": len(result)}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_upcoming_dunning(org_id: str) -> dict:
    """Shows which customers are scheduled to receive a dunning email in the next automated run.

    Args:
        org_id: The organisation UUID.
    """
    try:
        from datetime import datetime, timedelta, timezone
        cooldown_cutoff = (datetime.now(timezone.utc) - timedelta(days=3)).isoformat()

        recently_emailed = {
            r["customer_id"] for r in
            (_supabase.table("communications")
             .select("customer_id").eq("org_id", org_id)
             .eq("type", "email").eq("direction", "outbound")
             .gte("sent_at", cooldown_cutoff).execute()).data or []
        }

        opted_out = {
            r["customer_id"] for r in
            (_supabase.table("communications")
             .select("customer_id").eq("org_id", org_id)
             .eq("type", "note").eq("content", "UNSUBSCRIBED").execute()).data or []
        }

        invoices = (_supabase.table("invoices")
                    .select("amount, days_overdue, customer_id, customers(name, email)")
                    .eq("org_id", org_id).in_("status", ["overdue", "reminded"])
                    .gt("days_overdue", 0).execute()).data or []

        by_customer: dict = {}
        for inv in invoices:
            cid = inv.get("customer_id")
            if not cid or cid in recently_emailed or cid in opted_out:
                continue
            c = inv.get("customers") or {}
            if not c.get("email"):
                continue
            if cid not in by_customer:
                by_customer[cid] = {"name": c.get("name"), "email": c.get("email"),
                                     "invoice_count": 0, "total": 0, "max_days": 0}
            by_customer[cid]["invoice_count"] += 1
            by_customer[cid]["total"] += inv["amount"]
            by_customer[cid]["max_days"] = max(by_customer[cid]["max_days"], inv.get("days_overdue", 0))

        scheduled = sorted(by_customer.values(), key=lambda x: x["total"], reverse=True)
        return {"status": "success", "scheduled_count": len(scheduled),
                "customers": scheduled[:10],
                "note": "These customers will receive a dunning email in the next Mon-Fri 8am run."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ── ACTION TOOLS ─────────────────────────────────────────────────────────────

def send_dunning_email(customer_name: str, org_id: str, escalation_level: int) -> dict:
    """Drafts and sends a dunning email to a customer. ALWAYS confirm with the user before calling this.

    Args:
        customer_name: The customer company name (e.g. 'Sunrise Foods').
        org_id: The organisation UUID.
        escalation_level: 1 (friendly), 2 (firm), or 3 (final notice).
    """
    try:
        if escalation_level not in [1, 2, 3]:
            return {"status": "error", "message": "escalation_level must be 1, 2, or 3."}

        cust = _find_customer(customer_name, org_id)
        if not cust:
            return {"status": "not_found", "message": f"No customer found matching '{customer_name}'."}
        if not cust.get("email"):
            return {"status": "error", "message": f"{cust['name']} has no email address on file."}

        org_r = _supabase.table("organizations").select("name").eq("id", org_id).single().execute()
        org_name = org_r.data["name"] if org_r.data else "Your Company"

        settings_r = _supabase.table("org_settings").select("email_signature").eq("org_id", org_id).maybe_single().execute()
        signature = (settings_r.data or {}).get("email_signature") or f"Best regards,\nAR Team\n{org_name}"

        invoices = (_supabase.table("invoices")
                    .select("invoice_number, amount, currency, days_overdue")
                    .eq("org_id", org_id).eq("customer_id", cust["id"])
                    .in_("status", ["overdue", "reminded"]).execute()).data or []

        if not invoices:
            return {"status": "error", "message": f"{cust['name']} has no overdue invoices to chase."}

        tones = {
            1: "polite and friendly reminder, assume they may have overlooked it, soft ask, brief",
            2: "professional and firm, reference that previous reminders were sent, set a clear deadline",
            3: "serious final notice, offer a payment plan, frame as last opportunity before escalation",
        }
        total = sum(i["amount"] for i in invoices)
        inv_lines = "\n".join(f"  - {i['invoice_number']}: ${i['amount']:,.0f} ({i['days_overdue']}d overdue)" for i in invoices)

        prompt = f"""Draft a dunning email on behalf of {org_name}.
Customer: {cust['name']}
Total overdue: ${total:,.0f}
Escalation level: {escalation_level} of 3
Tone: {tones[escalation_level]}
Invoices:
{inv_lines}
Rules: Start with SUBJECT: [subject line], then blank line, then email body. Sign off with: {signature}. Under 180 words. No placeholder text."""

        resp = _genai.models.generate_content(model="gemini-3.5-flash", contents=prompt)
        raw = resp.text
        lines = raw.split("\n")
        subj_line = next((l for l in lines if l.startswith("SUBJECT:")), "")
        subject = subj_line.replace("SUBJECT:", "").strip() or f"Payment reminder — ${total:,.0f} outstanding"
        body_start = next((i for i, l in enumerate(lines) if l.startswith("SUBJECT:")), 0) + 2
        body = "\n".join(lines[body_start:]).strip()

        send_result = resend.Emails.send(resend.Emails.SendParams(
            from_=f"Collections <{_FROM_EMAIL}>",
            to=[cust["email"]],
            subject=subject,
            text=body,
        ))

        _supabase.table("communications").insert({
            "org_id": org_id,
            "customer_id": cust["id"],
            "invoice_id": invoices[0]["invoice_number"],
            "type": "email", "subject": subject, "content": body,
            "status": "sent", "direction": "outbound", "sent_by_ai": True,
            "approved_by": "agent",
        }).execute()

        inv_ids = [i["invoice_number"] for i in invoices]
        _supabase.table("invoices").update({"status": "reminded"}).in_("invoice_number", inv_ids).eq("org_id", org_id).execute()

        return {"status": "success", "message": f"Email sent to {cust['name']} at {cust['email']}.",
                "subject": subject, "invoices_chased": len(invoices), "total_amount": total}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def file_dispute(invoice_number: str, org_id: str, reason: str) -> dict:
    """Files a dispute for an invoice, pausing automated collections on it.

    Args:
        invoice_number: The invoice number (e.g. 'INV-023').
        org_id: The organisation UUID.
        reason: One of: incorrect_amount, goods_not_received, duplicate_invoice, already_paid, service_not_rendered, other.
    """
    valid_reasons = ["incorrect_amount", "goods_not_received", "duplicate_invoice",
                     "already_paid", "service_not_rendered", "other"]
    try:
        if reason not in valid_reasons:
            return {"status": "error", "message": f"Invalid reason. Choose from: {', '.join(valid_reasons)}"}

        inv = _find_invoice(invoice_number, org_id)
        if not inv:
            return {"status": "not_found", "message": f"Invoice {invoice_number} not found."}
        if inv["status"] == "disputed":
            return {"status": "error", "message": f"Invoice {invoice_number} already has an active dispute."}
        if inv["status"] == "paid":
            return {"status": "error", "message": f"Invoice {invoice_number} is already paid — no dispute needed."}

        _supabase.table("disputes").insert({
            "org_id": org_id, "invoice_id": inv["id"],
            "customer_id": inv["customer_id"], "reason": reason,
            "description": f"Filed via AI support agent. Reason: {reason}.", "status": "open",
        }).execute()

        _supabase.table("invoices").update({"status": "disputed"}).eq("id", inv["id"]).execute()

        return {"status": "success",
                "message": f"Dispute filed for {invoice_number} (${inv['amount']:,.0f}). Collections are now paused. View it at Dashboard → Disputes.",
                "invoice_number": invoice_number, "reason": reason}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ── AGENTS ───────────────────────────────────────────────────────────────────

knowledge_agent = Agent(
    name="knowledge_agent",
    model="gemini-3.5-flash",
    description="Answers how-to, product, pricing, navigation, and feature questions about DataByt.",
    instruction="""
You are DataByt's product knowledge specialist. Answer using the knowledge below.
For anything not covered here, say: "I'm not sure — let me connect you with our team."

── WHAT IS DATABYT ──────────────────────────────────────────────────────────
DataByt is an AI-powered Accounts Receivable (AR) collections automation SaaS.
It automates dunning emails, tracks overdue invoices, manages disputes, and gives
real-time cash flow visibility — all from one dashboard.

── DASHBOARD NAVIGATION ─────────────────────────────────────────────────────
- Dashboard (/dashboard): Overview — total outstanding, overdue amount, collection rate.
- AR Aging (/dashboard/ar-aging): All invoices by overdue bucket. Send emails, file disputes here.
- Collections (/dashboard/collections): All sent dunning emails and communication history.
- Disputes (/dashboard/disputes): View, resolve, or reject active disputes.
- Analytics (/dashboard/analytics): Collection trends, payment rates, AR performance charts.
- Customers (/dashboard/customers): Customer list with segments, invoice counts, amounts.
- Reports (/dashboard/reports): Generate board-ready PDF reports with one click.
- Integrations (/dashboard/integrations): Connect QuickBooks, Xero, or import CSV.
- Settings (/dashboard/settings): Email signature, collection rules, payment links, currency.
- Billing (/dashboard/billing): Manage your DataByt subscription.

── QUICKBOOKS / XERO ────────────────────────────────────────────────────────
Dashboard → Integrations → Connect QuickBooks or Xero → log in → Allow.
DataByt imports overdue invoices automatically. Takes about 5 minutes.

── CSV IMPORT ───────────────────────────────────────────────────────────────
Dashboard → Integrations → Import CSV.
Required columns: invoice_number, customer_name, customer_email, amount, due_date.

── DUNNING EMAILS ───────────────────────────────────────────────────────────
One email per customer covering ALL overdue invoices.
L1 (1+ days): polite reminder. L2 (10+ days): firm with deadline. L3 (30+ days): final notice.
Runs automatically Mon–Fri at 8am. Cooldown: 3 days minimum between emails.
Change thresholds: Settings → Collection Rules.

── MANUAL EMAIL ─────────────────────────────────────────────────────────────
AR Aging → find customer → Email button → choose level → AI drafts → send.
Or ask me directly and I can send it for you.

── PAYMENT LINKS ────────────────────────────────────────────────────────────
Settings → Payment Collection. Works with Stripe, Razorpay, bank transfer, any URL.
Use INVOICE_NUMBER as the placeholder — DataByt replaces it per invoice.

── DISPUTES ─────────────────────────────────────────────────────────────────
AR Aging → dispute icon next to invoice. Collections pause automatically.
Or ask me to file a dispute and I'll do it for you.
Resolve / reject: Dashboard → Disputes.

── CUSTOMER SEGMENTS ────────────────────────────────────────────────────────
standard, strategic (high-value — softer tone), at_risk (late payers — firmer tone).
Set in Dashboard → Customers → edit customer.

── REPORTS ──────────────────────────────────────────────────────────────────
Dashboard → Reports → Generate PDF Report. Includes AR aging, outstanding balance, collection rate.

── PRICING ──────────────────────────────────────────────────────────────────
One plan, everything included. Founding rate for first 20 customers. 30-day free trial, no card needed.
To upgrade: email kuberanoh@gmail.com.

── HELP ─────────────────────────────────────────────────────────────────────
support@databyt.in or kuberanoh@gmail.com for billing/urgent issues.
""",
)

account_agent = Agent(
    name="account_agent",
    model="gemini-3.5-flash",
    description="Looks up live invoice data, customer balances, and AR summaries.",
    instruction="""
You look up real account data. The org_id is in the [Context] header — extract and use it directly.

DATA MODEL:
- Organisation = the DataByt user's company (e.g. "Dinemetrics"). Use org_id from context.
- Customer = companies that OWE the org money (e.g. "Sunrise Foods", "Acme Corp").

TOOL SELECTION:
- "How many overdue/open/paid invoices?" → get_invoice_count(status, org_id)
- "Total AR outstanding / total owed to me?" → get_total_ar_outstanding(org_id)
- "How much does [Customer] owe?" → get_customer_balance(customer_name, org_id)
- "List all overdue customers / who owes me most?" → list_overdue_customers(org_id)
- "Show all invoices for [Customer]" → get_customer_invoices(customer_name, org_id)
- "When did we last email [Customer]?" → get_last_communication(customer_name, org_id)
- "Show active disputes / what disputes are open?" → get_disputed_invoices(org_id)
- "Who gets emailed next / upcoming dunning / scheduled emails?" → get_upcoming_dunning(org_id)
- Need org_id from a name → get_org_id(org_name)

RULES:
- NEVER ask for org_id — it is in the [Context] header.
- Always format dollar amounts clearly: "$458,550 across 4 invoices".
- If a customer is not found, say so clearly and ask if they want to check a different spelling.
""",
    tools=[get_org_id, get_invoice_count, get_total_ar_outstanding,
           get_customer_balance, list_overdue_customers,
           get_customer_invoices, get_last_communication,
           get_disputed_invoices, get_upcoming_dunning],
)

action_agent = Agent(
    name="action_agent",
    model="gemini-3.5-flash",
    description="Performs actions: sends dunning emails and files disputes.",
    instruction="""
You perform real actions that affect the customer's account.

AVAILABLE ACTIONS:
1. Send a dunning email to a customer → send_dunning_email(customer_name, org_id, escalation_level)
2. File a dispute for an invoice → file_dispute(invoice_number, org_id, reason)

IMPORTANT SAFETY RULES:
- ALWAYS confirm with the user before sending an email or filing a dispute.
  Example: "I'm about to send a Level 2 dunning email to Sunrise Foods. Should I proceed?"
- For disputes, confirm the invoice number and reason before filing.
- The org_id is in the [Context] header — extract and use it directly.
- NEVER send emails to customers without explicit user approval in this conversation.

DISPUTE REASONS (use exact values):
incorrect_amount, goods_not_received, duplicate_invoice, already_paid, service_not_rendered, other

ESCALATION LEVELS:
1 = friendly reminder, 2 = firm with deadline, 3 = final notice before escalation
""",
    tools=[get_org_id, get_customer_balance, get_customer_invoices,
           send_dunning_email, file_dispute],
)

escalation_agent = Agent(
    name="escalation_agent",
    model="gemini-3.5-flash",
    description="Handles complaints, refunds, billing disputes, and frustrated customers.",
    instruction="""
You handle difficult tickets that need human attention.
Apologise briefly and professionally.
Tell the user a team member will follow up within a few hours.
Ask for any specific detail that would help the team respond faster.
Never promise outcomes like refunds — only acknowledge and escalate.
""",
)

root_agent = Agent(
    name="support_manager",
    model="gemini-3.5-flash",
    description="DataByt AI support manager — routes requests to the right specialist.",
    instruction="""
You are DataByt's support manager. Read the user's message and route to the right specialist.

ROUTING RULES:
- "How do I...", product features, pricing, navigation, settings questions
  → knowledge_agent

- "How many invoices...", "total outstanding", "how much does X owe", "list overdue customers",
  "show invoices for X", "when did we last email X", any data lookup question
  → account_agent

- "Send a reminder to X", "chase X", "email Sunrise Foods", "file a dispute for INV-XXX",
  any request to take an action or do something
  → action_agent

- Refunds, complaints, billing issues, bugs, angry messages, anything unclear
  → escalation_agent

IMPORTANT: Always route. Never answer directly yourself. You are only the router.
""",
    sub_agents=[knowledge_agent, account_agent, action_agent, escalation_agent],
)
