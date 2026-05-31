import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const { data } = await db
    .from("integrations")
    .select("status, last_sync_at, last_sync_count, error_message")
    .eq("org_id", orgId)
    .eq("provider", "xero")
    .single();

  return NextResponse.json({ integration: data ?? null });
}

export async function POST(req: NextRequest) {
  let body: { orgId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "orgId required" }, { status: 400 }); }
  const { orgId } = body;
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const clientId   = process.env.XERO_CLIENT_ID;
  const host    = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "www.databyt.in";
  const proto   = req.headers.get("x-forwarded-proto") ?? "https";
  const redirectUri = `${proto}://${host}/api/integrations/xero/callback`;

  if (!clientId) {
    return NextResponse.json({ error: "Xero credentials not configured" }, { status: 503 });
  }

  const state = Buffer.from(JSON.stringify({ orgId, ts: Date.now() })).toString("base64url");

  const authUrl =
    `https://login.xero.com/identity/connect/authorize` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("offline_access accounting.transactions accounting.contacts.read")}` +
    `&state=${state}`;

  return NextResponse.json({ url: authUrl });
}

export async function DELETE(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  await db
    .from("integrations")
    .update({ status: "disconnected", access_token: null, refresh_token: null })
    .eq("org_id", orgId)
    .eq("provider", "xero");

  return NextResponse.json({ ok: true });
}
