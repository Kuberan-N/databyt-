import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@databyt.in";

export async function POST(req: NextRequest) {
  try {
    const { title, description, category, userEmail, orgName } = await req.json();

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    // Notify kuberan
    await resend.emails.send({
      from: `DataByt <${FROM}>`,
      to: "kuberan@databyt.in",
      subject: `[Feature Request] ${title}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111111">
          <h2 style="margin-bottom:4px">New Feature Request</h2>
          <p style="color:#777;margin-top:0">Submitted via DataByt dashboard</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p><strong>From:</strong> ${orgName ?? "Unknown"} (${userEmail ?? "unknown"})</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Description:</strong></p>
          <p style="background:#f8f8f8;padding:14px;border-radius:8px;white-space:pre-wrap">${description}</p>
        </div>
      `,
    });

    // Auto-reply to user
    if (userEmail) {
      await resend.emails.send({
        from: `DataByt <${FROM}>`,
        to: userEmail,
        subject: "We got your feature request — DataByt",
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111111">
            <h2>Thanks for the suggestion!</h2>
            <p>We received your feature request: <strong>${title}</strong></p>
            <p>Our team will review it and email you within <strong>2 working days</strong>
            to let you know whether it's feasible and when you can expect it.</p>
            <p style="color:#777;font-size:13px">— Kuberan & the DataByt team</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("feature-request:", err);
    return NextResponse.json({ error: "Failed to send request" }, { status: 500 });
  }
}
