from google.adk.agents import Agent
import os
from supabase import create_client

# create the Supabase client ONCE when the module loads
# (not inside the function, so we don't reconnect on every call)
_supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_KEY"],
)

def get_invoice_count(status: str, org_id: str) -> dict:
    """Returns how many invoices an organisation has with a given status.

    Args:
        status: One of 'open', 'overdue', or 'paid'.
        org_id: The organisation's unique ID (UUID string).
    """

    try:
        response = (
            _supabase
            .table("invoices")                 # which table to query
            .select("id", count="exact")       # select id column, get exact count
            .eq("org_id", org_id)              # filter: org_id must match
            .eq("status", status)              # filter: status must match
            .execute()                         # run the query
        )

        return {"status": "success", "count": response.count or 0}

    except Exception as e:
        return {"status": "error", "message": str(e)}

# ── SPECIALIST 1: knowledge (how-to questions) ───────────────────
knowledge_agent = Agent(
 name="knowledge_agent",
 model="gemini-3.5-flash",
 description="Answers how-to, product, pricing, and feature questions about DataByt.",
 instruction="""
 You answer product questions about DataByt using ONLY this knowledge.
 If the answer is not here, say "I'm not sure — let me connect you with our team."
 - CONNECT QB/XERO: Dashboard → Integrations → Connect, log in, Allow. 5 min.
 - DUNNING: one email/customer, L1/L2/L3 tone by days overdue. Settings → Collection Rules.
 - PAYMENT LINKS: Settings → Payment Collection. Any payment URL.
 - DISPUTES: file on AR Aging page; collections pause; resolve to resume.
 - REPORTS: Dashboard → Reports → Generate PDF Report.
 - PRICING: one plan, founding rate for first 20, 30-day free trial.
 """,
)


# ── SPECIALIST 2: account (data questions) ───────────────────────
account_agent = Agent(
 name="account_agent",
 model="gemini-3.5-flash",
 description="Checks the customer's invoice counts and account status data.",
 instruction="""
 You look up real account data for the customer.
 When asked how many invoices are open, overdue, or paid,
 ALWAYS call the get_invoice_count tool.
 Never guess numbers. Report what the tool returns clearly.
 """,
 tools=[get_invoice_count],
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
