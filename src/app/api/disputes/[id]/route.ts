import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { DisputeStatus } from "@/types/database";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json() as {
    status?: DisputeStatus;
    resolution_notes?: string;
    assigned_to?: string;
  };

  const update: Record<string, unknown> = {};
  if (body.status) update.status = body.status;
  if (body.resolution_notes !== undefined) update.resolution_notes = body.resolution_notes;
  if (body.assigned_to !== undefined) update.assigned_to = body.assigned_to;

  if (body.status === "resolved" || body.status === "rejected") {
    update.resolved_at = new Date().toISOString();
  }

  const { data: dispute, error } = await db
    .from("disputes")
    .update(update)
    .eq("id", id)
    .select("invoice_id, status")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If resolved/rejected, revert invoice status to overdue so collections can resume
  if (dispute && (body.status === "resolved" || body.status === "rejected")) {
    await db
      .from("invoices")
      .update({ status: "overdue" })
      .eq("id", dispute.invoice_id)
      .eq("status", "disputed");
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await db.from("disputes").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
