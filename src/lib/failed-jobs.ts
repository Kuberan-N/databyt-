import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export interface FailedJobPayload {
  orgId?: string;
  jobType: string;
  payload?: Record<string, unknown>;
  error: string;
  attempts?: number;
}

export async function logFailedJob(job: FailedJobPayload): Promise<void> {
  try {
    await db.from("failed_jobs").insert({
      org_id: job.orgId ?? null,
      job_type: job.jobType,
      payload: job.payload ?? null,
      error: job.error,
      attempts: job.attempts ?? 1,
    });
  } catch (err) {
    // Logging must never throw — write to console as fallback
    console.error("logFailedJob: could not write to failed_jobs table:", (err as Error).message, job);
  }
}
