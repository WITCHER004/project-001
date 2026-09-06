"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

function EventCard({ event, index }: { event: LuxuryEvent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: LUXURY_EASE, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.5, ease: LUXURY_EASE } }}
      className="group relative shrink-0 w-[340px] snap-start"
    >
      <div className="relative h-full bg-gradient-to-br from-gray-900/40 to-black/60 border border-yellow-600/20 rounded-2xl p-7 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-yellow-600/40 hover:shadow-gold-lg flex flex-col">
        {/* Ambient glow on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-yellow-600/0 to-yellow-600/0 group-hover:from-yellow-600/10 group-hover:to-yellow-600/0 transition-all duration-500" />

        <div className="relative flex items-start justify-between mb-6">
          <div>
            <p className="font-serif text-5xl text-yellow-500 font-light leading-none">
              {event.date.day}
            </p>
            <p className="text-xs text-gray-500 tracking-widest mt-2 uppercase">
              {event.date.month}
            </p>
          </div>
          <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full text-[11px] font-bold text-white uppercase tracking-widest">
            {event.tag}
          </span>
        </div>

        <h3 className="relative font-serif text-2xl text-white font-light leading-tight mb-3">
          {event.title}
        </h3>

        <p className="relative text-sm text-gray-400 leading-relaxed mb-6 flex-1">
          {event.description}
        </p>

        <div className="relative space-y-2 mb-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-yellow-600" /> {event.venue}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-yellow-600" /> {event.time} &middot; {event.capacity}
          </div>
        </div>

        <div className="relative border-t border-yellow-600/10 pt-5">
          <motion.button
            whileHover={{ scale: 1.03, transition: { duration: 0.4, ease: LUXURY_EASE } }}
            whileTap={{ scale: 0.97 }}
            className="w-full text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-3.5 rounded-xl"
          >
            Reserve Your Place
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Events() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <section id="events" className="relative py-40 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black -z-10" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-yellow-600/10 to-transparent blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: LUXURY_EASE }}
          className="mb-14 flex items-end justify-between gap-6 flex-wrap"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-yellow-600/10 border border-yellow-600/20 backdrop-blur-sm">
              <Sparkles size={16} className="text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
                Upcoming Events
              </span>
            </div>
            <h2 className="font-serif text-6xl sm:text-7xl text-white font-light">
              Cinematic
              <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600">
                Experiences
              </span>
            </h2>
          </div>

          {/* Scroll controls */}
          <div className="hidden md:flex gap-3">
            <motion.button
              onClick={() => scrollByAmount(-1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Scroll events left"
              className="p-4 rounded-full border border-yellow-600/20 text-yellow-600 hover:border-yellow-600/50 hover:bg-yellow-600/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <motion.button
              onClick={() => scrollByAmount(1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Scroll events right"
              className="p-4 rounded-full border border-yellow-600/20 text-yellow-600 hover:border-yellow-600/50 hover:bg-yellow-600/10 transition-colors"
            >
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scroller — full-bleed so cards can run to the viewport edge */}
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto pb-6 px-6 max-w-[100vw] snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-yellow-600/30 [&::-webkit-scrollbar-thumb]:rounded-full"
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
