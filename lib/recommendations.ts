import "server-only";
import type { Product } from "@/lib/type";

export interface RecommendationContext {
  productId?: string;
  cartItemIds?: string[];
}

/**
 * Swap this body for a call to your own model/pipeline, e.g.:
 *   const res = await fetch(process.env.ML_RECOMMENDATION_ENDPOINT!, {
 *     method: "POST", body: JSON.stringify(context),
 *   });
 *   const { productIds } = await res.json();
 *   return productIds.map(id => catalog.find(p => p.id === id)).filter(Boolean);
 */
export async function getRecommendations(
  context: RecommendationContext,
  catalog: Product[]
): Promise<Product[]> {
  const excluded = new Set([context.productId, ...(context.cartItemIds ?? [])]);
  const anchor = catalog.find((p) => p.id === context.productId);
  const pool = catalog.filter((p) => !excluded.has(p.id));
  if (!anchor) return pool.slice(0, 4);
  const sameCategory = pool.filter((p) => p.category === anchor.category);
  const rest = pool.filter((p) => p.category !== anchor.category);
  return [...sameCategory, ...rest].slice(0, 4);
}