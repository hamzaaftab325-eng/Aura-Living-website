// Aura Living Plan — Content Part 3: Design System + Animation Strategy
const H = require("./aurelia-plan.js");
const { h1, h2, h3, p, pr, bullet, bulletRich, spacer, divider, codeBlock, caption, dataTable, callout } = H;

// ════════════════════════════════════════════════════════════════
// CHAPTER 5: DESIGN SYSTEM
// ════════════════════════════════════════════════════════════════
function chapter5() {
  return [
    h1("5. Design System"),

    p("The Aura Living design system is the single source of truth for every visual decision in the application. It is encoded as CSS custom properties (design tokens) in globals.css, surfaced as Tailwind theme extensions in tailwind.config.ts, and consumed exclusively via Tailwind utility classes in components. There are no inline styles anywhere in the codebase. There are no magic numbers in components. Every colour, every spacing value, every radius, every shadow, every animation duration is a token, and every token has a name, a value, and a documented purpose. This discipline is what allows a designer and a developer to collaborate without friction and what allows the brand to evolve without cascading refactors."),

    h2("5.1 Color Token System"),

    p("Aura Living uses a four-tier colour token system inspired by the 2026 Tailwind 4 design-token conventions. The four tiers are: primitive (the raw colour value, e.g., a specific hex), semantic (the role the colour plays, e.g., \"background\" or \"foreground\"), component (the colour as applied to a specific component, e.g., \"button-primary-background\"), and state (variations for hover, focus, active, disabled). Primitive tokens are never used directly in components; they are composed into semantic tokens, which are composed into component tokens. This indirection means that changing the brand gold from #C9A84C to a slightly warmer shade requires editing one primitive token, not hunting through every component."),

    p("The colour system is anchored by three primary families: gold (the brand accent, in five shades), black (the ink and dark-section background, in four shades), and white (the light-section background, in two warm shades). Two supporting families — warm gray (for muted text and borders) and signal colours (success green, warning amber, error red, used sparingly for system feedback) — complete the palette. Every colour in the system meets WCAG 2.2 AA contrast against at least one other colour in the system, and the gold-on-black combination meets AAA contrast (7.4:1), making it safe for body text in dark sections."),

    h2("5.2 Gold and Black Palette Specification"),

    p("The table below specifies every colour token in the Aura Living system. The hex values are the source of truth; the HSL equivalents are provided for convenience when adjusting opacity. The role column describes the intended use; the contrast column lists the minimum contrast ratio against the token's intended pairing colour."),

    spacer(120),
    dataTable(
      ["Token Name", "Hex", "Role", "Contrast"],
      [
        ["color.gold.100", "#F5E6B8", "Lightest gold — subtle highlights, hover bg on dark", "1.4:1 on black"],
        ["color.gold.300", "#E8C766", "Light gold — decorative elements on dark sections", "9.2:1 on black"],
        ["color.gold.500", "#C9A84C", "Primary brand gold — accent, links, key UI on dark", "7.4:1 on black (AAA)"],
        ["color.gold.600", "#B08D3A", "Deep gold — hover/active states for gold elements", "5.8:1 on black (AA)"],
        ["color.gold.700", "#8A6B26", "Darkest gold — gold text on LIGHT backgrounds", "4.9:1 on white (AA)"],
        ["color.black.0", "#FFFFFF", "Pure white — primary light background", "21:1 on black.900"],
        ["color.black.50", "#FAF8F2", "Warm cream — secondary surface, cards, table rows", "19.8:1 on black.900"],
        ["color.black.100", "#F0EBDC", "Mid warm — borders, dividers on light sections", "15.2:1 on black.900"],
        ["color.black.700", "#2A2A2A", "Soft black — body text on dark sections", "14.1:1 on white"],
        ["color.black.900", "#0A0A0A", "Deepest black — headings, primary text on light", "21:1 on white"],
        ["color.black.950", "#0E0E0E", "Rich black — dark section backgrounds", "20.5:1 on white"],
        ["color.gray.400", "#8A8275", "Muted gray — captions, footers on dark", "4.6:1 on black.950"],
        ["color.gray.600", "#5A5A5A", "Mid gray — captions, muted text on light", "7.4:1 on white"],
        ["color.signal.success", "#2E7D5B", "Success — order placed, payment confirmed", "4.6:1 on white"],
        ["color.signal.warning", "#B8860B", "Warning — low stock, address verification", "4.8:1 on white"],
        ["color.signal.error", "#B23A3A", "Error — out of stock, payment failed", "5.2:1 on white"],
      ],
      [22, 12, 42, 24]
    ),
    caption("Table 5.1 — Complete Aura Living colour token specification"),

    h2("5.3 Typography System"),

    p("Aura Living uses two typeface families: Fraunces (a variable serif) for display and headings, and Inter (a variable sans-serif) for body, UI, and microcopy. Both are loaded via next/font/google with the variable axis enabled, which gives access to the full weight range without shipping multiple font files. The choice of Fraunces is deliberate: it is a contemporary serif with optical sizing (the letterforms adjust based on size, becoming more refined at display sizes), a soft warmth that complements the gold palette, and a personality that distinguishes Aura Living from generic sans-only e-commerce sites. Inter is chosen as the body face because it was designed for screen readability at small sizes, has exceptional legibility, and is neutral enough to let Fraunces carry the brand voice."),

    h3("5.3.1 Type Scale"),

    p("The type scale is based on a 1.250 (major third) modular ratio, with each step 1.25 times the previous. The scale is fluid: every size uses CSS clamp() to scale smoothly between a mobile minimum and a desktop maximum, eliminating the need for breakpoint-based font-size changes and preventing the layout shift that comes from abrupt font swaps. The table below lists the named type tokens, their mobile and desktop sizes, the line-height, and the intended use."),

    spacer(120),
    dataTable(
      ["Token", "Mobile / Desktop", "Line Height", "Use"],
      [
        ["text.display", "clamp(2.5rem, 5vw, 4.5rem)", "1.05", "Homepage hero, editorial banners"],
        ["text.h1", "clamp(2rem, 4vw, 3rem)", "1.1", "Page titles (Product, Cart, About)"],
        ["text.h2", "clamp(1.5rem, 3vw, 2.25rem)", "1.2", "Section headings"],
        ["text.h3", "clamp(1.25rem, 2vw, 1.5rem)", "1.3", "Subsection headings, product names"],
        ["text.h4", "clamp(1.125rem, 1.5vw, 1.25rem)", "1.4", "Card titles, table headers"],
        ["text.body-lg", "clamp(1.0625rem, 1vw, 1.125rem)", "1.6", "Lead paragraphs, product descriptions"],
        ["text.body", "1rem (16px)", "1.6", "Default body text"],
        ["text.body-sm", "0.875rem (14px)", "1.5", "Secondary body, captions, table cells"],
        ["text.caption", "0.75rem (12px)", "1.4", "Footnotes, disclaimers, badges"],
        ["text.overline", "0.6875rem (11px)", "1.4", "Labels, eyebrows — uppercase, tracking 0.1em"],
      ],
      [18, 26, 14, 42]
    ),
    caption("Table 5.2 — Aura Living fluid type scale (Fraunces for display/h1/h2, Inter for h3 and below)"),

    h3("5.3.2 Font Loading Strategy"),

    p("Fonts are loaded via next/font/google in the root layout. This approach has three critical advantages over traditional CSS @font-face loading: the fonts are self-hosted on the same domain as the application (eliminating the third-party request to fonts.googleapis.com that hurts performance and privacy), the font files are automatically subset to the glyphs used in the build (smaller payloads), and the font CSS is inlined into the HTML response (no render-blocking font CSS request). The variable axes of Fraunces and Inter are preloaded to ensure first paint has the correct typography."),

    codeBlock(`// app/layout.tsx — font loading
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${fraunces.variable} \${inter.variable}\`}>
      <body>{children}</body>
    </html>
  );
}`),

    h2("5.4 Spacing System"),

    p("Aura Living uses an 8-pixel base spacing unit, extended with a 4-pixel half-step for fine adjustments (icon padding, tight groups). All spacing in the application — padding, margin, gap, position offsets — is a multiple of 4. This constraint is enforced by the Tailwind config: only the values in the spacing scale are available as utilities, and arbitrary values via square-bracket syntax are disabled by an ESLint rule. The result is that every component sits on the same invisible grid, and the eye perceives a calm rhythm across the entire site."),

    p("For responsive spacing, the system uses fluid clamp() values at the section level. Section padding (the space between major page sections) is clamp(3rem, 8vw, 6rem) on mobile to desktop, scaling smoothly rather than stepping at breakpoints. Component-level spacing stays fixed: a button's internal padding does not change between mobile and desktop, only its container's spacing does. This distinction prevents the visual chaos of components resizing inconsistently across breakpoints."),

    spacer(120),
    dataTable(
      ["Token", "Value", "Use"],
      [
        ["space.0", "0", "No spacing (used for resets)"],
        ["space.px", "1px", "Hairline borders, focus rings"],
        ["space.0.5", "2px", "Micro adjustments (icon-to-text gap)"],
        ["space.1", "4px", "Tight internal padding (badges, chips)"],
        ["space.2", "8px", "Default icon padding, small component gaps"],
        ["space.3", "12px", "Button internal padding, list item gaps"],
        ["space.4", "16px", "Card padding, default component gaps"],
        ["space.6", "24px", "Form field gaps, card-to-card gaps"],
        ["space.8", "32px", "Subsection gaps within a section"],
        ["space.12", "48px", "Section heading to body gap"],
        ["space.16", "64px", "Section-to-section gap (mobile)"],
        ["space.24", "96px", "Section-to-section gap (desktop)"],
        ["space.section", "clamp(3rem, 8vw, 6rem)", "Fluid section padding (page-level)"],
      ],
      [16, 24, 60]
    ),
    caption("Table 5.3 — Aura Living spacing scale"),

    h2("5.5 Layout & Grid System"),

    p("Aura Living uses a 12-column grid on desktop, collapsing to a single column on mobile. The grid is implemented via Tailwind's grid utilities (grid-cols-12, col-span-X) and is constrained by a maximum content width of 1440px (90rem), with a minimum content width of 320px (the smallest phone Aura Living officially supports). The horizontal padding on either side of the grid is fluid: clamp(1rem, 5vw, 4rem), giving comfortable reading on small phones and generous air on large monitors. The grid is not used for every layout; for editorial pages (lookbook, journal) the layout breaks the grid intentionally for visual rhythm, but always returns to it for product listings and structured content."),

    p("Three container classes are defined as Tailwind components: .container-page (max-width 1440px, fluid padding, centered — for most pages), .container-narrow (max-width 768px, fluid padding — for article reading and checkout), and .container-wide (max-width 1680px, fluid padding — for full-bleed editorial). Every page uses one of these containers as its outermost wrapper, ensuring consistent horizontal rhythm across the site."),

    h2("5.6 Border Radius & Elevation"),

    p("Border radius in Aura Living is restrained. The system uses four radii: sharp (0px, for images and dividers), small (4px, for inputs and small buttons), medium (8px, for cards and large buttons), and pill (999px, for badges, chips, and the WhatsApp FAB). The restrained radius scale is a deliberate departure from the soft, rounded look of generic e-commerce sites; it gives Aura Living a more architectural, less playful feel that matches the premium positioning."),

    p("Elevation is similarly restrained. Aura Living uses only four shadows: none (default for most surfaces), sm (a 1px subtle shadow for cards in their resting state), md (a 4px shadow for cards on hover and dropdowns), and lg (an 8px shadow for the cart drawer, modals, and the mobile menu). Shadows are warm-tinted (using rgba(10, 10, 10, 0.08) rather than pure black) to feel softer and more cohesive with the warm palette. Borders are preferred over shadows for visual separation in most cases, giving the design a flatter, more editorial feel."),

    h2("5.7 Iconography"),

    p("All icons in Aura Living come from lucide-react, a tree-shakeable icon library with a consistent 2px stroke weight, 24x24 viewBox, and MIT licence. Icons are never recoloured to non-palette colours, never resized outside the type scale, and always have accessible names when used alone (via aria-label) or are hidden from assistive tech when used alongside visible text (via aria-hidden). The icon set used across the site is intentionally small (around 25 icons) to maintain visual consistency."),

    p("Custom icons — the Aura Living logo mark, the category icons for lamps/plants/candles, and a handful of decorative editorial marks — are hand-drawn SVGs, exported as React components in components/icons/. These use the same 2px stroke weight as Lucide for consistency. The Aura Living logo mark is a stylised overlapping L, P, and C (lamp, plant, candle) inside a circle, designed to read as both a single elegant mark and a subtle reference to the three product categories."),

    h2("5.8 Imagery Art Direction"),

    p("Imagery is the single most important visual element of a premium home-decor brand. Aura Living's imagery guidelines specify a consistent art direction: warm natural light (2700K to 3500K colour temperature, never cool blue), shallow depth of field, real Pakistani homes and contexts (not stock-photo western interiors), and a muted earth-toned palette that complements the gold and black brand. Product photography is shot on warm cream or soft black backgrounds; lifestyle photography places products in real homes with visible textures (linen, brass, terracotta, wood). All images are served as AVIF with WebP fallback via next/image, with explicit width and height attributes to prevent layout shift."),

    p("The homepage hero uses a single full-bleed editorial image or a slow Ken-Burns-style video, never a carousel. Carousel hero sections are explicitly forbidden: they introduce interaction cost, hide content from users who do not interact, and dilute the visual focus. The homepage hero is refreshed seasonally (four times per year) to signal freshness without frequent disruption."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 6: ANIMATION & MOTION STRATEGY
// ════════════════════════════════════════════════════════════════
function chapter6() {
  return [
    h1("6. Animation & Motion Strategy"),

    p("Motion in Aura Living is not decoration; it is communication. Every animation has a purpose: to draw attention, to provide feedback, to guide the eye, to smooth a transition, or to delight. Animations without a purpose are removed. This discipline is critical because animations have a cost — they consume main-thread time, they can cause layout shift, and they can make a site feel sluggish if mistimed. The Aura Living motion system is engineered to feel expensive (long, smooth, choreographed) on capable devices and to feel instant on low-powered devices, with no middle ground that feels neither polished nor fast."),

    p("Three libraries work together, each with a clearly delineated role. GSAP handles scroll-triggered animations (parallax, pinned sections, scrub-linked reveals), long-running timeline-based sequences (the homepage hero entrance, the product page gallery transitions), and any animation that requires precise timing control across multiple elements. Framer Motion (Motion) handles component-level animations (enter/exit transitions, layout animations, gesture-based interactions like drag and hover, and AnimatePresence-driven mount/unmount). Lenis provides smooth scrolling on desktop and (selectively) on mobile, integrating with GSAP's ScrollTrigger via a one-time raf wiring. There is deliberate overlap between what GSAP and Framer Motion can do; the rule is that GSAP owns anything scroll- or timeline-driven, and Framer Motion owns anything component- or gesture-driven."),

    h2("6.1 Motion Design Philosophy"),

    p("Aura Living motion follows four principles. First, slow is luxurious: Aura Living animations are slower than typical web animations (entrance animations are 800ms to 1200ms, not 300ms to 500ms) because slow motion signals confidence and craft. Second, choreography over chaos: when multiple elements animate together, they animate in sequence with small staggers (50ms to 120ms apart), never simultaneously, which creates a sense of choreography. Third, ease over line: every animation uses a custom cubic-bezier ease (a slow-in, slow-out curve with a slight overshoot for organic motion) rather than linear or default ease curves. Fourth, respect the user: every animation respects the prefers-reduced-motion media query, falling back to instant state changes for users who have requested reduced motion."),

    callout(
      "CUSTOM EASE CURVE",
      "Aura Living's signature ease: cubic-bezier(0.22, 1, 0.36, 1). This is a refined ease-out with no overshoot, derived from the standard 'easeOutQuint' curve. It feels slower and more deliberate than the default ease-out, which gives Aura Living motion its luxurious quality."
    ),

    h2("6.2 GSAP Usage Patterns"),

    p("GSAP is used via the @gsap/react package's useGSAP hook, which is the SSR-safe drop-in for useLayoutEffect and includes automatic cleanup via gsap.context(). Every GSAP animation in Aura Living lives inside a useGSAP hook, and the hook's scope is restricted to a ref to prevent selector collisions across components."),

    codeBlock(`// components/parallax.tsx — reusable parallax wrapper
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: React.ReactNode;
  speed?: number; // negative = slower (background), positive = faster (foreground)
  className?: string;
};

export function Parallax({ children, speed = -50, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(ref.current, {
      y: speed,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}`),

    p("Three GSAP patterns dominate the Aura Living codebase. The first is the parallax wrapper shown above, used for hero images, editorial banners, and the lookbook. The second is the scroll-triggered reveal, where elements animate from opacity 0 with a small y-offset to opacity 1 with no offset as they enter the viewport, with a stagger across sibling elements. The third is the pinned section, used sparingly on the homepage for the featured-collection section where the product grid pins and the background image scrolls behind it."),

    h2("6.3 Framer Motion Usage Patterns"),

    p("Framer Motion (imported as motion) handles all component-level animation. The most common pattern is the entrance animation via the initial, whileInView, and viewport props, which animate an element into view on scroll. Unlike GSAP's ScrollTrigger, Framer Motion's whileInView is simpler and integrates naturally with React's component lifecycle, making it the right tool for revealing cards, sections, and marketing copy. For cart drawer, mobile menu, and modals, AnimatePresence handles enter/exit animations on mount/unmount."),

    codeBlock(`// components/reveal.tsx — reusable scroll reveal
"use client";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 24, className }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}`),

    p("A second Framer Motion pattern is the magnetic button, where buttons and key interactive elements drift slightly toward the cursor on hover, giving a tactile, premium feel. This pattern uses the useMotionValue and useSpring hooks for performant, GPU-accelerated motion. It is used sparingly — only on the primary call-to-action buttons (Add to Cart, Checkout, Subscribe) — to avoid diluting its effect."),

    h2("6.4 Lenis Smooth Scroll Integration"),

    p("Lenis provides smooth scrolling by intercepting the native scroll, applying a lerp-based smoothing, and dispatching a transformed scroll event. On desktop, this gives the entire site a buttery, premium feel. On mobile, the situation is more nuanced: native mobile scroll is already smooth and performant, and overlaying Lenis can introduce input lag and break native interactions like pull-to-refresh. Aura Living therefore uses Lenis on desktop only, and uses the syncTouch option only on devices that report a fine pointer (i.e., touchscreens with a stylus, like iPad Pro), where the smoothness benefit outweighs the cost."),

    codeBlock(`// components/smooth-scroll-provider.tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Skip on mobile / coarse pointer / reduced motion
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || reduce) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // syncTouch: false on mobile-first build; enable only for fine pointer
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}`),

    h2("6.5 Parallax Implementation"),

    p("Parallax is the signature motion effect of Aura Living, used on the homepage hero, on editorial banners throughout the site, on the lookbook detail pages, and on the product page's lifestyle imagery. The implementation is GPU-accelerated (transform-only, never layout properties like top or left), passive (no scroll event listeners, only ScrollTrigger's raf-driven updates), and reduced-motion-aware (instant fallback). The parallax speed is calibrated per device: stronger on desktop (where the effect reads as luxurious) and subtler on mobile (where strong parallax causes motion sickness and feels gimmicky)."),

    p("Three parallax patterns are used. The first is single-layer parallax, where a background image moves slower than the foreground content (speed -30 to -50 on desktop, -15 to -25 on mobile). The second is multi-layer parallax, where two or three layers move at different speeds to create depth (used on the homepage hero: a background image at -50, a mid-ground product image at -25, and a foreground text overlay at 0). The third is scroll-linked rotation, where an element rotates subtly based on scroll progress (used on the Aura Living logo mark in the homepage hero, which rotates 5 degrees as the user scrolls past)."),

    h2("6.6 Reduced Motion Accessibility"),

    p("Every animation in Aura Living respects the prefers-reduced-motion media query. Users who have enabled this preference in their operating system see instant state changes with no motion. This is not optional; it is a WCAG 2.2 AA requirement and a basic respect for users who experience motion sensitivity, vestibular disorders, or simply prefer a calmer interface. The useReducedMotion hook (built on top of Framer Motion's hook of the same name) is the single point of truth for this check, and every animation component consults it before applying motion."),

    p("The reduced-motion fallback is not just disabling animation; it is designing the static end state to look intentional. A reveal animation that fades from opacity 0 to opacity 1 must, in reduced-motion mode, render at opacity 1 immediately — but the layout and spacing should still feel composed. A parallax that translates an element must, in reduced-motion mode, render the element in its final position. The discipline of designing the static end state well makes the reduced-motion experience equal in quality to the animated experience, not a degraded version of it."),

    h2("6.7 Performance Budgets for Animation"),

    p("Animation performance is governed by two budgets: a frame budget and a JavaScript budget. The frame budget is 16 milliseconds per frame on a 60Hz display (8ms on 120Hz displays); any animation that exceeds this budget causes visible jank. Aura Living animations only animate GPU-accelerated properties (transform, opacity, filter) and never animate layout properties (width, height, top, left, margin, padding). Will-change is used sparingly (on elements that will animate, set just before the animation starts and removed just after) to hint the browser to promote the element to its own compositor layer."),

    p("The JavaScript budget for animation libraries is 80KB gzipped total: GSAP core plus ScrollTrigger plus @gsap/react plus Motion plus Lenis. This budget is enforced by a bundlesize check in CI; if a PR introduces an animation library that pushes the total over 80KB, the build fails. The current budget allocation is approximately: GSAP core 30KB, ScrollTrigger 12KB, @gsap/react 2KB, Motion 30KB, Lenis 6KB — totaling 80KB. There is no headroom; introducing any additional animation library requires removing an existing one."),

    callout(
      "ANTI-PATTERNS FORBIDDEN",
      "The following animation patterns are explicitly forbidden in Aura Living: (1) Animating layout properties (width, height, top, left). (2) Using setTimeout or setInterval for animation. (3) Scroll event listeners without rAF throttling. (4) Parallax on touch devices without syncTouch testing. (5) Auto-playing video with sound. (6) Animations longer than 1500ms. (7) More than three simultaneous animations on screen at once. (8) Loading spinners that animate for less than 300ms (instant feedback preferred)."
    ),
  ];
}

module.exports = { chapter5, chapter6 };
