import dynamic from "next/dynamic";
import NavLuxury from "@/components/NavLuxury";
import ShopLuxury from "@/components/ShopLuxury";
import AboutLuxury from "@/components/AboutLuxury";
import CartDrawerLuxury from "@/components/CartDrawerLuxury";
import FooterLuxury from "@/components/FooterLuxury";
import Events from "@/components/Events";
import Testimonials from "@/components/Testimonials";
import Advisory from "@/components/Advisory";
import TopTicker from "@/components/TopTicker";
import ConciergeFAB from "@/components/ConciergeFAB";

const HeroLuxury = dynamic(
  () => import("@/components/HeroLuxury"), 
  { ssr: false }
);

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <TopTicker />
      <NavLuxury />
      <CartDrawerLuxury />
      <HeroLuxury />
      <ShopLuxury />
      <AboutLuxury />
      <Advisory />
      <Events />
      <Testimonials />
      <FooterLuxury />
      <ConciergeFAB />
    </main>
  );
}
