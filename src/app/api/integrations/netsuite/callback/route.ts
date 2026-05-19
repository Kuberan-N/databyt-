import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function GET(req: NextRequest) {
  const code  = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/dashboard/integrations?error=netsuite_denied`);
  }

  let orgId: string;
  try {
    ({ orgId } = JSON.parse(Buffer.from(state, "base64url").toString()));
  } catch {
    return NextResponse.redirect(`${baseUrl}/dashboard/integrations?error=netsuite_state`);
  }

  const clientId     = process.env.NETSUITE_CLIENT_ID!;
  const clientSecret = process.env.NETSUITE_CLIENT_SECRET!;
  const accountId    = process.env.NETSUITE_ACCOUNT_ID!;
  const redirectUri  = `${baseUrl}/api/integrations/netsuite/callback`;

  try {
    const tokenRes = await fetch(
      `https://${accountId}.suiteanalytics.com/services/rest/auth/oauth2/v1/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
      }
    );

    if (!tokenRes.ok) throw new Error(await tokenRes.text());

    const tokens = await tokenRes.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    await db.from("integrations").upsert({
      org_id: orgId,
      provider: "netsuite",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      realm_id: accountId,
      token_expires_at: expiresAt,
      status: "connected",
      error_message: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "org_id,provider" });

    return NextResponse.redirect(`${baseUrl}/dashboard/integrations?connected=netsuite`);
  } catch (err) {
    console.error("NetSuite OAuth error:", err);
    return NextResponse.redirect(`${baseUrl}/dashboard/integrations?error=netsuite_token`);
  }
}
