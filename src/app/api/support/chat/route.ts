import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const agentUrl = process.env.SUPPORT_AGENT_URL;

  if (!agentUrl) {
    return NextResponse.json({
      reply: "AI support is coming soon! For now, email us at support@databyt.in.",
    });
  }

  // org context comes directly from the client (already in auth session — no server DNS call needed)
  const { message, sessionId, orgId, orgName, userId } =
    await req.json() as { message: string; sessionId: string; orgId: string; orgName: string; userId: string };

  if (!message?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contextualMessage = orgId && orgName
    ? `[Context: org_id="${orgId}", org_name="${orgName}". Use these for all data lookups — never ask the user for their org_id or company name.]\n\n${message}`
    : message;

  const sid = sessionId ?? userId;

  // Create session first (idempotent)
  await fetch(`${agentUrl}/apps/support_agent/users/${userId}/sessions/${sid}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  const agentRes = await fetch(`${agentUrl}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_name: "support_agent",
      user_id: userId,
      session_id: sid,
      new_message: {
        role: "user",
        parts: [{ text: contextualMessage }],
      },
    }),
  });

  if (!agentRes.ok) {
    console.error("Agent error:", agentRes.status, await agentRes.text());
    return NextResponse.json({ reply: "Sorry, the support agent is unavailable right now." });
  }

  type Event = { content?: { role?: string; parts?: Array<{ text?: string }> } };
  const raw: Event | Event[] = await agentRes.json();
  const events: Event[] = Array.isArray(raw) ? raw : [raw];

  let reply = "I'm not sure how to help with that. Please contact support@databyt.in.";
  for (let i = events.length - 1; i >= 0; i--) {
    const text = events[i]?.content?.parts?.[0]?.text;
    if (text) { reply = text; break; }
  }

  return NextResponse.json({ reply });
}
