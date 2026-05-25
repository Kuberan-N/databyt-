import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { DisputeReason } from "@/types/database";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

  const { data, error } = await db
    .from("disputes")
    .select(`
      *,
      invoices(invoice_number, amount),
      customers(name)
    `)
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") return NextResponse.json({ disputes: [] });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const disputes = (data ?? []).map((d: {
    id: string; org_id: string; invoice_id: string; customer_id: string;
    reason: string; description: string; status: string; resolution_notes: string | null;
    assigned_to: string | null; created_at: string; resolved_at: string | null;
    invoices?: { invoice_number: string; amount: number };
    customers?: { name: string };
  }) => ({
    ...d,
    invoice_number: d.invoices?.invoice_number,
    invoice_amount: d.invoices?.amount,
    customer_name: d.customers?.name,
  }));

  return NextResponse.json({ disputes });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    orgId: string;
    invoiceId: string;
    customerId: string;
    reason: DisputeReason;
    description: string;
  };

  const { orgId, invoiceId, customerId, reason, description } = body;
  if (!orgId || !invoiceId || !customerId || !reason) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Create the dispute
  const { data: dispute, error } = await db.from("disputes").insert({
    org_id: orgId,
    invoice_id: invoiceId,
    customer_id: customerId,
    reason,
    description: description?.trim() || "",
    status: "open",
  }).select().single();

  if (error) {
    if (error.code === "42P01") {
      return NextResponse.json({ error: "Disputes feature requires database setup. Please run the migration SQL in Supabase." }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mark invoice as disputed — pause collections on it
  await db.from("invoices").update({ status: "disputed" }).eq("id", invoiceId);

  return NextResponse.json({ dispute }, { status: 201 });
}
