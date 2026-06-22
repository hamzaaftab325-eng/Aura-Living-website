"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";

/**
 * Hero — full-viewport cinematic hero with parallax background, gold accent
 * geometry, and CTA. Animates in on mount with staggered children.
 *
 * Framer Motion handles micro-interactions (mouse-move parallax on the
 * decorative elements, entrance animation). GSAP/ScrollTrigger take over for
 * the deeper scroll-driven scenes later in the page.
 */
export function Hero() {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.05 });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={ref}
      className="relative surface-hero overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Parallax background image */}
      <div
        className="absolute inset-0 z-base pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-900/70 to-ink-900" />
      </div>

      {/* Decorative gold geometric line — top right */}
      <div
        className="absolute top-0 right-0 w-1/3 h-1 bg-gradient-to-l from-gold-400 to-transparent z-raised hidden md:block"
        aria-hidden="true"
      />

      <div className="container-page relative z-raised">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="min-h-[88vh] md:min-h-[92vh] flex flex-col justify-center py-24"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="text-eyebrow inline-flex items-center gap-3">
              <span className="rule-gold" aria-hidden="true" />
              Handcrafted in Pakistan
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            className="text-display-1 text-paper"
          >
            Light, life, and warmth
            <span className="block text-gold-400 italic">for the modern home.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lead mt-6 max-w-xl text-ink-200"
          >
            Discover handcrafted brass lamps, living plants, and artisanal
            candles — each piece a quiet conversation between Pakistani craft
            and contemporary design.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-3"
          >
            <Button asChild variant="primary" size="lg">
              <Link href="/products">
                Shop the Collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/about">Our Story</Link>
            </Button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-ink-200"
          >
            <div className="flex items-center gap-2">
              <div className="flex" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="size-4 fill-gold-400 text-gold-400"
                  />
                ))}
              </div>
              <span>
                <span className="text-paper font-semibold">4.9</span> · 850+ reviews
              </span>
            </div>
            <span className="hidden sm:inline-block w-px h-4 bg-ink-600" aria-hidden="true" />
            <span>
              <span className="text-paper font-semibold">Cash on Delivery</span> nationwide
            </span>
            <span className="hidden sm:inline-block w-px h-4 bg-ink-600" aria-hidden="true" />
            <span>
              <span className="text-paper font-semibold">Free shipping</span> over PKR 5,000
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom scroll cue */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-raised hidden md:block"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 text-ink-400">
          <span className="text-[0.625rem] uppercase tracking-[0.22em]">Scroll</span>
          <span className="w-px h-8 bg-gradient-to-b from-gold-400 to-transparent" />
        </div>
      </div>
    </section>
  );
}
