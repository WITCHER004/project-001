"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";
import { useRef } from "react";

// X (Twitter) isn't in lucide's icon set as a named export in this version,
// so it's drawn as a tiny inline glyph to match icon sizing exactly.
function XGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.6l-5.2-6.8L5.4 22H2.3l8.1-9.3L1.4 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
    </svg>
  );
}

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: XGlyph, href: "#", label: "X" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

function MagneticIcon({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ElementType;
  href: string;
  label: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.4); // pull strength — subtle, not a full snap-to-cursor
    y.set(relY * 0.4);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={label}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.92 }}
      className="w-11 h-11 rounded-full bg-lime/10 border border-lime/25 flex items-center justify-center text-lime hover:bg-lime/15 hover:border-lime/50 transition-colors"
    >
      <Icon size={18} />
    </motion.a>
  );
}

export default function FooterLuxury() {
  return (
    <footer className="bg-ink border-t border-ink-700 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-2xl text-paper mb-4">GRABBO</h3>
            <p className="text-slate text-sm leading-relaxed">
              Your campus, delivered — plus the advisories, events, and slots
              that keep hostel life a little easier.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-paper mb-6 uppercase text-sm tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Shop", "About", "Events", "Testimonials", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-slate hover:text-lime transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-paper mb-6 uppercase text-sm tracking-wider">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@grabbo.com"
                  className="text-slate hover:text-lime transition-colors text-sm flex items-center gap-2"
                >
                  <Mail size={16} />
                  hello@grabbo.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="text-slate hover:text-lime transition-colors text-sm flex items-center gap-2"
                >
                  <Phone size={16} />
                  +91 9876 543 210
                </a>
              </li>
              <li className="text-slate text-sm flex items-start gap-2 pt-1">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Campus Block A, Main Gate</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold text-paper mb-6 uppercase text-sm tracking-wider">
              Follow
            </h4>
            <div className="flex gap-4">
              {socials.map((s) => (
                <MagneticIcon key={s.label} {...s} />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-ink-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate">
            <p>© 2026 GRABBO. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-lime transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-lime transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-lime transition-colors">Sustainability</a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-lime/5 blur-3xl -z-0" />
    </footer>
  );
}
