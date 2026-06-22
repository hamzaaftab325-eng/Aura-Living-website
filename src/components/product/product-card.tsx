"use client";

import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, computeDiscountedPrice, formatPKR } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useInView } from "@/hooks/use-in-view";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

/**
 * ProductCard — the workhorse of the storefront.
 * Renders image, badges, name, rating, price (with discount strike-through),
 * and an add-to-cart button. Staggered entrance animation.
 *
 * Uses global classes for all styling — no inline styles.
 */
export function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });
  const shouldReduceMotion = useReducedMotion();
  const addItem = useCartStore((s) => s.addItem);

  const discountedPrice = computeDiscountedPrice(product.price, product.discountPercent);
  const hasDiscount = product.discountPercent > 0;

  const handleAddToCart = () => {
    const defaultVariant = product.variants[0];
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      unitPrice: discountedPrice,
      quantity: 1,
      variantId: defaultVariant?.id,
      variantLabel: defaultVariant?.label,
      maxStock: defaultVariant?.stock ?? product.stock,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.06, 0.4),
      }}
      className="card card-hover h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-product overflow-hidden bg-ink-700">
        <Link
          href={`/products/${product.slug}`}
          className="img-zoom block w-full h-full"
          aria-label={`View ${product.name}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
            {...(priority ? { fetchPriority: "high" } : {})}
          />
        </Link>

        {/* Badges (top-left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badges.includes("new") && <Badge variant="new">New</Badge>}
          {product.badges.includes("bestseller") && (
            <Badge variant="gold">Bestseller</Badge>
          )}
          {product.badges.includes("limited") && (
            <Badge variant="goldSoft">Limited</Badge>
          )}
          {hasDiscount && (
            <Badge variant="sale">-{product.discountPercent}%</Badge>
          )}
        </div>

        {/* Quick add (desktop hover) */}
        <div className="absolute inset-x-3 bottom-3 hidden md:block">
          <Button
            variant="primary"
            size="sm"
            block
            onClick={handleAddToCart}
            className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          >
            <ShoppingBag className="size-4" /> Quick Add
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Star className="size-3.5 fill-gold-400 text-gold-400" aria-hidden="true" />
          <span className="text-xs text-muted">
            {product.rating.toFixed(1)} · {product.reviewCount} reviews
          </span>
        </div>

        <h3 className="font-display text-lg text-paper leading-tight">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-gold-400 transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        <p className="text-xs text-muted mt-1 line-clamp-2 flex-1">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-paper">
              {formatPKR(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through">
                {formatPKR(product.price)}
              </span>
            )}
          </div>
          {/* Mobile add button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden px-2"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>

        {/* Stock indicator */}
        {product.stock <= 10 && (
          <p
            className={cn(
              "mt-2 text-xs",
              product.stock <= 5 ? "text-warning" : "text-muted",
            )}
          >
            Only {product.stock} left
          </p>
        )}
      </div>
    </motion.div>
  );
}
