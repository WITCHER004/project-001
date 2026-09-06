import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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
      <body className="font-body bg-ink text-paper antialiased">{children}</body>
    </html>
  );
}