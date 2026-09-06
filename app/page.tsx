import dynamic from "next/dynamic";
import NavLuxury from "@/components/NavLuxury";
import ShopLuxury from "@/components/ShopLuxury";
import AboutLuxury from "@/components/AboutLuxury";
import CartDrawerLuxury from "@/components/CartDrawerLuxury";
import FooterLuxury from "@/components/FooterLuxury";
import Events from "@/components/Events";
import Testimonials from "@/components/Testimonials";

const HeroLuxury = dynamic(
  () => import("@/components/HeroLuxury"), 
  { ssr: false }
);

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <NavLuxury />
      <CartDrawerLuxury />
      <HeroLuxury />
      <ShopLuxury />
      <AboutLuxury />
      <Events />
      <Testimonials />
      <FooterLuxury />
    </main>
  );
}
