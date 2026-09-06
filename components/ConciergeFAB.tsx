"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
import { useState } from "react";

export default function ConciergeFAB() {
  const [open, setOpen] = useState(false);

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
              className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm rounded-3xl border border-lime/20 bg-ink-800/70 backdrop-blur-2xl shadow-2xl overflow-hidden"
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

              {/* Body — static UI shell, no backend logic wired yet */}
              <div className="px-5 py-6 space-y-3 h-64 overflow-y-auto">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-ink/70 border border-ink-700 px-4 py-2.5">
                  <p className="text-sm text-paper/90">
                    Hi! I can help you track an order, find a slot, or recommend
                    something for tonight. What are you after?
                  </p>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-ink-700/80">
                <div className="flex items-center gap-2 rounded-full bg-ink/70 border border-ink-700 px-4 py-2.5">
                  <input
                    type="text"
                    placeholder="Ask the concierge…"
                    className="flex-1 bg-transparent text-sm text-paper placeholder:text-slate outline-none"
                    disabled
                  />
                  <button
                    disabled
                    className="w-8 h-8 rounded-full bg-lime/15 text-lime flex items-center justify-center disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
