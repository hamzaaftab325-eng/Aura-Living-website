"use client";

import { useEffect } from "react";
import { X, ShoppingBag, Plus, Minus, Gift, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPKR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  SHIPPING_THRESHOLD,
  FREE_SHIPPING_MESSAGE,
  FREE_SHIPPING_PROGRESS,
} from "@/lib/constants";
import Link from "next/link";

/**
 * CartDrawer — slide-in cart panel controlled by Zustand.
 * Locks body scroll when open. Shows free-shipping progress, line items,
 * gift-wrap toggle, subtotal, and CTA to checkout.
 */
export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleGiftWrap = useCartStore((s) => s.toggleGiftWrap);
  const subtotal = useCartStore((s) => s.subtotal());
  const amountUntilFreeShipping = useCartStore((s) => s.amountUntilFreeShipping());
  const hasFreeShipping = useCartStore((s) => s.hasFreeShipping());
  const itemCount = useCartStore((s) => s.itemCount());

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const progressPct = hasFreeShipping
    ? 100
    : Math.min(100, ((SHIPPING_THRESHOLD - amountUntilFreeShipping) / SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-modal-backdrop bg-ink-950/70 backdrop-blur-sm transition-opacity duration-base ease-aura-living",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!isOpen}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "fixed top-0 right-0 z-modal h-full w-full max-w-[28rem] bg-ink-900 border-l border-ink-700 shadow-2xl flex flex-col transition-transform duration-slower ease-aura-living safe-pt safe-pb",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-gold-400" aria-hidden="true" />
            <h2 className="font-display text-lg font-medium text-paper">
              Your Cart
            </h2>
            <span className="text-sm text-muted">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="btn btn-ghost btn-sm px-2"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Free-shipping progress */}
        {items.length > 0 && (
          <div className="px-5 py-3 border-b border-ink-700 surface-ink-elevated">
            <p className="text-xs text-ink-100 mb-2 leading-relaxed">
              {hasFreeShipping ? (
                <span className="text-gold-400 font-semibold">{FREE_SHIPPING_MESSAGE} 🎉</span>
              ) : (
                FREE_SHIPPING_PROGRESS(amountUntilFreeShipping)
              )}
            </p>
            <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
              <div
                className="h-full rounded-full surface-gold-deep transition-all duration-slow ease-aura-living cart-progress-fill"
                style={{ "--cart-progress": `${progressPct}%` } as React.CSSProperties}
                role="progressbar"
                aria-valuenow={Math.round(progressPct)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Free shipping progress"
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full surface-ink-elevated flex items-center justify-center mb-4">
                <ShoppingBag className="size-7 text-muted" aria-hidden="true" />
              </div>
              <p className="font-display text-xl text-paper mb-2">Your cart is empty</p>
              <p className="text-sm text-muted mb-6">
                Explore our handcrafted lamps, plants, and candles.
              </p>
              <Button variant="primary" onClick={closeCart}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-ink-700">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId ?? "default"}`}
                  className="p-5 flex gap-4"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="img-zoom w-20 h-24 rounded-md flex-shrink-0 bg-ink-700"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                      loading="lazy"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-paper hover:text-gold-400 transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="btn btn-ghost btn-sm px-1 flex-shrink-0"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="size-4 text-muted" />
                      </button>
                    </div>

                    {item.variantLabel && (
                      <p className="text-xs text-muted mt-0.5">{item.variantLabel}</p>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity stepper */}
                      <div className="inline-flex items-center border border-ink-600 rounded-md">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center text-ink-100 hover:text-gold-400 transition-colors"
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span
                          className="w-8 text-center text-sm text-paper font-medium"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center text-ink-100 hover:text-gold-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-paper">
                        {formatPKR((item.unitPrice + item.giftWrapPrice) * item.quantity)}
                      </p>
                    </div>

                    {/* Gift wrap toggle */}
                    {item.isGiftWrap !== undefined && (
                      <button
                        type="button"
                        onClick={() => toggleGiftWrap(item.productId, item.variantId)}
                        className={cn(
                          "mt-2 inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors",
                          item.isGiftWrap
                            ? "text-gold-400 bg-gold-400/10"
                            : "text-muted hover:text-gold-400",
                        )}
                      >
                        <Gift className="size-3.5" aria-hidden="true" />
                        {item.isGiftWrap ? "Gift wrap added (+PKR 350)" : "Add gift wrap"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer (totals + CTA) */}
        {items.length > 0 && (
          <div className="border-t border-ink-700 p-5 surface-ink-elevated safe-pb">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="text-base font-semibold text-paper">{formatPKR(subtotal)}</span>
            </div>
            <p className="text-xs text-muted mb-4">
              Shipping & taxes calculated at checkout.
            </p>
            <Button variant="primary" size="lg" block>
              Checkout · {formatPKR(subtotal)}
            </Button>
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 w-full text-center text-xs text-muted hover:text-gold-400 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
