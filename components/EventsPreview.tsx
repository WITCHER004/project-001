"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { events, EventCard } from "./Events";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Homepage teaser for /events. Deliberately shows only the next two events
 * — full depth (and the horizontal scroller) lives on the dedicated /events
 * page — so the funnel here is "glimpse, then click through."
 */
export default function EventsPreview() {
  const upcoming = events.slice(0, 2);

  return (
    <section id="events-preview" className="relative py-24 sm:py-32 overflow-hidden bg-ink">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-lime/[0.04] blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: LUXURY_EASE }}
          className="mb-12 sm:mb-14 text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-lime/10 border border-lime/20 backdrop-blur-sm">
            <Sparkles size={16} className="text-lime" />
            <span className="text-sm font-semibold text-lime uppercase tracking-wider">
              Upcoming Events
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-paper font-light leading-tight">
            Two nights <span className="italic text-lime">worth clearing your calendar</span> for.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12 place-items-center">
          {upcoming.map((event, i) => (
            <div key={event.id} className="w-full flex justify-center">
              <EventCard event={event} index={i} />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/events">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-lime text-ink font-bold text-sm uppercase tracking-widest transition-all"
            >
              View All Events
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </div>
      </div>
    </section>
  );
}
