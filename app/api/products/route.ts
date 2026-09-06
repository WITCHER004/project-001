import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/sanity/products";

export const revalidate = 60;

export async function GET() {
  return NextResponse.json({ products: await fetchProducts() });
}