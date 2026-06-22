"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { COLLECTIONS } from "@/data/catalogue";
import { useInView } from "@/hooks/use-in-view";

/**
 * CollectionShowcase — horizontal-scroll-style grid of curated collections.
 * Three editorial cards with full-bleed cover image, tagline overlay,
 * and CTA.
 */
export function CollectionShowcase() {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="section-base"
      aria-labelledby="collections-heading"
    >
      <div className="container-page">
        <div className="mb-10 md:mb-14 max-w-2xl">
          <span className="text-eyebrow inline-flex items-center gap-3">
            <span className="rule-gold" aria-hidden="true" />
            Curated Collections
          </span>
          <h2 id="collections-heading" className="text-display-3 text-paper mt-4">
            Designed around moments.
          </h2>
          <p className="text-lead mt-4">
            Each collection brings together pieces that share a feeling — a
            season, a room, a milestone. Start with the moment, find the pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {COLLECTIONS.map((collection, idx) => (
            <motion.div
              key={collection.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
                delay: shouldReduceMotion ? 0 : idx * 0.12,
              }}
            >
              <Link
                href={`/collections/${collection.slug}`}
                className="group block relative aspect-square rounded-lg overflow-hidden surface-ink-elevated border border-ink-700 hover:border-gold-700 transition-colors duration-base ease-aura-living"
                aria-label={`View ${collection.name} collection`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collection.coverImage}
                  alt={collection.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-slower ease-aura-living group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                  <p className="text-eyebrow-light mb-2">
                    {collection.productSlugs.length} pieces
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl text-paper mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-ink-200 mb-4 max-w-xs">
                    {collection.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-400">
                    View Collection
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
