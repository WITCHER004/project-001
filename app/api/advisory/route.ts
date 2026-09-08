import { NextResponse } from "next/server";

export interface WeatherSnapshot {
  location: string;
  tempC: number;
  feelsLikeC: number;
  condition: string;
  aqi: number;
  advice: string;
}

export interface CafeteriaUpdate {
  hall: string;
  meal: string;
  items: string[];
  nextUpdate: string;
}

export interface LibraryStatus {
  block: string;
  seatsAvailable: number;
  seatsTotal: number;
  busiestWindow: string;
}

export interface CampusAdvisory {
  id: string;
  tag: string;
  title: string;
  body: string;
}

export interface ConciergePayload {
  campus: string;
  generatedAt: string; // ISO timestamp
  weather: WeatherSnapshot;
  cafeteria: CafeteriaUpdate;
  library: LibraryStatus;
  advisories: CampusAdvisory[];
}

/**
 * MOCK endpoint standing in for a real RAG pipeline. In production this
 * would: 1) pull fresh signals per module (a weather API, the cafeteria
 * POS/menu system, the library's seat-booking system, campus notice
 * boards), 2) retrieve the relevant snippets per module, and 3) ask an LLM
 * to draft short, on-brand copy from them (the `advice` and `body` fields
 * below are exactly the kind of thing that gets generated) — then cache
 * the result for a few minutes so every visitor isn't triggering a fresh
 * generation.
 *
 * Data below is illustrative and scoped to Shiv Nadar University, Dadri,
 * Greater Noida — swap for the real campus once this ships.
 *
 * The artificial delay exists only so the skeleton state in Advisory.tsx
 * is visible in this demo; a real cached response would typically return
 * in well under 100ms.
 */
export async function GET() {
  await new Promise((r) => setTimeout(r, 900));

  const payload: ConciergePayload = {
    campus: "Shiv Nadar University, Dadri, Greater Noida",
    generatedAt: new Date().toISOString(),
    weather: {
      location: "Greater Noida, NCR",
      tempC: 33,
      feelsLikeC: 36,
      condition: "Hazy sunshine",
      aqi: 172,
      advice: "AQI is trending into the 'moderate–poor' band — keep evening ground sessions short.",
    },
    cafeteria: {
      hall: "Dining Hall 2 (DH2)",
      meal: "Dinner",
      items: ["Dal Makhani & Jeera Rice", "South Indian Live Counter", "Grilled Sandwich Bar", "Multi-Cuisine Salad Station"],
      nextUpdate: "Late Night Menu unlocks at 9:00 PM",
    },
    library: {
      block: "Central Library — 3rd Floor Reading Room",
      seatsAvailable: 57,
      seatsTotal: 300,
      busiestWindow: "7–10 PM this week (mid-sem prep)",
    },
    advisories: [
      {
        id: "water-hostel-j",
        tag: "Campus Notice",
        title: "Hostel Block J water supply maintenance",
        body: "Water will be shut off in Block J from 11am–2pm tomorrow. Stock up at the Grabbo store before 10:45am.",
      },
      {
        id: "rain-evening",
        tag: "Weather",
        title: "Light showers expected after 6pm",
        body: "Delivery riders will switch to covered routes — orders placed after 5:30pm may run 10–15 minutes longer.",
      },
      {
        id: "shuttle-window",
        tag: "Advisory",
        title: "Shuttle timing shifted for exam week",
        body: "The Pari Chowk metro shuttle now runs every 20 minutes, 7am–11pm, through the exam period.",
      },
    ],
  };

  return NextResponse.json(payload);
}
