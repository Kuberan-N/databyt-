import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

// Accepts forwarded inbound emails from Cloudflare Email Workers.
// The Cloudflare Worker posts a JSON payload with: from, to, subject, text, headers.
// Reply-To on outbound emails is set to: reply+{invoiceId}@{RESEND_INBOUND_DOMAIN}
// This lets us extract the invoiceId without parsing email headers.
export async function POST(req: NextRequest) {
  let body: {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
    headers?: Record<string, string>;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const toAddress = body.to ?? "";
  const fromAddress = body.from ?? "";
  const subject = body.subject ?? "(no subject)";
  const text = body.text ?? body.html ?? "";

  // Extract invoiceId from reply+{invoiceId}@domain
  const match = toAddress.match(/reply\+([0-9a-f-]{36})@/i);
  if (!match) {
    // Not a tracked reply — ignore silently
    return NextResponse.json({ ok: true });
  }

  const invoiceId = match[1];

  // Look up the invoice to get org_id
  const { data: invoice } = await db
    .from("invoices")
    .select("id, org_id, customer_id")
    .eq("id", invoiceId)
    .single();

  if (!invoice) return NextResponse.json({ ok: true });

  // Log as inbound communication
  const { error } = await db.from("communications").insert({
    org_id: invoice.org_id,
    invoice_id: invoiceId,
    type: "email",
    subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
    content: text.slice(0, 10000), // cap at 10k chars
    status: "received",
    sent_at: new Date().toISOString(),
    direction: "inbound",
    sent_by_ai: false,
    approved_by: fromAddress || null,
  });

  if (error) {
    console.error("inbound-email webhook error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
