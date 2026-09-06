"use client";

const messages = [
  "Library slots filling fast",
  "Block C water maintenance tomorrow 11–2",
  "Rain expected 6pm today",
  "New vendor: Campus Bakes now live",
];

export default function TopTicker() {
  return (
    <div className="w-full bg-ink-800 border-b border-ink-700 overflow-hidden">
      <div className="flex gap-12 py-2.5 animate-[topscroll_26s_linear_infinite] whitespace-nowrap w-max">
        {[...messages, ...messages].map((m, i) => (
          <span
            key={i}
            className="font-display italic text-sm tracking-wide text-paper/80 flex items-center gap-3"
          >
            <span className="w-1 h-1 rounded-full bg-lime" />
            {m}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes topscroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
