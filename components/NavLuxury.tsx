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
          ? "bg-black/80 backdrop-blur-2xl border-b border-yellow-600/15 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        {/* Logo */}
        <motion.a
          href="#top"
          whileHover={{ scale: 1.05 }}
          className="font-serif text-3xl font-light tracking-tight text-white"
        >
          GRABBO
          <span className="text-yellow-500">.</span>
        </motion.a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <motion.li key={link.href} whileHover={{ y: -2 }}>
              <a
                href={link.href}
                className="text-sm font-semibold text-gray-300 hover:text-yellow-500 transition-colors duration-300 uppercase tracking-wider"
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
            className="relative p-4 rounded-lg bg-yellow-600/10 border border-yellow-600/30 hover:border-yellow-600/60 text-yellow-500 transition-all hover:bg-yellow-600/20"
          >
            <ShoppingBag size={22} />
            
            {/* 3. UPDATED: Added isMounted to the cart badge logic */}
            {isMounted && itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-600 to-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
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
            className="md:hidden p-4 rounded-lg hover:bg-yellow-600/10 text-yellow-500"
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
        className="md:hidden overflow-hidden border-t border-yellow-600/15"
      >
        <div className="bg-black/95 backdrop-blur-xl p-6">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-gray-300 hover:text-yellow-500 transition-colors block uppercase tracking-wider"
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