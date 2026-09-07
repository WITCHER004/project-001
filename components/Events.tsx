"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ArrowLeft, ArrowRight, Sparkles, Smartphone } from "lucide-react";
import { useRef, useState } from "react";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const APP_STORE_FALLBACK = "https://apps.apple.com/app/grabbo"; // TODO: real listing
const PLAY_STORE_FALLBACK = "https://play.google.com/store/apps/details?id=com.grabbo"; // TODO: real listing

interface LuxuryEvent {
  id: string;
  date: { day: string; month: string };
  title: string;
  venue: string;
  time: string;
  description: string;
  capacity: string;
  tag: string;
}

const events: LuxuryEvent[] = [
  {
    id: "midnight-tasting",
    date: { day: "14", month: "SEP" },
    title: "Midnight Tasting: Oud & Rare Whisky",
    venue: "The Grabbo Cellar, Mumbai",
    time: "9:00 PM",
    description: "An intimate evening pairing our rarest oud reserves with single-cask whisky, guided by master perfumers and distillers.",
    capacity: "24 seats",
    tag: "By Invitation",
  },
  {
    id: "chefs-table",
    date: { day: "22", month: "SEP" },
    title: "The Artisan's Table: Chef's Reserve Dinner",
    venue: "Grabbo Atelier, Delhi",
    time: "8:00 PM",
    description: "A seven-course tasting menu built entirely from this season's Gallery of Refinement, hosted by our culinary curators.",
    capacity: "12 seats",
    tag: "Limited",
  },
  {
    id: "founders-circle",
    date: { day: "05", month: "OCT" },
    title: "Founders' Circle: Private Cellar Preview",
    venue: "Grabbo House, Bengaluru",
    time: "7:30 PM",
    description: "First access to next quarter's collection, previewed before public release alongside the artisans who crafted it.",
    capacity: "40 seats",
    tag: "Members Only",
  },
  {
    id: "solstice-gala",
    date: { day: "20", month: "DEC" },
    title: "Winter Solstice Gala",
    venue: "The Imperial Lawns, Delhi",
    time: "6:00 PM",
    description: "Our flagship annual gathering — live tastings, a candlelit auction, and the unveiling of a one-of-one commissioned piece.",
    capacity: "150 seats",
    tag: "Flagship",
  },
];

/**
 * Attempts the Expo/React Native deep link straight into the event's
 * ticket-booking view, bypassing the app's home screen entirely. Falls back
 * to the appropriate app store if the app isn't installed (or the user is
 * on desktop, where the deep link can't resolve at all).
 */
function grabSpot(eventId: string) {
  const deepLink = `grabbo://events?eventId=${encodeURIComponent(eventId)}`;
  const fallback = /android/i.test(navigator.userAgent)
    ? PLAY_STORE_FALLBACK
    : APP_STORE_FALLBACK;

  const fallbackTimer = setTimeout(() => {
    window.location.href = fallback;
  }, 1200);
  window.addEventListener("blur", () => clearTimeout(fallbackTimer), { once: true });
  window.location.href = deepLink;
}

function EventCard({ event, index }: { event: LuxuryEvent; index: number }) {
  const qrTarget = `grabbo://events?eventId=${encodeURIComponent(event.id)}`;
  // Public, key-less QR generator — fine for a visual placeholder; swap for
  // a self-hosted generator if uptime/privacy of a third party is a concern.
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&bgcolor=0B0A08&color=C9A227&data=${encodeURIComponent(qrTarget)}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: LUXURY_EASE, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.5, ease: LUXURY_EASE } }}
      className="group relative shrink-0 w-[300px] sm:w-[340px] snap-start"
    >
      <div className="relative h-full bg-ink-800/40 border hairline rounded-2xl p-6 sm:p-7 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-lime/40 hover:shadow-glow flex flex-col">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lime/0 to-lime/0 group-hover:from-lime/10 group-hover:to-lime/0 transition-all duration-500" />

        <div className="relative flex items-start justify-between mb-6">
          <div>
            <p className="font-display text-4xl sm:text-5xl text-lime font-light leading-none">
              {event.date.day}
            </p>
            <p className="text-xs text-slate tracking-widest mt-2 uppercase">
              {event.date.month}
            </p>
          </div>
          <span className="px-3 py-1.5 bg-lime text-ink rounded-full text-[11px] font-bold uppercase tracking-widest">
            {event.tag}
          </span>
        </div>

        <h3 className="relative font-display text-xl sm:text-2xl text-paper font-light leading-tight mb-3">
          {event.title}
        </h3>

        <p className="relative text-sm text-slate leading-relaxed mb-6 flex-1">
          {event.description}
        </p>

        <div className="relative space-y-2 mb-6 text-sm text-slate">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-lime" /> {event.venue}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-lime" /> {event.time} &middot; {event.capacity}
          </div>
        </div>

        <div className="relative border-t border-ink-700 pt-5 space-y-4">
          <motion.button
            onClick={() => grabSpot(event.id)}
            whileHover={{ scale: 1.03, transition: { duration: 0.4, ease: LUXURY_EASE } }}
            whileTap={{ scale: 0.97 }}
            className="w-full text-sm font-bold uppercase tracking-widest bg-lime text-ink py-3.5 rounded-xl"
          >
            Grab Your Spot
          </motion.button>

          {/* Desktop fallback — deep links can't resolve without a phone,
              so give desktop visitors a scannable path instead. */}
          <div className="hidden md:flex items-center gap-3 pt-1">
            <img
              src={qrSrc}
              alt={`QR code to RSVP for ${event.title} in the Grabbo app`}
              width={56}
              height={56}
              className="rounded-md border border-lime/20 flex-shrink-0"
            />
            <p className="text-xs text-slate leading-snug flex items-center gap-1.5">
              <Smartphone size={12} className="text-lime flex-shrink-0" />
              Scan, or download the app to RSVP on the go.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Events() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section id="events" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-ink">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-lime/[0.04] blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: LUXURY_EASE }}
          className="mb-12 sm:mb-14 flex items-end justify-between gap-6 flex-wrap"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-lime/10 border border-lime/20 backdrop-blur-sm">
              <Sparkles size={16} className="text-lime" />
              <span className="text-sm font-semibold text-lime uppercase tracking-wider">
                Upcoming Events
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-paper font-light">
              Cinematic
              <br />
              <span className="italic text-lime">Experiences</span>
            </h2>
          </div>

          <div className="hidden md:flex gap-3">
            <motion.button
              onClick={() => scrollByAmount(-1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Scroll events left"
              className="p-4 rounded-full border border-lime/20 text-lime hover:border-lime/50 hover:bg-lime/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <motion.button
              onClick={() => scrollByAmount(1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Scroll events right"
              className="p-4 rounded-full border border-lime/20 text-lime hover:border-lime/50 hover:bg-lime/10 transition-colors"
            >
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto pb-6 px-4 sm:px-8 lg:px-16 max-w-[100vw] snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-lime/30 [&::-webkit-scrollbar-thumb]:rounded-full"
        style={{ scrollPaddingLeft: "1.5rem" }}
      >
        <div className="shrink-0 w-[max(0px,calc((100vw-80rem)/2))]" aria-hidden />
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
        <div className="shrink-0 w-6" aria-hidden />
      </div>
    </section>
  );
}
