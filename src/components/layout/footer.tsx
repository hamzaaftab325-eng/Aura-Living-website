import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";

/**
 * Footer — full-width dark footer with newsletter, links, contact, and brand block.
 * Includes a top divider that fades from gold to transparent (decorative).
 */
export function Footer() {
  const year = "2026";

  return (
    <footer
      className="app-footer surface-ink relative"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="divider-gold" aria-hidden="true" />

      <div className="container-page section-tight">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand block */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-baseline gap-2 text-paper hover:text-gold-400 transition-colors"
              aria-label={`${SITE.name} home`}
            >
              <span className="font-display text-2xl font-medium tracking-tight">
                {SITE.name}
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              {SITE.tagline}. Handcrafted in Pakistan, delivered with care.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SITE.instagram}
                className="btn btn-ghost btn-sm px-2"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={SITE.facebook}
                className="btn btn-ghost btn-sm px-2"
                aria-label="Follow us on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="btn btn-ghost btn-sm px-2"
                aria-label="Email us"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <nav aria-label="Shop footer">
            <h2 className="text-eyebrow mb-4">Shop</h2>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support links */}
          <nav aria-label="Support footer">
            <h2 className="text-eyebrow mb-4">Support</h2>
            <ul className="space-y-3">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Shipping & Returns", href: "/shipping-returns" },
                { label: "Track Order", href: "/track-order" },
                { label: "Accessibility", href: "/accessibility-statement" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact block */}
          <div>
            <h2 className="text-eyebrow mb-4">Get in Touch</h2>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 mt-0.5 text-gold-400 flex-shrink-0" aria-hidden="true" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-gold-400 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="hover:text-gold-400 transition-colors"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-gold-400 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-gold-400 transition-colors"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment + legal row */}
        <div className="mt-12 pt-6 border-t border-ink-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted text-center md:text-left">
            © {year} {SITE.name}. All rights reserved. Made with care in Lahore, Pakistan.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-gold-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gold-400 transition-colors">
              Terms
            </Link>
            <div className="flex items-center gap-2" aria-label="Accepted payment methods">
              <span className="pill pill-outline">COD</span>
              <span className="pill pill-outline">JazzCash</span>
              <span className="pill pill-outline">Easypaisa</span>
              <span className="pill pill-outline">Cards</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
