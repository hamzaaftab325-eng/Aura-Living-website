import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton — loading placeholder with shimmer animation.
 * Uses the .skeleton global class.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}
