"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
import { useRef, useState } from "react";

interface ConciergeMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "Track my order",
  "Late night recommendations",
  "What's in the Late Night Menu?",
  "Talk to a human",
];

/**
 * Single integration point for the concierge backend. Swap this out for a
 * real call once the RAG API exists — e.g.:
 *
 *   const res = await fetch("/api/concierge", {
 *     method: "POST",
 *     body: JSON.stringify({ message, history }),
 *   });
 *   return (await res.json()).reply;
 *
 * Everything above this function (message state, quick replies, typing
 * indicator) is already wired to expect an async reply, so this is the only
 * thing that needs to change.
 */
async function sendToConcierge(message: string, _history: ConciergeMessage[]): Promise<string> {
  await new Promise((r) => setTimeout(r, 700));
  return "That's not wired up to live data yet — but I'll be able to answer that once the concierge backend is connected.";
}

export default function ConciergeFAB() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: "greeting",
      role: "assistant",
      content:
        "Hi! I can help you track an order, find a slot, or recommend something for tonight. What are you after?",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pushMessage = (msg: ConciergeMessage) => {
    setMessages((prev) => [...prev, msg]);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ConciergeMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const historySoFar = [...messages, userMsg];
    pushMessage(userMsg);
    setDraft("");
    setIsTyping(true);

    const reply = await sendToConcierge(trimmed, historySoFar);

    setIsTyping(false);
    pushMessage({ id: crypto.randomUUID(), role: "assistant", content: reply });
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-ink-800/90 border border-lime/25 backdrop-blur-xl shadow-glow"
      >
        <Sparkles size={16} className="text-lime" />
        <span className="font-display text-sm text-paper tracking-wide">Concierge</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm rounded-3xl border border-lime/20 bg-ink-800/70 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-ink-700/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-lime/15 border border-lime/30 flex items-center justify-center">
                    <Sparkles size={14} className="text-lime" />
                  </div>
                  <div>
                    <p className="font-display text-paper text-sm">Grabbo Concierge</p>
                    <p className="text-[11px] text-slate">Usually replies in a minute</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-full hover:bg-lime/10 text-slate hover:text-lime transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="px-5 py-6 space-y-3 h-64 overflow-y-auto">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "assistant"
                        ? "rounded-tl-sm bg-ink/70 border border-ink-700 text-paper/90"
                        : "rounded-tr-sm bg-lime/15 border border-lime/30 text-paper ml-auto"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                {isTyping && (
                  <div className="max-w-[50%] rounded-2xl rounded-tl-sm bg-ink/70 border border-ink-700 px-4 py-2.5 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-lime"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Quick replies */}
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    disabled={isTyping}
                    className="text-xs px-3 py-1.5 rounded-full border border-lime/25 text-lime/90 hover:bg-lime/10 transition-colors disabled:opacity-40"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(draft);
                }}
                className="p-4 border-t border-ink-700/80"
              >
                <div className="flex items-center gap-2 rounded-full bg-ink/70 border border-ink-700 px-4 py-2.5">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Ask the concierge…"
                    className="flex-1 bg-transparent text-sm text-paper placeholder:text-slate outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || isTyping}
                    className="w-8 h-8 rounded-full bg-lime/15 text-lime flex items-center justify-center disabled:opacity-40 hover:bg-lime/25 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
