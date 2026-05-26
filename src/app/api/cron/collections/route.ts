import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { GoogleGenerativeAI } from "@google/generative-ai";

function unsubToken(orgId: string, customerId: string, email: string): string {
  return Buffer.from(JSON.stringify({ orgId, customerId, email })).toString("base64url");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

const resend = new Resend(process.env.RESEND_API_KEY);
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

// Minimum days between emails per customer
const COOLDOWN_DAYS = 3;

// Days-overdue thresholds for escalation level
function escalationLevel(daysOverdue: number): 1 | 2 | 3 {
  if (daysOverdue >= 30) return 3;
  if (daysOverdue >= 10) return 2;
  return 1;
}

const TONE: Record<number, string> = {
  1: `polite and friendly reminder. Open warmly, assume the customer may have simply overlooked this. Make a soft ask. Keep it brief.`,
  2: `professional and direct. Reference that previous reminders have gone unanswered. Set a clear payment deadline. Mention that continued non-payment may affect their account standing.`,
  3: `serious and firm - this is a final notice before escalating internally. Offer a payment plan as a resolution option. Frame this as a final opportunity to resolve the matter. Do NOT threaten legal action.`,
};

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  due_date: string;
  days_overdue: number;
  payment_link_url: string | null;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  segment: string;
  org_id: string;
  invoices: Invoice[];
  org_name: string;
  org_signature: string;
  org_currency: string;
}

async function buildBatchedEmail(
  customer: Customer,
  level: 1 | 2 | 3,
  baseUrl: string,
): Promise<{ subject: string; body: string }> {
  const fmtCurrency = (n: number, c = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

  const totalOwed = customer.invoices.reduce((s, i) => s + i.amount, 0);
  const currency  = customer.invoices[0]?.currency ?? "USD";

  const invoiceLines = customer.invoices
    .sort((a, b) => b.days_overdue - a.days_overdue)
    .map(inv => {
      const payLink = inv.payment_link_url ?? `${baseUrl}/pay/${inv.id}`;
      return `  * Invoice ${inv.invoice_number} - ${fmtCurrency(inv.amount, inv.currency)} - ${inv.days_overdue}d overdue - Pay: ${payLink}`;
    })
    .join("\n");

  const segmentNote =
    customer.segment === "strategic"
      ? "IMPORTANT: This is a high-value strategic customer - be extra courteous and emphasise the relationship."
      : customer.segment === "at_risk"
      ? "NOTE: This customer has a history of late payments - be firm and concise."
      : "";

  const prompt = `You are an accounts receivable specialist drafting a dunning email on behalf of ${customer.org_name}.

Customer: ${customer.name}
Total Amount Due: ${fmtCurrency(totalOwed, currency)}
Escalation Level: ${level} of 3
Tone instruction: ${TONE[level]}
${segmentNote ? `\n${segmentNote}` : ""}

Overdue invoices:
${invoiceLines}

Rules:
- Start with: SUBJECT: [your subject line]
- Then blank line, then the email body
- Address the customer by company name
- List all overdue invoices clearly with their amounts and payment links
- Include a primary payment call to action using the first invoice's payment link if there is one invoice, or list all links if multiple
- Sign off with: ${customer.org_signature}
- Do NOT use placeholder text
- Keep body under 200 words`;

  const model  = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const raw    = result.response.text();

  const lines       = raw.split("\n");
  const subjectLine = lines.find(l => l.startsWith("SUBJECT:")) ?? "";
  const subject     = subjectLine.replace("SUBJECT:", "").trim() || `Payment required - ${fmtCurrency(totalOwed, currency)}`;
  const bodyStart   = lines.findIndex(l => l.startsWith("SUBJECT:")) + 2;
  const body        = lines.slice(bodyStart).join("\n").trim();

  return { subject, body };
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const baseUrl   = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.databyt.in";
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "collections@databyt.io";
  const inboundDomain = process.env.RESEND_INBOUND_DOMAIN;

  // Get all active orgs
  const { data: orgs } = await db
    .from("organizations")
    .select("id, name")
    .eq("status", "active");

  if (!orgs?.length) return NextResponse.json({ ok: true, processed: 0 });

  let totalSent    = 0;
  let totalSkipped = 0;
  const errors: string[] = [];

  for (const org of orgs) {
    try {
      const { data: settings } = await db
        .from("org_settings")
        .select("email_signature, currency")
        .eq("org_id", org.id)
        .single();

      const signature = settings?.email_signature
        ?? `Best regards,\nAccounts Receivable Team\n${org.name}`;

      // Fetch overdue/reminded invoices with customer emails
      const { data: invoices } = await db
        .from("invoices")
        .select("id, invoice_number, amount, currency, due_date, days_overdue, payment_link_url, customer_id, customers(id, name, email, segment)")
        .eq("org_id", org.id)
        .in("status", ["overdue", "reminded"])
        .gt("days_overdue", 0)
        .not("customers.email", "is", null);

      if (!invoices?.length) continue;

      // Check opted-out customers
      const { data: optouts } = await db
        .from("communications")
        .select("customer_id")
        .eq("org_id", org.id)
        .eq("type", "note")
        .eq("content", "UNSUBSCRIBED");

      const optedOutIds = new Set<string>((optouts ?? []).map((o: { customer_id: string }) => o.customer_id));

      // Check cooldown - customers emailed in last COOLDOWN_DAYS days
      const cooldownDate = new Date(Date.now() - COOLDOWN_DAYS * 86_400_000).toISOString();
      const { data: recentComms } = await db
        .from("communications")
        .select("customer_id")
        .eq("org_id", org.id)
        .eq("type", "email")
        .eq("direction", "outbound")
        .gte("sent_at", cooldownDate);

      const recentlySentIds = new Set<string>((recentComms ?? []).map((c: { customer_id: string }) => c.customer_id));

      // Group invoices by customer
      const byCustomer = new Map<string, Customer>();
      for (const inv of invoices) {
        const c = inv.customers;
        if (!c?.email) continue;
        if (optedOutIds.has(c.id)) { totalSkipped++; continue; }
        if (recentlySentIds.has(c.id)) { totalSkipped++; continue; }

        if (!byCustomer.has(c.id)) {
          byCustomer.set(c.id, {
            id: c.id, name: c.name, email: c.email, segment: c.segment ?? "standard",
            org_id: org.id, invoices: [], org_name: org.name,
            org_signature: signature, org_currency: settings?.currency ?? "USD",
          });
        }
        byCustomer.get(c.id)!.invoices.push({
          id: inv.id, invoice_number: inv.invoice_number, amount: inv.amount,
          currency: inv.currency ?? "USD", due_date: inv.due_date,
          days_overdue: inv.days_overdue, payment_link_url: inv.payment_link_url,
        });
      }

      // Send one email per customer
      for (const customer of byCustomer.values()) {
        try {
          const maxDaysOverdue = Math.max(...customer.invoices.map(i => i.days_overdue));
          const level = escalationLevel(maxDaysOverdue);

          const { subject, body } = await buildBatchedEmail(customer, level, baseUrl);

          const replyTo = inboundDomain
            ? `reply+${customer.invoices[0].id}@${inboundDomain}`
            : undefined;

          const token       = unsubToken(org.id, customer.id, customer.email);
          const unsubUrl    = `${baseUrl}/api/unsubscribe?token=${token}`;
          const unsubFooter = `\n\n---\nTo stop receiving these reminders: ${unsubUrl}`;
          const bodyWithUnsub = body + unsubFooter;

          const { data: sendData, error: sendErr } = await resend.emails.send({
            from: `Collections <${fromEmail}>`,
            to: [customer.email],
            subject,
            replyTo,
            text: bodyWithUnsub,
            html: `<pre style="font-family:sans-serif;white-space:pre-wrap;font-size:14px;line-height:1.7">${bodyWithUnsub.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre><hr style="margin-top:24px;border:none;border-top:1px solid #e2e8f0"><p style="font-size:11px;color:#94a3b8;margin-top:8px">To stop receiving these reminders, <a href="${unsubUrl}" style="color:#94a3b8">unsubscribe here</a>.</p>`,
          });

          if (sendErr) throw new Error(sendErr.message);

          const now = new Date().toISOString();

          // Log one communication record (covering all invoices for this customer in this run)
          await db.from("communications").insert({
            org_id: org.id,
            customer_id: customer.id,
            invoice_id: customer.invoices[0].id,
            type: "email",
            subject,
            content: body,
            status: "sent",
            sent_at: now,
            direction: "outbound",
            sent_by_ai: true,
            approved_by: "auto",
            resend_message_id: sendData?.id ?? null,
          });

          // Update invoice statuses to "reminded"
          const invoiceIds = customer.invoices.map(i => i.id);
          await db.from("invoices")
            .update({ status: "reminded" })
            .in("id", invoiceIds)
            .eq("org_id", org.id);

          totalSent++;
        } catch (customerErr) {
          errors.push(`${org.name}/${customer.email}: ${(customerErr as Error).message}`);
        }
      }
    } catch (orgErr) {
      errors.push(`org ${org.id}: ${(orgErr as Error).message}`);
    }
  }

  return NextResponse.json({
    ok: true,
    sent: totalSent,
    skipped: totalSkipped,
    errors: errors.length ? errors : undefined,
  });
}
