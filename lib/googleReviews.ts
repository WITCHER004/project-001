/**
 * Shape matches the Google Places API "reviews" field exactly, so swapping
 * the mock below for the real thing later is a drop-in change:
 * https://developers.google.com/maps/documentation/places/web-service/details#reviews
 */
export interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number; // 1-5
  relative_time_description: string;
  text: string;
  time: number; // unix seconds
}

const MOCK_REVIEWS: GoogleReview[] = [
  { author_name: "Ananya Rao", rating: 5, relative_time_description: "2 weeks ago", text: "Ordered at 1am during finals week and it still showed up faster than I expected. The packaging alone felt like more than a snack run.", time: 1717000000 },
  { author_name: "Kabir Mehta", rating: 5, relative_time_description: "a month ago", text: "Grabbo is the only campus app that treats a midnight coffee run with the same care most brands reserve for real deliveries.", time: 1715000000 },
  { author_name: "Sneha Patil", rating: 5, relative_time_description: "3 weeks ago", text: "Sent a care package to a friend in Block C through the app — she said the notes card made it feel like a real gift, not just snacks.", time: 1716200000 },
  { author_name: "Devraj Singh", rating: 4, relative_time_description: "2 months ago", text: "Reliable every time. My only wish is that the Late Night Menu had a couple more dessert options.", time: 1712000000 },
  { author_name: "Meera Iyer", rating: 5, relative_time_description: "1 week ago", text: "The advisories feature has genuinely saved me twice this semester — knew about the water cut before my own hostel group did.", time: 1717800000 },
  { author_name: "Arjun Kapoor", rating: 5, relative_time_description: "5 days ago", text: "Referred half my floor. It's rare to find something this polished built around something as ordinary as a snack order.", time: 1718000000 },
];

/**
 * Client-safe mock. A real integration should NOT call the Places API
 * directly from the browser — the API key would be exposed. Instead, proxy
 * it through a server route, e.g.:
 *
 *   // app/api/reviews/route.ts
 *   const res = await fetch(
 *     `https://maps.googleapis.com/maps/api/place/details/json` +
 *       `?place_id=${PLACE_ID}&fields=reviews&key=${process.env.GOOGLE_PLACES_API_KEY}`
 *   );
 *   const data = await res.json();
 *   return NextResponse.json({ reviews: data.result.reviews });
 *
 * and have this function `fetch("/api/reviews")` instead of returning the
 * mock array below.
 */
export async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  await new Promise((r) => setTimeout(r, 700));
  return MOCK_REVIEWS;
}
