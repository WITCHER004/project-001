import "server-only";
import type { Product } from "@/lib/type";
import { getSanityClient, SANITY_CONFIGURED } from "./client";
import { PRODUCTS_QUERY } from "./queries";
import { seedProducts } from "./seedProducts";

export async function fetchProducts(): Promise<Product[]> {
  if (!SANITY_CONFIGURED) return seedProducts;
  try {
    const client = getSanityClient();
    const products = await client.fetch<Product[]>(PRODUCTS_QUERY);
    return products?.length ? products : seedProducts;
  } catch (err) {
    console.error("[sanity] failed to fetch products, using seed data", err);
    return seedProducts;
  }
}