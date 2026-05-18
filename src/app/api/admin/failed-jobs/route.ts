import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const countOnly = searchParams.get("count") === "true";
  const orgId = searchParams.get("orgId");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);

  if (countOnly) {
    let q = db.from("failed_jobs").select("id", { count: "exact", head: true });
    if (orgId) q = q.eq("org_id", orgId);
    const { count } = await q;
    return NextResponse.json({ count: count ?? 0 });
  }

  let query = db
    .from("failed_jobs")
    .select("id, org_id, job_type, payload, error, attempts, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (orgId) query = query.eq("org_id", orgId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ jobs: data ?? [], total: data?.length ?? 0 });
}

// Allow deleting a specific failed job (once resolved)
export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await db.from("failed_jobs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
