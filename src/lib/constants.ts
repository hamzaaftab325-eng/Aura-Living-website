/**
 * Aura Living — Application-wide constants.
 * Centralising magic strings/numbers prevents drift across components.
 */

export const SITE = {
  name: "Aura Living",
  shortName: "Aura",
  tagline: "Light, Life, and Warmth for the Pakistani Home",
  description:
    "Premium home decor for the modern Pakistani home — handcrafted lamps, living plants, and artisanal candles. Cash on delivery available across Pakistan.",
  url: "https://auraliving.pk",
  locale: "en_PK",
  currency: "PKR",
  email: "hello@auraliving.pk",
  phone: "+92 300 1234567",
  whatsapp: "923001234567",
  address: "Plot 14, Main Boulevard, Gulberg III, Lahore, Pakistan",
  instagram: "https://instagram.com/auraliving.pk",
  facebook: "https://facebook.com/auraliving.pk",
  pinterest: "https://pinterest.com/auraliving.pk",
} as const;

export const NAV_LINKS = [
  { label: "Shop All", href: "/products" },
  { label: "Lamps", href: "/products?category=lamps" },
  { label: "Plants", href: "/products?category=plants" },
  { label: "Candles", href: "/products?category=candles" },
  { label: "Collections", href: "/collections" },
  { label: "Our Story", href: "/about" },
] as const;

export const ANNOUNCEMENTS = [
  "Free delivery on orders above PKR 5,000 — across Pakistan",
  "Cash on Delivery available nationwide",
  "New: Handcrafted brass lamps from Multan — Shop the collection",
  "Eid Sale — up to 30% off selected decor",
] as const;

export const SHIPPING_THRESHOLD = 5000;
export const FREE_SHIPPING_MESSAGE = "Free shipping unlocked";
export const FREE_SHIPPING_PROGRESS = (remaining: number) =>
  `Add PKR ${remaining.toLocaleString("en-PK")} more to unlock free shipping`;

export const TRUST_BADGES = [
  { icon: "truck", title: "Nationwide Delivery", subtitle: "2–5 business days" },
  { icon: "shield", title: "Secure Payments", subtitle: "JazzCash · Easypaisa · COD" },
  { icon: "refresh", title: "7-Day Returns", subtitle: "No questions asked" },
  { icon: "leaf", title: "Handpicked Quality", subtitle: "Curated by experts" },
] as const;

export const WHATSAPP_MESSAGE =
  "Hello Aura Living, I'd like to know more about your products.";
