import type { Metadata } from "next";
import MiniHero from "@/components/MiniHero";
import Events from "@/components/Events";

export const metadata: Metadata = {
  title: "Events — Grabbo",
  description:
    "Cinematic campus experiences worth marking the calendar for — reserve your seat before it's gone.",
};

export default function EventsPage() {
  return (
    <main className="overflow-x-hidden">
      <MiniHero
        eyebrow="Cinematic Experiences"
        title="Moments Worth Marking the Calendar."
        highlight="Marking"
        subtitle="From midnight tastings to founders' circles — reserve your seat before it's gone."
      />
      <Events />
    </main>
  );
}
