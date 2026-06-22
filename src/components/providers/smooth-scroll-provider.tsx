"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLenis } from "@/hooks/use-lenis";

/**
 * SmoothScrollProvider — initialises Lenis once for the whole app.
 * Children can access the instance via `useSmoothScroll()` for programmatic scrolling.
 */

interface SmoothScrollContextValue {
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void;
  scrollToTop: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (lenis) setIsReady(true);
  }, [lenis]);

  const value = useMemo<SmoothScrollContextValue>(
    () => ({
      scrollTo: (target, options = {}) => {
        const offset = options.offset ?? 0;
        if (!lenis) {
          if (typeof target === "string") {
            const el = document.querySelector(target);
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY + offset;
              window.scrollTo({ top, behavior: "smooth" });
            }
          } else if (typeof target === "number") {
            window.scrollTo({ top: target + offset, behavior: "smooth" });
          } else if (target instanceof HTMLElement) {
            const top = target.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
          return;
        }
        if (typeof target === "string") {
          lenis.scrollTo(target, { offset });
        } else if (typeof target === "number") {
          lenis.scrollTo(target + offset);
        } else if (target instanceof HTMLElement) {
          lenis.scrollTo(target, { offset });
        }
      },
      scrollToTop: () => {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
      },
    }),
    [lenis, isReady],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll(): SmoothScrollContextValue {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) {
    return {
      scrollTo: (target) => {
        if (typeof target === "string") {
          document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
        } else if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "smooth" });
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      },
      scrollToTop: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    };
  }
  return ctx;
}
