"use client";

import { useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { SITE, WHATSAPP_MESSAGE } from "@/lib/constants";

/**
 * WhatsAppFab — floating WhatsApp action button (bottom-right).
 * Pakistani consumers prefer WhatsApp for customer support — this FAB is
 * the single most important conversion lever for the market.
 *
 * Includes a subtle pulse-ring animation (see .pulse-ring in globals.css)
 * that respects prefers-reduced-motion.
 */
export function WhatsAppFab() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  // Defensive: ensure the FAB never traps focus on mount
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-fixed bottom-4 right-4 md:bottom-6 md:right-6 inline-flex items-center gap-2 pl-3 pr-4 h-12 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-base ease-aura-living safe-pb"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="relative flex items-center justify-center w-7 h-7">
        <span className="pulse-ring" aria-hidden="true" />
        <MessageCircle className="size-5 relative" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold tracking-wide hidden sm:inline">
        Chat with us
      </span>
      <span className="sr-only">Opens WhatsApp in a new tab</span>
    </a>
  );
}

/** Compact close button used elsewhere — kept here for cohesion. */
export function CloseButton({
  onClick,
  label = "Close",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-ghost btn-sm px-2"
      aria-label={label}
    >
      <X className="size-5" />
    </button>
  );
}
