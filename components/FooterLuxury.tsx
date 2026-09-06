"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

export default function FooterLuxury() {
  return (
    <footer className="bg-black border-t border-yellow-600/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-2xl text-white mb-4">GRABBO</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Elevating the everyday by turning simple essentials into an extraordinary, curated experience.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-white mb-6 uppercase text-sm tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Shop", "About", "Events", "Testimonials", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-500 hover:text-yellow-600 transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-white mb-6 uppercase text-sm tracking-wider">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@grabbo.com"
                  className="text-gray-500 hover:text-yellow-600 transition-colors text-sm flex items-center gap-2"
                >
                  <Mail size={16} />
                  hello@grabbo.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="text-gray-500 hover:text-yellow-600 transition-colors text-sm flex items-center gap-2"
                >
                  <Phone size={16} />
                  +91 9876 543 210
                </a>
              </li>
              <li className="text-gray-500 text-sm flex items-start gap-2 pt-1">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>123 Artisan Lane, Mumbai 400050</span>
              </li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold text-white mb-6 uppercase text-sm tracking-wider">
              Follow
            </h4>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-yellow-600/10 border border-yellow-600/20 flex items-center justify-center text-yellow-600 hover:bg-yellow-600/20 transition-all"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-yellow-600/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-600">
            <p>
              © 2024 GRABBO Convenience. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-yellow-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-yellow-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-yellow-600 transition-colors">
                Sustainability
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-yellow-600/5 to-transparent blur-3xl -z-10" />
    </footer>
  );
}
