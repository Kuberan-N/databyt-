import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    created_at?: string;
    from?: string;
    to?: string[];
    subject?: string;
  };
}

const STATUS_MAP: Record<string, string> = {
  "email.sent":      "sent",
  "email.delivered": "sent",
  "email.opened":    "opened",
  "email.clicked":   "clicked",
  "email.bounced":   "bounced",
  "email.complained":"bounced",
};

export async function POST(req: NextRequest) {
  let payload: ResendWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, data } = payload;
  const emailId = data?.email_id;

  if (!emailId) return NextResponse.json({ ok: true }); // ignore unknown shapes

  const newStatus = STATUS_MAP[type];
  if (!newStatus) return NextResponse.json({ ok: true }); // event type we don't care about

  const now = new Date().toISOString();
  const updates: Record<string, string> = { status: newStatus };
  if (type === "email.opened")  updates.opened_at  = now;
  if (type === "email.clicked") updates.clicked_at = now;

  const { error } = await db
    .from("communications")
    .update(updates)
    .eq("resend_message_id", emailId);

  if (error) {
    console.error("Resend webhook update error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
