import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

const XERO_API = "https://api.xero.com/api.xro/2.0";

interface XeroInvoice {
  InvoiceID: string;
  InvoiceNumber: string;
  Type: string;
  Status: string;
  Contact: {
    ContactID: string;
    Name: string;
    EmailAddress?: string;
  };
  DateString: string;
  DueDateString: string;
  Total: number;
  AmountDue: number;
  CurrencyCode: string;
}

async function refreshXeroToken(orgId: string, integration: Record<string, string>) {
  const clientId     = process.env.XERO_CLIENT_ID!;
  const clientSecret = process.env.XERO_CLIENT_SECRET!;

  const res = await fetch("https://identity.xero.com/connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: integration.refresh_token,
    }),
  });

  if (!res.ok) throw new Error("Xero token refresh failed");

  const tokens = await res.json() as { access_token: string; refresh_token: string; expires_in: number };
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await db.from("integrations").update({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }).eq("org_id", orgId).eq("provider", "xero");

  return tokens.access_token;
}

export async function POST(req: NextRequest) {
  let _b: {orgId?:string}; try{_b=await req.json()}catch{return NextResponse.json({error:"orgId required"},{status:400})} const {orgId}=_b;
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const { data: integration, error } = await db
    .from("integrations")
    .select("*")
    .eq("org_id", orgId)
    .eq("provider", "xero")
    .single();

  if (error || !integration || integration.status === "disconnected") {
    return NextResponse.json({ error: "Xero not connected" }, { status: 400 });
  }

  await db.from("integrations").update({ status: "syncing" }).eq("id", integration.id);

  try {
    let accessToken: string = integration.access_token;
    const expiry = integration.token_expires_at ? new Date(integration.token_expires_at) : null;
    if (expiry && expiry < new Date()) {
      accessToken = await refreshXeroToken(orgId, integration);
    }

    const tenantId = integration.realm_id;

    // Fetch authorised AR invoices with balance remaining
    const xeroRes = await fetch(
      `${XERO_API}/Invoices?where=Type%3D%3D"ACCREC"%26%26Status%3D%3D"AUTHORISED"&order=DueDateUTC ASC`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Xero-Tenant-Id": tenantId,
          Accept: "application/json",
        },
      }
    );

    if (!xeroRes.ok) throw new Error(await xeroRes.text());

    const result = await xeroRes.json() as { Invoices?: XeroInvoice[] };
    const xeroInvoices = (result.Invoices ?? []).filter((i) => i.AmountDue > 0);

    let imported = 0;

    for (const xi of xeroInvoices) {
      const customerEmail =
        xi.Contact.EmailAddress ||
        `${xi.Contact.ContactID}@xero.local`;

      const { data: existingCustomer } = await db
        .from("customers")
        .select("id")
        .eq("org_id", orgId)
        .eq("email", customerEmail)
        .single();

      let customerId: string;
      if (existingCustomer) {
        customerId = existingCustomer.id;
        await db.from("customers").update({ name: xi.Contact.Name }).eq("id", customerId);
      } else {
        const { data: newCustomer } = await db.from("customers").insert({
          org_id: orgId,
          name: xi.Contact.Name ?? "Unknown",
          email: customerEmail,
          payment_terms: 30,
          segment: "standard",
        }).select("id").single();
        customerId = newCustomer?.id;
      }

      if (!customerId) continue;

      const dueDate = new Date(xi.DueDateString);
      const today   = new Date();
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / 86_400_000));
      const status = xi.Status === "PAID" ? "paid" : daysOverdue > 0 ? "overdue" : "open";

      await db.from("invoices").upsert({
        org_id: orgId,
        customer_id: customerId,
        invoice_number: xi.InvoiceNumber ?? xi.InvoiceID,
        amount: xi.AmountDue,
        currency: xi.CurrencyCode ?? "USD",
        issue_date: xi.DateString,
        due_date: xi.DueDateString,
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
