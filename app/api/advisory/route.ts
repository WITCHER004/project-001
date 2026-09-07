import { NextResponse } from "next/server";

export interface AdvisoryItem {
  id: string;
  kind: "weather" | "campus" | "advisory" | "lifestyle";
  tag: string;
  title: string;
  body: string;
  generatedAt: string; // ISO timestamp
}

/**
 * MOCK endpoint standing in for a real RAG pipeline. In production this
 * would: 1) pull fresh signals (campus notice boards, a weather API, mess
 * menu changes, AQI feeds), 2) retrieve the relevant snippets, and 3) ask an
 * LLM to draft short, on-brand copy from them — then cache the result for a
 * few minutes so every visitor isn't triggering a fresh generation.
 *
 * The artificial delay below exists only so the skeleton state in
 * Advisory.tsx is actually visible in this demo; a real cached response
 * would typically return in well under 100ms.
 */
export async function GET() {
  await new Promise((r) => setTimeout(r, 900));

  const now = new Date().toISOString();
  const items: AdvisoryItem[] = [
    {
      id: "weather-rain",
      kind: "weather",
      tag: "Weather",
      title: "Heavy rain expected after 6pm today",
      body: "Delivery riders will switch to covered routes. Orders placed after 5:30pm may run 15–20 minutes longer.",
      generatedAt: now,
    },
    {
      id: "campus-water",
      kind: "campus",
      tag: "Campus notice",
      title: "Block C water supply maintenance",
      body: "Water will be shut off in Block C from 11am–2pm tomorrow. Stock up at the Grabbo store before 10:45am.",
      generatedAt: now,
    },
    {
      id: "aqi-week",
      kind: "advisory",
      tag: "Advisory",
      title: "Air quality dipping this week",
      body: "AQI is trending into the 'moderate' band. Evening outdoor sports sessions are best kept short.",
      generatedAt: now,
    },
    {
      id: "late-night-tip",
      kind: "lifestyle",
      tag: "Lifestyle",
      title: "Midterm week: the library is filling by 8pm",
      body: "If you need a quiet table after dinner, get there before 8 — the Late Night Menu delivers straight to the reading rooms.",
      generatedAt: now,
    },
  ];

  return NextResponse.json({ items });
}
