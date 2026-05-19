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
    return NextResponse.redirect(`${baseUrl}/dashboard/integrations?error=sage_denied`);
  }

  let orgId: string;
  try {
    ({ orgId } = JSON.parse(Buffer.from(state, "base64url").toString()));
  } catch {
    return NextResponse.redirect(`${baseUrl}/dashboard/integrations?error=sage_state`);
  }

  const clientId     = process.env.SAGE_CLIENT_ID!;
  const clientSecret = process.env.SAGE_CLIENT_SECRET!;
  const redirectUri  = `${baseUrl}/api/integrations/sage/callback`;

  try {
    const tokenRes = await fetch("https://oauth.accounting.sage.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenRes.ok) throw new Error(await tokenRes.text());

    const tokens = await tokenRes.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    await db.from("integrations").upsert({
      org_id: orgId,
      provider: "sage",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: expiresAt,
      status: "connected",
      error_message: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "org_id,provider" });

    return NextResponse.redirect(`${baseUrl}/dashboard/integrations?connected=sage`);
  } catch (err) {
    console.error("Sage OAuth error:", err);
    return NextResponse.redirect(`${baseUrl}/dashboard/integrations?error=sage_token`);
  }
}
