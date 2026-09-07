"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Guideline {
  title: string;
  body: string;
}

const GUIDELINES: Guideline[] = [
  {
    title: "Delivery Windows",
    body: "Orders placed before 11pm are delivered same-day within your block's usual window. Late Night Menu orders (9pm–5am) are delivered on a rolling basis as riders become available — expect slightly longer waits at peak hours.",
  },
  {
    title: "Cancellations & Changes",
    body: "Orders can be edited or cancelled free of charge until a rider is assigned. Once a rider has your order in hand, cancellations are handled case-by-case through the Concierge.",
  },
  {
    title: "Campus Conduct",
    body: "Riders are your neighbours, not staff — please treat them accordingly. Repeated no-shows at drop-off may result in a temporary hold on your account.",
  },
  {
    title: "Payments & Refunds",
    body: "All payments are processed securely through the Grabbo app. Refunds for missing or incorrect items are issued to your original payment method within 3–5 business days.",
  },
  {
    title: "Privacy",
    body: "Your hostel block and delivery notes are visible only to the rider assigned to your order, and are discarded once the order is marked complete.",
  },
];

function GuidelineRow({ item, isOpen, onToggle }: { item: Guideline; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-t border-lime/20 last:border-b">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left"
      >
        <span className="font-display text-base sm:text-lg text-paper/90">
          {item.title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 text-lime/70"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 sm:pb-6 pr-8 text-sm leading-relaxed text-paper/60">
              {item.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GuidelinesLuxury() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-ink py-20 sm:py-28 px-4 sm:px-8 lg:px-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.3em] text-lime/70 mb-3 text-center">
          Good to Know
        </p>
        <h2 className="font-display text-2xl sm:text-3xl text-paper text-center mb-10 sm:mb-14">
          Guidelines
        </h2>

        <div>
          {GUIDELINES.map((item, i) => (
            <GuidelineRow
              key={item.title}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
