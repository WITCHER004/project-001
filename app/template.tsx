"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Route-level transition shell.
 *
 * Next.js gives every navigation a *brand new* `template.tsx` instance — the
 * previous one is unmounted the moment the new route's tree is ready, it
 * doesn't stick around to play an exit animation. That means the thing that
 * actually has to hide the seam between "old page gone" and "new page here"
 * is the enter animation of the incoming template, not <AnimatePresence>'s
 * exit prop (which we still declare, for correctness and in case a future
 * nested-layout structure lets it run).
 *
 * The trick: the ink curtain below is present at full coverage the instant
 * this component mounts (its `initial` state), painted a frame before the
 * new page is visibly ready, then sweeps away. The outgoing page disappears
 * behind that curtain rather than visibly popping out.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} initial="initial" animate="animate" exit="exit" className="relative">
        {/* Ink sweep curtain */}
        <motion.div
          aria-hidden
          variants={{
            initial: { scaleY: 1 },
            animate: {
              scaleY: 0,
              transition: { duration: 0.7, ease: LUXURY_EASE, delay: 0.08 },
            },
            exit: {
              scaleY: 1,
              transition: { duration: 0.45, ease: LUXURY_EASE },
            },
          }}
          style={{ transformOrigin: "bottom" }}
          className="fixed inset-0 z-[200] bg-ink pointer-events-none"
        />

        {/* Page content — fades/lifts in just after the curtain starts clearing */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 18 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.65, ease: LUXURY_EASE, delay: 0.32 },
            },
            exit: {
              opacity: 0,
              y: -10,
              transition: { duration: 0.25, ease: LUXURY_EASE },
            },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
