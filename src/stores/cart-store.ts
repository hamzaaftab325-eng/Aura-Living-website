/**
 * Aura Living — Cart store (Zustand + persist).
 * Persists cart across sessions via localStorage.
 * Handles line items, gift-wrap, coupon, drawer open state.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLineItem, CartState } from "@/types";
import { SHIPPING_THRESHOLD } from "@/lib/constants";
import { computeDiscountedPrice } from "@/lib/utils";

const GIFT_WRAP_PRICE = 350; // PKR per item

interface CartActions {
  addItem: (item: Omit<CartLineItem, "isGiftWrap" | "giftWrapPrice">) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  toggleGiftWrap: (productId: string, variantId?: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

interface ComputedSelectors {
  itemCount: () => number;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
  amountUntilFreeShipping: () => number;
  hasFreeShipping: () => boolean;
}

export type CartStore = CartState & CartActions & ComputedSelectors;

const lineItemKey = (productId: string, variantId?: string) =>
  variantId ? `${productId}__${variantId}` : productId;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ----- State -----
      items: [],
      couponCode: null,
      couponDiscount: 0,
      isOpen: false,

      // ----- Actions -----
      addItem: (item) => {
        const key = lineItemKey(item.productId, item.variantId);
        set((state) => {
          const existing = state.items.find(
            (i) => lineItemKey(i.productId, i.variantId) === key,
          );
          if (existing) {
            const nextQty = Math.min(existing.quantity + item.quantity, item.maxStock);
            return {
              items: state.items.map((i) =>
                lineItemKey(i.productId, i.variantId) === key
                  ? { ...i, quantity: nextQty }
                  : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                isGiftWrap: false,
                giftWrapPrice: 0,
              } satisfies CartLineItem,
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, variantId) => {
        const key = lineItemKey(productId, variantId);
        set((state) => ({
          items: state.items.filter((i) => lineItemKey(i.productId, i.variantId) !== key),
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        const key = lineItemKey(productId, variantId);
        set((state) => ({
          items: state.items
            .map((i) => {
              if (lineItemKey(i.productId, i.variantId) !== key) return i;
              const clamped = Math.max(0, Math.min(quantity, i.maxStock));
              return { ...i, quantity: clamped };
            })
            .filter((i) => i.quantity > 0),
        }));
      },

      toggleGiftWrap: (productId, variantId) => {
        const key = lineItemKey(productId, variantId);
        set((state) => ({
          items: state.items.map((i) =>
            lineItemKey(i.productId, i.variantId) === key
              ? {
                  ...i,
                  isGiftWrap: !i.isGiftWrap,
                  giftWrapPrice: !i.isGiftWrap ? GIFT_WRAP_PRICE : 0,
                }
              : i,
          ),
        }));
      },

      applyCoupon: (code, discount) => {
        set({ couponCode: code, couponDiscount: discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 });
      },

      clearCart: () => {
        set({ items: [], couponCode: null, couponDiscount: 0 });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // ----- Selectors -----
      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) =>
            sum + (i.unitPrice + i.giftWrapPrice) * i.quantity,
          0,
        ),

      shipping: () => {
        const sub = get().subtotal() - get().couponDiscount;
        if (sub === 0) return 0;
        return sub >= SHIPPING_THRESHOLD ? 0 : 250;
      },

      total: () => {
        const sub = get().subtotal();
        return Math.max(0, sub - get().couponDiscount) + get().shipping();
      },

      amountUntilFreeShipping: () => {
        const sub = get().subtotal();
        return Math.max(0, SHIPPING_THRESHOLD - sub);
      },

      hasFreeShipping: () => get().subtotal() >= SHIPPING_THRESHOLD,
    }),
    {
      name: "aura-living-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    },
  ),
);

export { GIFT_WRAP_PRICE };
export { computeDiscountedPrice };
