import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import DodoPayments from "dodopayments";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

function getDodoClient() {
  return new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY ?? "placeholder",
    environment: (process.env.DODO_ENVIRONMENT ?? "test_mode") as "test_mode" | "live_mode",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { invoiceId, orgId } = await req.json() as { invoiceId: string; orgId: string };
    if (!invoiceId || !orgId) {
      return NextResponse.json({ error: "invoiceId and orgId required" }, { status: 400 });
    }

    const { data: invoice, error: invErr } = await db
      .from("invoices")
      .select("*, customers(name, email)")
      .eq("id", invoiceId)
      .eq("org_id", orgId)
      .single();

    if (invErr || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "paid") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
    }

    // If payment link exists and is still pending, reuse it
    if (invoice.payment_link_url) {
      return NextResponse.json({ url: invoice.payment_link_url });
    }

    const amountCents = Math.round(invoice.amount * 100);
    const currency = (invoice.currency ?? "USD").toUpperCase();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const dodo = getDodoClient();

    // Create a one-time product for this invoice
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product = await (dodo.products as any).create({
      name: `Invoice ${invoice.invoice_number}`,
      tax_category: "saas",
      price: {
        type: "one_time_price",
        currency,
        price: amountCents,
        discount: 0,
        purchasing_power_parity: false,
      },
    });

    const customer = invoice.customers;
    const sessionParams: Record<string, unknown> = {
      product_cart: [{ product_id: product.product_id, quantity: 1 }],
      return_url: `${baseUrl}/pay/success?invoiceId=${invoiceId}`,
      cancel_url: `${baseUrl}/pay/${invoiceId}`,
    };

    if (customer?.email) {
      sessionParams.customer = {
        email: customer.email,
        name: customer.name ?? customer.email,
        create_new_customer: false,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await (dodo.checkoutSessions as any).create(sessionParams);

    const paymentUrl: string = session.url ?? session.payment_url ?? session.checkout_url ?? "";

    // Store in payment_links table
    await db.from("payment_links").insert({
      org_id: orgId,
      invoice_id: invoiceId,
      dodo_session_id: session.session_id ?? session.id,
      amount: invoice.amount,
      currency,
      status: "pending",
      payment_url: paymentUrl,
    });

    // Store URL on the invoice for quick access
    await db.from("invoices").update({ payment_link_url: paymentUrl }).eq("id", invoiceId);

    return NextResponse.json({ url: paymentUrl });
  } catch (err) {
    console.error("checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create checkout" },
      { status: 500 }
    );
  }
}
