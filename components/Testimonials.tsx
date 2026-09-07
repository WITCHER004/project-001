"use client";

import { motion } from "framer-motion";
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchGoogleReviews, GoogleReview } from "@/lib/googleReviews";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function initialOf(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

function ReviewCard({ review, index }: { review: GoogleReview; index: number }) {
  // Small alternating tilt so the row reads as a loose stack of polaroids
  // rather than a rigid grid.
  const tilt = index % 2 === 0 ? -1.5 : 1.5;

  return (
    <motion.div
      whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
      transition={{ duration: 0.4, ease: LUXURY_EASE }}
      style={{ rotate: tilt }}
      className="shrink-0 w-[280px] sm:w-[320px] select-none"
    >
      <div className="bg-ink-800/60 border border-lime/15 rounded-2xl p-5 pb-6 backdrop-blur-xl shadow-xl">
        {/* "Photo cap" — polaroid-style block up top */}
        <div className="rounded-xl bg-gradient-to-br from-lime/15 to-coral/10 border border-lime/10 aspect-[4/3] flex items-center justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center font-display text-xl text-lime border border-lime/30">
            {initialOf(review.author_name)}
          </div>
        </div>

        <Quote size={20} className="text-lime/40 mb-3" />

        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < review.rating ? "fill-lime text-lime" : "text-ink-700"}
            />
          ))}
        </div>

        <p className="text-paper/80 text-sm leading-relaxed mb-5 font-light line-clamp-4">
          &ldquo;{review.text}&rdquo;
        </p>

        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-paper">{review.author_name}</p>
          <p className="text-xs text-slate">{review.relative_time_description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewSkeletonCard() {
  return (
    <div className="shrink-0 w-[280px] sm:w-[320px] bg-ink-800/60 border border-lime/10 rounded-2xl p-5 pb-6 backdrop-blur-xl">
      <div className="rounded-xl bg-paper/5 aspect-[4/3] mb-5" />
      <div className="h-3 w-16 rounded bg-lime/10 mb-4" />
      <div className="h-3 w-full rounded bg-paper/10 mb-2" />
      <div className="h-3 w-4/5 rounded bg-paper/10 mb-5" />
      <div className="h-3 w-1/2 rounded bg-paper/10" />
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<GoogleReview[] | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragRange, setDragRange] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchGoogleReviews().then((data) => {
      if (!cancelled) setReviews(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!reviews) return;
    const measure = () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;
      setDragRange(Math.max(0, track.scrollWidth - container.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reviews]);

  const nudge = (dir: 1 | -1) => {
    containerRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  const averageRating = reviews
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-ink">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-lime/[0.04] blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: LUXURY_EASE }}
        className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mb-12 sm:mb-16 flex items-end justify-between gap-6 flex-wrap"
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-lime/10 border border-lime/20 backdrop-blur-sm">
            <Star size={16} className="text-lime fill-lime" />
            <span className="text-sm font-semibold text-lime uppercase tracking-wider">
              {averageRating} &middot; Google Reviews
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-paper font-light">
            What Our
            <br />
            <span className="italic text-lime">Community Says</span>
          </h2>
        </div>

        <div className="hidden md:flex gap-3">
          <motion.button
            onClick={() => nudge(-1)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Scroll reviews left"
            className="p-4 rounded-full border border-lime/20 text-lime hover:border-lime/50 hover:bg-lime/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <motion.button
            onClick={() => nudge(1)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Scroll reviews right"
            className="p-4 rounded-full border border-lime/20 text-lime hover:border-lime/50 hover:bg-lime/10 transition-colors"
          >
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* Fade masks at the edges */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-ink to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-ink to-transparent z-10" />

        <div ref={containerRef} className="overflow-x-hidden px-4 sm:px-8 lg:px-16">
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -dragRange, right: 0 }}
            dragElastic={0.08}
            className="flex gap-5 sm:gap-6 w-max cursor-grab active:cursor-grabbing py-2"
          >
            {reviews === null
              ? Array.from({ length: 4 }).map((_, i) => <ReviewSkeletonCard key={i} />)
              : reviews.map((r, i) => <ReviewCard key={`${r.author_name}-${i}`} review={r} index={i} />)}
          </motion.div>
        </div>
      </div>

      <p className="text-center text-xs text-slate/60 mt-6">Drag to browse more reviews</p>
    </section>
  );
}
