# Grabbo — Setup Guide (Absolute Beginner Friendly)

This is a Next.js 14 + Tailwind CSS + Framer Motion + React Three Fiber website.
Follow these steps exactly, in order, in your terminal.

## 1. Install Node.js (skip if you already have it)

Check if you have it:
```
node -v
```
If that prints a version number like `v18.x` or `v20.x`, skip to step 2.
If you get "command not found", download and install Node.js LTS from
https://nodejs.org (just click through the installer with default options),
then restart your terminal and run `node -v` again to confirm.

## 2. Unzip the project and move into it

```
cd path/to/where/you/unzipped/grabbo
```
(Replace with wherever the `grabbo` folder actually is — e.g. `cd ~/Downloads/grabbo`.)

## 3. Install all dependencies

This single command reads `package.json` and installs Next.js, React,
Tailwind, Framer Motion, and the 3D libraries (`three`, `@react-three/fiber`,
`@react-three/drei`) all at once:

```
npm install
```

This will take 1–3 minutes and create a `node_modules` folder. That's normal.

## 4. Run the project locally

```
npm run dev
```

You'll see something like:
```
▲ Next.js 14.2.5
- Local: http://localhost:3000
```

Open **http://localhost:3000** in your browser. That's the live site.

Any code changes you make will hot-reload automatically — no need to restart.

## 5. Stopping the server

Press `Ctrl + C` in the terminal.

## 6. Building for production / deploying

When you're ready to deploy (e.g. to Vercel, which is the easiest option
for Next.js and has a free tier):

```
npm run build
npm run start
```

Or, for the zero-config route: push this folder to a GitHub repo, go to
https://vercel.com, click "New Project," import the repo, and click Deploy.
No configuration needed — Vercel auto-detects Next.js.

---

## Project structure

```
grabbo/
├── app/
│   ├── layout.tsx      → root layout, loads fonts (Fraunces + Inter)
│   ├── page.tsx         → assembles all sections in order
│   └── globals.css      → Tailwind + custom textures/animations
├── components/
│   ├── Nav.tsx           → sticky nav bar
│   ├── Hero.tsx          → hero section, headline + CTA
│   ├── Scene3D.tsx        → the 3D floating phone + shapes (R3F)
│   ├── ScrollProgress.tsx → the lime scroll progress bar
│   ├── Vision.tsx         → founder's vision / about section
│   ├── Advisory.tsx       → auto-published advisories + ticker
│   ├── Events.tsx         → horizontal-scroll event ticket cards
│   ├── Testimonials.tsx   → Google-Reviews-style testimonials
│   └── Footer.tsx         → download CTAs, partner contact, socials
├── tailwind.config.ts   → brand colors, fonts
└── package.json
```

## Things to customize before you launch

1. **Replace placeholder content** — the advisories, events, testimonials,
   and stats (12k+ orders, etc.) in each component file are placeholder
   copy. Search each component for the arrays at the top (`advisories`,
   `events`, `reviews`) and swap in real data.
2. **App store links** — in `components/Footer.tsx`, the "Download for
   iOS/Android" buttons currently point to `#`. Replace with your real
   App Store / Play Store URLs once live.
3. **Social links** — same file, Instagram/Twitter/LinkedIn icons point to
   `#`. Add your real profile URLs.
4. **Fonts** — this uses Fraunces (display serif) + Inter (body) from
   Google Fonts, loaded automatically via `next/font/google`. No extra
   setup needed. If you have a licensed "General Sans" font file, you can
   swap it in via `next/font/local` in `app/layout.tsx`.
5. **Favicon / metadata** — update the `metadata` object in
   `app/layout.tsx` and drop a `favicon.ico` into `/app`.

## Design notes

- **Palette**: Ink navy (#0F1226) background, warm paper (#F6F4EC) for
  light sections, lime (#C6F135) as a sparse highlighter accent, coral
  (#FF5B4C) for secondary emphasis on events/urgency.
- **Type**: Fraunces (serif, personality) for all headlines, Inter for
  body/UI text — deliberately not the generic AI-cliché combo.
- **The "extra touch"**: a lime scroll-progress bar styled like a strip
  of highlighter tape, a continuously scrolling advisory ticker (like a
  campus notice board), and perforated "ticket stub" event cards with a
  dashed tear-line above the CTA.
