"use client";

import { motion } from "framer-motion";
import { CloudRain, ShieldAlert, Megaphone } from "lucide-react";

const advisories = [
  {
    icon: CloudRain,
    tag: "Weather",
    title: "Heavy rain expected after 6pm today",
    body: "Delivery riders will switch to covered routes. Orders placed after 5:30pm may run 15–20 minutes longer.",
    time: "Auto-published · 2h ago",
  },
  {
    icon: ShieldAlert,
    tag: "Campus notice",
    title: "Block C water supply maintenance",
    body: "Water will be shut off in Block C from 11am–2pm tomorrow. Stock up at the Grabbo store before 10:45am.",
    time: "Auto-published · 5h ago",
  },
  {
    icon: Megaphone,
    tag: "Advisory",
    title: "Air quality dipping this week",
    body: "AQI is trending into the 'moderate' band. Evening outdoor sports sessions are best kept short.",
    time: "Auto-published · Yesterday",
  },
];

const ticker = [
  "Rain expected 6pm today",
  "Block C water maintenance tomorrow 11–2",
  "AQI moderate this week",
  "Mess menu updated for Friday",
  "New vendor: Campus Bakes now live",
];

export default function Advisory() {
  return (
    <section id="advisories" className="pinboard py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <p className="text-lime font-medium mb-3">Live on campus</p>
            <h2 className="font-display text-4xl">
              Advisories, posted before you need them.
            </h2>
          </div>
          <p className="text-slate max-w-xs text-sm">
            Weather shifts, water cuts, mess changes — Grabbo auto-publishes
            the notices your hostel WhatsApp group forgets to.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {advisories.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-ink border hairline rounded-2xl p-6 relative"
            >
              <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center mb-5">
                <a.icon size={18} className="text-lime" />
              </div>
              <p className="text-xs text-coral font-medium mb-2 uppercase tracking-wide">
                {a.tag}
              </p>
              <h3 className="font-display text-xl mb-3 leading-snug">
                {a.title}
              </h3>
              <p className="text-slate text-sm mb-5">{a.body}</p>
              <p className="text-xs text-slate/70">{a.time}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* continuous ticker of headlines */}
      <div className="mt-16 border-y hairline py-4 overflow-hidden">
        <div className="flex gap-10 animate-[scroll_28s_linear_infinite] whitespace-nowrap w-max">
          {[...ticker, ...ticker].map((t, i) => (
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
