"use client";

import { Instagram, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { useInView } from "@/hooks/use-in-view";

/**
 * InstagramFeed — 5-up grid of community/lifestyle images.
 * Acts as social proof + drives Instagram traffic.
 * Each tile links to the brand Instagram profile.
 */
const INSTAGRAM_IMAGES = [
  "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565193298357-c5b46b0ff68a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=600&q=80",
];

export function InstagramFeed() {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="section-base"
      aria-labelledby="instagram-heading"
    >
      <div className="container-page">
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-eyebrow inline-flex items-center gap-3">
              <span className="rule-gold" aria-hidden="true" />
              <Instagram className="size-4" aria-hidden="true" />
              @auraliving.pk
            </span>
            <h2 id="instagram-heading" className="text-display-3 text-paper mt-4">
              Styled by our community.
            </h2>
            <p className="text-lead mt-4">
              Tag <span className="text-gold-400 font-semibold">@auraliving.pk</span> for a
              chance to be featured. Real homes, real moments.
            </p>
          </div>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-gold self-start md:self-auto flex-shrink-0"
          >
            Follow Us
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
          {INSTAGRAM_IMAGES.map((src, idx) => (
            <motion.a
              key={src}
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: shouldReduceMotion ? 0 : idx * 0.08,
              }}
              className="group relative aspect-square rounded-md overflow-hidden surface-ink-elevated"
              aria-label={`View Instagram post ${idx + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Aura Living styled by our community"
                className="w-full h-full object-cover transition-transform duration-slower ease-aura-living group-hover:scale-110"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/40 transition-colors duration-base ease-aura-living flex items-center justify-center"
                aria-hidden="true"
              >
                <Instagram className="size-6 text-paper opacity-0 group-hover:opacity-100 transition-opacity duration-base ease-aura-living" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
