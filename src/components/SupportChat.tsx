"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";

interface Message {
  role: "user" | "agent";
  text: string;
}

const WELCOME: Message = {
  role: "agent",
  text: "Hi! I'm DataByt's AI Assistant. Ask me about your invoices, collections, disputes, or anything else — I can also take actions for you.",
};

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[#F3F3F3] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-[#111111]/30 block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SupportChat() {
  const { user, organization, orgUser } = useAuth();
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
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
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
  }

  if (!user) return null;

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-2xl"
        aria-label="AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sparkles className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-[#E2E8F0] bg-white"
            style={{ width: 380, height: 540 }}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#111111] text-white flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">DataByt AI Assistant</p>
                <p className="text-xs text-white/50 leading-tight">Ask questions or take actions</p>
              </div>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-white/50">
                <motion.span
                  className="w-2 h-2 rounded-full bg-emerald-400 inline-block"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Online
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] text-xs rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[#111111] text-white rounded-br-sm"
                      : "bg-[#F3F3F3] text-[#0F172A] rounded-bl-sm"
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Quick actions */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {["Who owes me most?", "Overdue invoices?", "File a dispute"].map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#E2E8F0] text-[#333] hover:border-[#111] hover:text-[#111] transition-colors bg-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-[#E2E8F0] px-3 py-3 flex gap-2 shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask anything or request an action..."
                disabled={loading}
                className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#111111]/20 focus:border-[#111111] text-[#0F172A] disabled:opacity-50 transition-all"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={send}
                disabled={loading || !input.trim()}
                className="p-2.5 bg-[#111111] text-white rounded-xl hover:bg-black disabled:opacity-30 transition-colors shrink-0"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
