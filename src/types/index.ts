/**
 * Aura Living — Type definitions.
 * All shared types live here so components import from a single source of truth.
 */

export type ProductCategory = "lamps" | "plants" | "candles";

export type ProductBadge = "new" | "bestseller" | "limited" | "sale" | null;

export interface ProductVariant {
  id: string;
  label: string;
  sku: string;
  priceDelta: number; // signed integer PKR
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  longDescription: string;
  price: number; // PKR
  discountPercent: number; // 0–100
  badges: ProductBadge[];
  rating: number; // 0–5
  reviewCount: number;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  material: string;
  dimensions: string;
  weight: string;
  origin: string;
  isGiftWrapEligible: boolean;
  stock: number;
  featured: boolean;
  bestseller: boolean;
  createdAt: string; // ISO date
}

export interface CartLineItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number; // PKR (already discounted)
  quantity: number;
  variantId?: string;
  variantLabel?: string;
  isGiftWrap: boolean;
  giftWrapPrice: number;
  maxStock: number;
}

export interface CartState {
  items: CartLineItem[];
  couponCode: string | null;
  couponDiscount: number; // PKR
  isOpen: boolean; // drawer open state
}

export interface Category {
  slug: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  productSlug: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  productSlugs: string[];
}
