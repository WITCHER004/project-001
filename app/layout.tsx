import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import NavLuxury from "@/components/NavLuxury";
import CartDrawerLuxury from "@/components/CartDrawerLuxury";
import FooterLuxury from "@/components/FooterLuxury";
import ConciergeFAB from "@/components/ConciergeFAB";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const generalSans = localFont({
  src: "./fonts/GeneralSans-Variable.woff2",
  variable: "--font-general",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grabbo — Your Campus, Delivered.",
  description:
    "Grabbo is the campus lifestyle ecosystem: order to your hostel, get live campus advisories, and grab slots for the events everyone's talking about.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${generalSans.variable}`}>
      <body className="font-body bg-ink text-paper antialiased">
        {/*
          Global chrome lives here rather than in each page: this is now a
          multi-route app (/, /shop, /events, /download) and the nav, cart
          drawer, footer, and concierge FAB all need to persist across
          navigations instead of remounting per page. app/template.tsx
          slots in right at {children}, so only the page content between
          the nav and footer participates in the route transition.
        */}
        <NavLuxury />
        <CartDrawerLuxury />
        {children}
        <FooterLuxury />
        <ConciergeFAB />
      </body>
    </html>
  );
}
