// AURELIA Plan — Content Part 5: Components, SEO, Performance, Accessibility
const H = require("./aurelia-plan.js");
const { h1, h2, h3, p, pr, bullet, bulletRich, spacer, divider, codeBlock, caption, dataTable, callout } = H;

// ════════════════════════════════════════════════════════════════
// CHAPTER 8: COMPONENT INVENTORY
// ════════════════════════════════════════════════════════════════
function chapter8() {
  return [
    h1("8. Component Inventory"),

    p("The AURELIA component inventory is organised in three tiers: UI primitives (the smallest reusable units, in features/ui/), composite components (combinations of primitives that solve a specific UX pattern, in features/<feature>/components/), and page sections (large compositions that make up the structure of a page, in features/home/components/ and features/layout/components/). Every component is a Server Component by default unless it requires interactivity, in which case it is explicitly marked with \"use client\". This chapter catalogues every component planned for the build."),

    h2("8.1 UI Primitives"),

    p("UI primitives are the building blocks. They are deliberately minimal, accepting className and standard HTML props for composition, and they enforce the design system by rejecting props that would override tokens (e.g., the Button component does not accept a backgroundColor prop). There are twelve primitives in the AURELIA design system."),

    spacer(120),
    dataTable(
      ["Component", "Variants", "Purpose"],
      [
        ["Button", "primary, secondary, ghost, outline; sizes sm/md/lg", "All clickable actions"],
        ["Input", "text, email, tel, password, search; with label, error, hint", "Single-line text input"],
        ["Textarea", "with label, error, hint, char count", "Multi-line text input"],
        ["Select", "native select with custom chevron, searchable variant", "Dropdown selection"],
        ["Badge", "default, gold, success, warning, error", "Status indicators, tags"],
        ["Card", "default, hoverable, padded", "Container for grouped content"],
        ["Chip", "removable, selectable", "Filters, tags, categories"],
        ["Accordion", "single, multi; with smooth height animation", "FAQ, PDP info sections"],
        ["Dialog", "modal, alert; with focus trap and Esc-to-close", "Modals, confirmations"],
        ["Sheet", "left, right, bottom; with focus trap", "Cart drawer, mobile menu, filters"],
        ["Skeleton", "text, rect, circle; with pulse animation", "Loading placeholders"],
        ["Toast", "success, error, info, warning; auto-dismiss", "Transient notifications"],
      ],
      [22, 38, 40]
    ),
    caption("Table 8.1 — UI primitives in the AURELIA design system"),

    h2("8.2 Composite Components"),

    p("Composite components combine primitives into UX patterns. They live in feature folders and are not shared across features unless the pattern is truly generic (in which case the component is promoted to a shared folder). The table below lists the planned composite components, organised by feature."),

    spacer(120),
    dataTable(
      ["Feature", "Component", "Notes"],
      [
        ["Product", "ProductCard", "Grid card with image, name, price, quick-add"],
        ["Product", "ProductGallery", "Desktop: thumb strip + main; Mobile: swipe carousel"],
        ["Product", "ProductOptions", "Variant selectors (colour, size)"],
        ["Product", "ProductReviews", "Summary + paginated list"],
        ["Product", "RelatedProducts", "Horizontal scroll carousel"],
        ["Cart", "CartDrawer", "Right-side slide-in (Sheet-based)"],
        ["Cart", "CartLineItem", "Image, name, price, quantity stepper, remove"],
        ["Cart", "CartSummary", "Subtotal, shipping, discount, total"],
        ["Cart", "EmptyCart", "Illustrated empty state"],
        ["Checkout", "CheckoutForm", "4-section single-page form (RHF + Zod)"],
        ["Checkout", "PaymentSelector", "Radio group with method-specific fields"],
        ["Checkout", "OrderSummary", "Sticky sidebar with line items and totals"],
        ["Layout", "SiteHeader", "Transparent-to-solid on scroll, with nav + cart + search"],
        ["Layout", "MobileMenu", "Full-screen Sheet with nav accordion"],
        ["Layout", "SiteFooter", "4-column footer with newsletter, links, social"],
        ["Layout", "SearchOverlay", "Full-screen Sheet with input + suggestions"],
        ["Layout", "WhatsAppFAB", "Persistent floating button, bottom-right"],
        ["Layout", "Breadcrumb", "Schema.org-compliant breadcrumb trail"],
        ["Home", "Hero", "Full-viewport with parallax + staggered text reveal"],
        ["Home", "CategoryTiles", "3-tile grid linking to categories"],
        ["Home", "FeaturedCollection", "Pinned section with parallax background"],
        ["Home", "Bestsellers", "4-col grid with hover quick-add"],
        ["Home", "EditorialBanner", "Full-bleed seasonal banner"],
        ["Home", "Testimonials", "Infinite marquee (desktop) / swipe (mobile)"],
        ["Home", "NewsletterCTA", "Centered form with email capture"],
        ["Account", "AccountSidebar", "Nav with active state"],
        ["Account", "OrderCard", "Order summary card with status badge"],
        ["Account", "AddressCard", "Saved address with edit/delete actions"],
      ],
      [16, 26, 58]
    ),
    caption("Table 8.2 — Composite components by feature"),

    h2("8.3 Animation Wrappers"),

    p("Three reusable animation wrappers live in components/ and are used across features. The Parallax wrapper (GSAP ScrollTrigger, GPU-accelerated, reduced-motion-aware) wraps any element to apply scroll-linked translation. The Reveal wrapper (Framer Motion whileInView) wraps elements to fade-and-slide them into view on scroll, with optional stagger. The MagneticButton wrapper (Framer Motion useMotionValue + useSpring) wraps buttons to apply a subtle magnetic drift toward the cursor on hover. Each wrapper is documented in Chapter 6."),

    h2("8.4 Component Documentation"),

    p("Every component ships with a co-located Storybook story (component.stories.tsx) documenting its variants, sizes, states, and edge cases. Storybook is deployed to a private URL via Chromatic (or Vercel preview) and is the canonical reference for the design system. Components without stories are flagged in CI. Stories are also the visual regression testing surface: Chromatic snapshots every story on every PR and flags visual changes for review."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 9: SEO STRATEGY
// ════════════════════════════════════════════════════════════════
function chapter9() {
  return [
    h1("9. SEO Strategy"),

    p("Organic search is the most defensible acquisition channel for an e-commerce brand. Paid ads stop the moment you stop paying; SEO compounds. AURELIA's SEO strategy is built on 2026 best practices: a technically flawless foundation (fast pages, clean URLs, proper redirects, structured data), comprehensive on-page optimisation (unique titles and meta descriptions, semantic HTML, internal linking), and a content strategy that earns links and topic authority (the Journal, the Lookbook, category-level editorial content). This chapter specifies the technical and on-page layers; the content layer is covered in the separate content strategy."),

    h2("9.1 Technical SEO Architecture"),

    p("AURELIA's technical SEO is built into the Next.js App Router architecture rather than bolted on. Every page generates its own metadata via the Metadata API (a typed export from each page or layout), the sitemap is generated dynamically from the product and content catalogues, the robots.txt is generated with appropriate rules for staging versus production, and all redirects (permanent moves, retired products, URL changes) are managed in next.config.ts to be served at the edge with no server compute."),

    h3("9.1.1 Metadata API Usage"),

    p("Every page exports a generateMetadata function (for dynamic pages) or a static metadata object (for static pages). The metadata includes title, description, openGraph, twitter, alternates (canonical), robots, and any structured data via the jsonLd property (Next.js 16 native). The lib/seo.ts module provides helper functions for consistent metadata construction across the site."),

    codeBlock(`// app/product/[slug]/page.tsx — metadata generation
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { absoluteUrl, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product not found" };

  return {
    title: \`\${product.name} — AURELIA | \${product.category}\`,
    description: product.subtitle,
    alternates: { canonical: \`/product/\${product.slug}\` },
    openGraph: {
      title: product.name,
      description: product.subtitle,
      images: [{ url: product.images[0].url, width: 1200, height: 1500 }],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}`),

    h2("9.2 On-Page SEO Patterns"),

    p("On-page SEO follows a disciplined template. Every page has a single H1 (the page title), H2s for major sections, H3s for subsections, no heading level skipping. The first paragraph of every page includes the primary keyword naturally. Images have descriptive alt text (never keyword-stuffed, never empty). Internal links use descriptive anchor text (not \"click here\"). External links to authoritative sources use rel=\"noopener noreferrer\". Every page has a descriptive title tag (50-60 characters), a unique meta description (140-160 characters), and a canonical URL."),

    h2("9.3 Schema.org Markup"),

    p("Structured data is the language search engines use to understand page content. AURELIA implements five schema.org types via JSON-LD (the recommended format). Product is on every PDP with name, image, description, sku, brand, aggregateRating, and offers. BreadcrumbList is on every page with breadcrumbs. Organization is on the homepage and key pages. FAQPage is on the FAQ page and any PDP with an FAQ section. Article is on every Journal post. All JSON-LD is validated via the Rich Results Test before deployment."),

    spacer(120),
    dataTable(
      ["Schema Type", "Pages", "Key Properties"],
      [
        ["Product", "All PDPs", "name, image, description, sku, brand, aggregateRating, offers"],
        ["BreadcrumbList", "All pages with breadcrumbs", "itemListElement with position, name, item"],
        ["Organization", "Homepage, About, Contact", "name, url, logo, sameAs (social), contactPoint"],
        ["FAQPage", "FAQ, PDPs with FAQ", "mainEntity with Question/Answer pairs"],
        ["Article", "Journal posts", "headline, image, datePublished, author, publisher"],
        ["WebSite", "Homepage", "name, url, potentialAction (SearchAction)"],
      ],
      [18, 24, 58]
    ),
    caption("Table 9.1 — Schema.org markup implemented across AURELIA"),

    h2("9.4 Sitemap and Robots Strategy"),

    p("The sitemap is generated dynamically at build time via app/sitemap.ts, including all products, collections, journal posts, lookbook entries, and static pages. The sitemap is split into multiple files if it exceeds 50,000 URLs (not anticipated in the frontend phase). Each URL includes lastModified, changeFrequency, and priority. The robots.txt is generated via app/robots.ts and differs between staging (disallow all) and production (allow all, disallow /account, /checkout, /cart, /admin, /api)."),

    h2("9.5 Open Graph and Social"),

    p("Every page has Open Graph and Twitter Card metadata. The default social image (a 1200x630 PNG featuring the AURELIA logo on a gold-and-black background with the tagline) lives in public/images/og-default.jpg. Product pages use the product's hero image (1200x1500 for vertical card dominance in social feeds). Journal posts use the post's hero image. The og:type is product for PDPs, article for journal posts, and website for everything else."),

    h2("9.6 Content SEO Guidelines"),

    p("Beyond the technical layer, AURELIA's SEO is built on a content strategy targeting Pakistani home-decor search intent. The Journal publishes two posts per month covering topics that match customer search behaviour (\"how to care for a monstera in Karachi's climate\", \"best lamp height for living room\", \"soy wax vs paraffin candles\"). Each post targets a long-tail keyword with measurable search volume in Pakistan. Category pages have 200-word introductory copy targeting category-level keywords (\"table lamps Pakistan\", \"indoor plants Karachi\"). Product descriptions are 80 to 150 words, unique to each product (never manufacturer boilerplate), and include material, dimensions, care instructions, and a sensory description."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 10: PERFORMANCE STRATEGY
// ════════════════════════════════════════════════════════════════
function chapter10() {
  return [
    h1("10. Performance Strategy"),

    p("Performance is a feature. In Pakistan, where mobile connections are often 3G or entry-level 4G with high latency and intermittent coverage, performance is the feature. A site that loads in 1.5 seconds on a Karachi 4G connection converts dramatically better than one that loads in 4 seconds, and the user who has a fast first experience returns. AURELIA's performance strategy sets specific, measurable targets and engineers the architecture to hit them. Every PR is gated on performance budgets enforced in CI."),

    h2("10.1 Core Web Vitals Targets"),

    p("AURELIA targets the premium Core Web Vitals thresholds, not just the passing thresholds. The passing thresholds (the bar Google uses for ranking signals) are LCP under 2.5 seconds, INP under 200 milliseconds, and CLS under 0.1. AURELIA's targets are tighter: LCP under 2.0 seconds, INP under 150 milliseconds, CLS under 0.05. These targets are measured against the 75th percentile of real-user traffic via Vercel Web Vitals, not against Lighthouse lab data. Lab data is used in CI for regression detection; field data is the source of truth."),

    spacer(120),
    dataTable(
      ["Metric", "Passing (Google)", "AURELIA Target", "Strategy"],
      [
        ["LCP", "≤ 2.5s", "≤ 2.0s", "Hero image preload + AVIF + PPR static shell"],
        ["INP", "≤ 200ms", "≤ 150ms", "RSC for static content, minimal client JS, debounce handlers"],
        ["CLS", "≤ 0.1", "≤ 0.05", "Explicit width/height on all images, no layout-shifting ads"],
        ["TTFB", "≤ 0.8s", "≤ 0.4s", "Edge runtime + PPR + ISR for product pages"],
        ["FCP", "≤ 1.8s", "≤ 1.2s", "Critical CSS inlined, font preload, minimal blocking JS"],
        ["TBT (lab)", "≤ 0.2s", "≤ 0.1s", "Code splitting, defer non-critical hydration"],
      ],
      [16, 22, 22, 40]
    ),
    caption("Table 10.1 — Core Web Vitals targets and strategies"),

    h2("10.2 Image Optimization"),

    p("Images are the largest payload on most AURELIA pages, and image optimisation is therefore the largest performance lever. Every image is served via next/image, which automatically generates AVIF (the modern format with the best compression) and WebP (the widely-supported fallback) versions at the requested size. The hero image of every page is preloaded with fetchpriority=\"high\". Below-the-fold images use loading=\"lazy\". Every image has explicit width and height attributes to reserve space and prevent layout shift. The default quality is 75 (a good balance of file size and visual quality); product images use 80 for slightly sharper detail."),

    p("Image dimensions are deliberate, not arbitrary. Product card images are 600x750 pixels (4:5 portrait at 2x for retina). PDP gallery images are 1200x1500 pixels. Hero images are 1920x2160 pixels (a tall hero that fills the viewport on most desktops). Lookbook images are 1080x1350 pixels. By serving exactly the size needed at the device pixel ratio requested, AURELIA avoids the common anti-pattern of serving a 4000-pixel image to a 375-pixel phone."),

    h2("10.3 Code Splitting and Bundle Budgets"),

    p("Every page in AURELIA ships only the JavaScript it needs. The Next.js App Router automatically code-splits at the route level, and Client Components are bundled separately from Server Components. Beyond the framework's defaults, AURELIA uses dynamic imports for heavy client-side dependencies that are not needed on initial load: the GSAP-heavy parallax and pinned-section components are dynamically imported on desktop only; the Stripe.js (future) library is loaded only on the checkout page; the Storybook-only code is excluded from production builds entirely."),

    p("Bundle budgets are enforced in CI via the bundlesize package. The First Load JS budget (the JavaScript shipped on a fresh page load) is 130KB gzipped per route, broken down as: 40KB framework (React + Next.js runtime), 30KB animation libraries (allocated as documented in Chapter 6), 30KB application code, 20KB UI primitives and shared utilities, 10KB headroom. Routes that exceed 130KB fail CI. The current allocation is tight; growing it requires a documented decision."),

    h2("10.4 Font Loading"),

    p("Fonts are loaded via next/font as documented in Chapter 5. The strategy ensures zero render-blocking font requests, zero layout shift from font swaps, and minimal payload. Fraunces and Inter are preloaded with display: swap, which shows fallback text immediately and swaps to the web font when loaded. The fallback fonts (Georgia for Fraunces, system-ui for Inter) are tuned via font-display descriptors to minimise the swap shift."),

    h2("10.5 Caching Strategy"),

    p("Caching is layered across four tiers. The browser cache holds static assets (JS, CSS, images) with immutable, max-age=31536000 directives ( filenames are content-hashed, so they are safe to cache forever). The edge cache (Vercel's global CDN) holds the prerendered HTML of static pages and ISR pages, served from the nearest POP. The ISR cache (Next.js's incremental static regeneration) holds the rendered output of dynamic pages like PDPs, with a 300-second revalidation window. The full-page cache (future, full-stack phase) holds personalised pages per user."),

    h2("10.6 Mobile Performance on Pakistani Networks"),

    p("Mobile performance on Pakistani networks requires specific optimisations beyond the standard Core Web Vitals playbook. First, the total page weight target on mobile is 800KB (vs 1.5MB on desktop), achieved by serving smaller images and deferring non-critical JavaScript. Second, the LCP target on 4G is 2.5 seconds (vs 2.0 seconds on wifi), reflecting the higher latency. Third, the site is tested on real Pakistani mobile networks (Mobilink, Telenor, Zong) via WebPageTest's Lahore and Karachi test locations, not just on fast lab connections. Fourth, the site gracefully degrades on slow connections: images load progressively (low-quality placeholder to full quality), and non-critical sections lazy-load as the user scrolls."),

    callout(
      "MOBILE NETWORK TESTING",
      "Every PR is tested via WebPageTest on a Moto G4 (a low-end Android representative of Pakistani mid-range phones) over a simulated 4G connection (9Mbps down, 3Mbps up, 170ms RTT). The LCP, INP, and total page weight are recorded and tracked over time. Regressions over 10% on any metric block the PR."
    ),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 11: ACCESSIBILITY (WCAG 2.2 AA)
// ════════════════════════════════════════════════════════════════
function chapter11() {
  return [
    h1("11. Accessibility (WCAG 2.2 AA)"),

    p("Accessibility is a non-negotiable requirement for AURELIA. WCAG 2.2 AA is the target, both because it is the right thing to do and because compliance pressure on e-commerce sites is increasing globally, with the European Accessibility Act coming into full force in April 2026. Beyond legal compliance, accessibility improves the experience for all users (including the temporary disabilities of a parent holding a baby while shopping on mobile, or a user on a bright outdoor screen). This chapter specifies the accessibility strategy; specific patterns are referenced throughout the page blueprints in Chapter 7."),

    h2("11.1 Compliance Targets"),

    p("AURELIA targets WCAG 2.2 Level AA. This means meeting all A and AA success criteria, including the nine new criteria added in WCAG 2.2 (focus appearance, focus not obscured, dragging movements, target size minimum, consistent help, redundant entry, accessible authentication, accessible authentication minimum, and target size enhanced). Every page is tested with automated tooling (axe-core in CI, Lighthouse accessibility audit) and with manual testing (keyboard-only navigation, screen reader testing with NVDA on Windows and VoiceOver on macOS and iOS)."),

    h2("11.2 Keyboard Navigation"),

    p("Every interactive element in AURELIA is fully operable via keyboard. The tab order follows the visual order (no tabindex manipulation except for -1 to remove decorative elements from the tab order). Focus rings are visible (a 2px gold outline with a 2px offset, never removed), follow the brand colour system, and meet the WCAG 2.2 focus appearance criteria (the focus indicator is at least as large as the area of a 1 CSS pixel border of the focused control). Skip links are present at the top of every page (Skip to Main Content, Skip to Footer)."),

    p("Modal dialogs, drawers, and overlays trap focus correctly: when a dialog opens, focus moves to the dialog; when it closes, focus returns to the trigger. The Esc key closes any overlay. The Tab key cycles within the dialog and does not escape to the underlying page. These patterns are implemented once in the Dialog and Sheet primitives (built on top of the accessible Radix UI primitives that underlie shadcn/ui) and inherited by every overlay in the application."),

    h2("11.3 Screen Reader Patterns"),

    p("AURELIA uses semantic HTML as the primary screen reader strategy. Headings are h1-h3 (never divs with role), lists are ul/ol, navigation is nav, the main content is main, the header is header, the footer is footer, forms use label-for-input associations. Where semantic HTML is insufficient, ARIA is used sparingly and correctly: aria-label on icon-only buttons, aria-live on toast notifications, aria-expanded on accordions, aria-current on the active nav item. ARIA is never used to override semantic HTML; it only fills gaps."),

    p("Product cards have a clear screen reader announcement: \"[Product name], [Price], [In stock or Sold out], Add to cart button.\" The cart drawer announces \"Your cart, [N] items\" when it opens. The mobile menu announces \"Menu opened.\" Form errors are announced via aria-live=\"polite\" on the error region, with aria-invalid on the input. Loading states are announced via aria-busy on the loading region."),

    h2("11.4 Color Contrast (Gold on Black)"),

    p("The AURELIA colour system is engineered for accessibility from the start. The primary brand gold (#C9A84C) on the rich black (#0E0E0E) background achieves 7.4:1 contrast, exceeding the AAA threshold of 7:1 and making it safe for body text in dark sections. The darkest gold (#8A6B26) on white achieves 4.9:1, meeting the AA threshold for normal text. The white on rich black achieves 20.5:1, far exceeding any threshold. The system avoids the common anti-pattern of using pure gold (#C9A84C) for body text on white backgrounds (which would achieve only 2.1:1 and fail AA); gold on light backgrounds always uses the darker gold.700 variant."),

    h2("11.5 Focus Management"),

    p("Focus management is the discipline of ensuring the user's focus is in the right place at the right time. Beyond the modal focus trapping mentioned above, AURELIA manages focus on route changes (focus moves to the main heading of the new page), on filter changes on the PLP (focus moves to the result count announcement), on add-to-cart (the cart drawer opens and focus moves to the drawer title), and on form submission errors (focus moves to the first error field). These patterns are implemented via a small useFocusManager hook and are tested manually with a screen reader on every page."),

    callout(
      "ACCESSIBILITY TESTING PROTOCOL",
      "Every PR is tested via three methods: (1) axe-core automated scan via @axe-core/playwright (zero violations required). (2) Lighthouse accessibility audit (score 95+ required). (3) Manual keyboard-only test of the affected pages (all functionality reachable, no keyboard traps, visible focus throughout). For major releases, full screen reader testing with NVDA on Windows and VoiceOver on macOS/iOS is performed on the customer-critical journeys (homepage, PDP, cart, checkout)."
    ),
  ];
}

module.exports = { chapter8, chapter9, chapter10, chapter11 };
