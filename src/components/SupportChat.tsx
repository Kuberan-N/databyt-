"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

interface Message {
  role: "user" | "agent";
  text: string;
}

const WELCOME: Message = {
  role: "agent",
  text: "Hi! I'm DataByt's AI support agent. Ask me about your invoices, collections, settings, or anything else.",
};

export default function SupportChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `chat-${Date.now()}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({ message: text, sessionId }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "agent", text: data.reply ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages(prev => [...prev, { role: "agent", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-xl hover:bg-black transition-colors"
        aria-label="Support chat"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#E2E8F0] bg-white" style={{ height: 460 }}>
          {/* Header */}
          <div className="px-4 py-3 bg-[#111111] text-white flex items-center gap-2 shrink-0">
            <Bot className="w-4 h-4 shrink-0" />
            <span className="text-sm font-semibold">DataByt AI Support</span>
            <span className="ml-auto flex items-center gap-1 text-xs text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Online
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[78%] text-xs rounded-2xl px-3 py-2 leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[#111111] text-white rounded-br-sm"
                      : "bg-[#F3F3F3] text-[#0F172A] rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#F3F3F3] text-[#666] text-xs rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1 items-center">
                  <span className="w-1 h-1 rounded-full bg-[#999] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#999] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#999] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#E2E8F0] p-2 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything..."
              disabled={loading}
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#111111] text-[#0F172A] disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-2 bg-[#111111] text-white rounded-lg hover:bg-black disabled:opacity-40 transition-colors shrink-0"
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
