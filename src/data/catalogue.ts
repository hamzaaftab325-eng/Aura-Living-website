/**
 * Aura Living — Mock product catalogue.
 * In production this is served by the backend; for the build we ship a typed
 * mock dataset that exercises every UI state (discounts, badges, variants,
 * low-stock, gift-wrap eligibility).
 */

import type { Collection, Product, Testimonial } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "p_brass_lotus_01",
    slug: "brass-lotus-table-lamp",
    name: "Brass Lotus Table Lamp",
    category: "lamps",
    shortDescription: "Handcrafted brass lamp with a warm ivory linen shade.",
    longDescription:
      "Inspired by the lotus motifs of Mughal architecture, this brass table lamp is hand-spun by master craftsmen in Multan. The ivory linen shade diffuses a warm golden glow that's perfect for bedside tables and reading nooks. Each lamp carries the subtle hammer marks of its maker — a signature of true craftsmanship.",
    price: 18500,
    discountPercent: 15,
    badges: ["bestseller"],
    rating: 4.8,
    reviewCount: 124,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1080&q=80",
    ],
    variants: [
      { id: "v_warm", label: "Warm Light", sku: "BL-WARM", priceDelta: 0, stock: 18 },
      { id: "v_cool", label: "Cool Light", sku: "BL-COOL", priceDelta: 500, stock: 7 },
    ],
    tags: ["brass", "handcrafted", "bedside", "mughal"],
    material: "Polished brass · Ivory linen",
    dimensions: "H 56 cm · W 28 cm",
    weight: "2.4 kg",
    origin: "Multan, Pakistan",
    isGiftWrapEligible: true,
    stock: 25,
    featured: true,
    bestseller: true,
    createdAt: "2025-09-14",
  },
  {
    id: "p_onyx_pendant_01",
    slug: "onyx-pendant-light",
    name: "Onyx Stone Pendant Light",
    category: "lamps",
    shortDescription: "Translucent Balochistan onyx glows when lit from within.",
    longDescription:
      "Hand-carved from genuine Balochistan onyx, this pendant light transforms any room when illuminated. The stone's natural veins create a unique pattern in every piece — no two are alike. Suspended by a brushed-brass chain, it casts a honeyed light that turns dining into ritual.",
    price: 32500,
    discountPercent: 0,
    badges: ["new"],
    rating: 4.9,
    reviewCount: 47,
    images: [
      "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1080&q=80",
    ],
    variants: [
      { id: "v_honey", label: "Honey Onyx", sku: "OP-HONEY", priceDelta: 0, stock: 6 },
      { id: "v_white", label: "White Onyx", sku: "OP-WHITE", priceDelta: 2000, stock: 3 },
    ],
    tags: ["onyx", "pendant", "balochistan", "dining"],
    material: "Natural onyx · Brushed brass",
    dimensions: "H 32 cm · W 18 cm",
    weight: "3.8 kg",
    origin: "Quetta, Pakistan",
    isGiftWrapEligible: false,
    stock: 9,
    featured: true,
    bestseller: false,
    createdAt: "2026-01-22",
  },
  {
    id: "p_areca_palm_01",
    slug: "areca-palm-pot",
    name: "Areca Palm in Terracotta Pot",
    category: "plants",
    shortDescription: "Air-purifying indoor palm in a hand-thrown terracotta planter.",
    longDescription:
      "The Areca Palm is one of the most effective natural air purifiers, recommended by NASA studies. Potted in a hand-thrown terracotta planter from the potters of Hala, Sindh. Loves bright indirect light and weekly watering — perfect for Karachi and Lahore homes.",
    price: 6800,
    discountPercent: 0,
    badges: ["bestseller"],
    rating: 4.7,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1080&q=80",
    ],
    variants: [
      { id: "v_small", label: "Small · 60cm", sku: "AP-S", priceDelta: 0, stock: 24 },
      { id: "v_medium", label: "Medium · 90cm", sku: "AP-M", priceDelta: 1500, stock: 12 },
      { id: "v_large", label: "Large · 120cm", sku: "AP-L", priceDelta: 3500, stock: 5 },
    ],
    tags: ["air-purifying", "indoor", "low-light", "hala"],
    material: "Living plant · Terracotta",
    dimensions: "H 60–120 cm · W 40 cm",
    weight: "4.5 kg",
    origin: "Hala, Sindh",
    isGiftWrapEligible: true,
    stock: 41,
    featured: true,
    bestseller: true,
    createdAt: "2025-11-02",
  },
  {
    id: "p_pothos_marble_01",
    slug: "marble-queen-pothos",
    name: "Marble Queen Pothos",
    category: "plants",
    shortDescription: "Trailing variegated vine — nearly indestructible.",
    longDescription:
      "The Marble Queen Pothos is the perfect plant for first-time plant parents. Its cascading cream-and-green vines can grow several metres long, rooting readily in water or soil. Tolerates low light, irregular watering, and the occasional neglect — and still thrives.",
    price: 2400,
    discountPercent: 10,
    badges: ["sale"],
    rating: 4.9,
    reviewCount: 213,
    images: [
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1080&q=80",
    ],
    variants: [
      { id: "v_hanging", label: "Hanging Basket", sku: "MQ-HANG", priceDelta: 0, stock: 30 },
      { id: "v_table", label: "Table Pot", sku: "MQ-TABLE", priceDelta: -200, stock: 18 },
    ],
    tags: ["beginner", "trailing", "low-light", "apartment"],
    material: "Living plant · Plastic pot",
    dimensions: "Vine length up to 2m",
    weight: "1.2 kg",
    origin: "Local nursery, Lahore",
    isGiftWrapEligible: true,
    stock: 48,
    featured: false,
    bestseller: true,
    createdAt: "2025-08-19",
  },
  {
    id: "p_soy_saffron_01",
    slug: "saffron-soy-candle",
    name: "Saffron & Oud Soy Candle",
    category: "candles",
    shortDescription: "Hand-poured soy wax with saffron, oud, and rose absolute.",
    longDescription:
      "This candle captures the essence of an Eid evening — saffron, oud, and a hint of Damask rose absolute. Poured in small batches from 100% soy wax with a cotton wick. Burns clean for 45+ hours. The hand-blown glass vessel is reusable as a tea-light holder.",
    price: 3200,
    discountPercent: 0,
    badges: ["bestseller"],
    rating: 4.9,
    reviewCount: 167,
    images: [
      "https://images.unsplash.com/photo-1602874801006-e26c4c5b5e8a?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1080&q=80",
    ],
    variants: [
      { id: "v_180g", label: "180g · 30hr", sku: "SO-180", priceDelta: 0, stock: 40 },
      { id: "v_300g", label: "300g · 45hr", sku: "SO-300", priceDelta: 800, stock: 22 },
    ],
    tags: ["soy", "oud", "saffron", "eid", "gift"],
    material: "Soy wax · Hand-blown glass",
    dimensions: "H 9 cm · W 8 cm",
    weight: "0.4 kg",
    origin: "Lahore, Pakistan",
    isGiftWrapEligible: true,
    stock: 62,
    featured: true,
    bestseller: true,
    createdAt: "2025-12-05",
  },
  {
    id: "p_jasmine_bloom_01",
    slug: "night-blooming-jasmine-candle",
    name: "Night-Blooming Jasmine Candle",
    category: "candles",
    shortDescription: "The scent of a Karachi monsoon evening, captured in wax.",
    longDescription:
      "Night-blooming jasmine — raat ki rani — is the unmistakable scent of a South Asian monsoon night. This candle is a love letter to that memory. Pure soy wax, cotton wick, 35-hour burn time. Hand-poured in Lahore.",
    price: 2800,
    discountPercent: 20,
    badges: ["sale", "limited"],
    rating: 4.8,
    reviewCount: 76,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1080&q=80",
    ],
    variants: [
      { id: "v_180g", label: "180g", sku: "NB-180", priceDelta: 0, stock: 15 },
    ],
    tags: ["jasmine", "soy", "karachi", "monsoon"],
    material: "Soy wax · Glass",
    dimensions: "H 9 cm · W 7 cm",
    weight: "0.35 kg",
    origin: "Lahore, Pakistan",
    isGiftWrapEligible: true,
    stock: 15,
    featured: false,
    bestseller: false,
    createdAt: "2026-02-11",
  },
  {
    id: "p_floor_arc_01",
    slug: "arc-floor-lamp",
    name: "Brass Arc Floor Lamp",
    category: "lamps",
    shortDescription: "Sculptural brass arc — designed to cantilever over a sofa.",
    longDescription:
      "A statement floor lamp with a graceful brass arc that arcs over your favourite reading chair or sofa. The heavy marble base keeps it perfectly stable. Dimmable LED included. A modern classic that suits both contemporary and traditional interiors.",
    price: 42500,
    discountPercent: 0,
    badges: ["new"],
    rating: 4.7,
    reviewCount: 31,
    images: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1080&q=80",
    ],
    variants: [
      { id: "v_brass", label: "Polished Brass", sku: "AF-BR", priceDelta: 0, stock: 4 },
      { id: "v_black", label: "Matte Black", sku: "AF-BLK", priceDelta: -2000, stock: 6 },
    ],
    tags: ["floor", "statement", "marble", "modern"],
    material: "Brass · Marble base",
    dimensions: "H 180 cm · Reach 90 cm",
    weight: "12 kg",
    origin: "Lahore, Pakistan",
    isGiftWrapEligible: false,
    stock: 10,
    featured: true,
    bestseller: false,
    createdAt: "2026-03-08",
  },
  {
    id: "p_snake_plant_01",
    slug: "snake-plant-sansevieria",
    name: "Snake Plant in Ceramic Pot",
    category: "plants",
    shortDescription: "Architectural, drought-tolerant, releases oxygen at night.",
    longDescription:
      "The Snake Plant (Sansevieria trifasciata) is one of the few plants that releases oxygen at night — making it ideal for bedrooms. Tolerates low light and irregular watering. Potted in a glazed ceramic planter from Kasur.",
    price: 4200,
    discountPercent: 0,
    badges: ["new"],
    rating: 4.8,
    reviewCount: 58,
    images: [
      "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?auto=format&fit=crop&w=1080&q=80",
    ],
    variants: [
      { id: "v_small", label: "Small · 40cm", sku: "SP-S", priceDelta: 0, stock: 20 },
      { id: "v_medium", label: "Medium · 70cm", sku: "SP-M", priceDelta: 1200, stock: 14 },
    ],
    tags: ["bedroom", "low-light", "drought-tolerant", "air-purifying"],
    material: "Living plant · Glazed ceramic",
    dimensions: "H 40–70 cm · W 25 cm",
    weight: "2.8 kg",
    origin: "Kasur, Pakistan",
    isGiftWrapEligible: true,
    stock: 34,
    featured: false,
    bestseller: false,
    createdAt: "2026-04-01",
  },
];

export const CATEGORIES: Array<{
  slug: "lamps" | "plants" | "candles";
  name: string;
  tagline: string;
  description: string;
  image: string;
  productCount: number;
}> = [
  {
    slug: "lamps",
    name: "Lamps",
    tagline: "Handcrafted brass, onyx, and bone china",
    description:
      "From Mughal-inspired brass to Balochistan onyx, each lamp is handcrafted by Pakistani artisans.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1080&q=80",
    productCount: 3,
  },
  {
    slug: "plants",
    name: "Plants",
    tagline: "Living decor for every room",
    description:
      "Air-purifying indoor plants potted in hand-thrown terracotta and ceramic from Hala and Kasur.",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1080&q=80",
    productCount: 3,
  },
  {
    slug: "candles",
    name: "Candles",
    tagline: "The scent of South Asian evenings",
    description:
      "Soy-wax candles hand-poured in Lahore. Saffron, oud, jasmine — fragrances of memory and ritual.",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1080&q=80",
    productCount: 2,
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "c_eid_2026",
    slug: "eid-collection-2026",
    name: "The Eid Collection",
    tagline: "Light, fragrance, and warmth for the holy month",
    description:
      "A curated selection of lamps, candles, and living plants to welcome guests and mark the rituals of Eid. Each piece chosen for its ability to transform a house into a home of celebration.",
    coverImage:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1600&q=80",
    productSlugs: ["saffron-soy-candle", "brass-lotus-table-lamp", "night-blooming-jasmine-candle"],
  },
  {
    id: "c_modern_lahore",
    slug: "modern-lahore",
    name: "Modern Lahore",
    tagline: "Brass, marble, and clean lines",
    description:
      "For the contemporary Pakistani home — sculptural floor lamps, minimal ceramics, and architectural plants that speak to the new Lahore aesthetic.",
    coverImage:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1600&q=80",
    productSlugs: ["arc-floor-lamp", "snake-plant-sansevieria", "onyx-pendant-light"],
  },
  {
    id: "c_first_home",
    slug: "first-home-essentials",
    name: "First Home Essentials",
    tagline: "Pieces that grow with you",
    description:
      "Moving into your first place? These forgiving, beautiful, affordable pieces will make it feel like home from day one — and last for years.",
    coverImage:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1600&q=80",
    productSlugs: ["marble-queen-pothos", "areca-palm-pot", "saffron-soy-candle"],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t_001",
    name: "Ayesha K.",
    city: "Lahore",
    rating: 5,
    text: "The brass lotus lamp is even more beautiful in person. The packaging was exquisite — felt like opening a gift. COD made it stress-free.",
    productSlug: "brass-lotus-table-lamp",
    createdAt: "2026-05-12",
  },
  {
    id: "t_002",
    name: "Bilal R.",
    city: "Karachi",
    rating: 5,
    text: "Ordered the saffron candle for my mother on Eid. She cried. The scent is exactly like the one we remember from our childhood.",
    productSlug: "saffron-soy-candle",
    createdAt: "2026-04-22",
  },
  {
    id: "t_003",
    name: "Sana M.",
    city: "Islamabad",
    rating: 4,
    text: "Areca palm arrived healthy and lush. The terracotta pot has a beautiful raw finish. Delivery took 3 days to Islamabad — quite reasonable.",
    productSlug: "areca-palm-pot",
    createdAt: "2026-05-28",
  },
  {
    id: "t_004",
    name: "Hamza A.",
    city: "Faisalabad",
    rating: 5,
    text: "Bought the onyx pendant for our dining room. The light it casts is unreal — like honey. Worth every rupee.",
    productSlug: "onyx-pendant-light",
    createdAt: "2026-06-02",
  },
];

/** Get a product by slug. */
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Get featured products. */
export function getFeaturedProducts(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

/** Get bestsellers. */
export function getBestsellers(limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.bestseller).slice(0, limit);
}

/** Get products by category. */
export function getProductsByCategory(category: "lamps" | "plants" | "candles"): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}
