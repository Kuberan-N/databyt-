import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

export async function POST(req: NextRequest) {
  try {
    const { invoiceId, orgId, subject, body, toEmail, toName } = await req.json();

    if (!invoiceId || !orgId || !subject || !body || !toEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "collections@databyt.io";

    const { data: sendData, error: sendError } = await resend.emails.send({
      from: `Collections <${fromEmail}>`,
      to: [toEmail],
      subject,
      text: body,
      html: `<pre style="font-family:sans-serif;white-space:pre-wrap;font-size:14px;line-height:1.6">${body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`,
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return NextResponse.json({ error: sendError.message }, { status: 500 });
    }

    // Update invoice status to "reminded"
    await db.from("invoices").update({ status: "reminded" }).eq("id", invoiceId).eq("org_id", orgId);

    // Log communication
    await db.from("communications").insert({
      org_id: orgId,
      invoice_id: invoiceId,
      type: "email",
      subject,
      content: body,
      status: "sent",
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, emailId: sendData?.id });
  } catch (err) {
    console.error("send-email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
