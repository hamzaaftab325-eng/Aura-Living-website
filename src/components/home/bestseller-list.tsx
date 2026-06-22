"use client";

import { ProductCard } from "@/components/product/product-card";
import { getBestsellers } from "@/data/catalogue";

/**
 * BestsellerList — pure grid of the bestseller-tagged products.
 * Reused by BestsellersSection (home) and could be embedded on PDP sidebars.
 */
export function BestsellerList() {
  const products = getBestsellers(4);

  return (
    <div className="grid-products group">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} index={idx} />
      ))}
    </div>
  );
}
