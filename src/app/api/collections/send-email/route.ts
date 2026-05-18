import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { withRetry } from "@/lib/retry";
import { logFailedJob } from "@/lib/failed-jobs";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function POST(req: NextRequest) {
  let payload: {
    invoiceId: string; orgId: string; subject: string; body: string;
    toEmail: string; toName: string; approvedBy?: string; sentByAi?: boolean;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { invoiceId, orgId, subject, body, toEmail, toName, approvedBy, sentByAi } = payload;

  if (!invoiceId || !orgId || !subject || !body || !toEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "collections@databyt.io";
  const inboundDomain = process.env.RESEND_INBOUND_DOMAIN;
  const replyTo = inboundDomain ? `reply+${invoiceId}@${inboundDomain}` : undefined;

  let sendData: { id?: string } | null = null;
  try {
    const result = await withRetry(() =>
      resend.emails.send({
        from: `Collections <${fromEmail}>`,
        to: [toEmail],
        subject,
        replyTo,
        text: body,
        html: `<pre style="font-family:sans-serif;white-space:pre-wrap;font-size:14px;line-height:1.6">${body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`,
      })
    );
    if (result.error) throw new Error(result.error.message);
    sendData = result.data;
  } catch (err) {
    const msg = (err as Error).message;
    console.error("send-email: Resend failed after retries:", msg);
    await logFailedJob({ orgId, jobType: "send_email", payload: { invoiceId, toEmail, subject }, error: msg });
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  // Update invoice status + log communication (non-critical path — don't retry)
  try {
    await db.from("invoices").update({ status: "reminded" }).eq("id", invoiceId).eq("org_id", orgId);

    await db.from("communications").insert({
      org_id: orgId,
      invoice_id: invoiceId,
      type: "email",
      subject,
      content: body,
      status: "sent",
      sent_at: new Date().toISOString(),
      direction: "outbound",
      sent_by_ai: sentByAi ?? true,
      approved_by: approvedBy ?? null,
      resend_message_id: sendData?.id ?? null,
    });
  } catch (err) {
    // Email was already sent — log DB failure but return success
    console.error("send-email: post-send DB update failed:", (err as Error).message);
    await logFailedJob({ orgId, jobType: "send_email_db", payload: { invoiceId, resendId: sendData?.id }, error: (err as Error).message });
  }

  return NextResponse.json({ success: true, emailId: sendData?.id });
}
