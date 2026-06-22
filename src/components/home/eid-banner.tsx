"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

/**
 * EidBanner — full-width promotional banner.
 * Tied to seasonal moments (Eid, Ramadan, Monsoon). Visual hierarchy:
 * eyebrow → headline → CTA. Gold gradient background.
 */
export function EidBanner() {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={ref} aria-labelledby="promo-heading">
      <div className="container-page">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="surface-gold-deep rounded-2xl overflow-hidden p-8 md:p-14 text-center relative"
        >
          {/* Decorative top-corner sparkles */}
          <Sparkles
            className="absolute top-6 left-6 size-5 text-ink-900/30"
            aria-hidden="true"
          />
          <Sparkles
            className="absolute bottom-6 right-6 size-5 text-ink-900/30"
            aria-hidden="true"
          />

          <p className="text-eyebrow-light text-on-gold mb-3">
            Limited Time
          </p>
          <h2
            id="promo-heading"
            className="font-display text-3xl md:text-5xl text-ink-900 font-medium"
          >
            Eid Collection — up to 30% off
          </h2>
          <p className="mt-4 text-base md:text-lg text-ink-900/80 max-w-2xl mx-auto">
            Celebrate the holy month with our curated selection of lamps,
            candles, and living plants. Each piece chosen for the rituals of
            Eid — for welcoming guests, marking prayers, and creating warmth.
          </p>
          <a
            href="/collections/eid-collection-2026"
            className="btn btn-lg mt-8 bg-ink-900 text-gold-400 border-ink-900 hover:bg-ink-800 hover:border-ink-800 hover:text-gold-300"
          >
            Shop the Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}
