export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  /** Sanity CDN URL (production) or emoji placeholder (seed data). */
  image: string;
  rating: number;
  badge?: string;
  description: string;
}