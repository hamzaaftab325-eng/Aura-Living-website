import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge — small status pill.
 * Uses .pill-* global classes from globals.css.
 */
const badgeVariants = cva("pill", {
  variants: {
    variant: {
      gold: "pill-gold",
      goldSoft: "pill-gold-soft",
      outline: "pill-outline",
      sale: "pill-sale",
      new: "pill-new",
    },
  },
  defaultVariants: {
    variant: "gold",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
