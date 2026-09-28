import type { StoreProduct } from "@/types/storefront";

export const STRIPE_API_VERSION = "2026-02-25.clover";
export const R2_BASE_URL = "https://pub-0e7fc99fe226413f853855be2eddd12d.r2.dev";

const buildAssetUrl = (fileName: string) => {
  return `${R2_BASE_URL}/${encodeURIComponent(fileName)}`;
};

const hoodieImages = [
  "hoodie 1.png",
  "hoodie 2.png",
  "hoodei 3.png",
  "hoodie 4.png",
  "hoodie 5.png",
  "hoodie 6.png",
  "hoodie 7.png",
  "hoodie 8.png",
].map(buildAssetUrl);

const pantsImages = [
  "panst1.png",
  "pants 2.png",
  "pants3.png",
  "pants 4.png",
  "pants 5.png",
  "pants 6.png",
  "pants 7.png",
  "pants 8.png",
].map(buildAssetUrl);

const hatImages = [
  "hat 1.png",
  "hat 2.png",
  "hat 3.png",
  "hat 4.png",
  "hat5.png",
  "hat6.png",
].map(buildAssetUrl);

export const PRODUCTS: StoreProduct[] = [
  {
    id: "scrapwrk-001-hoodie",
    name: "SCRAPWRK 001: HOODIE",
    price: 349,
    description:
      "One-of-a-kind handcrafted hoodie made from premium recycled materials. Each piece represents the perfect fusion of sustainability and high fashion.",
    features: [
      "Handmade in limited quantities",
      "Sustainable materials",
      "Unique design - no two pieces are alike",
      "Water-resistant outer layer",
    ],
    images: hoodieImages,
    material: "Upcycled Textiles",
    size: "Large",
    availabilityLabel: "1 of 1",
  },
  {
    id: "scrapwrk-002-pants",
    name: "SCRAPWRK 002: PANTS",
    price: 429,
    description:
      "Artisanal pants crafted from reclaimed textiles. Featuring unique patterns and textures, these pants offer comfort with sustainable style.",
    features: [
      "Ethically produced",
      "Zero-waste manufacturing",
      "Adjustable waistband",
      "Reinforced stitching for durability",
    ],
    images: pantsImages,
    material: "Upcycled Textiles",
    size: "Large",
    availabilityLabel: "1 of 1",
  },
  {
    id: "scrapwrk-003-hat",
    name: "SCRAPWRK 003: HAT",
    price: 99,
    description:
      "Minimalist hat designed with purpose. Featuring a unique silhouette and crafted from recovered materials, each hat tells its own story.",
    features: [
      "Adjustable fit",
      "UV protection",
      "Breathable material",
      "Reversible design",
    ],
    images: hatImages,
    material: "Upcycled Textiles",
    size: "Adjustable",
    availabilityLabel: "1 of 1",
  },
];

export const PRODUCT_MAP = Object.fromEntries(
  PRODUCTS.map((product) => [product.id, product]),
) as Record<string, StoreProduct>;

export const getCatalogProduct = (productId: string) => PRODUCT_MAP[productId];
