import dynamic from "next/dynamic";
import Advisory from "@/components/Advisory";
import EventsPreview from "@/components/EventsPreview";
import AboutLuxury from "@/components/AboutLuxury";
import Testimonials from "@/components/Testimonials";
import GuidelinesLuxury from "@/components/GuidelinesLuxury";

// The 3D hero canvas is client-only (WebGL + postprocessing don't exist on
// the server), so it's kept out of the server-rendered bundle entirely.
const HeroLuxury = dynamic(() => import("@/components/HeroLuxury"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroLuxury />
      <Advisory />
      <EventsPreview />
      <AboutLuxury />
      <Testimonials />
      <GuidelinesLuxury />
    </main>
  );
}
