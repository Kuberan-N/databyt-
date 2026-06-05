"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, Sparkles, Minus, X, AlertTriangle, Lightbulb, ChevronUp, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

type ChatState = "closed" | "open" | "minimized";
type Drawer = "none" | "escalate" | "feature";
type Feedback = "up" | "down" | null;

interface Message {
  role: "user" | "agent";
  text: string;
  feedback?: Feedback;
}

const WELCOME: Message = {
  role: "agent",
  text: "Hi! I'm DataByt's AI Assistant. I can answer questions about your AR data and take real actions — like sending reminders or filing disputes.",
};

const QUICK_CHIPS = [
  "Who owes me the most?",
  "How many overdue invoices?",
  "My total AR outstanding",
  "Send reminder to a customer",
  "File a dispute",
  "Show invoices for a customer",
  "When did we last email a customer?",
  "How do I connect QuickBooks?",
];

const ESCALATE_REASONS = ["Billing issue", "Wrong data shown", "Technical bug", "Account access problem", "Other"];

const CHAT_KEY = "databyt_chat_v2";

// ── Markdown renderer ──────────────────────────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-[#0F172A]">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="bg-black/8 rounded px-1 font-mono text-[11px]">{part.slice(1, -1)}</code>;
    return part;
  });
}

function AgentMessage({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="space-y-2">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter(l => l.trim());
        if (!lines.length) return null;
        const isList = lines.length > 0 && lines.every(l => /^[\*\-•]\s/.test(l.trim()));
        const isHeading = lines.length === 1 && /^#{1,3}\s/.test(lines[0]);
        if (isHeading) return (
          <p key={bi} className="font-semibold text-[#0F172A] text-[11px] uppercase tracking-wide mt-1">
            {renderInline(lines[0].replace(/^#{1,3}\s/, ""))}
          </p>
        );
        if (isList) return (
          <ul key={bi} className="space-y-1.5">
            {lines.map((line, li) => (
              <li key={li} className="flex gap-2 leading-snug">
                <span className="text-[#4F46E5] shrink-0 mt-0.5">•</span>
                <span>{renderInline(line.replace(/^[\*\-•]\s+/, ""))}</span>
              </li>
            ))}
          </ul>
        );
        return (
          <p key={bi} className="leading-relaxed">
            {lines.map((line, li) => (
              <span key={li}>{renderInline(line)}{li < lines.length - 1 && <br />}</span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start gap-2">
      <div className="w-6 h-6 rounded-full bg-[#111] flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-3 h-3 text-white" />
      </div>
      <div className="bg-[#F1F5F9] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map(i => (
          <motion.span key={i} className="w-2 h-2 rounded-full bg-[#111]/25 block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />
        ))}
      </div>
    </div>
  );
}

export default function SupportChat() {
  const { user, organization, orgUser } = useAuth();

  const [sessionId] = useState<string>(() => {
    if (typeof window === "undefined") return `chat-${Date.now()}`;
    try {
      return JSON.parse(localStorage.getItem(CHAT_KEY) ?? "{}").sessionId ?? `chat-${Date.now()}`;
    } catch { return `chat-${Date.now()}`; }
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [WELCOME];
    try {
      const saved = JSON.parse(localStorage.getItem(CHAT_KEY) ?? "{}");
      return Array.isArray(saved.messages) && saved.messages.length > 1 ? saved.messages : [WELCOME];
    } catch { return [WELCOME]; }
  });

  const [state, setState] = useState<ChatState>("closed");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [drawer, setDrawer] = useState<Drawer>("none");
  const [featureText, setFeatureText] = useState("");
  const [alertBadge, setAlertBadge] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const featureRef = useRef<HTMLTextAreaElement>(null);

  const isOpen = state === "open";
  const isMinimized = state === "minimized";

  // Persist to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify({ sessionId, messages: messages.slice(-60) }));
    } catch {}
  }, [messages, sessionId]);

  // Check for critical AR alerts (90+ days overdue)
  useEffect(() => {
    if (!orgUser?.org_id) return;
    (supabase as unknown as { from: (t: string) => { select: (c: string, o: object) => { eq: (...a: unknown[]) => { gt: (...a: unknown[]) => { limit: (n: number) => Promise<{ data: unknown[] | null }> } } } } })
      .from("invoices")
      .select("id", { count: "exact" })
      .eq("org_id", orgUser.org_id)
      .gt("days_overdue", 89)
      .limit(1)
      .then(({ data }) => { if (data && data.length > 0) setAlertBadge(true); })
      .catch(() => {});
  }, [orgUser?.org_id]);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    if (drawer === "feature") setTimeout(() => featureRef.current?.focus(), 100);
  }, [drawer]);

  const send = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setDrawer("none");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text, sessionId,
          userId: user?.id,
          orgId: orgUser?.org_id,
          orgName: organization?.name,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "agent", text: data.reply ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages(prev => [...prev, { role: "agent", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, user?.id, orgUser?.org_id, organization?.name]);

  function copyMessage(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  function setFeedback(idx: number, fb: Feedback) {
    setMessages(prev => prev.map((m, i) => i === idx ? { ...m, feedback: m.feedback === fb ? null : fb } : m));
  }

  function toggleDrawer(d: Drawer) {
    setDrawer(prev => prev === d ? "none" : d);
  }

  function escalate(reason: string) {
    send(`I need to escalate an issue: ${reason}. Please connect me with the team.`);
  }

  function submitFeature() {
    if (!featureText.trim()) return;
    send(`Feature request: ${featureText.trim()}`);
    setFeatureText("");
  }

  if (!user) return null;

  const unreadAgentCount = messages.filter(m => m.role === "agent").length - 1;

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setState(s => s === "open" ? "minimized" : "open")}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-2xl"
        aria-label="AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={isOpen ? "minus" : "spark"}
            initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
            {isOpen ? <Minus className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </motion.div>
        </AnimatePresence>
        {/* Alert badge */}
        {alertBadge && !isOpen && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        )}
      </motion.button>

      {/* Minimized bar */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 bg-[#111111] text-white rounded-2xl shadow-xl flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-black transition-colors"
            style={{ width: 280 }}
            onClick={() => setState("open")}
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">DataByt AI Assistant</p>
              <p className="text-[10px] text-white/50 truncate">
                {messages.length > 1 ? `${messages.length - 1} message${messages.length > 2 ? "s" : ""}` : "Click to open"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadAgentCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {unreadAgentCount}
                </span>
              )}
              <ChevronUp className="w-4 h-4 text-white/50 shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-[#E2E8F0] bg-white"
            style={{ width: 400, height: 580 }}
          >
            {/* Header */}
            <div className="px-5 py-3.5 bg-[#111111] text-white flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">DataByt AI Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"
                    animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  <span className="text-[10px] text-white/50">Online · Ask or act</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button onClick={() => setState("minimized")}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white" title="Minimize">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setState("closed")}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white" title="Close">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>

                  <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start gap-2"} w-full`}>
                    {m.role === "agent" && (
                      <div className="w-6 h-6 rounded-full bg-[#111] flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`group relative max-w-[82%] text-xs rounded-2xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-[#111111] text-white rounded-br-sm leading-relaxed"
                        : "bg-[#F8F9FC] text-[#0F172A] rounded-bl-sm border border-[#E8ECF0]"
                    }`}>
                      {m.role === "agent" ? <AgentMessage text={m.text} /> : m.text}

                      {/* Copy button — agent messages only */}
                      {m.role === "agent" && (
                        <button
                          onClick={() => copyMessage(m.text, i)}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#666] hover:text-[#111]">
                          {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thumbs feedback — agent messages only, not welcome */}
                  {m.role === "agent" && i > 0 && (
                    <div className="flex gap-1 mt-1 ml-8">
                      <button onClick={() => setFeedback(i, "up")}
                        className={`p-1 rounded transition-colors ${m.feedback === "up" ? "text-emerald-500" : "text-[#CCC] hover:text-[#666]"}`}>
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => setFeedback(i, "down")}
                        className={`p-1 rounded transition-colors ${m.feedback === "down" ? "text-red-400" : "text-[#CCC] hover:text-[#666]"}`}>
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Quick chips */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {QUICK_CHIPS.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-[11px] px-3 py-1.5 rounded-full border border-[#E2E8F0] text-[#444] hover:border-[#111] hover:text-[#111] hover:bg-[#F8F9FC] transition-colors bg-white">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Escalate drawer */}
            <AnimatePresence>
              {drawer === "escalate" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="border-t border-[#E2E8F0] bg-[#FFF8F0] px-4 py-3 overflow-hidden shrink-0">
                  <p className="text-[11px] font-semibold text-[#92400E] mb-2">What type of issue?</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ESCALATE_REASONS.map(r => (
                      <button key={r} onClick={() => escalate(r)}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-white border border-[#F59E0B]/40 text-[#92400E] hover:bg-[#FEF3C7] transition-colors">
                        {r}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feature request drawer */}
            <AnimatePresence>
              {drawer === "feature" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="border-t border-[#E2E8F0] bg-[#F0F4FF] px-4 py-3 overflow-hidden shrink-0">
                  <p className="text-[11px] font-semibold text-[#3730A3] mb-2">Suggest a feature</p>
                  <textarea ref={featureRef} value={featureText} onChange={e => setFeatureText(e.target.value)}
                    placeholder="Describe what you'd like DataByt to do..."
                    rows={2}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#C7D2FE] bg-white focus:outline-none focus:ring-1 focus:ring-[#4F46E5] resize-none text-[#0F172A]" />
                  <button onClick={submitFeature} disabled={!featureText.trim()}
                    className="mt-2 w-full text-xs py-1.5 rounded-lg bg-[#4F46E5] text-white font-medium hover:bg-[#4338CA] disabled:opacity-40 transition-colors">
                    Submit
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input + bottom bar */}
            <div className="border-t border-[#E2E8F0] shrink-0">
              <div className="px-3 pt-3 flex gap-2">
                <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Ask anything or request an action..."
                  disabled={loading}
                  className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#111]/10 focus:border-[#111] text-[#0F172A] disabled:opacity-50 transition-all" />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-[#111111] text-white rounded-xl hover:bg-black disabled:opacity-30 transition-colors shrink-0">
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="px-4 py-2 flex items-center gap-2">
                <button onClick={() => toggleDrawer("escalate")} title="Escalate an issue"
                  className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full transition-colors ${
                    drawer === "escalate"
                      ? "bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/40"
                      : "text-[#666] hover:text-[#92400E] hover:bg-[#FEF3C7] border border-transparent"
                  }`}>
                  <AlertTriangle className="w-3 h-3" />
                  Escalate issue
                </button>
                <button onClick={() => toggleDrawer("feature")} title="Request a feature"
                  className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full transition-colors ${
                    drawer === "feature"
                      ? "bg-[#EEF2FF] text-[#3730A3] border border-[#C7D2FE]"
                      : "text-[#666] hover:text-[#3730A3] hover:bg-[#EEF2FF] border border-transparent"
                  }`}>
                  <Lightbulb className="w-3 h-3" />
                  Request feature
                </button>
                <span className="ml-auto text-[10px] text-[#CCC]">DataByt AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
