// Aura Living Plan — Content Part 2: Technical Architecture + Folder Structure
const H = require("./aurelia-plan.js");
const { h1, h2, h3, p, pr, bullet, bulletRich, spacer, divider, codeBlock, caption, dataTable, callout } = H;

// ════════════════════════════════════════════════════════════════
// CHAPTER 3: TECHNICAL ARCHITECTURE
// ════════════════════════════════════════════════════════════════
function chapter3() {
  return [
    h1("3. Technical Architecture"),

    p("The technical architecture of Aura Living is chosen to satisfy three simultaneous demands: sub-second page loads on Pakistani mobile networks, a premium animation experience that does not compromise interaction responsiveness, and an SEO foundation that earns organic traffic from day one. Next.js 16, with its stable Partial Prerendering and Turbopack dev server, is the only framework in 2026 that meets all three demands without forcing compromises. This chapter specifies the stack and the architectural patterns that govern its use."),

    h2("3.1 Technology Stack Selection"),

    p("The stack is intentionally conservative on the runtime layer (Next.js, React, TypeScript) and intentionally opinionated on the experience layer (Tailwind, GSAP, Framer Motion, Lenis). The runtime choices prioritise stability, hiring pool, and long-term support. The experience choices prioritise the specific motion language Aura Living requires. Every dependency in the package.json must justify its weight against the bundle budget in Chapter 10; the list below has been pruned of every library that does not earn its place."),

    spacer(120),
    dataTable(
      ["Layer", "Technology", "Version (2026)", "Purpose"],
      [
        ["Framework", "Next.js", "16.x", "App Router, RSC, PPR, image/font opt"],
        ["UI Runtime", "React", "19.2 (via Next 16)", "Concurrent rendering, Server Components"],
        ["Language", "TypeScript", "5.6+", "Strict mode, end-to-end type safety"],
        ["Styling", "Tailwind CSS", "4.x", "Utility-first, zero inline styles"],
        ["UI Primitives", "shadcn/ui", "latest", "Headless components (Dialog, Sheet, etc.)"],
        ["Scroll Anim", "GSAP + @gsap/react", "3.12+ / 2.1+", "ScrollTrigger, timelines, useGSAP hook"],
        ["Component Anim", "Framer Motion (motion)", "11.x", "Layout animations, enter/exit, gestures"],
        ["Smooth Scroll", "Lenis", "1.1+", "lenis/react wrapper, syncTouch for mobile"],
        ["State", "Zustand", "5.x", "Cart, UI state, persist middleware"],
        ["Forms", "React Hook Form", "7.x", "Performant form state, controlled inputs"],
        ["Validation", "Zod", "3.x", "Shared schemas (client + future server)"],
        ["Icons", "lucide-react", "latest", "Tree-shakeable icons, consistent stroke"],
        ["Fonts", "Fraunces + Inter", "via next/font", "Display serif + body sans, zero CLS"],
        ["Class Merge", "clsx + tailwind-merge", "latest", "Conditional class composition"],
        ["Analytics", "Vercel Analytics + Plausible", "latest", "RUM + product analytics"],
      ],
      [16, 24, 16, 44]
    ),
    caption("Table 3.1 — Aura Living frontend dependency manifest"),

    h2("3.2 Next.js 16 App Router Architecture"),

    p("The App Router is the default and only recommended router in Next.js 16. Aura Living uses it exclusively. The Pages Router is deprecated and will not be considered. The App Router's core architectural primitive is the layout: a React component that wraps a segment of the route tree and remains mounted across navigations within that segment. Aura Living uses a root layout (with the html and body tags, font loading, and global providers), a marketing layout (for landing, about, contact, blog pages), a shop layout (for product listing, product detail, cart, checkout — with persistent filter state and cart drawer), and an account layout (for authenticated pages)."),

    p("Each route segment can include optional special files: loading.tsx for Suspense fallbacks, error.tsx for error boundaries, not-found.tsx for 404 within that segment, and layout.tsx for the persistent wrapper. Aura Living uses loading.tsx on every dynamic route (product pages, product listing pages, search) to display a content-shaped skeleton that prevents layout shift and signals progress to the user. Error boundaries are route-segmented so that a failure in a single product card never takes down the entire listing."),

    h2("3.3 Server vs Client Component Strategy"),

    p("The 2026 Next.js default is Server Components everywhere, with Client Components only at the leaf level where interactivity is required. This is not an aesthetic preference; it is a performance imperative. Server Components ship zero JavaScript to the client, can fetch data directly from the database or CMS without an API hop, and reduce the client bundle proportionally to how much of the page they render."),

    p("Aura Living follows a strict heuristic for choosing between Server and Client Components. A component is a Client Component if and only if it uses one of: useState, useEffect, useReducer, useRef (for DOM access), event handlers (onClick, onChange, onSubmit), browser-only APIs (window, localStorage, IntersectionObserver), or a Client-only third-party hook (useGSAP, useLenis, framer-motion's useScroll). Everything else is a Server Component by default. The cart drawer, the product gallery, the mobile menu, the search bar, the parallax hero, the newsletter form, and any component using GSAP or Framer Motion are Client Components. The product title, product description, breadcrumb, related products, footer, header, and most marketing content are Server Components."),

    h3("3.3.1 The 'use client' Boundary Pattern"),

    p("Client Components are not isolated islands; they compose with Server Components. Aura Living uses the pattern of Server Component parent passing Server-fetched data as props to a Client Component child. For example, the ProductPage (Server Component) fetches the product and renders the static parts (title, description, breadcrumbs, related products), then renders a ProductGallery (Client Component) passing it the image URLs as props. This keeps the gallery interactive while keeping the data fetch on the server and the static markup in the server-rendered HTML."),

    codeBlock(`// app/products/[slug]/page.tsx — Server Component
import { db } from "@/lib/db"; // future Supabase client
import { ProductGallery } from "@/features/product/product-gallery";
import { ProductInfo } from "@/features/product/product-info";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) notFound();

  return (
    <article>
      <ProductGallery images={product.images} />  {/* Client */}
      <ProductInfo product={product} />           {/* Server */}
    </article>
  );
}`),

    h2("3.4 Partial Prerendering (PPR) Strategy"),

    p("Next.js 16 made Partial Prerendering stable through the Cache Components API. PPR combines the speed of static generation with the dynamism of server rendering by prerendering a static shell of every page at build time, then streaming dynamic content into Suspense boundaries at request time. For Aura Living, this means: the homepage hero, navigation, footer, and most product imagery are prerendered as a static shell that serves from the edge in under 100 milliseconds; the personalised sections (recently viewed, cart count in the header) stream in as dynamic content via Suspense."),

    p("Every dynamic route in Aura Living is structured to maximise the prerendered surface. Product pages prerender the entire visible-above-the-fold content (gallery, title, price, add-to-cart) and stream only the related-products carousel and reviews section. The product listing page prerenders the page chrome and the first page of results, streaming the filter state and pagination. The homepage prerenders everything except the personalised recently-viewed strip. This architecture is what makes sub-second page loads achievable on Pakistani mobile networks: the static shell is served from a nearby edge POP without any server compute, and only the small dynamic portion requires a round trip."),

    h2("3.5 State Management Architecture"),

    p("Aura Living uses Zustand for client-side global state and React's built-in useState and useReducer for component-local state. There is no Redux, no MobX, no Recoil. Zustand is chosen because it has the smallest bundle size of any production-grade state library (around 1KB), a hooks-based API that feels native to React, and a persist middleware that handles cart persistence to localStorage with one line of configuration."),

    p("Three Zustand stores are planned. The cart store manages cart items, totals, and the open/closed state of the cart drawer, with persistence to localStorage and skipHydration to prevent SSR mismatches. The UI store manages ephemeral UI state such as mobile menu open, search overlay open, and recently-viewed product IDs. The user store (light, for the frontend phase) holds the cached user profile once authentication is added in the full-stack phase. Each store is in its own file under features/<feature>/store.ts and is consumed exclusively via custom hooks (useCart, useUI, useUser) to keep the API stable if the underlying store implementation changes."),

    codeBlock(`// features/cart/store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartItem = { id: string; slug: string; name: string; price: number; image: string; quantity: number };
type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      addItem: (item, qty = 1) => set((s) => {
        const existing = s.items.find((i) => i.id === item.id);
        if (existing) {
          return { items: s.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i), drawerOpen: true };
        }
        return { items: [...s.items, { ...item, quantity: qty }], drawerOpen: true };
      }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, qty) => set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i) })),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    { name: "aura-living-cart", storage: createJSONStorage(() => localStorage), skipHydration: true }
  )
);`),

    h2("3.6 Form Handling & Validation"),

    p("All forms in Aura Living — checkout, login, registration, newsletter, contact, address book — use React Hook Form for state management and Zod for validation. Zod schemas are defined once and shared between the client (for instant field-level feedback) and the future server (for authoritative validation). This eliminates the common anti-pattern of duplicating validation rules in two places and the bugs that follow."),

    p("The checkout form is the most complex form in the application and deserves explicit specification. It uses a multi-section single-page layout (not a multi-step wizard) because Pakistani users on mobile prefer to see the full commitment upfront and abandon multi-step flows at higher rates. The form is divided into four visually-grouped sections — Contact, Shipping Address, Delivery Method, Payment — each with its own Zod sub-schema composed into a single root schema. Field-level validation fires onBlur, section-level validation fires on submit attempt."),

    codeBlock(`// features/checkout/schema.ts
import { z } from "zod";

const phoneRegex = /^\+92\s?3\d{2}\s?\d{7}$/;
const pkPostalCode = /^\d{5}$/;

export const checkoutSchema = z.object({
  contact: z.object({
    fullName: z.string().min(3, "Full name is required"),
    phone: z.string().regex(phoneRegex, "Enter a valid Pakistani mobile number (+92 3XX XXXXXXX)"),
    email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  }),
  shipping: z.object({
    addressLine1: z.string().min(5, "Street address is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    province: z.enum(["Sindh", "Punjab", "KPK", "Balochistan", "Islamabad", "Gilgit-Baltistan", "AJK"]),
    postalCode: z.string().regex(pkPostalCode, "5-digit postal code required"),
  }),
  delivery: z.object({
    method: z.enum(["standard", "express", "same-day"]),
    instructions: z.string().max(200).optional(),
  }),
  payment: z.object({
    method: z.enum(["cod", "jazzcash", "easypaisa", "card", "bank"]),
    // method-specific fields validated via discriminated union
  }),
});`),

    h2("3.7 Routing Taxonomy"),

    p("The routing structure is designed to be predictable, SEO-friendly, and shallow. Every URL in Aura Living is human-readable and reflects the information architecture. There are no query-string-based routes for primary navigation; query strings are reserved for filters and pagination on listing pages. The full route tree is specified in Chapter 7 (page-by-page blueprint); the table below lists the top-level route segments."),

    spacer(120),
    dataTable(
      ["Route", "Type", "Description"],
      [
        ["/", "Static + PPR", "Homepage with prerendered shell + streamed personalised section"],
        ["/shop", "Dynamic + PPR", "All products listing with filters"],
        ["/shop/[category]", "Dynamic + PPR", "Category listing (lamps, plants, candles)"],
        ["/shop/[category]/[subcategory]", "Dynamic + PPR", "Subcategory listing"],
        ["/product/[slug]", "Static + PPR", "Product detail page (ISR, revalidate 300s)"],
        ["/collections/[slug]", "Static + PPR", "Curated collection page (editorial)"],
        ["/cart", "Static", "Full cart page (drawer used for quick view)"],
        ["/checkout", "Static + Client", "Single-page checkout, client-heavy"],
        ["/account", "Protected", "Account dashboard"],
        ["/account/orders", "Protected", "Order history"],
        ["/account/addresses", "Protected", "Saved addresses"],
        ["/account/wishlist", "Protected", "Saved products"],
        ["/account/settings", "Protected", "Profile and preferences"],
        ["/lookbook", "Static", "Editorial lookbook grid"],
        ["/lookbook/[slug]", "Static", "Single lookbook story"],
        ["/journal", "Static + PPR", "Blog index"],
        ["/journal/[slug]", "Static", "Blog post (MDX)"],
        ["/about", "Static", "Brand story"],
        ["/contact", "Static", "Contact form + WhatsApp + map"],
        ["/faq", "Static", "Frequently asked questions"],
        ["/shipping-returns", "Static", "Shipping and returns policy"],
        ["/privacy", "Static", "Privacy policy"],
        ["/terms", "Static", "Terms of service"],
        ["/search", "Dynamic + PPR", "Search results (q parameter)"],
        ["/orders/[id]/confirmed", "Static", "Order confirmation page"],
        ["/accessibility-statement", "Static", "WCAG 2.2 AA accessibility statement (Ch.27.4)"],
        ["/maintenance", "Static", "503 maintenance page served when feature flag active (Ch.29.2)"],
        ["/404", "Static", "Custom not-found page"],
      ],
      [28, 16, 56]
    ),
    caption("Table 3.2 — Complete route taxonomy for Aura Living"),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 4: PRODUCTION-GRADE FOLDER STRUCTURE
// ════════════════════════════════════════════════════════════════
function chapter4() {
  return [
    h1("4. Production-Grade Folder Structure"),

    p("The folder structure of a Next.js application is not a cosmetic choice; it is the primary organising principle that determines whether a codebase scales gracefully or collapses under its own weight. Aura Living uses a feature-based folder structure within the App Router's route-based conventions. The app/ directory mirrors the URL structure (kept intentionally thin — only route-specific code lives here), while the features/ directory holds all domain logic organised by feature (cart, checkout, product, account, etc.), and the lib/, services/, and utils/ directories hold shared infrastructure."),

    p("This structure is derived from the production patterns that have emerged in large-scale Next.js applications over 2024 to 2026. It optimises for three goals: locality (everything related to a feature lives in one folder), discoverability (a new contributor can find any piece of code in under thirty seconds), and refactoring safety (moving or removing a feature does not require touching files outside its folder)."),

    h2("4.1 Directory Tree"),

    codeBlock(`aura-living/
├── app/                          # App Router — thin route layer
│   ├── (marketing)/              # Route group: marketing pages
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── shipping-returns/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── (shop)/                   # Route group: shopping pages
│   │   ├── layout.tsx            # Shop layout (cart drawer, filters)
│   │   ├── shop/page.tsx
│   │   ├── shop/[category]/page.tsx
│   │   ├── product/[slug]/page.tsx
│   │   ├── collections/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── search/page.tsx
│   ├── (account)/                # Route group: protected pages
│   │   ├── layout.tsx
│   │   ├── account/page.tsx
│   │   ├── account/orders/page.tsx
│   │   ├── account/addresses/page.tsx
│   │   ├── account/wishlist/page.tsx
│   │   └── account/settings/page.tsx
│   ├── (editorial)/              # Route group: content pages
│   │   ├── lookbook/page.tsx
│   │   ├── lookbook/[slug]/page.tsx
│   │   ├── journal/page.tsx
│   │   └── journal/[slug]/page.tsx
│   ├── orders/[id]/confirmed/page.tsx
│   ├── layout.tsx                # Root layout (html, body, fonts, providers)
│   ├── page.tsx                  # Homepage
│   ├── loading.tsx               # Root loading skeleton
│   ├── error.tsx                 # Root error boundary
│   ├── not-found.tsx             # 404 page
│   ├── globals.css               # Tailwind + design tokens (the ONLY global CSS)
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # robots.txt
│
├── features/                     # Feature modules (domain logic)
│   ├── product/
│   │   ├── components/           # Product-specific UI components
│   │   │   ├── product-gallery.tsx
│   │   │   ├── product-info.tsx
│   │   │   ├── product-options.tsx
│   │   │   ├── product-reviews.tsx
│   │   │   └── related-products.tsx
│   │   ├── hooks/
│   │   │   └── use-product-views.ts
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── cart/
│   │   ├── components/
│   │   │   ├── cart-drawer.tsx
│   │   │   ├── cart-line-item.tsx
│   │   │   └── cart-summary.tsx
│   │   ├── store.ts              # Zustand store
│   │   └── types.ts
│   ├── checkout/
│   │   ├── components/
│   │   │   ├── checkout-form.tsx
│   │   │   ├── payment-selector.tsx
│   │   │   └── order-summary.tsx
│   │   ├── schema.ts             # Zod schema
│   │   └── types.ts
│   ├── account/                  # Account-related feature
│   ├── layout/                   # Header, footer, nav
│   │   ├── components/
│   │   │   ├── site-header.tsx
│   │   │   ├── mobile-menu.tsx
│   │   │   ├── site-footer.tsx
│   │   │   ├── search-overlay.tsx
│   │   │   └── whatsapp-fab.tsx
│   ├── home/                     # Homepage-specific sections
│   │   └── components/
│   │       ├── hero.tsx
│   │       ├── featured-collection.tsx
│   │       ├── category-tiles.tsx
│   │       ├── bestsellers.tsx
│   │       ├── editorial-banner.tsx
│   │       ├── testimonials.tsx
│   │       └── newsletter.tsx
│   └── ui/                       # Shared UI primitives (design system)
│       ├── button.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── dialog.tsx            # shadcn/ui-based
│       ├── sheet.tsx             # shadcn/ui-based (drawer)
│       ├── accordion.tsx
│       ├── select.tsx
│       ├── toast.tsx
│       └── skeleton.tsx
│
├── lib/                          # Cross-feature infrastructure
│   ├── analytics.ts              # Plausible + Vercel Analytics init
│   ├── seo.ts                    # Metadata helpers, JSON-LD builders
│   ├── format.ts                 # Currency, date, phone formatters
│   ├── constants.ts              # Site-wide constants (NAV, SOCIAL)
│   └── env.ts                    # Validated environment variables
│
├── services/                     # External data services (frontend-only mock layer)
│   ├── products.ts               # Product fetching (will swap to Supabase later)
│   ├── collections.ts
│   └── content.ts                # Journal/lookbook fetching
│
├── hooks/                        # Global hooks (not feature-specific)
│   ├── use-mounted.ts            # SSR-safe mounted state
│   ├── use-media-query.ts
│   ├── use-scroll-position.ts
│   ├── use-reduced-motion.ts
│   └── use-lenis.ts              # Lenis smooth-scroll hook
│
├── components/                   # Animation wrappers + provider components
│   ├── providers.tsx             # Client: Zustand, theme, analytics providers
│   ├── smooth-scroll-provider.tsx# Lenis root provider
│   ├── parallax.tsx              # Reusable parallax wrapper (GSAP)
│   ├── reveal.tsx                # Scroll-triggered reveal (Framer Motion)
│   ├── magnetic-button.tsx       # Magnetic hover effect (Framer Motion)
│   └── marquee.tsx               # Infinite marquee (GSAP)
│
├── types/                        # Global TypeScript types
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   └── content.ts
│
├── utils/                        # Pure utility functions
│   ├── cn.ts                     # clsx + tailwind-merge
│   ├── format-price.ts
│   ├── slugify.ts
│   └── debounce.ts
│
├── public/
│   ├── fonts/                    # Self-hosted font fallbacks (optional)
│   ├── images/                   # Static brand images, og-default.jpg
│   ├── favicons/                 # favicon.ico, apple-touch-icon, etc.
│   └── robots-production.txt
│
├── content/                      # MDX content (journal, lookbook)
│   ├── journal/
│   └── lookbook/
│
├── middleware.ts                 # Auth + locale (future) middleware
├── next.config.ts                # Next.js config (image formats, etc.)
├── tailwind.config.ts            # Tailwind theme (extends design tokens)
├── tsconfig.json                 # TypeScript config with path aliases
├── package.json
└── README.md`),

    h2("4.2 File Naming Conventions"),

    p("File naming is enforced by ESLint and Prettier and is non-negotiable. React component files use kebab-case (product-gallery.tsx, not ProductGallery.tsx) because kebab-case plays well with filesystem case-insensitivity across macOS, Windows, and Linux development environments and avoids git case-conflict issues. The default export of each component file is the component itself, PascalCased (ProductGallery). Non-component TypeScript files (store.ts, schema.ts, types.ts, hooks, utils) use kebab-case for filenames and PascalCase for exported types and camelCase for exported functions."),

    p("Co-location is the rule: tests sit next to the file they test (product-gallery.test.tsx), stories sit next to the component they document (product-gallery.stories.tsx), and styles are not co-located because Tailwind handles styling. Each component file exports exactly one default component; secondary exports are allowed only for closely related sub-components (e.g., ProductGallery exports ProductGallery as default and ProductGalleryThumb as a named export)."),

    h2("4.3 Path Aliases"),

    p("Path aliases are configured in tsconfig.json and resolve consistently in TypeScript, ESLint, Jest, and Storybook. The aliases are intentionally short to keep imports readable, and they are top-level (no nested aliases) to keep resolution fast."),

    codeBlock(`// tsconfig.json (paths excerpt)
{
  "compilerOptions": {
    "paths": {
      "@/*":                 ["./*"],
      "@/components/*":      ["./components/*"],
      "@/features/*":        ["./features/*"],
      "@/lib/*":             ["./lib/*"],
      "@/services/*":        ["./services/*"],
      "@/hooks/*":           ["./hooks/*"],
      "@/utils/*":           ["./utils/*"],
      "@/types/*":           ["./types/*"],
      "@/content/*":         ["./content/*"]
    }
  }
}`),

    p("Imports in application code always use the aliases (never relative paths like ../../utils/cn). The only place relative paths are acceptable is within a single feature folder, where the components reference each other (e.g., product-gallery.tsx importing product-gallery-thumb.tsx in the same folder). This keeps refactoring simple: moving a feature folder never requires updating imports inside it."),

    h2("4.4 Module Organisation Principles"),

    p("Three principles govern module organisation. First, the Dependency Rule: dependencies point inward toward the leaves of the tree. UI primitives in features/ui/ may be imported by anything. Feature components in features/<feature>/ may be imported by app/ routes and by other features only via a public index file. lib/, services/, and utils/ may be imported by anything. app/ routes may not be imported by anything. Second, the Cohesion Rule: a feature folder contains everything needed to understand that feature — components, hooks, types, constants, store, schema — and nothing outside the feature folder needs to be consulted to modify the feature. Third, the Surface Rule: every feature folder exposes a public API via an index.ts barrel file, and consumers may only import from the barrel, not from internal files."),

    callout(
      "ENFORCEMENT",
      "These principles are not aspirational. They are enforced by an ESLint plugin (eslint-plugin-import with import-boundaries rules) that fails the build on violation. A developer who tries to import from features/cart/store.ts directly from app/page.tsx will see a lint error before they can commit."
    ),
  ];
}

module.exports = { chapter3, chapter4 };
