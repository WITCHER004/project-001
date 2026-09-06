"use client";

import { motion } from "framer-motion";
import { Award, Globe, Leaf } from "lucide-react";

export default function AboutLuxury() {
  const values = [
    {
      icon: Award,
      title: "Uncompromising Quality",
      description: "Every item meticulously curated from the world's finest producers, ethically sourced and thoughtfully presented.",
    },
    {
      icon: Globe,
      title: "Global Curation",
      description: "From the mountains of Ethiopia to the valleys of Tuscany, we bring the world's best to your doorstep.",
    },
    {
      icon: Leaf,
      title: "Ethical Excellence",
      description: "100% commitment to sustainable practices, fair trade partnerships, and environmental responsibility.",
    },
  ];

  const stats = [
    { number: "500+", label: "Curated Items" },
    { number: "50+", label: "Premium Partners" },
    { number: "24/7", label: "Availability" },
    { number: "100%", label: "Ethical Sourcing" },
  ];

  return (
    <section id="about" className="relative py-40 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/5 via-black to-black -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero narrative */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-yellow-600/60 uppercase text-sm font-semibold tracking-widest mb-6">
              Our Story
            </p>
            <h2 className="font-serif text-5xl text-white mb-8 font-light leading-tight">
              Where Convenience Meets
              <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                Connoisseurship.
              </span>
            </h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed mb-6">
              GRABBO was born from a singular vision: to elevate the mundane errand into a moment of discovery. In a world of mass-produced convenience, we chose to stand apart.
            </p>
            <p className="text-gray-500 text-lg font-light leading-relaxed">
              Every product on our shelves tells a story of craftsmanship, tradition, and passion. From artisanal perfumes to single-origin coffees, from heritage ramen to ethically sourced honey—we believe that even an everyday purchase deserves to be extraordinary.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 rounded-2xl overflow-hidden border border-yellow-600/20 bg-gradient-to-br from-gray-900/50 to-black/80 flex items-center justify-center"
          >
            <div className="text-center">
              <p className="text-6xl font-serif text-yellow-500/40 mb-4">✦</p>
              <p className="text-gray-600 italic font-light">
                Elevating the everyday
                <br />
                into an experience.
              </p>
            </div>

            {/* Decorative border animation */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 border border-yellow-600/20 rounded-2xl"
            />
          </motion.div>
        </div>

        {/* Values grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/40 to-black/60 border border-yellow-600/10 hover:border-yellow-600/30 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-600/20 to-amber-600/10 flex items-center justify-center mb-6"
              >
                <value.icon className="text-yellow-600" size={24} />
              </motion.div>
              <h3 className="font-serif text-xl text-white mb-3">
                {value.title}
              </h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats showcase */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-y border-yellow-600/10"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <motion.p
                className="font-serif text-4xl text-yellow-500 mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.number}
              </motion.p>
              <p className="text-gray-500 text-sm uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center max-w-3xl mx-auto"
        >
          <h3 className="font-serif text-4xl text-white mb-6 font-light">
            Our Commitment
          </h3>
          <p className="text-gray-400 text-lg font-light leading-relaxed mb-10">
            We partner exclusively with producers who share our values: ethical labor practices, environmental stewardship, and an unwavering commitment to quality. When you shop GRABBO, you're supporting a global community of artisans and makers.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block px-10 py-5 bg-gradient-to-r from-yellow-600/20 to-amber-600/10 border border-yellow-600/30 rounded-xl text-yellow-600 font-semibold hover:border-yellow-600/60 transition-all"
          >
            Learn About Our Partners
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
