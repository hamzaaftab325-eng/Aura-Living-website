"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";

interface StorySectionProps {
  eyebrow: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

/**
 * StorySection — split-screen brand storytelling block.
 * One side image, one side copy. Animates in on scroll.
 * The `reverse` prop flips the layout for alternating sections.
 */
export function StorySection({
  eyebrow,
  title,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
}: StorySectionProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="section-base"
      aria-labelledby={`story-${title.slice(0, 12).replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="container-page">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Image side */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: reverse ? 40 : -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-landscape rounded-lg overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink-950/30 to-transparent"
              aria-hidden="true"
            />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <span className="text-eyebrow inline-flex items-center gap-3">
              <span className="rule-gold" aria-hidden="true" />
              {eyebrow}
            </span>
            <h2 className="text-display-3 text-paper mt-4">{title}</h2>
            <p className="text-lead mt-5">{body}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
