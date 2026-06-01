import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const agentUrl = process.env.SUPPORT_AGENT_URL;

  // Agent not deployed yet — return a graceful holding message
  if (!agentUrl) {
    return NextResponse.json({
      reply: "AI support is coming soon! For now, email us at support@databyt.in.",
    });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get the user's org so we can inject it — agent never asks for it
  const { data: orgUser } = await supabaseAdmin
    .from("users")
    .select("org_id")
    .eq("id", user.id)
    .single();

  const { data: org } = orgUser?.org_id
    ? await supabaseAdmin.from("organizations").select("id, name").eq("id", orgUser.org_id).single()
    : { data: null };

  const { message, sessionId } = await req.json() as { message: string; sessionId: string };
  if (!message?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  // Prepend org context — the agent never needs to ask "what company are you?"
  const contextualMessage = org
    ? `[Context: org_id="${org.id}", org_name="${org.name}". Use these for all data lookups — never ask the user for their org_id or company name.]\n\n${message}`
    : message;

  const agentRes = await fetch(`${agentUrl}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_name: "support_agent",
      user_id: user.id,
      session_id: sessionId ?? user.id,
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

  const events: Array<{ content?: { role?: string; parts?: Array<{ text?: string }> } }> = await agentRes.json();

  // Find the last model text response from the events array
  let reply = "I'm not sure how to help with that. Please contact support@databyt.in.";
  for (let i = events.length - 1; i >= 0; i--) {
    const content = events[i]?.content;
    if (content?.role === "model" && content?.parts?.[0]?.text) {
      reply = content.parts[0].text;
      break;
    }
  }

  return NextResponse.json({ reply });
}
