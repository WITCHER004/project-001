"use client";

import { motion } from "framer-motion";
import {
  CloudSun,
  Library,
  UtensilsCrossed,
  Megaphone,
  RefreshCw,
  Wind,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ConciergePayload } from "@/app/api/advisory/route";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Shown immediately if the feed fails to load, so the dashboard never goes
// empty — clearly labelled as cached rather than live.
const FALLBACK_PAYLOAD: ConciergePayload = {
  campus: "Shiv Nadar University, Dadri, Greater Noida",
  generatedAt: new Date().toISOString(),
  weather: {
    location: "Greater Noida, NCR",
    tempC: 31,
    feelsLikeC: 33,
    condition: "Clear",
    aqi: 140,
    advice: "Briefing is warming up — showing the last known snapshot instead.",
  },
  cafeteria: {
    hall: "Dining Hall 2 (DH2)",
    meal: "Today",
    items: ["Menu refreshing…"],
    nextUpdate: "Check back shortly",
  },
  library: {
    block: "Central Library",
    seatsAvailable: 0,
    seatsTotal: 300,
    busiestWindow: "—",
  },
  advisories: [
    {
      id: "fallback-1",
      tag: "Campus Notice",
      title: "Live briefing is warming up",
      body: "We couldn't reach the briefing feed just now — here's the last known update instead.",
    },
  ],
};

function aqiTone(aqi: number) {
  if (aqi <= 100) return { label: "Good", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" };
  if (aqi <= 150) return { label: "Moderate", classes: "bg-lime/15 text-lime border-lime/25" };
  return { label: "Poor", classes: "bg-coral/15 text-coral border-coral/25" };
}

function ConciergeCardShell({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CloudSun;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: LUXURY_EASE }}
      className="bg-ink border hairline rounded-2xl p-6 flex flex-col"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-full bg-lime/15 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-lime" />
        </div>
        <p className="text-xs text-slate uppercase tracking-wide font-medium">{label}</p>
      </div>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

function ConciergeSkeletonCard() {
  return (
    <div className="bg-ink border hairline rounded-2xl p-6 relative overflow-hidden">
      <div className="w-9 h-9 rounded-full bg-lime/10 mb-5" />
      <div className="h-8 w-2/3 rounded bg-paper/10 mb-3" />
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
  const [data, setData] = useState<ConciergePayload | null>(null);
  const [failed, setFailed] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/advisory");
        if (!res.ok) throw new Error(`Advisory feed returned ${res.status}`);
        const payload: ConciergePayload = await res.json();
        if (cancelled) return;
        setData(payload);
        setUpdatedAt(new Date());
      } catch {
        if (cancelled) return;
        setData(FALLBACK_PAYLOAD);
        setFailed(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = data === null;
  const occupancyPct = data ? Math.round((1 - data.library.seatsAvailable / data.library.seatsTotal) * 100) : 0;
  const aqi = data ? aqiTone(data.weather.aqi) : aqiTone(0);

  const tickerText = isLoading
    ? ["Loading live briefing…"]
    : data.advisories.map((a) => a.title);

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
                Smart Campus Concierge · Predictive
              </p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl mb-2">
              Everything your campus needs you to know, before you ask.
            </h2>
            <p className="text-slate text-sm">
              {isLoading ? "Syncing campus feeds…" : data.campus}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate max-w-xs text-sm mb-2">
              Weather, mess menus, library seats, and campus notices — drafted
              the moment something changes.
            </p>
            {updatedAt && !failed && (
              <p className="flex items-center justify-end gap-1.5 text-xs text-slate/60">
                <RefreshCw size={11} />
                Updated {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            {failed && <p className="text-xs text-coral/80">Showing cached briefing</p>}
          </div>
        </div>

        {/* Modular grid — weather / cafeteria / library, each a distinct
            RAG-fillable slot rather than a generic feed item. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ConciergeSkeletonCard key={i} />)
          ) : (
            <>
              <ConciergeCardShell icon={CloudSun} label="Weather · Live">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="font-display text-4xl text-paper">{data.weather.tempC}°</p>
                  <p className="text-slate text-sm">feels {data.weather.feelsLikeC}°</p>
                </div>
                <p className="text-paper/80 text-sm mb-3">
                  {data.weather.condition} · {data.weather.location}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mb-3 ${aqi.classes}`}
                >
                  <Wind size={11} />
                  AQI {data.weather.aqi} · {aqi.label}
                </span>
                <p className="text-slate text-sm leading-relaxed">{data.weather.advice}</p>
              </ConciergeCardShell>

              <ConciergeCardShell icon={Library} label="Library · Seating">
                <div className="flex items-baseline gap-2 mb-3">
                  <p className="font-display text-4xl text-paper">{data.library.seatsAvailable}</p>
                  <p className="text-slate text-sm">/ {data.library.seatsTotal} seats open</p>
                </div>
                <div className="h-1.5 w-full rounded-full bg-ink-700 overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${occupancyPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: LUXURY_EASE }}
                    className={`h-full rounded-full ${occupancyPct > 80 ? "bg-coral" : "bg-lime"}`}
                  />
                </div>
                <p className="text-paper/80 text-sm mb-1">{data.library.block}</p>
                <p className="flex items-center gap-1.5 text-slate text-sm leading-relaxed">
                  <Users size={12} className="text-lime flex-shrink-0" />
                  Busiest: {data.library.busiestWindow}
                </p>
              </ConciergeCardShell>

              <ConciergeCardShell icon={UtensilsCrossed} label="Cafeteria · Menu">
                <p className="text-paper/80 text-sm mb-1">{data.cafeteria.hall}</p>
                <p className="text-xs text-lime uppercase tracking-wide mb-3">{data.cafeteria.meal}</p>
                <ul className="space-y-1.5 mb-4">
                  {data.cafeteria.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-paper/70">
                      <span className="w-1 h-1 rounded-full bg-lime flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-slate text-xs">{data.cafeteria.nextUpdate}</p>
              </ConciergeCardShell>
            </>
          )}
        </div>

        {/* Campus advisories — the general notices/weather/shuttle alerts,
            kept as compact cards below the three headline modules. */}
        {!isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {data.advisories.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: LUXURY_EASE, delay: i * 0.08 }}
                className="bg-ink-800/40 border hairline rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <Megaphone size={14} className="text-coral flex-shrink-0" />
                  <p className="text-xs text-coral font-medium uppercase tracking-wide">{a.tag}</p>
                </div>
                <h3 className="font-display text-base text-paper mb-1.5 leading-snug">{a.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{a.body}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Continuous ticker of headlines, driven by whatever's currently loaded */}
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
