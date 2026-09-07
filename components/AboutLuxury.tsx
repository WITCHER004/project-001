"use client";

import { motion } from "framer-motion";
import RevealText from "./RevealText";

const stats = [
  { number: "12k+", label: "Students Served" },
  { number: "9 min", label: "Avg. Delivery" },
  { number: "24/7", label: "Late Night Menu" },
  { number: "40+", label: "Campus Blocks" },
];

/**
 * Deliberately short. This used to run a full "Our Commitment" partnership
 * pitch below the stats — cut entirely per the funnel redesign, since the
 * homepage's job now is to move people toward /shop and /events, not hold
 * them on a brand-story section.
 */
export default function AboutLuxury() {
  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-gradient-to-b from-lime/[0.04] via-ink to-ink -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 text-center">
        <RevealText className="mb-16 sm:mb-20">
          <p className="text-lime uppercase text-sm font-semibold tracking-widest mb-6">
            Our Story
          </p>
          <h2 className="font-display text-4xl sm:text-6xl text-paper font-light leading-tight mb-8">
            Convenience, made
            <br />
            <span className="italic text-lime">unmistakably yours.</span>
          </h2>
          <p className="text-paper/60 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Grabbo was built for one campus night at a time — the 2am cravings, the
            midterm library runs, the block-wide water cut nobody saw coming. No
            middlemen, no guesswork. Just your hostel, delivered.
          </p>
        </RevealText>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 py-10 sm:py-12 border-y hairline"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <p className="font-display text-3xl sm:text-4xl text-lime mb-1">{stat.number}</p>
              <p className="text-paper/50 text-xs sm:text-sm uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
