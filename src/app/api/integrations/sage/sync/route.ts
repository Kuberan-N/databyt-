import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

const SAGE_API = "https://api.accounting.sage.com/v3.1";

interface SageSalesInvoice {
  id: string;
  displayed_as: string;
  contact: { id: string; displayed_as: string };
  contact_name: string;
  date: string;
  due_date: string;
  total_amount: number;
  outstanding_amount: number;
  currency: { id: string; symbol: string };
  status: { id: string };
  void_reason: string | null;
}

async function refreshSageToken(orgId: string, integration: Record<string, string>) {
  const clientId     = process.env.SAGE_CLIENT_ID!;
  const clientSecret = process.env.SAGE_CLIENT_SECRET!;

  const res = await fetch("https://oauth.accounting.sage.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: integration.refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) throw new Error("Sage token refresh failed");

  const tokens = await res.json() as { access_token: string; expires_in: number; refresh_token?: string };
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await db.from("integrations").update({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? integration.refresh_token,
    token_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }).eq("org_id", orgId).eq("provider", "sage");

  return tokens.access_token;
}

export async function POST(req: NextRequest) {
  const { orgId } = await req.json() as { orgId: string };
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const { data: integration, error } = await db
    .from("integrations")
    .select("*")
    .eq("org_id", orgId)
    .eq("provider", "sage")
    .single();

  if (error || !integration || integration.status === "disconnected") {
    return NextResponse.json({ error: "Sage not connected" }, { status: 400 });
  }

  await db.from("integrations").update({ status: "syncing" }).eq("id", integration.id);

  try {
    let accessToken: string = integration.access_token;
    const expiry = integration.token_expires_at ? new Date(integration.token_expires_at) : null;
    if (expiry && expiry < new Date()) {
      accessToken = await refreshSageToken(orgId, integration);
    }

    // Fetch outstanding sales invoices from Sage
    const res = await fetch(
      `${SAGE_API}/sales_invoices?status_id=UNPAID&items_per_page=200&page=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error(await res.text());
    const result = await res.json() as { $items: SageSalesInvoice[] };
    const sageInvoices = result.$items ?? [];

    let imported = 0;

    for (const si of sageInvoices) {
      if (si.void_reason) continue;

      const contactEmail = `${si.contact.id}@sage.local`;

      const { data: existingCustomer } = await db
        .from("customers")
        .select("id")
        .eq("org_id", orgId)
        .ilike("name", si.contact_name ?? si.contact.displayed_as)
        .single();

      let customerId: string;
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer } = await db.from("customers").insert({
          org_id: orgId,
          name: si.contact_name ?? si.contact.displayed_as ?? "Unknown",
          email: contactEmail,
          payment_terms: 30,
          segment: "standard",
        }).select("id").single();
        customerId = newCustomer?.id;
      }

      if (!customerId) continue;

      const dueDate  = new Date(si.due_date);
      const today    = new Date();
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / 86_400_000));
      const statusId = si.status?.id ?? "";
      const status =
        statusId === "PAID" ? "paid" :
        statusId === "VOID" ? "written_off" :
        daysOverdue > 0    ? "overdue" : "open";

      await db.from("invoices").upsert({
        org_id: orgId,
        customer_id: customerId,
        invoice_number: si.displayed_as ?? si.id,
        amount: si.outstanding_amount ?? si.total_amount,
        currency: si.currency?.symbol ?? "USD",
        issue_date: si.date,
        due_date: si.due_date,
        status,
        days_overdue: daysOverdue,
      }, { onConflict: "org_id,invoice_number" });

      imported++;
    }

    await db.from("integrations").update({
      status: "connected",
      last_sync_at: new Date().toISOString(),
      last_sync_count: imported,
      error_message: null,
    }).eq("id", integration.id);

    return NextResponse.json({ ok: true, imported });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Sync failed";
    await db.from("integrations").update({
      status: "error",
      error_message: msg,
    }).eq("id", integration.id);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
