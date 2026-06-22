"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/data/catalogue";

/**
 * FeaturedProducts — six-up grid of the featured catalogue.
 * Includes the section header, eyebrow, and a CTA to the full PLP.
 * (Each ProductCard handles its own scroll-reveal animation via useInView.)
 */
export function FeaturedProducts() {
  const products = getFeaturedProducts(6);

  return (
    <section
      className="section-base surface-ink-elevated"
      aria-labelledby="featured-heading"
    >
      <div className="container-page">
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-eyebrow inline-flex items-center gap-3">
              <span className="rule-gold" aria-hidden="true" />
              Curated Selection
            </span>
            <h2
              id="featured-heading"
              className="text-display-3 text-paper mt-4"
            >
              Pieces we love this season.
            </h2>
            <p className="text-lead mt-4">
              Hand-picked by our team — each item passes a 12-point quality
              check before it earns a place on this page.
            </p>
          </div>
          <Button asChild variant="outlineGold" className="self-start md:self-auto flex-shrink-0">
            <Link href="/products">
              View All Products
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid-products group">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              priority={idx < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
