"use client";

import { useEffect, useState } from "react";
import { ANNOUNCEMENTS } from "@/lib/constants";

/**
 * AnnouncementBar — rotating marquee of operational announcements.
 * Pure CSS animation (see .marquee / .marquee-track in globals.css).
 * No JS dependencies — works even with JS disabled.
 */
export function AnnouncementBar() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // Duplicate the list so the marquee loops seamlessly.
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div
      className="surface-gold-deep safe-pt"
      role="region"
      aria-label="Store announcements"
    >
      <div className="marquee py-2 text-on-gold">
        <div className="marquee-track" aria-hidden={isClient ? undefined : true}>
          {items.map((text, idx) => (
            <span
              key={`${idx}-${text.slice(0, 12)}`}
              className="text-on-gold text-xs font-semibold tracking-wide whitespace-nowrap flex items-center gap-4"
            >
              <span aria-hidden="true" className="inline-block w-1 h-1 rounded-full bg-current opacity-60" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
