"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart when the user successfully lands here
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-serif text-5xl text-yellow-500 mb-4">Payment Successful</h1>
      <p className="text-gray-400 mb-8">Thank you for your order. Your luxury experience awaits.</p>
      <Link 
        href="/"
        className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-xl hover:shadow-gold-lg transition-all"
      >
        Return to Gallery
      </Link>
    </div>
  );
}