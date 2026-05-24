import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

interface QBInvoice {
  Id: string;
  DocNumber: string;
  TxnDate: string;
  DueDate: string;
  TotalAmt: number;
  Balance: number;
  CustomerRef: { value: string; name: string };
  BillEmail?: { Address: string };
  CurrencyRef?: { value: string };
}

async function refreshQBToken(orgId: string, integration: Record<string, string>) {
  const clientId     = process.env.QUICKBOOKS_CLIENT_ID!;
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!;

  const res = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: integration.refresh_token,
    }),
  });

  if (!res.ok) throw new Error("QuickBooks token refresh failed");

  const tokens = await res.json() as { access_token: string; refresh_token: string; expires_in: number };
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await db.from("integrations").update({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }).eq("org_id", orgId).eq("provider", "quickbooks");

  return tokens.access_token;
}

export async function POST(req: NextRequest) {
  const { orgId } = await req.json() as { orgId: string };
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const { data: integration, error } = await db
    .from("integrations")
    .select("*")
    .eq("org_id", orgId)
    .eq("provider", "quickbooks")
    .single();

  if (error || !integration || integration.status === "disconnected") {
    return NextResponse.json({ error: "QuickBooks not connected" }, { status: 400 });
  }

  await db.from("integrations").update({ status: "syncing" }).eq("id", integration.id);

  try {
    let accessToken: string = integration.access_token;
    const expiry = integration.token_expires_at ? new Date(integration.token_expires_at) : null;
    if (expiry && expiry < new Date()) {
      accessToken = await refreshQBToken(orgId, integration);
    }

    const realmId = integration.realm_id;
    const isSandbox = process.env.QUICKBOOKS_SANDBOX === "true";
    const apiBase = isSandbox
      ? `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}`
      : `https://quickbooks.api.intuit.com/v3/company/${realmId}`;

    // Fetch unpaid invoices (Balance > 0)
    const query = `SELECT * FROM Invoice WHERE Balance > '0' MAXRESULTS 500`;
    const qbRes = await fetch(
      `${apiBase}/query?query=${encodeURIComponent(query)}&minorversion=65`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    if (!qbRes.ok) throw new Error(await qbRes.text());

    const result = await qbRes.json() as {
      QueryResponse?: { Invoice?: QBInvoice[] };
    };
    const qbInvoices = result.QueryResponse?.Invoice ?? [];

    // Fetch customer emails in bulk (one request per unique customer)
    const customerIdSet = new Set(qbInvoices.map((i) => i.CustomerRef.value));
    const customerEmailMap = new Map<string, string>();

    for (const customerId of customerIdSet) {
      try {
        const custRes = await fetch(
          `${apiBase}/customer/${customerId}?minorversion=65`,
          { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } }
        );
        if (custRes.ok) {
          const custData = await custRes.json() as { Customer?: { PrimaryEmailAddr?: { Address: string } } };
          const email = custData.Customer?.PrimaryEmailAddr?.Address;
          if (email) customerEmailMap.set(customerId, email);
        }
      } catch { /* non-fatal — email may be missing */ }
    }

    let imported = 0;

    for (const inv of qbInvoices) {
      const customerEmail =
        inv.BillEmail?.Address ??
        customerEmailMap.get(inv.CustomerRef.value) ??
        `${inv.CustomerRef.value}@quickbooks.local`;

      const { data: existingCustomer } = await db
        .from("customers")
        .select("id")
        .eq("org_id", orgId)
        .eq("email", customerEmail)
        .single();

      let customerId: string;
      if (existingCustomer) {
        customerId = existingCustomer.id;
        // Update name if it changed
        await db.from("customers").update({ name: inv.CustomerRef.name }).eq("id", customerId);
      } else {
        const { data: newCustomer } = await db.from("customers").insert({
          org_id: orgId,
          name: inv.CustomerRef.name ?? "Unknown",
          email: customerEmail,
          payment_terms: 30,
          segment: "standard",
        }).select("id").single();
        customerId = newCustomer?.id;
      }

      if (!customerId) continue;

      const dueDate = new Date(inv.DueDate);
      const today   = new Date();
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / 86_400_000));
      const status = inv.Balance === 0 ? "paid" : daysOverdue > 0 ? "overdue" : "open";

      await db.from("invoices").upsert({
        org_id: orgId,
        customer_id: customerId,
        invoice_number: inv.DocNumber ?? inv.Id,
        amount: inv.Balance,
        currency: inv.CurrencyRef?.value ?? "USD",
        issue_date: inv.TxnDate,
        due_date: inv.DueDate,
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
