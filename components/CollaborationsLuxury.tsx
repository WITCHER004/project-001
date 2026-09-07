"use client";

import { motion } from "framer-motion";
import { TrendingUp, Handshake, Store, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import RevealText from "./RevealText";

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const AUDIENCES = [
  {
    icon: TrendingUp,
    title: "Investors",
    body: "A campus-native delivery layer with a built-in advisory feed and events funnel — growth metrics available under NDA.",
  },
  {
    icon: Handshake,
    title: "Brand Deals",
    body: "Reach every hostel block on campus through one storefront. Limited drops and co-branded bundles perform especially well here.",
  },
  {
    icon: Store,
    title: "Local Restaurants",
    body: "Get listed without building your own delivery fleet. We handle riders, advisories, and the app — you handle the food.",
  },
];

const STATS = [
  { number: "12K+", label: "Active Students Reached" },
  { number: "40+", label: "Campus Vendors Onboarded" },
  { number: "3", label: "Cities, Expanding in 2026" },
  { number: "24/7", label: "Delivery Coverage" },
];

type PartnerType = "Investor" | "Brand" | "Restaurant" | "Other";

interface FormState {
  name: string;
  email: string;
  organization: string;
  partnerType: PartnerType;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  organization: "",
  partnerType: "Brand",
  message: "",
};

function UnderlineInput({
  label,
  value,
  onChange,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-slate">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-ink-700 focus:border-lime outline-none py-2.5 mt-1 text-paper placeholder:text-slate/50 transition-colors"
      />
    </label>
  );
}

export default function CollaborationsLuxury() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: wire to a real endpoint (e.g. POST /api/partnerships) once one
    // exists — this is UI-only for now, so nothing is actually sent.
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="partners" className="relative bg-ink py-24 sm:py-32 lg:py-40 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-coral/[0.04] blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-lime/[0.04] blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: LUXURY_EASE }}
          className="max-w-2xl mb-16 sm:mb-20"
        >
          <p className="text-lime text-xs uppercase tracking-[0.3em] mb-4">
            Future Growth &amp; Digital Presence
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-paper leading-tight">
            Built for campus.
            <br />
            <span className="italic text-lime">Built to expand.</span>
          </h2>
          <p className="text-slate mt-6 text-base sm:text-lg leading-relaxed">
            Grabbo started as one hostel's delivery run. It's now a
            distribution layer for campus life — advisories, events, and
            commerce in one app. Here's how to build on it with us.
          </p>
        </motion.div>

        {/* Audience cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20 sm:mb-28">
          {AUDIENCES.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: LUXURY_EASE }}
              className="border hairline rounded-2xl p-6 sm:p-7 bg-ink-800/40"
            >
              <div className="w-10 h-10 rounded-full bg-lime/15 flex items-center justify-center mb-5">
                <a.icon size={18} className="text-lime" />
              </div>
              <h3 className="font-display text-xl text-paper mb-3">{a.title}</h3>
              <p className="text-slate text-sm leading-relaxed">{a.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 pb-20 sm:pb-28 border-b hairline"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl sm:text-4xl text-lime">{s.number}</p>
              <p className="text-xs text-slate uppercase tracking-wide mt-2">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Contact form */}
        <div className="grid md:grid-cols-2 gap-12 sm:gap-16 pt-20 sm:pt-28 items-start">
          <RevealText staggerDelay={0.15}>
            <p className="text-lime text-xs uppercase tracking-[0.3em] mb-4">
              Get in Touch
            </p>
            <h3 className="font-display italic text-3xl sm:text-4xl text-paper leading-snug mb-6">
              Let's build the next chapter of campus commerce together.
            </h3>
            <p className="text-slate text-sm leading-relaxed">
              Whether you're backing us, stocking us, or selling through us —
              tell us a little about what you have in mind and we'll follow up
              within two business days.
            </p>
          </RevealText>

          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border hairline rounded-2xl p-8 flex items-start gap-4 bg-ink-800/40"
              >
                <div className="w-9 h-9 rounded-full bg-lime/15 flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-lime" />
                </div>
                <div>
                  <p className="font-display text-lg text-paper mb-1">Message sent</p>
                  <p className="text-slate text-sm">
                    Thanks, {form.name.split(" ")[0] || "there"} — we'll be in touch soon.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid sm:grid-cols-2 gap-6">
                  <UnderlineInput label="Name" value={form.name} onChange={(v) => update("name", v)} />
                  <UnderlineInput label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} />
                </div>
                <UnderlineInput
                  label="Company / Organization"
                  value={form.organization}
                  onChange={(v) => update("organization", v)}
                  required={false}
                />

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-slate">
                    I'm reaching out as a
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(["Investor", "Brand", "Restaurant", "Other"] as PartnerType[]).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => update("partnerType", t)}
                        className={`text-xs px-3.5 py-2 rounded-full border transition-colors ${
                          form.partnerType === t
                            ? "border-lime bg-lime/15 text-lime"
                            : "border-ink-700 text-slate hover:border-lime/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-slate">Message</span>
                  <textarea
                    required
                    rows={3}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="w-full bg-transparent border-b border-ink-700 focus:border-lime outline-none py-2.5 mt-1 text-paper placeholder:text-slate/50 transition-colors resize-none"
                  />
                </label>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ y: -3, boxShadow: "0 0 40px rgba(201,162,39,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-3 bg-lime text-ink font-bold px-8 py-4 rounded-xl shadow-xl transition-all duration-300 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Start the Conversation"}
                  {!submitting && (
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
