"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, Moon, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import RevealText from "./RevealText";
import { useLateNightMode } from "@/hooks/useLateNightMode";

const Scene3DLuxury = dynamic(() => import("./Scene3DLuxury"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-ink" />,
});

export default function HeroUltraCinematic() {
  const [isClient, setIsClient] = useState(false);
  const [scrollHint, setScrollHint] = useState(true);
  const lateNight = useLateNightMode();

  const heroRef = useRef<HTMLElement>(null);
  const cursorX = useMotionValue(-9999);
  const cursorY = useMotionValue(-9999);
  const spotlightX = useSpring(cursorX, { stiffness: 120, damping: 25 });
  const spotlightY = useSpring(cursorY, { stiffness: 120, damping: 25 });

  // Blur/fade thresholds scale to the viewport's own height so a short
  // mobile hero finishes its focus-pull in the same visual proportion as a
  // tall desktop one, instead of using a fixed pixel range that triggers
  // too late (or never) on small screens.
  const [viewportHeight, setViewportHeight] = useState(900);
  useEffect(() => {
    const update = () => setViewportHeight(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollY } = useScroll();
  const sceneBlur = useTransform(scrollY, [0, viewportHeight], [0, 18]);
  const sceneOpacity = useTransform(scrollY, [0, viewportHeight], [1, 0.35]);
  const sceneBlurFilter = useTransform(sceneBlur, (v) => `blur(${v}px)`);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Only active while the cursor is over the hero band.
      if (e.clientY > rect.bottom) {
        cursorX.set(-9999);
        return;
      }
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleScroll = () => setScrollHint(window.scrollY <= 100);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Full-bleed 3D background — pinned behind the entire page, not
          scoped to the hero's own box. Sharpness fades on scroll via the
          motion values above. */}
      <motion.div
        aria-hidden
        className="fixed inset-0 w-full h-full z-[-1]"
        style={{ filter: sceneBlurFilter, opacity: sceneOpacity }}
      >
        {isClient && <Scene3DLuxury />}
        {/* Cinematic vignette + warm/cool grade, sits above the canvas */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(11,10,8,0.55) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: lateNight
              ? "linear-gradient(135deg, rgba(139,58,58,0.10) 0%, rgba(11,10,8,0.2) 100%)"
              : "linear-gradient(135deg, rgba(201,162,39,0.06) 0%, rgba(139,58,58,0.05) 100%)",
          }}
        />
      </motion.div>

      <section ref={heroRef} id="top" className="relative min-h-screen overflow-hidden pt-20 sm:pt-24 pb-16 sm:pb-20">
        {/* Cursor spotlight — soft antique-gold glow that tracks the mouse */}
        {isClient && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute w-[520px] h-[520px] rounded-full -z-[1]"
            style={{
              left: spotlightX,
              top: spotlightY,
              x: "-50%",
              y: "-50%",
              background:
                "radial-gradient(circle, rgba(201,162,39,0.14) 0%, rgba(201,162,39,0.05) 45%, transparent 70%)",
            }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid md:grid-cols-2 gap-10 sm:gap-16 items-center relative z-20">
          {/* Text Content — volumetric reveal: emerges from depth (blurred,
              scaled up, translucent) into sharp focus, like a title card. */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 1.4, filter: "blur(18px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <div className="p-2 rounded-lg bg-lime/10 border border-lime/30 backdrop-blur-xl">
                {lateNight ? (
                  <Moon className="w-4 h-4 text-lime" />
                ) : (
                  <Sparkles className="w-4 h-4 text-lime animate-pulse" />
                )}
              </div>
              <span className="text-sm font-semibold text-lime/90 tracking-widest uppercase">
                {lateNight ? "Late Night Menu Live" : "Your Campus, Curated"}
              </span>
            </motion.div>

            <RevealText staggerDelay={0.18}>
              <motion.h1
                initial={{ opacity: 0, y: 30, scale: 1.15, filter: "blur(14px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-6 text-paper"
              >
                {lateNight ? "Midnight" : "A Flavor"}
                <br />
                <span className="italic text-lime">
                  {lateNight ? "Cravings" : "Cascade"}
                </span>
              </motion.h1>

              <p className="text-lg text-slate max-w-md mb-12 leading-relaxed font-light">
                {lateNight
                  ? "Hostel lights still on? The Late Night Menu is live — quick eats, quiet delivery, straight to your block."
                  : "Everything your campus runs on, delivered like it means something. Watch the scene settle as you scroll — this is the whole store, in one frame."}
              </p>

              <div className="flex flex-wrap items-center gap-5 mb-16">
                <motion.a
                  href="#shop"
                  whileHover={{ y: -4, boxShadow: "0 0 40px rgba(201,162,39,0.35)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center gap-3 bg-lime text-ink font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-gold-lg transition-all duration-300"
                >
                  {lateNight ? "Order Late Night Menu" : "Explore Now"}
                  <ArrowDownRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                </motion.a>

                <motion.a
                  href="#about"
                  whileHover={{ x: 4 }}
                  className="text-sm font-semibold text-paper/80 hover:text-lime transition-colors group flex items-center gap-2 border border-ink-700 px-6 py-4 rounded-lg"
                >
                  Our Story
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </motion.a>
              </div>
            </RevealText>
          </div>

          {/* Right column is now empty of its own boxed canvas — the scene
              lives full-bleed behind the whole page. This spacer keeps the
              two-column rhythm on desktop without a redundant nested canvas. */}
          <div className="hidden md:block h-[500px]" />
        </div>

        <AnimatedScrollIndicator show={scrollHint} />
      </section>
    </>
  );
}

function AnimatedScrollIndicator({ show }: { show: boolean }) {
  return (
    <motion.div
      animate={{ y: [0, 10, 0], opacity: show ? 1 : 0 }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 z-20"
    >
      <span className="text-xs text-slate uppercase tracking-widest">Scroll</span>
      <div className="w-6 h-10 border border-lime/40 rounded-full flex justify-center p-2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1 h-2 bg-lime rounded-full"
        />
      </div>
    </motion.div>
  );
}
