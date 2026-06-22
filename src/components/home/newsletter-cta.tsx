"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * NewsletterCta — email capture with success state.
 * Pakistani customers respond well to discount incentives — copy mentions
 * 10% off the first order. Form is progressive-enhancement friendly.
 */
export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="section-base" aria-labelledby="newsletter-heading">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, threshold: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative surface-hero border border-ink-700 rounded-2xl p-8 md:p-14 overflow-hidden"
        >
          {/* Decorative gold ring */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-gold-700/30 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-gold-700/20 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative max-w-2xl">
            <span className="text-eyebrow inline-flex items-center gap-3">
              <span className="rule-gold" aria-hidden="true" />
              Stay in the Loop
            </span>
            <h2
              id="newsletter-heading"
              className="text-display-3 text-paper mt-4"
            >
              Get 10% off your first order.
            </h2>
            <p className="text-lead mt-4">
              Join our newsletter for early access to new collections, decor
              tips, and subscriber-only offers. No spam — just thoughtful notes,
              twice a month.
            </p>

            {status === "success" ? (
              <div
                className="mt-8 p-4 md:p-5 rounded-md border border-success/30 bg-success/10 flex items-start gap-3"
                role="status"
                aria-live="polite"
              >
                <CheckCircle2
                  className="size-5 text-success flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-paper">
                    You&rsquo;re in! Check your inbox.
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Your 10% discount code is on its way. Welcome to Aura Living.
                  </p>
                </div>
              </div>
            ) : (
              <form
                className="mt-8 flex flex-col sm:flex-row gap-3"
                onSubmit={handleSubmit}
                noValidate
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="input-base pl-10"
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "newsletter-error" : undefined}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </Button>
              </form>
            )}

            {status === "error" && (
              <p
                id="newsletter-error"
                className="mt-3 text-xs text-danger"
                role="alert"
              >
                Please enter a valid email address.
              </p>
            )}

            <p className="mt-4 text-xs text-muted">
              By subscribing you agree to our{" "}
              <a href="/privacy" className="link-underline text-gold-400">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
