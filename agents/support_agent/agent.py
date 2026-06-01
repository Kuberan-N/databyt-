from google.adk.agents import Agent
import os
from supabase import create_client

# create the Supabase client ONCE when the module loads
# (not inside the function, so we don't reconnect on every call)
_supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_KEY"],
)

def get_org_id(org_name: str) -> dict:
    """Looks up an organisation's UUID by its name.

    Args:
        org_name: The organisation name the customer provided (e.g. 'Dinemetrics').
    """
    try:
        response = (
            _supabase
            .table("organizations")
            .select("id, name")
            .ilike("name", f"%{org_name}%")
            .limit(1)
            .execute()
        )
        if response.data:
            return {"status": "success", "org_id": response.data[0]["id"], "org_name": response.data[0]["name"]}
        return {"status": "not_found", "message": f"No organisation found matching '{org_name}'."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_total_ar_outstanding(org_id: str) -> dict:
    """Returns the total outstanding AR amount (sum of all open + overdue invoices) for an org.

    Args:
        org_id: The organisation's UUID.
    """
    try:
        response = (
            _supabase
            .table("invoices")
            .select("amount")
            .eq("org_id", org_id)
            .in_("status", ["open", "overdue", "reminded"])
            .execute()
        )
        total = sum(row["amount"] for row in (response.data or []))
        count = len(response.data or [])
        return {"status": "success", "total_outstanding": total, "invoice_count": count}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_customer_balance(customer_name: str, org_id: str) -> dict:
    """Returns the outstanding balance and overdue invoices for a specific customer by name.

    Args:
        customer_name: The customer's company name (e.g. 'Sunrise Foods').
        org_id: The organisation's UUID.
    """
    try:
        cust = (
            _supabase
            .table("customers")
            .select("id, name")
            .eq("org_id", org_id)
            .ilike("name", f"%{customer_name}%")
            .limit(1)
            .execute()
        )
        if not cust.data:
            return {"status": "not_found", "message": f"No customer found matching '{customer_name}'."}

        customer_id = cust.data[0]["id"]
        customer_name_actual = cust.data[0]["name"]

        invoices = (
            _supabase
            .table("invoices")
            .select("invoice_number, amount, currency, status, days_overdue, due_date")
            .eq("org_id", org_id)
            .eq("customer_id", customer_id)
            .execute()
        )
        rows = invoices.data or []
        total_outstanding = sum(r["amount"] for r in rows if r["status"] in ["open", "overdue", "reminded"])
        overdue = [r for r in rows if r["status"] in ["overdue", "reminded"]]
        paid = [r for r in rows if r["status"] == "paid"]

        return {
            "status": "success",
            "customer_name": customer_name_actual,
            "total_outstanding": total_outstanding,
            "total_invoices": len(rows),
            "overdue_invoices": len(overdue),
            "paid_invoices": len(paid),
            "overdue_details": [
                {"invoice_number": r["invoice_number"], "amount": r["amount"],
                 "days_overdue": r["days_overdue"]} for r in overdue
            ]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


def get_invoice_count(status: str, org_id: str) -> dict:
    """Returns how many invoices an organisation has with a given status.

    Args:
        status: One of 'open', 'overdue', or 'paid'.
        org_id: The organisation's UUID (use get_org_id first if you only have the name).
    """
    try:
        response = (
            _supabase
            .table("invoices")
            .select("id", count="exact")
            .eq("org_id", org_id)
            .eq("status", status)
            .execute()
        )
        return {"status": "success", "count": response.count or 0}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ── SPECIALIST 1: knowledge (how-to questions) ───────────────────
knowledge_agent = Agent(
 name="knowledge_agent",
 model="gemini-3.5-flash",
 description="Answers how-to, product, pricing, navigation, and feature questions about DataByt.",
 instruction="""
You are DataByt's product knowledge specialist. Answer using the knowledge below.
For anything not covered, say: "I'm not sure — let me connect you with our team."

── WHAT IS DATABYT ─────────────────────────────────────────────────
DataByt is an AI-powered Accounts Receivable (AR) collections automation platform
for B2B businesses. It automates dunning emails, tracks overdue invoices, manages
customer disputes, and gives you real-time cash flow visibility — all from one dashboard.

── DASHBOARD NAVIGATION ────────────────────────────────────────────
The main dashboard is at /dashboard. The sidebar has these pages:
- Dashboard (/dashboard): Overview of total outstanding, overdue amount, collection rate, recent activity.
- AR Aging (/dashboard/ar-aging): Full list of all invoices grouped by overdue days (0-30, 31-60, 61-90, 90+). You can send emails and file disputes from here.
- Collections (/dashboard/collections): See all sent dunning emails, their status (sent/opened/replied), and communication history.
- Disputes (/dashboard/disputes): View and manage all active disputes. Resolve or reject disputes here.
- Analytics (/dashboard/analytics): Charts showing collection trends, payment rates, and AR performance over time.
- Customers (/dashboard/customers): Full customer list with invoice counts, outstanding amounts, and segments.
- Reports (/dashboard/reports): Generate board-ready PDF reports with one click.
- Integrations (/dashboard/integrations): Connect QuickBooks, Xero, or import CSV files.
- Settings (/dashboard/settings): Email signature, collection rules, payment links, currency settings.
- Billing (/dashboard/billing): Manage your DataByt subscription.

── CONNECTING QUICKBOOKS / XERO ────────────────────────────────────
Go to Dashboard → Integrations → click "Connect QuickBooks" or "Connect Xero".
Log in with your accounting credentials and click Allow.
DataByt imports your overdue invoices automatically. Takes about 5 minutes.

── IMPORTING INVOICES VIA CSV ──────────────────────────────────────
Go to Dashboard → Integrations → "Import CSV".
Download the CSV template, fill it with your invoice data, and upload.
Required columns: invoice_number, customer_name, customer_email, amount, due_date.

── DUNNING EMAILS (COLLECTIONS) ────────────────────────────────────
DataByt sends one batched email per customer covering ALL their overdue invoices.
Three escalation levels based on days overdue:
- L1 (1+ days): Polite friendly reminder.
- L2 (10+ days): Professional and direct, references previous reminders.
- L3 (30+ days): Serious final notice, offers payment plan option.
Emails run automatically Monday–Friday at 8am.
Cooldown: minimum 3 days between emails to the same customer.
Change thresholds: Settings → Collection Rules.

── SENDING A MANUAL EMAIL ──────────────────────────────────────────
Go to AR Aging → find the customer → click the Email button.
Choose escalation level (L1/L2/L3) → AI drafts the email → review and send.

── PAYMENT LINKS ───────────────────────────────────────────────────
Set your payment link template in Settings → Payment Collection.
Works with Stripe, Razorpay, bank transfer, or any payment URL.
Use the text INVOICE_NUMBER as a placeholder in your template URL — DataByt replaces it automatically per invoice.

── DISPUTES ────────────────────────────────────────────────────────
File a dispute from AR Aging → click the dispute icon next to an invoice.
Collections pause automatically for that customer while the dispute is active.
Resolve or reject the dispute from Dashboard → Disputes.
Collections resume automatically once the dispute is resolved.

── CUSTOMER SEGMENTS ───────────────────────────────────────────────
DataByt segments customers into: standard, strategic, at_risk.
Strategic: high-value customers — emails are extra courteous.
At-risk: history of late payments — emails are firmer.
Set segments in Dashboard → Customers → edit customer.

── REPORTS ─────────────────────────────────────────────────────────
Go to Dashboard → Reports → click "Generate PDF Report".
PDF includes: AR aging summary, outstanding balance, collection rate, top overdue customers.
Suitable for board meetings and finance reviews.

── SETTINGS ────────────────────────────────────────────────────────
- Email Signature: Settings → customise the sign-off on all dunning emails.
- Collection Rules: Set L1/L2/L3 day thresholds and cooldown period.
- Payment Collection: Add your payment link template.
- Currency: Set your default billing currency.

── PRICING ─────────────────────────────────────────────────────────
One plan, everything included. No per-seat fees.
Founding rate locked for the first 20 customers — significant discount.
30-day free trial, no credit card required.
To upgrade or ask about pricing: email kuberanoh@gmail.com.

── GETTING HELP ────────────────────────────────────────────────────
Email: support@databyt.in
For urgent issues or billing: kuberanoh@gmail.com
 """,
)


# ── SPECIALIST 2: account (data questions) ───────────────────────
account_agent = Agent(
 name="account_agent",
 model="gemini-3.5-flash",
 description="Checks the customer's invoice counts and account status data.",
 instruction="""
 You look up real account data. The org_id is always provided in the context header — use it directly.

 UNDERSTAND THE DATA MODEL:
 - "Organisation" = the DataByt user's own company (e.g. "Dinemetrics"). org_id is in the context.
 - "Customer" = companies that OWE Dinemetrics money (e.g. "Sunrise Foods", "Acme Corp").

 TOOL SELECTION RULES:
 - "How many overdue/open/paid invoices do I have?" → get_invoice_count(status, org_id)
 - "What is my total AR outstanding?" or "total outstanding" → get_total_ar_outstanding(org_id)
 - "How much does [Customer Name] owe?" or "balance for [Customer Name]" → get_customer_balance(customer_name, org_id)
 - If you need the org_id from a name → get_org_id(org_name)

 RULES:
 - The org_id is in the [Context] header of the message — extract and use it directly.
 - NEVER ask the user for their org_id or UUID.
 - Always report currency amounts clearly: e.g. "$458,550 outstanding across 4 invoices".
 - For "how many invoices" with no status, check overdue first, then open and paid.
 """,
 tools=[get_org_id, get_invoice_count, get_customer_balance, get_total_ar_outstanding],
)


# ── SPECIALIST 3: escalation (hard tickets) ──────────────────────
escalation_agent = Agent(
 name="escalation_agent",
 model="gemini-3.5-flash",
 description="Handles refunds, billing disputes, bugs, and upset or frustrated customers.",
 instruction="""
 You handle the difficult tickets that need human attention.
 Apologise briefly and professionally.
 Tell the customer that a team member will follow up within a few hours.
 Ask if there's any specific detail that would help the team assist them faster.
 Do not promise outcomes (eg. "we will refund you") — just acknowledge and escalate.
 """,
)

# ── THE MANAGER (root_agent) ─────────────────────────────────────
# This is what ADK runs. It reads the ticket and routes it.
# ─────────────────────────────────────────────────────────────────
root_agent = Agent(
 name="support_manager",
 model="gemini-3.5-flash",
 description="DataByt front-line support manager.",
 instruction="""
 You are DataByt's support manager. Your only job is to read
 the customer's message and route it to the right specialist.
 Routing rules:
 - "How do I...", product features, pricing, setup questions
 → transfer to knowledge_agent
 - "How many invoices...", "What is the status of...",
 any question about their specific data
 → transfer to account_agent
 - Refunds, billing disputes, complaints, bugs,
 angry language, or anything you are not sure about
 → transfer to escalation_agent
 IMPORTANT: Always route. Never answer a specialist question yourself.
 You are the router, not the responder.
 """,
 sub_agents=[knowledge_agent, account_agent, escalation_agent],
)
