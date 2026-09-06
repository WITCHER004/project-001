"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDownRight, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const Scene3DLuxury = dynamic(() => import("./Scene3DLuxury"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-black to-gray-900" />
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
};

export default function HeroUltraCinematic() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [scrollHint, setScrollHint] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollHint(false);
      } else {
        setScrollHint(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-24 pb-20 bg-black">
      {/* Luxury gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black -z-20" />

      {/* Gold gradient orbs */}
      <div className="absolute -top-60 -right-60 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-yellow-600/20 to-transparent blur-3xl -z-10 opacity-60" />
      <div className="absolute -bottom-40 -left-60 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-red-700/15 to-transparent blur-3xl -z-10" />

      {/* Luxury grain overlay */}
      <div className="absolute inset-0 bg-grain opacity-3 pointer-events-none -z-5" />

      {/* Gold light streaks */}
      <div className="absolute top-0 left-1/4 w-1 h-96 bg-gradient-to-b from-yellow-500/30 to-transparent blur-xl -z-10" />
      <div className="absolute top-1/4 right-1/3 w-1 h-96 bg-gradient-to-b from-red-500/25 to-transparent blur-xl -z-10" />

      {/* Mouse glow effect */}
      {isClient && (
        <motion.div
          className="pointer-events-none fixed w-96 h-96 rounded-full bg-gradient-to-r from-yellow-600/15 to-red-600/10 blur-3xl -z-5"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 40, stiffness: 300 }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-20">
        {/* Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10"
        >
          {/* Premium badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="p-2 rounded-lg bg-yellow-600/10 border border-yellow-600/40 backdrop-blur-xl">
              <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
            </div>
            <span className="text-sm font-semibold text-yellow-600/90 tracking-widest uppercase">
              Cinematic Spectacle
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-[1.05] mb-6 text-white"
          >
            A Flavor
            <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-red-500">
              Cascade
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-400 max-w-md mb-12 leading-relaxed font-light"
          >
            Experience an infinite cinematic spectacle. Watch chips and cokes collide in a mesmerizing dance. The blur intensifies with your scroll—pure visual poetry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-5 mb-16"
          >
            <motion.a
              href="#shop"
              whileHover={{ y: -4, boxShadow: "0 0 40px rgba(251, 191, 36, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-red-600 text-black font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-gold-lg transition-all duration-300"
            >
              Explore Now
              <ArrowDownRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
            </motion.a>

            <motion.a
              href="#about"
              whileHover={{ x: 4 }}
              className="text-sm font-semibold text-yellow-500/80 hover:text-yellow-400 transition-colors group flex items-center gap-2 border border-yellow-600/30 px-6 py-4 rounded-lg"
            >
              Our Story
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.a>
          </motion.div>

          {/* Premium Stats */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-12 pt-8 border-t border-yellow-600/20"
          >
            <div className="space-y-1">
              <p className="font-serif text-4xl text-yellow-500">70+</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Particles Falling</p>
            </div>
            <div className="w-px h-12 bg-yellow-600/20" />
            <div className="space-y-1">
              <p className="font-serif text-4xl text-yellow-500">5PT</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Light Setup</p>
            </div>
            <div className="w-px h-12 bg-yellow-600/20" />
            <div className="space-y-1">
              <p className="font-serif text-4xl text-yellow-500">60FPS</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Smooth</p>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Ultra-Cinematic Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[500px] md:h-[650px]"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-2xl border border-yellow-600/15 shadow-2xl">
            <Scene3DLuxury />
          </div>

          {/* Gold corner accents with animation */}
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-4 right-4 w-24 h-24 border border-yellow-600/40 rounded-full backdrop-blur-md pointer-events-none"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.05, 0.95, 1.05] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute bottom-4 left-4 w-20 h-20 border border-red-600/30 rounded-full backdrop-blur-md pointer-events-none"
          />

          {/* Cinematic gradient overlays */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/0 via-transparent to-black/40 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/5 to-transparent rounded-3xl" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator with blur hint */}
      <AnimatedScrollIndicator show={scrollHint} />
    </section>
  );
}

function AnimatedScrollIndicator({ show }: { show: boolean }) {
  return (
    <motion.div
      animate={{ y: [0, 10, 0], opacity: show ? 1 : 0 }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 z-20"
    >
      <span className="text-xs text-gray-500 uppercase tracking-widest">
        Scroll for blur effect
      </span>
      <div className="w-6 h-10 border border-yellow-600/40 rounded-full flex justify-center p-2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1 h-2 bg-gradient-to-b from-yellow-600 to-red-600 rounded-full"
        />
      </div>
    </motion.div>
  );
}
