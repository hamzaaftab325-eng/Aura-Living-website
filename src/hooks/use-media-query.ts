"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — SSR-safe media query hook.
 * Returns `false` on the server and during the first client render, then
 * resolves to the actual match after mount (avoids hydration mismatches).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Common media query presets matching the Tailwind breakpoints. */
export const useIsMobile = () => useMediaQuery("(max-width: 47.99rem)"); // < 768px
export const useIsTablet = () => useMediaQuery("(min-width: 48rem) and (max-width: 63.99rem)");
export const useIsDesktop = () => useMediaQuery("(min-width: 64rem)");
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
