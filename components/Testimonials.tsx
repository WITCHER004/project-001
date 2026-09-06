"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useRef, useState } from "react";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Testimonial {
  name: string;
  title: string;
  initial: string;
  rating: number;
  body: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Ananya Rao",
    title: "Collector, Mumbai",
    initial: "A",
    rating: 5,
    body: "The Oud & Bergamot Reserve arrived exactly as described — sealed, cool, and boxed like something meant to be kept, not just used.",
  },
  {
    name: "Kabir Mehta",
    title: "Member since 2023",
    initial: "K",
    rating: 5,
    body: "Grabbo is the only place I've found that treats a coffee delivery with the same care most brands reserve for jewellery.",
  },
  {
    name: "Sneha Patil",
    title: "Verified Buyer",
    initial: "S",
    rating: 5,
    body: "Ordered the Manuka Honey Reserve as a gift. The unboxing alone made it feel like a much larger gesture than it was.",
  },
  {
    name: "Devraj Singh",
    title: "Founders' Circle Member",
    initial: "D",
    rating: 4,
    body: "Consistently excellent curation. My only wish is that new drops didn't sell out within the hour.",
  },
  {
    name: "Meera Iyer",
    title: "Collector, Bengaluru",
    initial: "M",
    rating: 5,
    body: "Every piece feels considered — from the tasting notes on the card to the weight of the packaging itself.",
  },
  {
    name: "Arjun Kapoor",
    title: "Member since 2022",
    initial: "A",
    rating: 5,
    body: "I've referred half my office. It's rare to find a platform this polished built around everyday indulgences.",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="shrink-0 w-[380px] bg-gradient-to-br from-gray-900/40 to-black/60 border border-yellow-600/20 rounded-2xl p-8 backdrop-blur-xl mx-3">
      <Quote size={28} className="text-yellow-600/40 mb-4" />

      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < testimonial.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-700"}
          />
        ))}
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light">
        "{testimonial.body}"
      </p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg text-white bg-gradient-to-br from-yellow-600 to-amber-600 shrink-0">
          {testimonial.initial}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-gray-500">{testimonial.title}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Auto-playing marquee. Rather than a Framer `animate({ x: [...] })` loop
 * (which restarts with a visible jump when it wraps), this drives a plain
 * `x` motion value every frame with `useAnimationFrame` and wraps it with a
 * modulo against the measured track width — the loop is seamless because
 * the track content is duplicated and the wrap point is invisible.
 * Hover / touch pauses the marquee for readability.
 */
function MarqueeRow({ items, speed = 40, reverse = false }: { items: Testimonial[]; speed?: number; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    if (!track || isPaused) return;

    const halfWidth = track.scrollWidth / 2;
    if (halfWidth === 0) return;

    const direction = reverse ? 1 : -1;
    offsetRef.current += direction * speed * (delta / 1000);

    // Wrap seamlessly: once we've scrolled a full copy's width, snap back
    if (offsetRef.current <= -halfWidth) offsetRef.current += halfWidth;
    if (offsetRef.current >= 0) offsetRef.current -= halfWidth;

    track.style.transform = `translateX(${offsetRef.current}px)`;
  });

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[...items, ...items].map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const rowOne = testimonials.slice(0, 3);
  const rowTwo = testimonials.slice(3, 6);

  return (
    <section id="testimonials" className="relative py-40 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-yellow-600/10 to-transparent blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: LUXURY_EASE }}
        className="max-w-7xl mx-auto px-6 mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-yellow-600/10 border border-yellow-600/20 backdrop-blur-sm">
          <Star size={16} className="text-yellow-600 fill-yellow-600" />
          <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wider">
            4.9 &middot; 2,400+ Reviews
          </span>
        </div>

        <h2 className="font-serif text-6xl sm:text-7xl text-white font-light">
          What Our
          <br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600">
            Community Says
          </span>
        </h2>
      </motion.div>

      {/* Fade masks at the edges so cards feel like they emerge from nothing */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-black to-transparent z-10" />

        <div className="space-y-6">
          <MarqueeRow items={rowOne} speed={34} />
          <MarqueeRow items={rowTwo} speed={30} reverse />
        </div>
      </div>
    </section>
  );
}
