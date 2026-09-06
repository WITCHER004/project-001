import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand system (source of truth: app/globals.css + app/layout.tsx)
        ink: {
          DEFAULT: "#0F1226",
          800: "#171A38", // card / pinboard surfaces
          700: "#23264A", // hairline borders
        },
        paper: "#F6F4EC",
        lime: "#C6F135",
        coral: "#FF6A4D",
        slate: "#93A0C2",

        // Luxury black & grays (legacy — still used by Hero/Shop/About,
        // kept so those sections don't break; not for new work)
        "black": "#000000",
        "gray-950": "#0a0a0a",
        "gray-900": "#1a1a1a",
        "gray-850": "#2a2a2a",
        "gray-800": "#3a3a3a",
        "yellow-gold": "#d4af37",
        "amber-dark": "#8B4513",
        "gold-light": "#e8d4a0",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-general)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-general)", "sans-serif"],
      },
      backgroundImage: {
        "noise": "url('/noise.png')",
        "grain": "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 seed=%222%22 /%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23noise)%22 opacity=%220.02%22/%3E%3C/svg%3E')",
        "gradient-gold": "linear-gradient(135deg, #d4af37 0%, #e8d4a0 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow": "0 0 30px rgba(212, 175, 55, 0.3)",
        "glow-lg": "0 0 60px rgba(212, 175, 55, 0.4)",
        "gold-lg": "0 0 50px rgba(212, 175, 55, 0.3), 0 0 100px rgba(212, 175, 55, 0.15)",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(212, 175, 55, 0.5)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
