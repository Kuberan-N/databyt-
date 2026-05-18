import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface DraftEmailRequest {
  invoiceId: string;
  orgId: string;
  escalationLevel: 1 | 2 | 3;
}

export interface DraftEmailResponse {
  subject: string;
  body: string;
  escalationLevel: number;
  invoiceId: string;
}

const ESCALATION_TONE: Record<number, string> = {
  1: "friendly and professional reminder — assume the customer may have simply forgotten. Keep it warm, brief (3-4 sentences max), and include a clear call to action.",
  2: "firm and professional — acknowledge no response to previous outreach, express concern, set a clear deadline, and mention that continued non-payment may affect their account status.",
  3: "urgent and direct — this is a final notice before escalating to collections. Be formal, state consequences clearly, and provide one last opportunity to resolve. Mention legal or collections action if unresolved.",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function POST(req: NextRequest) {
  try {
    const { invoiceId, orgId, escalationLevel } = (await req.json()) as DraftEmailRequest;

    if (!invoiceId || !orgId || ![1, 2, 3].includes(escalationLevel)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { data: invoice } = await db
      .from("invoices")
      .select("*, customers(name, email, payment_terms, segment)")
      .eq("id", invoiceId)
      .eq("org_id", orgId)
      .single();

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    const { data: org } = await db.from("organizations").select("name").eq("id", orgId).single();
    const { data: settings } = await db.from("org_settings").select("email_signature, currency").eq("org_id", orgId).single();

    const customer = invoice.customers;
    const currency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.currency ?? "USD",
    }).format(invoice.amount);

    const tone = ESCALATION_TONE[escalationLevel];
    const orgName = org?.name ?? "Your Company";
    const signature = settings?.email_signature ?? `Best regards,\nAccounts Receivable Team\n${orgName}`;

    const prompt = `You are an accounts receivable specialist drafting a dunning email on behalf of ${orgName}.

Customer: ${customer?.name ?? "Customer"}
Invoice Number: ${invoice.invoice_number}
Amount Due: ${currency}
Due Date: ${invoice.due_date}
Days Overdue: ${invoice.days_overdue}
Customer Segment: ${customer?.segment ?? "standard"}
Escalation Level: ${escalationLevel} of 3

Tone: ${tone}

Draft a concise, professional dunning email. Rules:
- Write ONLY the email content (subject line + body), no preamble
- Start with: SUBJECT: [your subject line]
- Then blank line, then the email body
- Address the customer by company name
- Reference the specific invoice number and amount
- Include a clear payment call to action
- Sign off with: ${signature}
- Do NOT use placeholder text like [Your Name] — use the actual company name
- Keep body under 150 words`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    const lines = raw.split("\n");
    const subjectLine = lines.find(l => l.startsWith("SUBJECT:")) ?? "";
    const subject = subjectLine.replace("SUBJECT:", "").trim() || `Invoice ${invoice.invoice_number} — Payment Required`;
    const bodyStart = lines.findIndex(l => l.startsWith("SUBJECT:")) + 2;
    const body = lines.slice(bodyStart).join("\n").trim();

    return NextResponse.json({
      subject,
      body,
      escalationLevel,
      invoiceId,
    } satisfies DraftEmailResponse);
  } catch (err) {
    console.error("draft-email error:", err);
    return NextResponse.json({ error: "Failed to draft email" }, { status: 500 });
  }
}
