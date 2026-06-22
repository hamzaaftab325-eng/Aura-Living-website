import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — conditional class merger.
 * Combines clsx (conditional) with tailwind-merge (conflict resolution).
 *
 * @example cn("btn", isActive && "btn-primary", "px-2")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a number as PKR currency (Pakistani Rupee, no decimals). */
export function formatPKR(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a number with Pakistani thousands separators. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-PK").format(value);
}

/** Truncate a string to a max length, adding an ellipsis. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Convert a string to a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Compute the discounted price given an original price and discount percentage. */
export function computeDiscountedPrice(price: number, discountPercent: number): number {
  if (discountPercent <= 0 || discountPercent >= 100) return price;
  return Math.round((price * (100 - discountPercent)) / 100);
}

/** Stable pseudo-random id for client-only entities. */
export function makeId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Sleep for `ms` milliseconds (used in mock async functions). */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Type-safe `Object.entries` that preserves key types. */
export function typedEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}
