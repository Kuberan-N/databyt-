import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Webhook } from "standardwebhooks";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const webhookKey = process.env.DODO_WEBHOOK_KEY;
  if (webhookKey) {
    try {
      const wh = new Webhook(webhookKey);
      wh.verify(rawBody, {
        "webhook-id":        req.headers.get("webhook-id") ?? "",
        "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
        "webhook-signature": req.headers.get("webhook-signature") ?? "",
      });
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: { type: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type !== "payment.succeeded") {
    return NextResponse.json({ ok: true });
  }

  const data = event.data;
  const sessionId  = (data.session_id ?? data.id ?? "") as string;
  const paymentId  = (data.payment_id ?? data.id ?? "") as string;
  const totalAmount = typeof data.total_amount === "number" ? data.total_amount / 100 : null;

  // Find the payment link for this session
  const { data: link } = await db
    .from("payment_links")
    .select("*")
    .or(`dodo_session_id.eq.${sessionId},dodo_payment_id.eq.${paymentId}`)
    .eq("status", "pending")
    .single();

  if (!link) {
    // Idempotency — already processed or not from our system
    return NextResponse.json({ ok: true });
  }

  // Mark payment link as paid
  await db.from("payment_links").update({
    status: "paid",
    dodo_payment_id: paymentId,
    paid_at: new Date().toISOString(),
  }).eq("id", link.id);

  // Get invoice to fetch org_id and amount
  const { data: invoice } = await db
    .from("invoices")
    .select("org_id, amount, customer_id")
    .eq("id", link.invoice_id)
    .single();

  if (!invoice) return NextResponse.json({ ok: true });

  // Create payment record (cash application)
  await db.from("payments").insert({
    org_id: invoice.org_id,
    invoice_id: link.invoice_id,
    amount: totalAmount ?? invoice.amount,
    payment_date: new Date().toISOString().slice(0, 10),
    method: "dodo_payments",
    dodo_payment_id: paymentId,
    matched: true,
  });

  // Mark invoice as paid
  await db.from("invoices").update({
    status: "paid",
    payment_received_date: new Date().toISOString().slice(0, 10),
    payment_link_url: null,
  }).eq("id", link.invoice_id);

  return NextResponse.json({ ok: true });
}
