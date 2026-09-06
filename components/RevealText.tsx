"use client";

import { motion } from "framer-motion";
import { Children, ReactNode } from "react";

/**
 * Wrap a heading + supporting lines so each direct child fades/lifts in as a
 * slow stagger when it enters the viewport. Usage:
 *
 *   <RevealText>
 *     <h2>Headline</h2>
 *     <p>Supporting line.</p>
 *   </RevealText>
 */
export default function RevealText({
  children,
  className = "",
  staggerDelay = 0.12,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1], // slow, editorial ease-out
            delay: i * staggerDelay,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
