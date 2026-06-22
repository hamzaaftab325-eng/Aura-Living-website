"use client";

import { Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { TESTIMONIALS } from "@/data/catalogue";
import { useInView } from "@/hooks/use-in-view";
import { Star } from "lucide-react";

/**
 * Testimonials — customer review carousel.
 * Static grid for accessibility (no auto-rotate). Each card shows a 5-star
 * rating, the review text, customer name, and city.
 */
export function Testimonials() {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="section-base surface-ink-elevated"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-page">
        <div className="mb-10 md:mb-14 text-center max-w-2xl mx-auto">
          <span className="text-eyebrow inline-flex items-center gap-3 justify-center">
            <span className="rule-gold" aria-hidden="true" />
            From Our Customers
            <span className="rule-gold" aria-hidden="true" />
          </span>
          <h2 id="testimonials-heading" className="text-display-3 text-paper mt-4">
            Loved across Pakistan.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.figure
              key={t.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: shouldReduceMotion ? 0 : idx * 0.1,
              }}
              className="card p-6 flex flex-col h-full"
            >
              <Quote
                className="size-7 text-gold-400 mb-3"
                aria-hidden="true"
              />

              <div
                className="flex items-center gap-0.5 mb-3"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className={
                      i < t.rating
                        ? "size-3.5 fill-gold-400 text-gold-400"
                        : "size-3.5 text-ink-600"
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="text-sm text-ink-100 leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <figcaption className="mt-5 pt-4 border-t border-ink-700">
                <p className="text-sm font-semibold text-paper">{t.name}</p>
                <p className="text-xs text-muted">{t.city}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
