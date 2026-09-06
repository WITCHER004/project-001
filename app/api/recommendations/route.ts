import { NextRequest, NextResponse } from "next/server";
import { fetchProducts } from "@/lib/sanity/products";
import { getRecommendations, type RecommendationContext } from "@/lib/recommendations";

export async function POST(req: NextRequest) {
  const context = (await req.json()) as RecommendationContext;
  const catalog = await fetchProducts();
  return NextResponse.json({ recommendations: await getRecommendations(context, catalog) });
}