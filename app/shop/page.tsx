import type { Metadata } from "next";
import MiniHero from "@/components/MiniHero";
import ShopLuxury from "@/components/ShopLuxury";

export const metadata: Metadata = {
  title: "Shop — Grabbo",
  description:
    "Snacks, essentials, and late-night saviors, delivered straight to your hostel block.",
};

export default function ShopPage() {
  return (
    <main className="overflow-x-hidden">
      <MiniHero
        eyebrow="The Collection"
        title="Curated Objects of Desire."
        highlight="Objects"
        subtitle="Snacks, essentials, and late-night saviors — delivered like it's couture."
      />
      <ShopLuxury />
    </main>
  );
}
