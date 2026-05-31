import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

interface NetSuiteInvoice {
  id: string;
  tranid: string;
  entity_name: string;
  entity_email: string;
  trandate: string;
  duedate: string;
  amount: number;
  amountremaining: number;
  currency_symbol: string;
  status: string;
}

async function refreshNetsuiteToken(orgId: string, integration: Record<string, string>) {
  const accountId    = integration.realm_id;
  const clientId     = process.env.NETSUITE_CLIENT_ID!;
  const clientSecret = process.env.NETSUITE_CLIENT_SECRET!;

  const res = await fetch(
    `https://${accountId}.suiteanalytics.com/services/rest/auth/oauth2/v1/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: integration.refresh_token }),
    }
  );
  if (!res.ok) throw new Error("Token refresh failed");
  const tokens = await res.json() as { access_token: string; expires_in: number };
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await db.from("integrations").update({
    access_token: tokens.access_token,
    token_expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }).eq("org_id", orgId).eq("provider", "netsuite");

  return tokens.access_token;
}

export async function POST(req: NextRequest) {
  let _b: {orgId?:string}; try{_b=await req.json()}catch{return NextResponse.json({error:"orgId required"},{status:400})} const {orgId}=_b;
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const { data: integration, error } = await db
    .from("integrations")
    .select("*")
    .eq("org_id", orgId)
    .eq("provider", "netsuite")
    .single();

  if (error || !integration || integration.status === "disconnected") {
    return NextResponse.json({ error: "NetSuite not connected" }, { status: 400 });
  }

  await db.from("integrations").update({ status: "syncing" }).eq("id", integration.id);

  try {
    let accessToken: string = integration.access_token;
    const expiry = integration.token_expires_at ? new Date(integration.token_expires_at) : null;
    if (expiry && expiry < new Date()) {
      accessToken = await refreshNetsuiteToken(orgId, integration);
    }

    const accountId = integration.realm_id;
    const query = `
      SELECT
        t.id, t.tranid, e.entityid AS entity_name, e.email AS entity_email,
        t.trandate, t.duedate, t.amount, t.amountremaining,
        c.symbol AS currency_symbol, t.status
      FROM Transaction t
      JOIN Entity e ON t.entity = e.id
      LEFT JOIN Currency c ON t.currency = c.id
      WHERE t.type = 'CustInvc'
        AND t.status IN ('CustInvc:A', 'CustInvc:B')
      ORDER BY t.trandate DESC
      FETCH FIRST 500 ROWS ONLY
    `;

    const suiteqlRes = await fetch(
      `https://${accountId}.suiteanalytics.com/services/rest/query/v1/suiteql?limit=500`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "transient",
        },
        body: JSON.stringify({ q: query }),
      }
    );

    if (!suiteqlRes.ok) throw new Error(await suiteqlRes.text());
    const result = await suiteqlRes.json() as { items: NetSuiteInvoice[] };
    const nsInvoices = result.items ?? [];

    let imported = 0;

    for (const ns of nsInvoices) {
      // Upsert customer
      const { data: existingCustomer } = await db
        .from("customers")
        .select("id")
        .eq("org_id", orgId)
        .eq("email", ns.entity_email ?? `${ns.entity_name}@netsuite.local`)
        .single();

      let customerId: string;
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer } = await db.from("customers").insert({
          org_id: orgId,
          name: ns.entity_name ?? "Unknown",
          email: ns.entity_email || null,
          payment_terms: 30,
          segment: "standard",
        }).select("id").single();
        customerId = newCustomer?.id;
      }

      if (!customerId) continue;

      const dueDate  = new Date(ns.duedate);
      const today    = new Date();
      const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / 86_400_000));
      const status = ns.status === "CustInvc:B" ? "paid" : daysOverdue > 0 ? "overdue" : "open";

      // Upsert invoice
      await db.from("invoices").upsert({
        org_id: orgId,
        customer_id: customerId,
        invoice_number: ns.tranid ?? ns.id,
        amount: ns.amountremaining ?? ns.amount,
        currency: ns.currency_symbol ?? "USD",
        issue_date: ns.trandate,
        due_date: ns.duedate,
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
