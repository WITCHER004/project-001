"use client";

import RevealText from "./RevealText";

export default function VisionLuxury() {
  return (
    <section className="relative bg-ink py-24 sm:py-32 lg:py-40 px-4 sm:px-8 lg:px-16 overflow-hidden">
      {/* Quiet gold wash, kept far dimmer than the hero so this section reads
          as a pause, not another spectacle. */}
      <div className="absolute inset-0 bg-gradient-to-b from-lime/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center">
        <span className="block text-xs sm:text-sm uppercase tracking-[0.3em] text-lime/80 mb-8 sm:mb-10">
          Founder&rsquo;s Note
        </span>

        <RevealText
          staggerDelay={0.22}
          className="space-y-6 sm:space-y-8"
        >
          <p className="font-display italic text-2xl sm:text-3xl lg:text-4xl leading-snug text-paper">
            Grabbo didn&rsquo;t start as a company. It started as a favor —
            picking up dinner for a hallway of friends too buried in exams to
            leave their rooms.
          </p>
          <p className="font-display italic text-2xl sm:text-3xl lg:text-4xl leading-snug text-paper/85">
            What we&rsquo;re building now is that same favor, done properly:
            unhurried, personal, and a little more beautiful than it needs to
            be.
          </p>
          <p className="font-display italic text-2xl sm:text-3xl lg:text-4xl leading-snug text-paper/85">
            Every order that reaches your door at midnight is still, to us,
            just one friend looking out for another.
          </p>
        </RevealText>

        <div className="mt-12 sm:mt-16 flex items-center justify-center gap-4">
          <span className="h-px w-10 sm:w-12 bg-lime/40" />
          <p className="font-display text-sm sm:text-base text-paper/70 tracking-wide">
            Aarav Mehta <span className="text-slate">— Founder, Grabbo</span>
          </p>
          <span className="h-px w-10 sm:w-12 bg-lime/40" />
        </div>
      </div>
    </section>
  );
}
