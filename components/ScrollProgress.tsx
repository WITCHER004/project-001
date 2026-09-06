"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * The site's one signature scroll effect: a highlighter-style progress
 * bar that tracks how far down the page the visitor has gotten, styled
 * like a strip of lime highlighter tape pinned across the top edge.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-lime origin-left z-[60]"
    />
  );
}
