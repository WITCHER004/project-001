export const PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(_createdAt desc) {
    "id": _id, name, category, price,
    "image": image.asset->url,
    rating, badge, description
  }
`;