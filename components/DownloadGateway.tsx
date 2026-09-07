"use client";

import { motion } from "framer-motion";
import { Apple, PlayCircle, QrCode, Smartphone, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import RevealText from "./RevealText";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/appLinks";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Sleek interstitial shown when a `grabbo://` deep link fails to open the
 * app (not installed, or opened on a desktop browser where the scheme can't
 * resolve at all). Both variants below are always in the DOM — which one
 * renders is resolved purely by Tailwind's `md:` breakpoint, so there's no
 * user-agent sniffing, no hydration flicker, and no flash of the wrong
 * variant while JS boots.
 */
export default function DownloadGateway({ deepLink }: { deepLink: string }) {
  const [retried, setRetried] = useState(false);

  // Public, key-less QR generator — same one already used for event RSVPs
  // in Events.tsx, kept consistent rather than adding a new dependency.
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&bgcolor=F3ECDC&color=0B0A08&data=${encodeURIComponent(
    deepLink
  )}`;

  const retryDeepLink = () => {
    setRetried(true);
    window.location.href = deepLink;
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-ink pt-32 pb-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-lime/[0.05] via-ink to-ink -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-lime/[0.05] blur-3xl -z-10" />

      <div className="max-w-md w-full text-center">
        <RevealText className="mb-10">
          <p className="text-lime uppercase text-xs font-semibold tracking-[0.3em] mb-5">
            Continue In The App
          </p>
          <h1 className="font-display italic text-3xl sm:text-4xl text-paper font-light mb-4 leading-tight">
            Almost there, <span className="text-lime">Grabber.</span>
          </h1>
          <p className="text-paper/60 text-sm sm:text-base">
            It looks like Grabbo isn&apos;t installed yet, or your browser blocked the
            handoff. Pick a path below to pick up right where you left off.
          </p>
        </RevealText>

        {/* Desktop: QR handoff to the phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.2 }}
          className="hidden md:flex flex-col items-center gap-5 bg-ink-800/50 border hairline rounded-3xl p-8"
        >
          <div className="p-3 rounded-2xl bg-paper shadow-glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt="QR code to open Grabbo on your phone"
              width={220}
              height={220}
              className="rounded-lg block"
            />
          </div>
          <p className="flex items-center gap-2 text-sm text-slate">
            <QrCode size={16} className="text-lime flex-shrink-0" />
            Scan with your phone&apos;s camera to open Grabbo
          </p>
        </motion.div>

        {/* Mobile: retry the deep link, then fall back to store badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.2 }}
          className="flex md:hidden flex-col gap-4"
        >
          <motion.button
            onClick={retryDeepLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 w-full bg-lime text-ink font-bold text-sm uppercase tracking-widest py-4 rounded-xl"
          >
            <Smartphone size={18} />
            Open The Grabbo App
          </motion.button>

          {retried && (
            <p className="text-xs text-slate -mt-1">
              Nothing happened? The app isn&apos;t installed yet — grab it below.
            </p>
          )}

          <a href={APP_STORE_URL} className="block">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 w-full bg-ink-800/60 border hairline rounded-xl py-4 text-paper font-semibold text-sm"
            >
              <Apple size={20} />
              Download on the App Store
            </motion.span>
          </a>

          <a href={PLAY_STORE_URL} className="block">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 w-full bg-ink-800/60 border hairline rounded-xl py-4 text-paper font-semibold text-sm"
            >
              <PlayCircle size={20} />
              Get it on Google Play
            </motion.span>
          </a>
        </motion.div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mt-10 text-sm text-slate hover:text-lime transition-colors"
        >
          Continue on the web instead <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
