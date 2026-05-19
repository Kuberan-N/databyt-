import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

function decodeToken(token: string): { orgId: string; customerId: string; email: string } | null {
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString());
  } catch {
    return null;
  }
}

export function generateUnsubToken(orgId: string, customerId: string, email: string): string {
  return Buffer.from(JSON.stringify({ orgId, customerId, email })).toString("base64url");
}

export async function GET(req: NextRequest) {
  const token   = req.nextUrl.searchParams.get("token");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!token) return NextResponse.redirect(`${baseUrl}/unsubscribe?error=missing_token`);

  const decoded = decodeToken(token);
  if (!decoded) return NextResponse.redirect(`${baseUrl}/unsubscribe?error=invalid_token`);

  const { orgId, customerId, email } = decoded;

  // Check not already opted out
  const { data: existing } = await db
    .from("communications")
    .select("id")
    .eq("org_id", orgId)
    .eq("customer_id", customerId)
    .eq("type", "note")
    .eq("content", "UNSUBSCRIBED")
    .single();

  if (!existing) {
    await db.from("communications").insert({
      org_id: orgId,
      customer_id: customerId,
      type: "note",
      subject: "Unsubscribed",
      content: "UNSUBSCRIBED",
      status: "sent",
      sent_at: new Date().toISOString(),
      direction: "inbound",
      sent_by_ai: false,
    });
  }

  return NextResponse.redirect(`${baseUrl}/unsubscribe?success=1&email=${encodeURIComponent(email)}`);
}
