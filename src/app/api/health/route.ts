import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function GET() {
  const checks = { database: false, gemini: !!process.env.GEMINI_API_KEY, resend: !!process.env.RESEND_API_KEY };
  let dbLatencyMs = 0;

  try {
    const start = Date.now();
    await db.from("organizations").select("id").limit(1);
    dbLatencyMs = Date.now() - start;
    checks.database = true;
  } catch {
    checks.database = false;
  }

  const healthy = checks.database;
  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks, dbLatencyMs, timestamp: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  );
}
