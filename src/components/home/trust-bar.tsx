import { Truck, ShieldCheck, RefreshCw, Leaf } from "lucide-react";
import { TRUST_BADGES } from "@/lib/constants";

/**
 * TrustBar — four-up feature strip with icons.
 * Pure server component (no interactivity) — render-once.
 */
const ICON_MAP = {
  truck: Truck,
  shield: ShieldCheck,
  refresh: RefreshCw,
  leaf: Leaf,
} as const;

export function TrustBar() {
  return (
    <section
      className="surface-ink-elevated border-y border-ink-700"
      aria-label="Why shop with us"
    >
      <div className="container-page py-8 md:py-10">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {TRUST_BADGES.map((badge) => {
            const Icon = ICON_MAP[badge.icon as keyof typeof ICON_MAP];
            return (
              <li
                key={badge.title}
                className="flex items-start gap-3"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full surface-ink-raised flex items-center justify-center border border-ink-600">
                  <Icon className="size-5 text-gold-400" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-paper leading-tight">
                    {badge.title}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{badge.subtitle}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
