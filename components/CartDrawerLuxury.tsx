"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

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

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const total = getTotal();
  const itemCount = getItemCount();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      // Hand off to Stripe Checkout. No need to reset isCheckingOut here —
      // the page is navigating away.
      window.location.href = data.url;
    } catch (err) {
      console.error("[checkout]", err);
      setCheckoutError(
        err instanceof Error ? err.message : "Checkout failed. Please try again."
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gradient-to-b from-gray-900/95 via-black to-black border-l border-yellow-600/20 z-50 flex flex-col shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-yellow-600/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-600/20 border border-yellow-600/30">
                  <ShoppingBag size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-light text-white">
                    Your Collection
                  </h2>
                  <p className="text-xs text-gray-500">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCart}
                className="p-2 hover:bg-yellow-600/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </motion.button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <ShoppingBag size={48} className="text-gray-700 mb-4" />
                  <p className="text-gray-400 font-semibold">Your collection is empty</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Discover our curated selection
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
                      className="group bg-gray-900/40 rounded-lg p-4 border border-yellow-600/10 hover:border-yellow-600/30 transition-all"
                    >
                      <div className="flex gap-4">
                        {/* Item Image */}
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-900/20 to-black flex items-center justify-center text-2xl flex-shrink-0">
                          {item.image}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-white truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">
                            {item.category}
                          </p>
                          <p className="font-serif text-lg text-yellow-500">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-600 hover:text-yellow-600"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1.5 rounded-md bg-gray-800/50 border border-yellow-600/10 hover:border-yellow-600/30 text-gray-600 hover:text-yellow-600 transition-colors"
                        >
                          <Minus size={14} />
                        </motion.button>

                        <span className="text-sm font-bold text-white w-8 text-center">
                          {item.quantity}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 rounded-md bg-gray-800/50 border border-yellow-600/10 hover:border-yellow-600/30 text-gray-600 hover:text-yellow-600 transition-colors"
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
              <div className="border-t border-yellow-600/10 p-6 space-y-4 bg-black/60">
                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (5%)</span>
                    <span className="text-yellow-600">₹{Math.round(total * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-yellow-600/10">
                    <span className="font-serif text-white font-light">Total</span>
                    <span className="font-serif text-2xl text-yellow-500">
                      ₹{Math.round(total * 1.05).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Error */}
                {checkoutError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 text-center"
                  >
                    {checkoutError}
                  </motion.p>
                )}

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: isCheckingOut ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-gold-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      Redirecting to secure checkout...
                    </motion.span>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </motion.button>

                <button
                  onClick={closeCart}
                  className="w-full py-3 border border-yellow-600/20 text-gray-300 hover:text-yellow-500 hover:border-yellow-600/50 rounded-lg transition-colors font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}