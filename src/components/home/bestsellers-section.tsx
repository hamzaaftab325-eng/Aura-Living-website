"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { BestsellerList } from "@/components/home/bestseller-list";

/**
 * BestsellersSection — wrapper that gives BestsellerList a section frame.
 * Kept separate so the list itself can be reused on PDP / PLP sidebars.
 */
export function BestsellersSection() {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.1 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="section-base"
      aria-labelledby="bestsellers-heading"
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="container-page"
      >
        <div className="mb-10 md:mb-14 max-w-2xl">
          <span className="text-eyebrow inline-flex items-center gap-3">
            <span className="rule-gold" aria-hidden="true" />
            Customer Favourites
          </span>
          <h2 id="bestsellers-heading" className="text-display-3 text-paper mt-4">
            Our most-loved pieces.
          </h2>
          <p className="text-lead mt-4">
            Tried, tested, and treasured by hundreds of Pakistani homes. These
            are the items our customers come back for.
          </p>
        </div>

        <BestsellerList />
      </motion.div>
    </section>
  );
}
