"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * QueryProvider — TanStack Query v5 client.
 * Stable configuration for an e-commerce storefront:
 *  - 60s stale time (catalogue data is fairly stable)
 *  - 1 retry (avoid hammering the backend on transient failures)
 *  - No refetch on window focus (avoid cart jumps)
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
