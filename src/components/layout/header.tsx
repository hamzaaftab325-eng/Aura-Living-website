"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Header — sticky brand header.
 * Switches from transparent to glass-dark background once scrolled.
 * Mobile menu opens a slide-down drawer.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrolled = useScrolled(24);

  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-fixed transition-all duration-base ease-aura-living",
        scrolled ? "glass-dark border-b border-ink-700" : "bg-transparent",
      )}
      role="banner"
    >
      <div className="container-page">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu trigger */}
          <button
            type="button"
            className="md:hidden btn btn-ghost btn-sm px-2"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 text-paper hover:text-gold-400 transition-colors"
            aria-label={`${SITE.name} home`}
          >
            <span className="font-display text-xl md:text-2xl font-medium tracking-tight">
              {SITE.name}
            </span>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-sm font-medium text-ink-100 hover:text-gold-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm px-2"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm px-2 hidden sm:inline-flex"
              aria-label="Account"
            >
              <User className="size-5" />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm px-2 relative"
              aria-label={`Cart with ${itemCount} items`}
              onClick={openCart}
            >
              <ShoppingBag className="size-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-gold-400 text-ink-900 text-xs font-bold flex items-center justify-center"
                  aria-hidden="true"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div
        id="mobile-nav"
        className={cn(
          "md:hidden overflow-hidden transition-all duration-base ease-aura-living",
          menuOpen ? "max-h-screen border-t border-ink-700" : "max-h-0",
        )}
      >
        <nav
          className="glass-dark flex flex-col p-4 gap-1"
          aria-label="Mobile primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-3 rounded-md text-base font-medium text-ink-100 hover:bg-ink-700 hover:text-gold-400 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 pt-3 border-t border-ink-700">
            <Button variant="outlineGold" size="md" block>
              <User className="size-4" /> Sign In
            </Button>
          </div>
        </nav>
      </div>

      {/* Inline search (slide-down) */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-base ease-aura-living border-ink-700",
          searchOpen ? "max-h-32 border-t" : "max-h-0",
        )}
      >
        <div className="glass-dark p-4">
          <div className="container-page">
            <form
              role="search"
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSearchOpen(false);
              }}
            >
              <label className="sr-only" htmlFor="header-search">
                Search products
              </label>
              <input
                id="header-search"
                type="search"
                placeholder="Search lamps, plants, candles…"
                className="input-base"
                autoComplete="off"
              />
              <Button type="submit" variant="primary">
                <Search className="size-4" /> Search
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
