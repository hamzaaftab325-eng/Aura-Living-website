"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/catalogue";
import { useInView } from "@/hooks/use-in-view";

/**
 * CategoryShowcase — three large category cards (Lamps / Plants / Candles).
 * Each card has a full-bleed image, gradient overlay, name, tagline, and
 * a hover-revealed CTA. Staggered entrance on scroll.
 */
export function CategoryShowcase() {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="section-base"
      aria-labelledby="categories-heading"
    >
      <div className="container-page">
        <div className="mb-10 md:mb-14 max-w-2xl">
          <span className="text-eyebrow inline-flex items-center gap-3">
            <span className="rule-gold" aria-hidden="true" />
            Browse by Category
          </span>
          <h2
            id="categories-heading"
            className="text-display-3 text-paper mt-4"
          >
            Three disciplines, one philosophy.
          </h2>
          <p className="text-lead mt-4">
            Each Aura Living category is chosen for its power to transform a
            room — through light, life, or fragrance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: shouldReduceMotion ? 0 : idx * 0.12,
              }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group block relative aspect-portrait rounded-lg overflow-hidden surface-ink-elevated border border-ink-700 hover:border-gold-700 transition-colors duration-base ease-aura-living"
                aria-label={`Browse ${cat.name} collection`}
              >
                {/* Background image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-slower ease-aura-living group-hover:scale-105"
                  loading={idx === 0 ? "eager" : "lazy"}
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent"
                  aria-hidden="true"
                />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                  <p className="text-eyebrow-light mb-2">{cat.productCount} pieces</p>
                  <h3 className="font-display text-3xl md:text-4xl text-paper mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-ink-200 mb-4 max-w-xs">{cat.tagline}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-400">
                    Explore
                    <ArrowUpRight className="size-4 transition-transform duration-base ease-aura-living group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
