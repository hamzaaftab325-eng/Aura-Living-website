"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

/**
 * BrandPromise — large editorial pull-quote section.
 * Sets the brand voice (craft, intent, restraint) between product blocks.
 */
export function BrandPromise() {
  const [ref, inView] = useInView<HTMLDivElement>({ triggerOnce: true, threshold: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={ref} className="section-base surface-ink" aria-label="Our promise">
      <div className="container-narrow text-center">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Quote
            className="size-10 text-gold-400 mx-auto mb-6"
            aria-hidden="true"
          />
          <p className="font-display text-2xl md:text-4xl text-paper leading-tight italic">
            &ldquo;We don&rsquo;t sell decor. We sell the quiet moments a room
            can hold — the page you read by lamplight, the morning you water
            your plants, the evening you light a candle for someone you
            love.&rdquo;
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="rule-gold" aria-hidden="true" />
            <p className="text-eyebrow">Aura Living, Lahore</p>
            <span className="rule-gold" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
