"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image"; 

const links = [
  { label: "Home", href: "#top" },
  { label: "Shop", href: "#shop" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function NavLuxury() {
  const [solid, setSolid] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 1. ADDED: Hydration check state
  const [isMounted, setIsMounted] = useState(false);

  const getItemCount = useCartStore((state) => state.getItemCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const itemCount = getItemCount();

  // 2. ADDED: Tell React the component has mounted in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-ink/85 backdrop-blur-2xl border-b border-ink-700 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-16 py-5 sm:py-6">
        {/* Logo */}
        <motion.a
          href="#top"
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3"
        >
          <span className="relative w-9 h-9 flex-shrink-0 drop-shadow-[0_2px_8px_rgba(201,162,39,0.45)]">
            <Image
              src="/logo.jpg"
              alt="Grabbo"
              fill
              sizes="36px"
              // True brand colors now show through — grounded in the dark
              // navbar with a warm gold-tinted drop-shadow (on the wrapping
              // span, not the image, so overflow-hidden doesn't clip it)
              // instead of the grayscale/blend filter that was suppressing
              // the logo's own colors.
              className="object-cover rounded-full ring-1 ring-lime/20"
            />
          </span>
          <span className="font-display text-2xl font-light tracking-tight text-paper">
            GRABBO
            <span className="text-lime">.</span>
          </span>
        </motion.a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <motion.li key={link.href} whileHover={{ y: -2 }}>
              <a
                href={link.href}
                className="text-sm font-semibold text-paper/70 hover:text-lime transition-colors duration-300 uppercase tracking-wider"
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleCart}
            className="relative p-4 rounded-lg bg-lime/10 border border-lime/25 hover:border-lime/50 text-lime transition-all hover:bg-lime/15"
          >
            <ShoppingBag size={22} />

            {isMounted && itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-lime text-ink text-xs font-bold rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-4 rounded-lg hover:bg-lime/10 text-lime"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          height: mobileMenuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden border-t border-ink-700"
      >
        <div className="bg-ink/95 backdrop-blur-xl p-6">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-paper/70 hover:text-lime transition-colors block uppercase tracking-wider"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </header>
  );
}