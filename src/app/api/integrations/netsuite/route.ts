import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

// GET /api/integrations/netsuite?orgId=... — status
export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const { data } = await db
    .from("integrations")
    .select("status, last_sync_at, last_sync_count, error_message")
    .eq("org_id", orgId)
    .eq("provider", "netsuite")
    .single();

  return NextResponse.json({ integration: data ?? null });
}

// POST /api/integrations/netsuite — initiate OAuth
export async function POST(req: NextRequest) {
  let _b: {orgId?:string}; try{_b=await req.json()}catch{return NextResponse.json({error:"orgId required"},{status:400})} const {orgId}=_b;
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const clientId     = process.env.NETSUITE_CLIENT_ID;
  const accountId    = process.env.NETSUITE_ACCOUNT_ID;
  const redirectUri  = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/netsuite/callback`;

  if (!clientId || !accountId) {
    return NextResponse.json({ error: "NetSuite credentials not configured" }, { status: 503 });
  }

  const state = Buffer.from(JSON.stringify({ orgId, ts: Date.now() })).toString("base64url");

  const authUrl =
    `https://${accountId}.app.netsuite.com/app/login/oauth2/authorize.nl` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=restlets%20rest_webservices` +
    `&state=${state}`;

  return NextResponse.json({ url: authUrl });
}

// DELETE /api/integrations/netsuite?orgId=... — disconnect
export async function DELETE(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  await db
    .from("integrations")
    .update({ status: "disconnected", access_token: null, refresh_token: null })
    .eq("org_id", orgId)
    .eq("provider", "netsuite");

  return NextResponse.json({ ok: true });
}
