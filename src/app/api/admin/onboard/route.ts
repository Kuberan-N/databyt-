import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export interface OnboardRequest {
  orgName: string;
  planTier: "starter" | "growth" | "scale";
  mrr?: number;
  contractStart?: string;
  contractEnd?: string;
  clientEmail: string;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: OnboardRequest = await req.json();
  const { orgName, planTier, mrr, contractStart, contractEnd, clientEmail } = body;

  if (!orgName?.trim() || !clientEmail?.trim()) {
    return NextResponse.json({ error: "orgName and clientEmail are required" }, { status: 400 });
  }

  // 1. Create organization
  const { data: org, error: orgErr } = await db
    .from("organizations")
    .insert({
      name: orgName.trim(),
      plan_tier: planTier ?? "starter",
      mrr: mrr ?? null,
      contract_start: contractStart ?? null,
      contract_end: contractEnd ?? null,
      status: "onboarding",
    })
    .select("id, name")
    .single();

  if (orgErr) {
    return NextResponse.json({ error: `Failed to create org: ${orgErr.message}` }, { status: 500 });
  }

  // 2. Invite client via Supabase auth (triggers handle_new_user to create users row)
  const { error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    clientEmail.trim().toLowerCase(),
    {
      data: { org_id: org.id, role: "admin" },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard`,
    }
  );

  if (inviteErr) {
    // Org was created — log but don't roll back; operator can re-invite
    console.error("Invite error:", inviteErr.message);
    return NextResponse.json({
      orgId: org.id,
      orgName: org.name,
      inviteSent: false,
      inviteError: inviteErr.message,
    });
  }

  return NextResponse.json({ orgId: org.id, orgName: org.name, inviteSent: true });
}
