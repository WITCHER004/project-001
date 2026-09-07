"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, ShieldAlert, Megaphone, Sparkles, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import type { AdvisoryItem } from "@/app/api/advisory/route";

const ICONS: Record<AdvisoryItem["kind"], typeof CloudRain> = {
  weather: CloudRain,
  campus: ShieldAlert,
  advisory: Megaphone,
  lifestyle: Sparkles,
};

// Shown immediately if the feed fails to load, so the section never goes
// empty — clearly labelled as cached rather than live.
const FALLBACK_ITEMS: AdvisoryItem[] = [
  {
    id: "fallback-1",
    kind: "campus",
    tag: "Campus notice",
    title: "Live briefing is warming up",
    body: "We couldn't reach the briefing feed just now — here's the last known update instead.",
    generatedAt: new Date().toISOString(),
  },
];

function AdvisorySkeletonCard() {
  return (
    <div className="bg-ink border hairline rounded-2xl p-6 relative overflow-hidden">
      <div className="w-10 h-10 rounded-full bg-lime/10 mb-5" />
      <div className="h-3 w-20 rounded bg-lime/15 mb-3" />
      <div className="h-5 w-4/5 rounded bg-paper/10 mb-2" />
      <div className="h-5 w-3/5 rounded bg-paper/10 mb-4" />
      <div className="h-3 w-full rounded bg-paper/5 mb-2" />
      <div className="h-3 w-5/6 rounded bg-paper/5" />
      {/* Gold sheen sweep — reads as "the model is drafting this" rather
          than a generic gray shimmer. */}
      <div className="absolute inset-0 -translate-x-full animate-[sheen_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-lime/10 to-transparent" />
      <style>{`
        @keyframes sheen {
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default function Advisory() {
  const [items, setItems] = useState<AdvisoryItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/advisory");
        if (!res.ok) throw new Error(`Advisory feed returned ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setItems(data.items);
        setUpdatedAt(new Date());
      } catch {
        if (cancelled) return;
        setItems(FALLBACK_ITEMS);
        setFailed(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = items === null;
  const tickerText = isLoading
    ? ["Loading live briefing…"]
    : items.map((i) => i.title);

  return (
    <section id="advisories" className="pinboard py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex items-end justify-between mb-10 sm:mb-12 gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
              </span>
              <p className="text-lime font-medium text-sm uppercase tracking-wide">
                Live Campus Briefing
              </p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">
              Advisories, posted before you need them.
            </h2>
          </div>
          <div className="text-right">
            <p className="text-slate max-w-xs text-sm mb-2">
              Weather shifts, water cuts, mess changes — auto-drafted the
              moment something changes on campus.
            </p>
            {updatedAt && !failed && (
              <p className="flex items-center justify-end gap-1.5 text-xs text-slate/60">
                <RefreshCw size={11} />
                Updated {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            {failed && (
              <p className="text-xs text-coral/80">Showing cached briefing</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                exit={{ opacity: 0 }}
                className="contents"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <AdvisorySkeletonCard key={i} />
                ))}
              </motion.div>
            ) : (
              items.map((a, i) => {
                const Icon = ICONS[a.kind];
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-ink border hairline rounded-2xl p-6 relative"
                  >
                    <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center mb-5">
                      <Icon size={18} className="text-lime" />
                    </div>
                    <p className="text-xs text-coral font-medium mb-2 uppercase tracking-wide">
                      {a.tag}
                    </p>
                    <h3 className="font-display text-xl mb-3 leading-snug">
                      {a.title}
                    </h3>
                    <p className="text-slate text-sm mb-5">{a.body}</p>
                    <p className="text-xs text-slate/70">Auto-published</p>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* continuous ticker of headlines, driven by whatever's currently loaded */}
      <div className="mt-14 sm:mt-16 border-y hairline py-4 overflow-hidden">
        <div className="flex gap-10 animate-[scroll_28s_linear_infinite] whitespace-nowrap w-max">
          {[...tickerText, ...tickerText].map((t, i) => (
            <span key={i} className="text-slate text-sm flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-coral" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
