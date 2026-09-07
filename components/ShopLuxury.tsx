"use client";

import { useAddToCartSound } from "@/hooks/useAddToCartSound";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Filter, Check, Sparkles, RefreshCw } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/type";


/* ------------------------------------------------------------------ */
/*  Cinematic easing                                                   */
/*                                                                      */
/*  Swaps Framer Motion's default linear/ease-out feel for custom      */
/*  cubic-bezier curves: slower, more deliberate reveals that settle    */
/*  rather than snap — the "expensive boutique" pacing.                 */
/* ------------------------------------------------------------------ */
const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const LUXURY_EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const revealTransition = (delay = 0) => ({
  duration: 1.1,
  ease: LUXURY_EASE,
  delay,
});

/** A Sanity asset URL vs. our emoji placeholder fallback. */
const isImageUrl = (value: string) => /^https?:\/\//.test(value);

function ProductVisual({ image, alt }: { image: string; alt: string }) {
  if (isImageUrl(image)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} className="h-full w-full object-cover" />;
  }
  return <span className="text-7xl">{image}</span>;
}

function ProductCard({
  product,
  index,
  onAdded, // I see you also have this in your second screenshot!
}: {
  product: Product;
  index: number;
  onAdded?: () => void;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  
  // 1. Initialize the hook right here
  const playAddedSound = useAddToCartSound();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });

    // 2. Play the sound right here after adding to cart
    playAddedSound();

    setIsAdded(true);
    setPulseKey((k) => k + 1);
    setTimeout(() => setIsAdded(false), 2000);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={revealTransition(index * 0.08)}
      whileHover={{ y: -12, transition: { duration: 0.5, ease: LUXURY_EASE_SOFT } }}
      className="group relative"
    >
      <div className="relative bg-gradient-to-br from-gray-900/40 to-black/60 border border-yellow-600/20 rounded-2xl p-7 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-yellow-600/40 hover:shadow-gold-lg group-hover:from-gray-800/50 group-hover:to-black/70">
        {/* Luxury badge */}
        {product.badge && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: LUXURY_EASE, delay: index * 0.08 + 0.3 }}
            className="absolute top-4 right-4 z-10"
          >
            <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full text-xs font-bold text-white uppercase tracking-widest">
              {product.badge}
            </span>
          </motion.div>
        )}

        {/* Product showcase area */}
        <div className="relative h-48 flex items-center justify-center mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/40 to-black/80 group-hover:from-yellow-900/20 group-hover:to-black transition-all border border-yellow-600/10">
          <motion.div
            className="h-full w-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: LUXURY_EASE_SOFT }}
          >
            <ProductVisual image={product.image} alt={product.name} />
          </motion.div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-yellow-600/0 to-yellow-600/0 group-hover:from-yellow-600/10 group-hover:to-yellow-600/0 transition-all duration-500"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Product info */}
        <div className="space-y-3 mb-6">
          <p className="text-xs text-yellow-600/80 uppercase font-semibold tracking-widest">
            {product.category}
          </p>
          <h3 className="font-serif text-2xl text-white font-light leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 pt-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-600"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">{product.rating}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-yellow-600/10">
          <div>
            <p className="text-3xl font-serif text-yellow-500 font-light">
              ₹{product.price.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Exclusive to GRABBO</p>
          </div>

          <div className="relative">
            {/* Shockwave glow ring — fires once per click, doesn't loop */}
            <AnimatePresence>
              {isAdded && (
                <motion.span
                  key={pulseKey}
                  initial={{ scale: 0.6, opacity: 0.6 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: LUXURY_EASE }}
                  className="absolute inset-0 rounded-xl bg-yellow-500/40 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleAddToCart}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 28px 4px rgba(234,179,8,0.45)",
              }}
              whileTap={{ scale: 0.92 }}
              animate={
                isAdded
                  ? { scale: [1, 1.15, 1], boxShadow: "0 0 24px 6px rgba(74,222,128,0.35)" }
                  : { scale: 1, boxShadow: "0 0 0px 0px rgba(234,179,8,0)" }
              }
              transition={{ duration: 0.55, ease: LUXURY_EASE_SOFT }}
              className={`relative p-4 rounded-xl font-bold flex items-center justify-center min-w-[56px] overflow-hidden ${
                isAdded
                  ? "bg-green-600/20 text-green-400 border border-green-600/30"
                  : "bg-gradient-to-r from-yellow-600 to-amber-600 text-white"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isAdded ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.4, ease: LUXURY_EASE_SOFT }}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <Check size={18} />
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="bag"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: LUXURY_EASE_SOFT }}
                  >
                    <ShoppingBag size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-yellow-600/10 bg-gradient-to-br from-gray-900/40 to-black/60 p-7 animate-pulse">
      <div className="h-48 rounded-xl bg-gray-800/40 mb-6" />
      <div className="h-3 w-24 bg-gray-800/60 rounded mb-3" />
      <div className="h-6 w-3/4 bg-gray-800/60 rounded mb-3" />
      <div className="h-3 w-full bg-gray-800/40 rounded mb-2" />
      <div className="h-3 w-2/3 bg-gray-800/40 rounded mb-6" />
      <div className="flex items-center justify-between pt-4 border-t border-yellow-600/10">
        <div className="h-8 w-20 bg-gray-800/60 rounded" />
        <div className="h-12 w-12 bg-gray-800/60 rounded-xl" />
      </div>
    </div>
  );
}

function RecommendationsStrip({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.6, ease: LUXURY_EASE_SOFT }}
      className="mb-16 rounded-2xl border border-yellow-600/20 bg-gradient-to-br from-gray-900/40 to-black/60 p-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 mb-4 text-yellow-500">
        <Sparkles size={16} />
        <span className="text-xs font-semibold uppercase tracking-widest">
          Pairs well with your selection
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 rounded-xl border border-yellow-600/10 bg-black/40 p-3"
          >
            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-900/60 overflow-hidden">
              <ProductVisual image={product.image} alt={product.name} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-white">{product.name}</p>
              <p className="text-xs text-yellow-500">
                ₹{product.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ShopLuxury() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeCategory, setActiveCategory] = useState("All");
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const itemCount = useCartStore((state) => state.getItemCount());
  const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

  const loadProducts = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      const data: { products: Product[] } = await res.json();
      setProducts(data.products);
      setStatus("ready");
    } catch (err) {
      console.error("[shop] failed to load products", err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleItemAdded = useCallback(async (productId: string) => {
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      const data: { recommendations: Product[] } = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      // Recommendations are a nice-to-have — never block the cart flow on them.
      console.error("[shop] failed to load recommendations", err);
      setRecommendations([]);
    }
  }, []);

  // Categories are derived from whatever the CMS actually returns, so a
  // new category added in Sanity shows up here with no code change.
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="shop" className="relative py-40 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-yellow-600/10 to-transparent blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={revealTransition()}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-yellow-600/10 border border-yellow-600/20 backdrop-blur-sm">
            <Filter size={16} className="text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
              Curated Collection
            </span>
          </div>

          <h2 className="font-serif text-6xl sm:text-7xl mb-6 text-white font-light">
            The Gallery of
            <br />
            <span className="italic text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600">
              Refinement
            </span>
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">
            Each item thoughtfully selected from artisanal producers worldwide. Experience the intersection of convenience and luxury.
          </p>
        </motion.div>

        {/* Category Filter */}
        {status === "ready" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={revealTransition(0.15)}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05, transition: { duration: 0.4, ease: LUXURY_EASE_SOFT } }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-sm uppercase tracking-wider ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg"
                    : "bg-gray-900/50 text-gray-400 border border-yellow-600/10 hover:border-yellow-600/30"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Recommendations */}
        <AnimatePresence>
          {status === "ready" && <RecommendationsStrip products={recommendations} />}
        </AnimatePresence>

        {/* Products Grid */}
        {status === "error" ? (
          <div className="text-center py-24 border border-yellow-600/10 rounded-2xl mb-16">
            <p className="text-gray-400 mb-6">
              We couldn't load the collection right now.
            </p>
            <motion.button
              onClick={loadProducts}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-semibold"
            >
              <RefreshCw size={16} />
              Try Again
            </motion.button>
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {status === "loading"
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onAdded={() => handleItemAdded(product.id)}
                  />
                ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={revealTransition(0.1)}
          className="text-center pt-8 border-t border-yellow-600/10"
        >
         {isMounted && itemCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-yellow-500/80 mb-6 font-semibold"
            >
              {itemCount} {itemCount === 1 ? "item" : "items"} in your collection
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mx-auto px-10 py-5 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-gold-lg transition-all text-lg"
          >
            View Full Collection
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}