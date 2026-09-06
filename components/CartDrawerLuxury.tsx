"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, Check, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

const APP_STORE_FALLBACK = "https://apps.apple.com/app/grabbo"; // TODO: real listing
const PLAY_STORE_FALLBACK = "https://play.google.com/store/apps/details?id=com.grabbo"; // TODO: real listing

export default function CartDrawerLuxury() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotal,
    getItemCount,
  } = useCartStore();

  // "idle" -> "handoff" (cinematic reveal) -> redirecting
  const [stage, setStage] = useState<"idle" | "handoff">("idle");
  const total = getTotal();
  const itemCount = getItemCount();

  const handleContinueInApp = () => {
    setStage("handoff");

    // Encode the cart so the app can pick up exactly where the web left off —
    // nothing here claims a purchase has happened, it just carries the bag over.
    const payload = encodeURIComponent(
      JSON.stringify(items.map((i) => ({ id: i.id, qty: i.quantity })))
    );
    const deepLink = `grabbo://checkout?cart=${payload}`;
    const fallback = /android/i.test(navigator.userAgent)
      ? PLAY_STORE_FALLBACK
      : APP_STORE_FALLBACK;

    // Try the app first; if it's not installed, land on the store after a beat.
    const fallbackTimer = setTimeout(() => {
      window.location.href = fallback;
    }, 1200);

    window.addEventListener("blur", () => clearTimeout(fallbackTimer), { once: true });
    window.location.href = deepLink;
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-ink border-l border-ink-700 z-50 flex flex-col shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {stage === "idle" ? (
                <motion.div
                  key="cart"
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-ink-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-lime/10 border border-lime/25">
                        <ShoppingBag size={20} className="text-lime" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-light text-paper">
                          Your Bag
                        </h2>
                        <p className="text-xs text-slate">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeCart}
                      className="p-2 hover:bg-lime/10 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-slate" />
                    </motion.button>
                  </div>

                  {/* Items */}
                  <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <ShoppingBag size={48} className="text-ink-700 mb-4" />
                        <p className="text-paper/80 font-semibold">Your bag is empty</p>
                        <p className="text-slate text-sm mt-2">
                          Grab something from the shop
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="group bg-ink-800 rounded-2xl p-4 border border-ink-700 hover:border-lime/30 transition-all"
                          >
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-xl bg-ink flex items-center justify-center text-2xl flex-shrink-0">
                                {item.image}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-display text-paper truncate">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-slate mb-2">{item.category}</p>
                                <p className="font-display text-lg text-lime">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate hover:text-coral"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>

                            <div className="flex items-center gap-3 mt-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 rounded-md bg-ink border border-ink-700 hover:border-lime/40 text-slate hover:text-lime transition-colors"
                              >
                                <Minus size={14} />
                              </motion.button>
                              <span className="text-sm font-bold text-paper w-8 text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 rounded-md bg-ink border border-ink-700 hover:border-lime/40 text-slate hover:text-lime transition-colors"
                              >
                                <Plus size={14} />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {items.length > 0 && (
                    <div className="border-t border-ink-700 p-6 space-y-4 bg-ink-800">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate">
                          <span>Subtotal</span>
                          <span>₹{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-ink-700">
                          <span className="font-display text-paper font-light">Total</span>
                          <span className="font-display text-2xl text-lime">
                            ₹{total.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinueInApp}
                        className="w-full py-4 bg-lime text-ink font-bold rounded-xl shadow-glow flex items-center justify-center gap-2"
                      >
                        Continue in the App
                        <ArrowRight size={18} />
                      </motion.button>

                      <button
                        onClick={closeCart}
                        className="w-full py-3 border border-ink-700 text-paper/70 hover:text-lime hover:border-lime/40 rounded-lg transition-colors font-semibold"
                      >
                        Keep Browsing
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                // Honest handoff moment — confirms the bag is saved, never implies a
                // purchase completed. Cinematic, but truthful.
                <motion.div
                  key="handoff"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center px-10"
                >
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16 }}
                    className="w-16 h-16 rounded-full bg-lime/15 border border-lime/30 flex items-center justify-center mb-6"
                  >
                    <Check size={28} className="text-lime" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="font-display text-2xl text-paper mb-2"
                  >
                    Your bag is saved
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-slate text-sm mb-8"
                  >
                    Opening the Grabbo app to finish checkout. If it doesn't open
                    automatically, we'll take you to the store.
                  </motion.p>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="text-xs uppercase tracking-widest text-lime"
                  >
                    Redirecting…
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
