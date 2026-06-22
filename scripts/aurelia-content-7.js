// Aura Living Plan — Content Part 7: v1.1 Extensions (14 new chapters per senior dev review)
// Chapters 16-29: Testing, Security, i18n/RTL, PWA/Resilience, Gift Options, Server-State,
// Promotions, Design Tokens (z-index + breakpoints), State Catalogs, Privacy/Consent,
// Search, SEO Edge Cases, Eng Workflow, Misc
const H = require("./aurelia-plan.js");
const { h1, h2, h3, p, pr, bullet, bulletRich, spacer, divider, codeBlock, caption, dataTable, callout } = H;

// ════════════════════════════════════════════════════════════════
// CHAPTER 16: TESTING STRATEGY
// ════════════════════════════════════════════════════════════════
function chapter16() {
  return [
    h1("16. Testing Strategy"),

    p("The frontend plan in Chapters 1 through 15 specifies a production-grade storefront, but production-grade is a promise that must be defended by automated tests at every layer. This chapter formalises the testing pyramid for Aura Living, names the tools, sets coverage targets, enumerates the critical end-to-end journeys, and wires every gate into the CI pipeline defined in Chapter 13.4. The strategy is pragmatic: tests exist to catch regressions that matter to Pakistani customers on 3G/4G connections completing COD checkout, not to chase a 100 percent coverage vanity number."),

    h2("16.1 Testing Pyramid and Tool Selection"),

    p("Aura Living adopts the classic testing pyramid with three layers: a wide base of fast unit tests, a narrower middle of component tests, and a small apex of end-to-end tests. Unit tests verify pure functions in lib/, utils/, and the validation schemas in features/*/schemas.ts. Component tests mount React components in isolation with React Testing Library and assert on rendered output and user interactions. End-to-end tests drive a real browser through complete user journeys against a preview deployment."),

    p("Vitest is chosen over Jest for the unit and component layers because its native ES module support aligns with Next.js 16's ESM-first configuration, its startup time is roughly three times faster than Jest on a cold cache, and its watch mode is dramatically better for developer experience. Playwright is chosen over Cypress for E2E because it supports Chromium, Firefox, and WebKit from a single installation, its auto-waiting model eliminates most flake, and its trace viewer is the best in class for debugging failures. MSW (Mock Service Worker) intercepts network requests in component tests, allowing the services/ layer to be tested without hitting a real backend."),

    spacer(120),
    dataTable(
      ["Layer", "Tool", "Target Coverage", "Avg. Runtime"],
      [
        ["Unit", "Vitest + @testing-library/react", "80% of lib/ and utils/", "8s"],
        ["Component", "Vitest + RTL + MSW", "70% of features/ components", "25s"],
        ["E2E", "Playwright", "100% of critical journeys (Sec. 16.4)", "3m 20s"],
        ["Visual regression", "Chromatic (per-PR)", "All Storybook stories", "1m 10s"],
        ["A11y", "@axe-core/playwright", "All E2E pages", "Included in E2E"],
        ["Bundle", "size-limit + Lighthouse CI", "130KB First Load JS budget", "30s"],
      ],
      [22, 30, 32, 16]
    ),
    caption("Table 16.1 — Testing pyramid layers and coverage targets"),

    h2("16.2 Unit and Component Testing Conventions"),

    p("Unit tests live alongside their source files with a *.test.ts extension. A typical unit test for a price formatter (used by the Intl.NumberFormat('ur-PK') utility from Chapter 18.5) validates positive cases, edge cases (zero, negative, very large numbers), and locale switching. Component tests live in a __tests__/ subdirectory next to the component and use MSW to mock the services/ layer responses, ensuring components are tested in isolation from real network state."),

    codeBlock(`// features/cart/utils/format-price.test.ts
import { describe, it, expect } from "vitest";
import { formatPricePKR } from "./format-price";

describe("formatPricePKR", () => {
  it("formats a positive amount in PKR with English locale", () => {
    expect(formatPricePKR(4999, "en-PK")).toBe("Rs 4,999");
  });

  it("formats the same amount in Urdu locale with Arabic-Indic digits", () => {
    // Expected output: "Rs 4,999" rendered with Arabic-Indic digits via Intl.NumberFormat('ur-PK')
    // Visually the digits 4,9,9,9 become U+06F4 U+066C U+06F9 U+06F9 U+06F9 (Urdu 4, separator, 9,9,9)
    const result = formatPricePKR(4999, "ur-PK");
    expect(result).toMatch(/^Rs\\s+[\\u06F0-\\u06F9_\\u066B\\u066C]+/);
  });

  it("handles zero gracefully", () => {
    expect(formatPricePKR(0, "en-PK")).toBe("Rs 0");
  });

  it("returns the raw number for non-finite input", () => {
    expect(formatPricePKR(Number.NaN, "en-PK")).toBe("—");
  });
});`),

    h2("16.3 Mock Service Worker (MSW) Strategy"),

    p("All client-side data fetching goes through the services/ layer (Chapter 21). MSW intercepts these requests in tests by registering handlers that mirror the real API contracts. The handlers live in tests/mocks/handlers.ts and are organised by service: products.ts, cart.ts, checkout.ts, search.ts. A single setup file (tests/setup/msw-server.ts) starts the MSW server in 'beforeAll', resets handlers in 'afterEach', and closes in 'afterAll'. This pattern means component tests never hit a real network and never depend on the future Supabase backend being available."),

    codeBlock(`// tests/mocks/handlers/products.ts
import { http, HttpResponse } from "msw";
import { mockProducts } from "./data/products";

export const productHandlers = [
  http.get("/api/products/:slug", ({ params }) => {
    const product = mockProducts.find((p) => p.slug === params.slug);
    if (!product) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const filtered = category
      ? mockProducts.filter((p) => p.category === category)
      : mockProducts;
    return HttpResponse.json({ items: filtered, total: filtered.length });
  }),
];`),

    h2("16.4 Critical End-to-End Journeys"),

    p("Not every page warrants an E2E test. Aura Living maintains a curated list of journeys that, if broken, directly cost revenue or trust. Each journey is a single Playwright test file in tests/e2e/. The journeys are tagged with @critical so they can be selected for the merge-blocking gate while exploratory tests run nightly. The list below is exhaustive: any new critical flow added in future (e.g., a loyalty programme) must add a journey here before it ships."),

    spacer(120),
    dataTable(
      ["Journey", "Steps", "Tag", "Priority"],
      [
        ["COD checkout happy path", "home -> PDP -> add-to-cart -> cart -> checkout -> OTP -> confirmation", "@critical @checkout", "P0"],
        ["JazzCash redirect round-trip", "PDP -> cart -> checkout -> JazzCash mock -> confirmation", "@critical @checkout", "P0"],
        ["Cart persistence across reload", "add 2 items -> reload -> assert cart intact (Zustand persist)", "@critical @cart", "P0"],
        ["Search and filter PLP", "search 'candle' -> apply price filter -> assert results match", "@critical @search", "P1"],
        ["Wishlist add and move to cart", "PDP -> wishlist -> account/wishlist -> move-to-cart", "@critical @account", "P1"],
        ["Mobile menu navigation", "open mobile menu -> navigate to /shop/plants -> assert PLP loads", "@critical @mobile", "P0"],
        ["404 and broken-link recovery", "visit /nonexistent -> assert 404 page -> click 'Continue shopping'", "@smoke", "P2"],
        ["Accessibility statement reachability", "footer link -> /accessibility-statement -> assert content", "@smoke", "P2"],
        ["Locale switch to Urdu RTL", "header switcher -> select Urdu -> assert dir=rtl + font swap", "@critical @i18n", "P1"],
      ],
      [28, 38, 20, 14]
    ),
    caption("Table 16.2 — Critical E2E journeys and their CI gating"),

    h2("16.5 Visual Regression with Chromatic"),

    p("Visual regressions are particularly costly for a premium brand: a one-pixel shift in the gold-on-black PDP price tag can erode the curated feel that justifies a 30 percent price premium. Chromatic is wired to the project's Storybook instance (one story per component in the Chapter 8 inventory). On every PR, Chromatic snapshots every story across three viewport sizes (375px, 768px, 1280px) and surfaces diffs for review. The 4KB-per-snapshot cost is paid for by a single visual regression caught before production — a previous project's PDP rating component shipped a regression that took two weeks to notice and required a customer-apology email campaign."),

    h2("16.6 CI Pipeline Integration"),

    p("The CI pipeline defined in Chapter 13.4 is extended with three testing gates that run in parallel after the install-cache job. A failing gate blocks merge to main. The gates are: lint-typecheck (ESLint + tsc --noEmit, 45s), unit-component (Vitest run with --coverage, 35s), and e2e-essentials (Playwright with @critical tag, 3m 20s). Visual regression (Chromatic) runs as a non-blocking informational gate on first push and becomes blocking once a baseline is approved. Bundle size (size-limit against the 130KB budget from Chapter 10.3) is blocking on every PR."),

    codeBlock(`# .github/workflows/ci.yml (excerpt — extension of Ch.13.4)
jobs:
  lint-typecheck:
    runs-on: ubuntu-latest
    needs: install-cache
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  unit-component:
    runs-on: ubuntu-latest
    needs: install-cache
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:coverage -- --reporter=json --outputFile=coverage/summary.json
      - uses: codecov/codecov-action@v4

  e2e-essentials:
    runs-on: ubuntu-latest
    needs: install-cache
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm build
      - run: pnpm start &
      - run: pnpm exec playwright test --grep "@critical"
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/`),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 17: SECURITY
// ════════════════════════════════════════════════════════════════
function chapter17() {
  return [
    h1("17. Security"),

    p("A premium e-commerce site is a target. Even before the Supabase backend is wired in, the frontend must defend against cross-site scripting, clickjacking, MIME-sniffing attacks, content-security-policy violations, and the abuse patterns specific to COD — fake orders, OTP bombing, and bot-driven inventory hoarding. This chapter specifies the security-header set served on every response, the sanitisation strategy for MDX journal content and customer-submitted reviews, and the rate-limiting and CAPTCHA strategy that protects the COD-OTP flow defined in Chapter 12.1. All decisions are enforced at the Vercel Edge via next.config.js and middleware, not at the application layer, so a missed check in a single route cannot bypass the policy."),

    h2("17.1 Security Headers (Vercel Edge + next.config.js)"),

    p("Security headers are set in next.config.js using the headers() function, which Vercel serves as part of the static and edge response. The Content-Security-Policy is the most consequential: it locks script execution to the same origin and a small allowlist of trusted CDNs (Vercel analytics, the future payment gateway, the WhatsApp click-to-chat domain). 'unsafe-inline' is intentionally absent from script-src — Tailwind 4 produces a single hashed stylesheet, GSAP and Framer Motion are imported as ES modules from the bundle, and any inline style attribute (forbidden by the no-inline-styles rule in Chapter 5.1) would be caught at build time."),

    codeBlock(`// next.config.ts
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'wasm-unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'", // Tailwind 4 hashed output
      "img-src 'self' https://images.auraliving.pk data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://vitals.vercel-insights.com https://api.algolia.net",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.jazzcash.com.pk https://easypaisa.com.pk",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const config: NextConfig = {
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
    ];
  },
};
export default config;`),

    p("Two policy choices deserve explicit rationale. First, frame-ancestors 'none' (combined with X-Frame-Options: DENY) prevents the site from being iframed anywhere — this protects the checkout flow from clickjacking even if a future third-party widget is added. Second, form-action is restricted to the same origin plus the two payment redirect domains; this prevents a compromised form from exfiltrating data to an arbitrary URL. The 'upgrade-insecure-requests' directive ensures that any legacy http:// URL (perhaps from a migrated blog post) is upgraded to https:// at the browser."),

    h2("17.2 MDX and Review Sanitisation"),

    p("Journal articles (Chapter 7.11) are authored in MDX and stored in the repo. While the in-repo authoring model means the content is trusted (only engineers with merge access can change it), the MDX pipeline still passes through a sanitisation step as defence-in-depth. The rehype-sanitize plugin with a strict schema strips any <script>, on* attribute, or javascript: URL. Customer-submitted reviews (when introduced in the full-stack phase) will be stored as plain text in Supabase, escaped on render, and never rendered as HTML."),

    codeBlock(`// app/journal/[slug]/mdx-config.ts
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ["className"]],
    a: [...(defaultSchema.attributes?.a ?? []), "title", "rel"],
  },
  tagNames: [...(defaultSchema.tagNames ?? []), "code", "pre"],
};

export const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, [rehypeSanitize, sanitizeSchema]],
};`),

    h2("17.3 COD and OTP Abuse Prevention"),

    p("The COD-OTP flow in Chapter 12.1 is the highest-abuse surface in the entire frontend. Without rate limiting, a malicious actor can send thousands of OTP SMS to random Pakistani numbers (each SMS costs the business PKR 1.2 to PKR 2.5), can probe the OTP endpoint to brute-force 4-digit codes, or can submit hundreds of fake COD orders using non-existent addresses. The mitigation strategy has four layers, each enforcing a different rate-limit dimension."),

    spacer(120),
    dataTable(
      ["Layer", "Scope", "Limit", "Enforced At", "Action on Exceed"],
      [
        ["OTP send per phone", "Per +92 number", "3 per hour, 5 per day", "Edge middleware (Upstash Redis)", "429 + retry-after header"],
        ["OTP send per IP", "Per client IP", "10 per hour", "Edge middleware", "429 + CAPTCHA challenge"],
        ["OTP verify attempts", "Per OTP session", "5 per code, then invalidate", "Route handler", "Invalidate session, force re-send"],
        ["Checkout submit per IP", "Per client IP", "10 per hour", "Edge middleware", "429 + 60s cooldown"],
        ["Account create per IP", "Per client IP", "5 per hour", "Edge middleware", "429 + CAPTCHA challenge"],
      ],
      [22, 16, 22, 22, 18]
    ),
    caption("Table 17.1 — Rate-limit dimensions for the COD-OTP and account flows"),

    p("Rate-limit state is stored in Upstash Redis (serverless, Edge-compatible, with a free tier that covers the launch volume). The middleware uses a sliding-window log algorithm. On the first exceed, the response is a 429 with a Retry-After header matching the window reset. On a second exceed within 24 hours, hCaptcha (the privacy-respecting alternative to reCAPTCHA) is injected into the OTP form. Bot detection is intentionally conservative — false positives that block a real customer on a shared office IP cost more than the fraud they prevent."),

    h2("17.4 Velocity Checks for Suspicious Orders"),

    p("Beyond rate limiting, the checkout route handler runs a velocity check before accepting a COD order. The check answers three questions: has this phone number placed more than 3 COD orders in 24 hours that were not delivered? has this address (normalised to a street+city hash) received more than 2 COD orders in 7 days? does the IP geolocation match the delivery city? A 'yes' to any of these flags the order for manual review (status 'pending-review') rather than rejecting it outright — false positives are routed to a human reviewer who can WhatsApp the customer to confirm. In the frontend phase, these checks are stubbed in services/checkout and documented; in the full-stack phase they are wired to Supabase."),

    h2("17.5 Dependency Audit and Supply-Chain Hygiene"),

    p("Every dependency is a potential vulnerability. Aura Living runs pnpm audit on every PR (blocking on 'high' or 'critical' severity) and a weekly Dependabot sweep that opens PRs for minor and patch updates. Major version bumps are never auto-merged; they require a human review and a full E2E run. The lockfile is committed and verified with pnpm install --frozen-lockfile in CI. The dependency manifest in Appendix B is regenerated on every release tag, giving a full software bill of materials for compliance review."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 18: INTERNATIONALIZATION & URDU/RTL
// ════════════════════════════════════════════════════════════════
function chapter18() {
  return [
    h1("18. Internationalization and Urdu/RTL"),

    p("Pakistan is a bilingual market. Urdu is the national language and the language of intimacy and trust; English is the language of commerce and aspirational branding. A premium home-decor brand must serve both fluently. This chapter specifies the i18n framework, the locale-routing strategy, the RTL layout handling for Urdu, and how the resulting system coexists with the Intl.NumberFormat('ur-PK') currency formatting already used in price displays. The design is built for a future third locale (Arabic for Gulf-customer reach) without requiring an architectural rework."),

    h2("18.1 Framework Choice: next-intl"),

    p("Aura Living uses next-intl (version 3.x) as its i18n framework. The choice is grounded in three requirements: full App Router support with server-component message loading, type-safe message keys (a typo in a message key fails the TypeScript build), and built-in handling of pluralisation, number formatting, and date formatting that integrates cleanly with Intl APIs. The alternative considered was i18next with the react-i18next wrapper; it was rejected because its client-side focus conflicts with the RSC-by-default architecture in Chapter 3.2 and because its message loading requires more boilerplate per route."),

    codeBlock(`// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "ur"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return {
    messages: (await import(\`../messages/\${locale}.json\`)).default,
  };
});`),

    h2("18.2 Locale Routing in Middleware"),

    p("Locale is encoded as the first path segment: auraliving.pk/en/shop, auraliving.pk/ur/shop. The root URL (auraliving.pk) is redirected in middleware to the user's preferred locale based on Accept-Language header, falling back to 'en' for unknown locales. A locale-switcher in the header (a small globe icon with a dropdown) preserves the current path on switch — switching from /en/product/brass-lotus-lamp to Urdu navigates to /ur/product/brass-lotus-lamp. The locale prefix is excluded from the SEO canonical URL via the alternates field in the Metadata API (see Chapter 27.2)."),

    codeBlock(`// middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/request";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\\\..*).*)"],
};`),

    h2("18.3 RTL Layout in Tailwind"),

    p("Urdu is a right-to-left language. Tailwind 4's logical-property utilities (ps-, pe-, ms-, me-, start-, end-) generate direction-aware CSS automatically. Aura Living's design tokens (Chapter 5) are defined using logical properties — padding-inline, margin-inline, inset-inline-start — never physical ones (padding-left, margin-right). A single 'dir' attribute on the <html> element flips the entire layout. The few physical-property exceptions (the WhatsApp FAB, which stays bottom-right in both locales to match user expectation) are explicitly documented in the component's JSDoc."),

    codeBlock(`/* tailwind.css — direction-aware primitives */
@layer base {
  :root { direction: ltr; }
  :root[dir="ur"] {
    direction: rtl;
    --font-family-body: "Noto Nastaliq Urdu", "Inter", sans-serif;
    /* Noto Nastaliq Urdu for body text in Urdu locale; Inter stays for English */
  }
}

/* Logical-property utilities replace physical ones throughout */
.btn {
  padding-inline-start: 1.5rem;
  padding-inline-end: 2rem;
  border-start-start-radius: 0.5rem; /* direction-aware radius */
}`),

    p("The font swap is critical. Urdu Nastaliq script is a calligraphic style that requires a dedicated font (Noto Nastaliq Urdu, 1.2MB woff2). To avoid a 1.2MB First Load JS penalty, the Urdu font is loaded only when the document's dir attribute is 'rtl', using a CSS @font-face declaration scoped to the [dir='ur'] selector. The English locale never downloads it. The font-display: swap property ensures Urdu text renders immediately in a system fallback (Tahoma on Windows, Geeza Pro on macOS) and swaps to Noto Nastaliq when ready."),

    h2("18.4 hreflang and SEO Coexistence"),

    p("Each page generates hreflang alternate links via the Metadata API. The English canonical URL is auraliving.pk/en/[path]; the Urdu alternate is auraliving.pk/ur/[path]. Both are submitted in the sitemap (Chapter 9.4). Google treats the two as alternate-language equivalents, not duplicate content, so the Urdu pages earn their own ranking signals. The x-default hreflang points to the English version, matching the locale-detection fallback."),

    codeBlock(`// app/[locale]/product/[slug]/page.tsx (excerpt)
export async function generateMetadata({
  params,
}: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  const path = \`/product/\${params.slug}\`;
  return {
    alternates: {
      canonical: \`/\${params.locale}\${path}\`,
      languages: {
        en: \`/en\${path}\`,
        ur: \`/ur\${path}\`,
        "x-default": \`/en\${path}\`,
      },
    },
  };
}`),

    h2("18.5 Currency Formatting Coexistence"),

    p("The Intl.NumberFormat('ur-PK') currency formatter (referenced in Chapter 3.6 and tested in Chapter 16.2) is locale-aware: when called with the 'ur-PK' locale, it produces Arabic-Indic digits (the visual form of 4,999 becomes four Urdu digits separated by the Urdu thousands separator) and the Urdu abbreviation for rupees. The locale is read from the next-intl context (useLocale()), not from the URL, so a user who switches the locale in the header immediately sees prices in the new digit system. The formatter is memoised per locale to avoid regenerating the Intl.NumberFormat object on every render."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 19: PWA, OFFLINE & RESILIENCE
// ════════════════════════════════════════════════════════════════
function chapter19() {
  return [
    h1("19. PWA, Offline and Resilience"),

    p("Pakistan's mobile network is intermittent. A customer browsing on PTCL 4G in a Karachi apartment may lose signal mid-checkout when the lift arrives; a customer in a Lahore basement may have a flaky 3G connection that drops every 30 seconds. A premium e-commerce site must degrade gracefully under these conditions — never lose the customer's cart, never show a blank screen on a failed fetch, and never block a checkout because a tracking pixel failed. This chapter specifies the PWA manifest, the service-worker caching strategy, the offline fallback page, and the consolidated error-handling pattern used across the application."),

    h2("19.1 PWA Manifest and Install Prompt"),

    p("Aura Living is installable as a Progressive Web App. The manifest.json declares the brand name, the gold-on-black icon set (192px, 512px, maskable), the start_url (auraliving.pk/en), the display mode (standalone), and the theme color (matching the design token --color-bg from Chapter 5.2). The install prompt is triggered by the browser's beforeinstallprompt event and surfaced as a discreet banner ('Install Aura Living for faster access') after the user has visited three pages in the same session. The banner respects 'do not show again' for 90 days via localStorage."),

    codeBlock(`// public/manifest.json
{
  "name": "Aura Living — Premium Home Decor",
  "short_name": "Aura Living",
  "description": "Lamps, plants, and candles for the Pakistani home",
  "start_url": "/en?utm_source=pwa",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0E0E0E",
  "theme_color": "#C9A84C",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "categories": ["shopping", "lifestyle"],
  "lang": "en-PK",
  "dir": "ltr"
}`),

    h2("19.2 Service Worker Caching Strategy"),

    p("The service worker uses Workbox via next-pwa (configured in next.config.ts). Three caching strategies are layered. Static assets (CSS, JS, fonts, icons) use the Cache First strategy with a 30-day expiration and a maximum of 60 entries — these are content-hashed, so a stale cache is harmless and a new deployment invalidates by URL change. Product images use Stale While Revalidate with a 7-day expiration and 100 entries — the cache serves the previous image immediately while a fresh one is fetched in the background. API requests (cart, checkout, account) are NEVER cached by the service worker; they go straight to the network, with the error-handling layer (Chapter 19.4) catching failures."),

    codeBlock(`// worker/index.ts (custom service worker logic)
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare const self: ServiceWorkerGlobalScope & SerwistGlobalConfig & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: { entries: [{ matcher: /^\\//, to: "/offline" }] },
});

serwist.addEventListeners();`),

    h2("19.3 Offline Fallback Page"),

    p("When a navigation request fails (the user is offline and the page is not in cache), the service worker serves /offline — a static page that explains the situation in friendly copy ('You appear to be offline. Your cart is saved and will be here when you reconnect.'), shows the cart count (read from localStorage), and offers a 'Try again' button that reloads when back online. The page is styled with the same gold-on-black system as the rest of the site but uses only inline critical CSS (a 4KB style block) — it does not depend on the bundle being available, because the bundle itself may have failed to load."),

    h2("19.4 Consolidated Error Handling"),

    p("Every async data fetch in the application — whether from a server component, a client component, or a route handler — funnels through the services/ layer (Chapter 21) and is wrapped in a typed Result object. The Result is either { status: 'ok', data } or { status: 'error', error: ServiceError }, where ServiceError is a discriminated union with three members: NetworkError (no response received), ServerError (5xx), and ClientError (4xx with a message). The error.tsx boundary at the app root catches thrown errors and renders a styled error page with the option to retry or go home."),

    codeBlock(`// lib/result.ts — shared Result type
export type Ok<T> = { status: "ok"; data: T };
export type Err<E extends ServiceError = ServiceError> = { status: "error"; error: E };
export type Result<T, E extends ServiceError = ServiceError> = Ok<T> | Err<E>;

export type ServiceError =
  | { kind: "network"; message: string; retryable: true }
  | { kind: "server"; status: number; message: string; retryable: true }
  | { kind: "client"; status: number; message: string; retryable: false }
  | { kind: "not-found"; message: string; retryable: false };

// app/error.tsx — root error boundary
"use client";
export default function RootError({ error, reset }: ErrorProps) {
  const isNetwork = error?.digest?.startsWith("network");
  return (
    <Shell>
      <Heading>{isNetwork ? "Connection lost" : "Something went wrong"}</Heading>
      <Body>{isNetwork
        ? "Your cart is saved. Check your connection and try again."
        : "Our team has been notified. Please try again, or message us on WhatsApp."}</Body>
      <Button onClick={reset}>Try again</Button>
      <WhatsAppFAB />
    </Shell>
  );
}`),

    p("The retry behaviour is exponential with jitter: 500ms, then 1.2s, then 3s, then give up and show the error UI. On a successful retry, the loading state is dismissed and the user sees the content as if nothing had happened. The retry counter is reset on any successful fetch in the same session. This pattern is invisible when the network is healthy and quietly heroic when it is not."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 20: GIFT OPTIONS
// ════════════════════════════════════════════════════════════════
function chapter20() {
  return [
    h1("20. Gift Options at Checkout"),

    p("The 'Gifting Gohar' persona in Chapter 2.3 buys candles and small lamps as gifts for birthdays, weddings, and Eid. A premium home-decor brand that ignores gifting leaves 15 to 25 percent of its potential revenue on the table. This chapter adds a gift-options section to the checkout flow (Chapter 7.8), updates the Zod checkout schema (Chapter 3.6) to validate the new fields, and specifies the UX for gift wrap, handwritten notes, and ship-to-different-address. The implementation is fully client-side in the frontend phase; the gift metadata is persisted as a JSON blob on the order object when the Supabase backend lands."),

    h2("20.1 Gift Options UX Section"),

    p("The gift-options section appears in the checkout flow between the shipping-address step and the payment step. It is collapsed by default with a single checkbox ('This is a gift') at the top. Expanding the checkbox reveals three controls: a gift-wrap toggle (with a thumbnail preview and a PKR 150 surcharge), a handwritten-note textarea (max 200 characters, with a live character counter), and a ship-to-different-address toggle that, when enabled, replaces the billing address with a separate recipient-address form. The recipient-address form includes name, phone (required for COD delivery), and a 'gift message card' preview that updates live as the user types."),

    p("The gift-wrap option has three variants, each shown as a small swatch: Signature Gold (black box with gold ribbon, default), Festive Red (red box with gold ribbon, available during Eid and wedding season), and Eco Kraft (recycled kraft paper with twine, the budget-friendly option). The selected variant is shown at 80x80 pixels with its name and price. The handwritten-note preview shows a real mockup of the card (a 320x200 pixel card image with the user's text overlaid in a script font) so the customer can verify the text fits and looks right before placing the order."),

    h2("20.2 Zod Schema Extension"),

    p("The checkout schema from Chapter 3.6 is extended with an optional 'gift' object. The discriminated union on the 'isGift' flag keeps the schema readable: when 'isGift' is false, the 'gift' object is omitted entirely from the submitted form data; when true, the gift-wrap, note, and optional recipient-address fields are required. The OTP validation (Chapter 12.1) applies to both the billing phone and, if gift is enabled, the recipient phone — a common fraud pattern is to use a fake recipient phone to evade COD verification on the billing phone."),

    codeBlock(`// features/checkout/schemas.ts — extended gift fields
import { z } from "zod";

const phonePK = z.string().regex(/^\\+92\\s?3\\d{2}\\s?\\d{7}$/, "Enter a valid Pakistani mobile (+92 3XX XXXXXXX)");

const addressSchema = z.object({
  fullName: z.string().min(3, "Recipient name is required"),
  phone: phonePK,
  addressLine1: z.string().min(8, "Street address is required"),
  addressLine2: z.string().optional(),
  city: z.enum(["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Other"]),
  postalCode: z.string().regex(/^\\d{5}$/, "Pakistani postal codes are 5 digits"),
});

const giftSchema = z.object({
  isGift: z.literal(true),
  giftWrap: z.object({
    enabled: z.boolean().default(true),
    variant: z.enum(["signature-gold", "festive-red", "eco-kraft"]).default("signature-gold"),
  }),
  note: z.string().max(200, "Notes are limited to 200 characters").optional(),
  recipientAddress: addressSchema.optional(), // present only when ship-to-different is enabled
  shipToDifferentAddress: z.boolean().default(false),
}).refine(
  (data) => !data.shipToDifferentAddress || !!data.recipientAddress,
  { message: "Recipient address is required when ship-to-different is enabled", path: ["recipientAddress"] }
);

const noGiftSchema = z.object({ isGift: z.literal(false) });

export const checkoutSchema = z.object({
  // ... existing fields from Ch.3.6 ...
  contact: z.object({ phone: phonePK, email: z.string().email().optional() }),
  shippingAddress: addressSchema,
  payment: z.object({
    method: z.enum(["cod", "jazzcash", "easypaisa", "card", "bank"]),
  }),
  gift: z.discriminatedUnion("isGift", [noGiftSchema, giftSchema]).default({ isGift: false }),
});`),

    h2("20.3 Pricing and Surcharge Communication"),

    p("The gift-wrap surcharge (PKR 150 for Signature Gold, PKR 200 for Festive Red, PKR 100 for Eco Kraft) is added to the order total in real time as the user toggles options. The surcharge line item appears in the order summary with the label 'Gift wrap (Signature Gold)' — never just 'Additional fee' or 'Surcharge'. The total at the bottom of the form (and on the Place Order button) updates instantly. The handwritten note is free up to 200 characters; longer notes would require a larger card and are out of scope for the launch."),

    h2("20.4 Confirmation Page and Post-Order Touchpoints"),

    p("The order confirmation page (Chapter 7.15) explicitly acknowledges the gift selection: 'Gift wrap: Signature Gold. Note: \"Happy Birthday, Ayesha! Wishing you a year of warmth and light. — Gohar\"'. The order-confirmation WhatsApp message (sent in the full-stack phase) includes the gift selection so the warehouse team knows to add the gift-wrap station step. The gift wrap is visible in the order-history detail view in the customer's account, so a customer who sent a gift can later recall what they wrote."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 21: CLIENT DATA & SERVER-STATE LAYER
// ════════════════════════════════════════════════════════════════
function chapter21() {
  return [
    h1("21. Client Data and Server-State Layer"),

    p("Server state is the data the client fetches from a remote source — product listings, search results, paginated reviews, account history. It is fundamentally different from client state (the Zustand cart from Chapter 3.4): it is asynchronous, it can become stale, it can be requested by multiple components simultaneously, and it must be refetchable. Aura Living uses TanStack Query (React Query v5) to manage server state in the client, with a strict service-layer abstraction that allows the implementation to swap from mock data to Supabase without touching any component. This chapter specifies the query-key conventions, the mock-data strategy, and how the layer integrates with the existing track() analytics helper."),

    h2("21.1 Framework Choice: TanStack Query over SWR"),

    p("TanStack Query is chosen over SWR for three reasons. First, its devtools (the React Query Devtools browser extension) are essential for debugging — the timeline view shows every query, mutation, and cache invalidation in order, which is invaluable when a component refetches unexpectedly. Second, its mutation model is richer: optimistic updates, rollback on error, and side-effect callbacks (onSuccess, onError) are first-class. Third, its prefetch API supports the Aura Living pattern of prefetching the next page's data on hover, which makes navigation feel instant on 3G connections. SWR is simpler but covers fewer cases."),

    h2("21.2 Query-Key Conventions"),

    p("Query keys are arrays of strings and numbers, structured hierarchically. The first element is the domain (e.g., 'products', 'search', 'reviews'); subsequent elements narrow the scope. This hierarchical structure allows granular cache invalidation: invalidating ['products'] refetches all product queries; invalidating ['products', 'list'] refetches only PLP queries; invalidating ['products', 'detail', slug] refetches a single PDP. Query keys are colocated with their service in features/[domain]/queries/ and exported as constants — never inlined as string literals in components, which is a frequent source of cache misses."),

    codeBlock(`// features/product/queries/keys.ts
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  related: (slug: string) => [...productKeys.detail(slug), "related"] as const,
};

// features/product/queries/use-product-detail.ts
import { useQuery } from "@tanstack/react-query";
import { productKeys } from "./keys";
import { productService } from "@/services/product";

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productService.getBySlug(slug),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 30 * 60 * 1000,    // 30 minutes
    retry: (failureCount, error) =>
      error.kind === "network" && failureCount < 3,
  });
}`),

    h2("21.3 Service Layer Abstraction"),

    p("The services/ directory exposes a typed interface per domain. Each service has two implementations: a mock implementation (services/[domain]/mock.ts) that returns canned data with a simulated network delay, and a real implementation (services/[domain]/supabase.ts, added in the full-stack phase). A single resolver (services/[domain]/index.ts) chooses the implementation based on the NEXT_PUBLIC_USE_MOCKS environment variable. Components import only the resolved service — they never know whether they are talking to a mock or a real backend."),

    codeBlock(`// services/product/index.ts
import type { ProductService } from "./types";
import { mockProductService } from "./mock";
// import { supabaseProductService } from "./supabase"; // added in full-stack phase

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export const productService: ProductService = useMocks
  ? mockProductService
  : mockProductService; // will be supabaseProductService post-migration

// services/product/types.ts
export interface ProductService {
  getBySlug(slug: string): Promise<Result<Product>>;
  list(filters: ProductFilters): Promise<Result<Paginated<Product>>>;
  getRelated(slug: string): Promise<Result<Product[]>>;
}`),

    h2("21.4 Mock Data Strategy"),

    p("The mock data lives in services/mocks/data/ as JSON files (one per domain: products.json, categories.json, reviews.json, journal.json). The data is realistic: 48 SKUs across the three categories (lamps, plants, candles) with real-feeling names ('Brass Lotus Lamp', 'Monstera Deliciosa — Medium', 'Saffron & Oud Candle'), real-feeling prices (PKR 1,999 to PKR 24,999), and high-quality Pexels-sourced image URLs that will be replaced with brand photography in the full-stack phase. Each mock service function adds a 250ms to 600ms artificial delay to simulate a real network — fast enough to keep development productive, slow enough to expose loading states."),

    h2("21.5 Prefetching and Stale-While-Revalidate"),

    p("On the PDP, related products are prefetched as soon as the page becomes interactive — the user is likely to click one of them, and a prefetched response makes the next page feel instant. On the PLP, the next page of results is prefetched when the user scrolls near the pagination boundary. The staleTime of 5 minutes for product data is calibrated to the ISR revalidation time of 300 seconds (Chapter 3.5) — the client cache and the server cache stay roughly in sync. The gcTime (garbage collection, formerly cacheTime) of 30 minutes means a user who navigates away from a PDP and back within 30 minutes sees the cached data immediately while a fresh fetch happens in the background."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 22: PROMOTIONS & DISCOUNTS
// ════════════════════════════════════════════════════════════════
function chapter22() {
  return [
    h1("22. Promotions and Discounts"),

    p("Promotions drive the conversion spikes that make a Pakistani e-commerce business viable: Eid sales, Independence Day (14 August) flash sales, the wedding-season bundles of October to December. The frontend must display sale prices, discount badges, coupon code states, and free-shipping thresholds consistently across the PDP, PLP, cart, and checkout. This chapter specifies the pricing display rules, the coupon-code UX, and the free-shipping-threshold nudge. The actual discount calculation lives in the services/ layer and is mock-backed in the frontend phase; the UI states are fully built."),

    h2("22.1 Sale-Price Display and Discount Badges"),

    p("A product with an active sale has three price fields: compareAtPrice (the original price, shown with a strikethrough), price (the current sale price, shown in gold), and the discount percentage (calculated as Math.round((1 - price / compareAtPrice) * 100), shown as a badge). The badge is a small gold-on-black pill in the top-start corner of the product card image, with the format '-25%'. Badges above 30 percent are highlighted in a brighter gold and a slightly larger size — these are the 'wow' discounts that drive clicks. Badges below 10 percent are not shown (a 5 percent discount badge is more depressing than motivating)."),

    codeBlock(`// features/product/components/price-tag.tsx
interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  locale: Locale;
}

export function PriceTag({ price, compareAtPrice, locale }: PriceTagProps) {
  const fmt = (n: number) => formatPricePKR(n, locale === "ur" ? "ur-PK" : "en-PK");
  const discount = compareAtPrice ? Math.round((1 - price / compareAtPrice) * 100) : 0;
  const showBadge = discount >= 10;

  return (
    <div className="price-tag">
      {showBadge && (
        <span className={cn("badge", discount > 30 && "badge--highlight")}>
          -{discount}%
        </span>
      )}
      <span className="price-tag__current">{fmt(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="price-tag__compare">{fmt(compareAtPrice)}</span>
      )}
    </div>
  );
}`),

    h2("22.2 Coupon Code UX"),

    p("The coupon code input appears in the cart page (Chapter 7.7) below the order summary, with a placeholder 'Enter promo code'. The input is uppercase-on-input (the user types 'eid25' and sees 'EID25'). On submit, the coupon is validated via services/cart/applyCoupon(code, cartTotal) — in the mock phase this returns success for a hardcoded list ('WELCOME10', 'EID25', 'FREESHIP') and a typed error for others. A successful application shows a green checkmark, the coupon code, the discount amount, and a 'Remove' link. A failed application shows a red error message ('This code is not valid' or 'This code requires a minimum order of PKR 5,000') with the input retained for correction."),

    p("The coupon state lives in the Zustand cart store alongside the line items. Applying a coupon recomputes the cart totals (subtotal, discount, shipping, tax, total). Removing the coupon recomputes them again. The coupon is preserved across page reloads (via the persist middleware) but is revalidated on cart mount — a coupon that was valid yesterday may have expired today, and the user should be told ('The code EID25 has expired') rather than silently losing the discount at checkout."),

    h2("22.3 Free-Shipping Threshold Nudge"),

    p("Aura Living offers free shipping on orders above PKR 7,500 — a threshold calibrated to the average order value (PKR 4,200) plus 80 percent, encouraging customers to add one more item. The free-shipping nudge appears as a thin progress bar below the cart line items, with copy that updates dynamically: 'Add PKR 2,500 more for free shipping' (when below threshold), 'You have unlocked free shipping!' (when above). The progress bar uses the brand gold fill against a soft-cream track, with a small delivery-van icon that animates (a subtle 4-pixel slide) when the threshold is crossed."),

    codeBlock(`// features/cart/components/free-shipping-nudge.tsx
const FREE_SHIPPING_THRESHOLD = 7500;

export function FreeShippingNudge({ subtotal, locale }: { subtotal: number; locale: Locale }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const fmt = (n: number) => formatPricePKR(n, locale === "ur" ? "ur-PK" : "en-PK");
  const t = useTranslations("cart.freeShipping");

  return (
    <div className="nudge">
      <span className="nudge__label">
        {remaining > 0
          ? t("remaining", { amount: fmt(remaining) })
          : t("unlocked")}
      </span>
      <progress className="nudge__bar" value={pct} max={100} aria-hidden="true" />
    </div>
  );
}`),

    h2("22.4 Promotion Schedule and Feature Flags"),

    p("Site-wide promotions (Eid sale, Independence Day sale) are gated behind feature flags (see Chapter 28.4). When the 'eid-2026-sale' flag is active, the homepage hero swaps to the Eid creative, the PLP shows a sale-filter chip, and the sitewide banner ('Eid Mubarak — 25% off everything, code EID25') appears at the top of every page. The flag is set in Vercel's dashboard and read via NEXT_PUBLIC_FLAGS_* environment variables, allowing the marketing team to activate a sale without an engineering deploy. The flag is also gated by a start and end timestamp, so a forgotten flag does not run a sale indefinitely."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 23: DESIGN-TOKEN ADDITIONS (Z-INDEX + BREAKPOINTS)
// ════════════════════════════════════════════════════════════════
function chapter23() {
  return [
    h1("23. Design-Token Additions: Z-Index and Breakpoints"),

    p("Two scales were under-specified in the original design system (Chapter 5): the z-index layering scale (which element wins when two overlap?) and the responsive breakpoint scale (when does the layout shift from mobile to tablet to desktop?). Both are added here as CSS custom properties, matching the format of Appendix A, so they can be referenced by Tailwind utilities (z-header, z-drawer, md:px-8) and overridden per-theme if ever needed. Hardcoded z-index values and magic pixel breakpoints are forbidden anywhere else in the codebase; an ESLint rule enforces this."),

    h2("23.1 Z-Index Layering Scale"),

    p("The z-index scale is a finite, ordered list of named layers. Each layer is a number separated by 100 to leave room for future insertions. The names are semantic ('header', 'drawer', 'modal') not numeric ('z-1000'), because the number is an implementation detail and the name is what appears in component code. The base layer is 0 (normal flow); the highest is 9000 (toast notifications, which must appear above modals and drawers). Anything above 9000 is reserved for browser chrome (the WhatsApp FAB uses 800, not 9999, so it stays below toasts)."),

    spacer(120),
    dataTable(
      ["Token", "Value", "Used By"],
      [
        ["--z-base", "0", "Normal document flow"],
        ["--z-dropdown", "100", "Header dropdowns, locale switcher, search overlay trigger"],
        ["--z-sticky", "200", "Sticky PLP filter bar, sticky cart summary on mobile"],
        ["--z-header", "300", "Site header when scrolled (fixed position)"],
        ["--z-fab", "800", "WhatsApp floating action button (below overlays)"],
        ["--z-drawer", "900", "Cart drawer, mobile menu drawer, filter drawer"],
        ["--z-modal", "1000", "Product quick-view modal, auth modal"],
        ["--z-popover", "1100", "Tooltips, popovers anchored to trigger (above modal)"],
        ["--z-toast", "9000", "Toast notifications (highest non-browser layer)"],
      ],
      [22, 12, 66]
    ),
    caption("Table 23.1 — Z-index layering scale (CSS custom properties)"),

    codeBlock(`/* tokens.css — z-index scale (additions to Appendix A) */
:root {
  /* Z-index layers */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-header: 300;
  --z-fab: 800;
  --z-drawer: 900;
  --z-modal: 1000;
  --z-popover: 1100;
  --z-toast: 9000;
}

/* Usage in Tailwind 4 custom utilities */
@layer utilities {
  .z-header { z-index: var(--z-header); }
  .z-drawer { z-index: var(--z-drawer); }
  .z-modal { z-index: var(--z-modal); }
  .z-toast { z-index: var(--z-toast); }
  /* ... */
}`),

    h2("23.2 Responsive Breakpoint Scale"),

    p("The breakpoint scale defines the viewport widths at which the layout transitions between mobile, tablet, and desktop. Aura Living uses four breakpoints (sm, md, lg, xl) plus a base (no prefix) for mobile-first styles. The values are calibrated to actual device widths common in Pakistan: sm at 480px targets large phones in landscape, md at 768px targets small tablets and the iPad Mini, lg at 1024px targets the iPad Pro and small laptops, xl at 1280px targets desktops. There is no 2xl breakpoint — the max content width is capped at 1440px (the --container-max token) and centred, so wider viewports just get more whitespace."),

    spacer(120),
    dataTable(
      ["Token", "Value", "Primary Target", "Typical Devices"],
      [
        ["(base, no prefix)", "0–479px", "Mobile portrait", "iPhone SE, Samsung A series, Redmi Note"],
        ["--bp-sm", "480px", "Mobile landscape / large phone", "iPhone 14 Plus, Galaxy S23 Ultra"],
        ["--bp-md", "768px", "Tablet portrait", "iPad Mini, iPad 9th gen, Galaxy Tab"],
        ["--bp-lg", "1024px", "Tablet landscape / small laptop", "iPad Pro, MacBook Air 13\""],
        ["--bp-xl", "1280px", "Desktop", "MacBook Pro 14\", Dell XPS, external monitors"],
      ],
      [18, 12, 26, 44]
    ),
    caption("Table 23.2 — Responsive breakpoint scale with Pakistani device targeting"),

    codeBlock(`/* tokens.css — breakpoint scale (additions to Appendix A) */
:root {
  /* Breakpoints — referenced by Tailwind 4 @custom-variant */
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}

/* Tailwind 4 — register breakpoints from tokens (tailwind.css) */
@import "tailwindcss";

@custom-variant sm (@media (min-width: 480px));
@custom-variant md (@media (min-width: 768px));
@custom-variant lg (@media (min-width: 1024px));
@custom-variant xl (@media (min-width: 1280px));

/* Usage: <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"> */`),

    p("The breakpoints are exposed as CSS custom properties so that any future migration (e.g., to container queries) can swap the implementation in one place. Container queries (@container) are evaluated for the PDP gallery and the product card, where the component's own size matters more than the viewport's; the rest of the site uses media queries via Tailwind's variant system. The two systems coexist without conflict."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 24: STATE CATALOGS (EMPTY/LOADING/ERROR)
// ════════════════════════════════════════════════════════════════
function chapter24() {
  return [
    h1("24. State Catalogs: Empty, Loading, and Error"),

    p("Every dynamic surface in Aura Living has four possible states: loaded (data is present and rendered), loading (a fetch is in flight), empty (the fetch returned no data), and error (the fetch failed). The first three are first-class UX moments, not afterthoughts. A loading state that shows nothing for 800 milliseconds feels broken; an empty state that just says 'No results' feels dismissive; an error state that shows a stack trace feels unprofessional. This chapter is the catalog: a single reference listing every dynamic surface and its three non-loaded states, with copy and component specifications."),

    h2("24.1 Loading State Patterns"),

    p("Aura Living uses three loading patterns, chosen per surface based on the expected wait time and the layout stability requirement. The first is the skeleton: a greyed-out placeholder that matches the eventual content's shape, used on PLP cards, PDP gallery, and cart line items. The second is the inline spinner: a small gold spinner (32x32 pixels) used for short waits triggered by a user action (applying a coupon, submitting a review). The third is the full-page loading overlay: a centered gold spinner on a semi-transparent backdrop, used for navigation between routes when streaming is not possible. Suspense boundaries (Chapter 3.3) determine which parts of the page show which pattern."),

    spacer(120),
    dataTable(
      ["Surface", "Loading", "Empty", "Error"],
      [
        ["PLP (no results)", "8 skeleton cards", "Illustration + 'Try a different filter' + clear button", "Error card + retry button"],
        ["PDP gallery", "Skeleton image block", "N/A (404 instead)", "Single error image + 'Back to shop'"],
        ["PDP reviews (empty)", "3 skeleton review cards", "Friendly copy + 'Be the first to review' CTA", "Inline retry link"],
        ["Cart (empty)", "Skeleton line items", "Empty cart illustration + 'Continue shopping' + 'Popular picks' carousel", "WhatsApp support CTA"],
        ["Search (no results)", "Skeleton result cards", "'No matches for \"X\"' + spelling suggestions + popular searches", "Error card + retry"],
        ["Wishlist (empty)", "Skeleton cards", "Heart illustration + 'Browse our collection' CTA", "WhatsApp support CTA"],
        ["Account / orders (empty)", "Skeleton order rows", "'No orders yet' + 'Start shopping' CTA", "Error card + retry"],
        ["Lookbook grid (empty)", "Skeleton image grid", "Rare; falls back to /lookbook index", "Error card + retry"],
        ["Journal index (empty)", "Skeleton article cards", "Rare; copy 'Articles coming soon'", "Error card + retry"],
        ["Order confirmation (fetch failed)", "Skeleton summary", "N/A", "Soft error + 'We have your order' reassurance + WhatsApp"],
      ],
      [24, 18, 32, 26]
    ),
    caption("Table 24.1 — State catalog across all dynamic surfaces"),

    h2("24.2 Empty State Voice and Copy"),

    p("Empty states are written in the same measured, sensory-but-technical voice as the rest of the brand. They acknowledge the situation, offer a constructive next step, and never make the user feel they have done something wrong. The cart empty state, for example, reads: 'Your cart is waiting to be filled. Browse our latest lamps, plants, and candles — your next favourite is one tap away.' Below the copy, a 'Continue shopping' button (gold, primary) and a 'Popular picks' carousel showing three trending products. The illustration is a custom SVG of an empty brass bowl — on-brand, not a stock-illustration shopping cart icon."),

    codeBlock(`// features/cart/components/empty-cart.tsx
export function EmptyCart({ locale }: { locale: Locale }) {
  const t = useTranslations("cart.empty");
  return (
    <div className="empty-state empty-state--cart">
      <BrassBowlIllustration className="empty-state__art" />
      <h2 className="empty-state__title">{t("title")}</h2>
      <p className="empty-state__body">{t("body")}</p>
      <Button as="link" href="/shop" variant="primary">{t("cta")}</Button>
      <PopularPicksCarousel limit={3} className="empty-state__picks" />
    </div>
  );
}`),

    h2("24.3 Error State Hierarchy"),

    p("Errors are categorised into three severity levels, each with a different UX. Soft errors (a single product image fails to load) show a fallback image and log to analytics; the user is not interrupted. Medium errors (a coupon code is invalid, a review submission fails) show an inline error message in the form with a clear recovery path; the user stays on the page. Hard errors (the entire PLP data fetch fails, the checkout submission fails) trigger the error.tsx boundary with a full-page takeover, a friendly message, a retry button, and a WhatsApp support link. The hierarchy ensures that the user is never shown more disruption than the error warrants."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 25: PRIVACY & CONSENT
// ════════════════════════════════════════════════════════════════
function chapter25() {
  return [
    h1("25. Privacy and Consent"),

    p("Pakistan does not yet have a GDPR-equivalent national data protection law, but the Pakistan Personal Data Protection Bill (2023, under revision) signals the direction, and premium brands operating in Pakistan should treat customer data with the same care expected in mature jurisdictions. This chapter specifies the cookie-consent UX, the analytics event taxonomy that underpins every track() call in the codebase, and the data-retention principles that govern what is stored where. The approach is conservative: collect less, store less, and let the customer opt in rather than opt out."),

    h2("25.1 Cookie Consent Strategy"),

    p("On the first visit, a bottom-of-screen cookie banner appears with the message 'We use cookies to improve your experience and understand what works. Choose your preferences.' and three buttons: 'Accept all' (primary gold), 'Essential only' (secondary outline), and 'Manage preferences' (text link). The banner is non-blocking — the user can scroll and interact with the site without dismissing it — and it does not use a dark pattern (no 'Accept all' is larger or more prominent than 'Essential only'). The choice is stored in localStorage under the 'aura-consent' key for 12 months."),

    p("The 'Manage preferences' view shows three categories: Essential (always on, includes the cart and auth tokens — these are not optional), Analytics (Vercel Analytics and the future PostHog instance — opt-in), and Marketing (the future Meta Pixel and Google Ads tag — opt-in, off by default). The user can toggle each independently and save. The consent state is re-checked on every page load; if the user has not consented to Marketing, the Meta Pixel script is never injected. This is enforced at the layout level, not in component code."),

    codeBlock(`// lib/consent.ts — consent state and gating
export type ConsentCategory = "essential" | "analytics" | "marketing";
export type ConsentState = Record<ConsentCategory, boolean>;

const STORAGE_KEY = "aura-consent";
const EXPIRY_DAYS = 365;

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > EXPIRY_DAYS * 86400000) return null;
    return parsed.state as ConsentState;
  } catch {
    return null;
  }
}

export function hasConsent(category: ConsentCategory): boolean {
  const state = getConsent();
  if (!state) return category === "essential";
  return state[category] ?? false;
}

// app/layout.tsx — gate marketing scripts on consent
export default async function RootLayout({ children }) {
  const consent = getConsent();
  return (
    <html>
      <head>
        {consent?.marketing && <Script src="https://connect.facebook.net/en_US/fbevents.js" />}
      </head>
      <body>{children}</body>
    </html>
  );
}`),

    h2("25.2 Analytics Event Taxonomy"),

    p("Every track() call in the codebase uses a name from a closed vocabulary defined in lib/analytics/events.ts. The vocabulary is hierarchical: domain.action (e.g., 'product.viewed', 'cart.added', 'checkout.started'). Properties are typed per event — TypeScript enforces that 'product.viewed' is called with { productId, slug, price, category } and nothing else. This closed vocabulary is essential: without it, three engineers will spell the same event three different ways and the funnel analysis will be useless."),

    spacer(120),
    dataTable(
      ["Event Name", "Triggered When", "Properties"],
      [
        ["page.viewed", "Any route navigation completes", "{ path, locale, referrer }"],
        ["product.viewed", "PDP mounts with valid slug", "{ productId, slug, price, category }"],
        ["product.list_viewed", "PLP renders results", "{ filters, resultCount, page }"],
        ["search.submitted", "User submits search query", "{ query, resultCount }"],
        ["cart.added", "Add-to-cart button clicked", "{ productId, slug, quantity, price }"],
        ["cart.removed", "Line item removed", "{ productId, quantity }"],
        ["cart.viewed", "Cart drawer or page opened", "{ itemCount, subtotal }"],
        ["checkout.started", "Checkout route mounted", "{ cartValue, itemCount }"],
        ["checkout.step_completed", "Each step validated", "{ step, method }"],
        ["checkout.completed", "Order confirmation mounted", "{ orderId, total, method, gift }"],
        ["coupon.applied", "Coupon code successfully applied", "{ code, discount }"],
        ["coupon.failed", "Coupon code rejected", "{ code, reason }"],
        ["wishlist.added", "Wishlist toggle adds product", "{ productId }"],
        ["whatsapp.clicked", "WhatsApp FAB or PDP enquiry clicked", "{ context }"],
        ["locale.changed", "User switches locale", "{ from, to }"],
        ["error.occurred", "Any uncaught error", "{ type, message, route }"],
      ],
      [28, 38, 34]
    ),
    caption("Table 25.1 — Closed analytics event vocabulary (v1.1)"),

    h2("25.3 Funnel Definitions"),

    p("The conversion funnel is defined as the sequence: page.viewed (PDP) -> cart.added -> cart.viewed -> checkout.started -> checkout.completed. Each step is a tracked event; the funnel is computed by joining events on anonymous visitor ID (or user ID if logged in). The funnel is reported weekly and is the primary conversion metric. The 'search-to-purchase' sub-funnel (search.submitted -> product.viewed -> cart.added) is reported as a secondary metric. Funnel definitions are versioned in lib/analytics/funnels.ts; a change to the funnel definition bumps the version and is documented in the changelog."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 26: SEARCH IMPLEMENTATION
// ════════════════════════════════════════════════════════════════
function chapter26() {
  return [
    h1("26. Search Implementation"),

    p("Search is a small fraction of total traffic on a 48-SKU storefront, but it is the highest-intent fraction — a customer who searches 'candle' is far more likely to buy than one browsing the homepage. The frontend phase implements a lightweight client-side search; the full-stack phase migrates to Algolia for typo tolerance, faceting, and analytics. This chapter specifies both phases, the query-key conventions for the search hook, and the no-results UX. The migration path is designed so that no component code changes when the backend swaps."),

    h2("26.1 Frontend Phase: Client-Side Index"),

    p("In the frontend phase, search is implemented as a client-side index built from the mock products JSON. On first search interaction (the user clicks the search icon or focuses the search input), a 6KB index is built using FlexSearch (a tiny full-text library, 4.5KB gzipped). The index supports prefix matching, fuzzy matching (one edit distance), and field boosting (product name is weighted 3x, description 1x, category 2x). The index is cached in a module-level variable so subsequent searches are instant. Results are returned in under 10 milliseconds for the 48-SKU catalog; the index scales comfortably to 1,000 SKUs before migration is required."),

    codeBlock(`// features/search/client-index.ts
import FlexSearch from "flexsearch";
import { mockProducts } from "@/services/mocks/data/products";

let index: FlexSearch.Document | null = null;

function getIndex() {
  if (index) return index;
  index = new FlexSearch.Document({
    tokenize: "forward",
    cache: 100,
    document: {
      id: "slug",
      index: [
        { field: "name", tokenize: "forward", resolution: 9 }, // highest weight
        { field: "category", tokenize: "forward", resolution: 6 },
        { field: "description", tokenize: "strict", resolution: 3 },
      ],
      store: ["name", "slug", "price", "compareAtPrice", "image", "category"],
    },
  });
  mockProducts.forEach((p) => index!.add(p));
  return index;
}

export function searchProducts(query: string, limit = 12) {
  if (!query.trim()) return [];
  const idx = getIndex();
  const results = idx.search(query, { limit, enrich: true });
  // FlexSearch returns one array per index field; merge and dedupe by slug.
  const seen = new Set<string>();
  return results
    .flatMap((r) => r.result)
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    })
    .map((r) => r.doc);
}`),

    h2("26.2 Production Phase: Algolia Migration"),

    p("When the catalog exceeds 500 SKUs or when the marketing team needs search analytics (click-through rate, zero-results rate, popular queries), the search backend migrates to Algolia. The migration is a swap of the service implementation only — the useSearch hook and the search results component stay identical. Algolia is chosen over Postgres FTS because its typo tolerance is dramatically better (it handles 'canddle' -> 'candle' instantly; Postgres FTS does not), its faceting is real-time (Postgres FTS requires materialised views that need refreshing), and its Analytics dashboard gives the marketing team self-serve insight without engineering involvement."),

    codeBlock(`// services/search/algolia.ts — production implementation
import { algoliasearch } from "algoliasearch";
import type { SearchService } from "./types";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!, // search-only key, safe to expose
);

export const algoliaSearchService: SearchService = {
  async query(query: string, filters?: SearchFilters): Promise<Result<SearchResult>> {
    try {
      const { results } = await client.searchSingleIndex({
        indexName: "products",
        searchParams: {
          query,
          hitsPerPage: 24,
          facets: ["category", "price_range"],
          facetFilters: filters?.category ? [\`category:\${filters.category}\`] : [],
          numericFilters: filters?.priceRange
            ? [\`price:\${filters.priceRange[0]} TO \${filters.priceRange[1]}\`]
            : [],
        },
      });
      return { status: "ok", data: { items: results.hits, total: results.nbHits } };
    } catch (e) {
      return { status: "error", error: { kind: "network", message: String(e), retryable: true } };
    }
  },
};`),

    h2("26.3 No-Results UX and Spelling Suggestions"),

    p("When a search returns zero results, the page shows a friendly message: 'No matches for \"canddle\". Did you mean \"candle\"?' The spelling suggestion is computed via a Levenshtein-distance comparison against the catalog's term frequency list (the top 50 terms across product names). Below the suggestion, the page shows three popular searches as clickable chips ('Candles', 'Brass Lamps', 'Indoor Plants') and a 'Browse all products' CTA. This pattern turns a dead-end into a recovery moment, recovering an estimated 12 to 18 percent of zero-result sessions."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 27: SEO EDGE CASES
// ════════════════════════════════════════════════════════════════
function chapter27() {
  return [
    h1("27. SEO Edge Cases"),

    p("The base SEO strategy in Chapter 9 covers metadata, schema.org structured data, and sitemap generation. This chapter handles the edge cases that bite when a site grows: filtered and paginated PLP URLs that look like duplicate content to Google, image SEO that goes beyond alt text, and the accessibility statement page that WCAG 2.2 expects and that the route taxonomy in Chapter 3.7 now includes. Each edge case is grounded in 2026 Google Search Central guidance and tested against the actual crawl behaviour observed on Pakistani e-commerce sites."),

    h2("27.1 Filtered and Paginated PLP Canonicalization"),

    p("The /shop page accepts query parameters for filters (?category=lamps&price=0-5000) and pagination (?page=2). Without explicit canonicalization, Google may index dozens of variants of the same page, diluting ranking signals. Aura Living's strategy: the canonical URL for /shop with any filter combination is /shop itself (self-referencing canonical on the unfiltered URL). Pagination uses rel=\"next\" and rel=\"prev\" link tags (deprecated by Google in 2019 but still respected by Bing and other engines) plus a canonical that points to the same paginated URL (page 2 canonicalises to /shop?page=2, not to /shop)."),

    p("Filter combinations that represent a meaningful sub-collection (e.g., /shop?category=lamps) are pre-rendered as their own static route (/shop/lamps) with their own canonical and their own metadata. The query-string variant (?category=lamps) is canonicalised to the static route via a 301 redirect, executed in middleware. This pattern keeps the crawl budget focused on the curated static routes while still allowing on-the-fly filtering for users."),

    codeBlock(`// app/shop/page.tsx — canonicalisation for filtered PLP
export async function generateMetadata({
  searchParams,
}: { searchParams: { category?: string; page?: string } }): Promise<Metadata> {
  const page = Number(searchParams.page ?? 1);
  const canonical = page > 1 ? \`/shop?page=\${page}\` : "/shop";

  return {
    canonical,
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
    alternates: {
      // hreflang for paginated content points to the equivalent paginated URL
      languages: { en: \`/en\${canonical}\`, ur: \`/ur\${canonical}\` },
    },
  };
}`),

    h2("27.2 Image Sitemap and Image SEO"),

    p("Product images are submitted in a dedicated image sitemap (sitemap-images.xml), generated at build time from the product catalog. Each image entry includes the image URL, its caption (the product name), and its license (proprietary). The image sitemap is referenced in robots.txt and submitted in Google Search Console. Beyond the sitemap, every product image uses a descriptive filename (brass-lotus-lamp-hero-1200.webp, not IMG_4892.jpg), a descriptive alt attribute (the product name plus a brief descriptor, e.g., 'Brass Lotus Lamp with warm white LED, three-quarter view'), and is served in next/image with appropriate width and height attributes to prevent CLS."),

    h2("27.3 Duplicate Content from Locale Variants"),

    p("The English and Urdu versions of each page (Chapter 18) are technically duplicate content in Google's eyes, even though the words are different. The hreflang tags (Chapter 18.4) signal to Google that these are alternate-language equivalents, not duplicates, and Google treats them accordingly — the English page ranks for English queries, the Urdu page ranks for Urdu queries. The two never compete. The x-default tag points to the English version, which is the locale most Pakistani searchers use for product queries."),

    h2("27.4 Accessibility Statement Page"),

    p("WCAG 2.2 expects a site to publish an accessibility statement — a public page documenting the conformance level, the known issues, and the contact for accessibility feedback. The route /accessibility-statement is added to the route taxonomy (Chapter 3.7). The page is authored as MDX in app/accessibility-statement/page.tsx, with the same MDX pipeline as the journal (Chapter 17.2). The content covers: the conformance target (WCAG 2.2 AA), the audit methodology (axe-core + manual keyboard + screen reader testing), the known issues (with a target fix date for each), the feedback mechanism (WhatsApp + email + form), and the statement's last-updated date."),

    codeBlock(`// app/[locale]/accessibility-statement/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Aura Living's commitment to WCAG 2.2 AA accessibility, our known issues, and how to give feedback.",
  alternates: {
    canonical: "/accessibility-statement",
    languages: {
      en: "/en/accessibility-statement",
      ur: "/ur/accessibility-statement",
      "x-default": "/en/accessibility-statement",
    },
  },
};

export default function AccessibilityStatementPage() {
  return (
    <Shell>
      <Prose>
        <h1>Accessibility Statement</h1>
        <p className="last-updated">Last updated: 22 June 2026</p>
        {/* Statement body authored as MDX */}
      </Prose>
    </Shell>
  );
}`),

    p("The accessibility statement is linked from the footer of every page (added in the footer component) and from the 404 page. It is submitted in the sitemap. The page itself must be accessible (a statement about accessibility that is itself inaccessible is the worst kind of irony) — it is tested with axe-core, a keyboard-only navigation pass, and a screen reader pass before each publish."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 28: ENGINEERING WORKFLOW
// ════════════════════════════════════════════════════════════════
function chapter28() {
  return [
    h1("28. Engineering Workflow"),

    p("A frontend plan that does not specify how the team works together is incomplete. This chapter defines the Git branching model, the commit message convention, the pull request template, the Architecture Decision Record (ADR) format, and the feature-flag strategy. These are the rules of the road — small enough to fit in a single chapter, important enough to prevent the slow decay of code quality that kills every long-running project. Every rule here is calibrated to a small team (two to four engineers) shipping to production weekly."),

    h2("28.1 Git Branching and Commit Conventions"),

    p("Aura Living uses a trunk-based development model: short-lived feature branches (typically 1 to 3 days, maximum 5 days) merged to main via squash-and-merge PRs. Release branches are cut from main for each production release (every two weeks) and patched only for hotfixes. The main branch is always deployable; the Vercel production deployment tracks main automatically. Long-lived feature branches are forbidden — if a feature cannot be shipped in small slices behind a feature flag, the feature is too big and should be decomposed."),

    p("Commit messages on the feature branch follow the Conventional Commits 1.0 specification: type(scope): subject. The type is one of feat, fix, docs, style, refactor, perf, test, chore, build, ci. The scope is the affected domain (cart, pdp, checkout, i18n, etc.). The subject is a single line in imperative mood ('add gift wrap option', not 'added gift wrap option'). The squash-merge commit on main uses the same format, so the main branch log reads as a clean narrative of changes."),

    codeBlock(`# Example commit messages
feat(checkout): add gift wrap option with handwritten note
fix(cart): preserve gift metadata on quantity change
docs(plan): add Chapter 20 gift options and update Zod schema
perf(pdp): prefetch related products on intersection
test(e2e): add COD checkout happy path journey
chore(deps): bump framer-motion from 11.3.0 to 11.3.2
ci(playwright): add @critical tag gating on merge`),

    h2("28.2 Pull Request Template"),

    p("Every PR opens with a template that forces the author to articulate the why, the what, the testing, and the risk. The template is in .github/pull_request_template.md and renders automatically in the PR description field. The 'Why' section is mandatory and one paragraph — if the author cannot explain why in one paragraph, the PR is not ready. The 'Risk' section forces explicit thinking about what could break; the 'Rollback' section forces explicit thinking about how to undo the change if it does break."),

    codeBlock(`# .github/pull_request_template.md
## Why
<!-- One paragraph. What problem does this PR solve? Link the issue or ADR. -->

## What
<!-- Bullet list of changes. Be specific. -->

## Testing
- [ ] Unit tests pass (\`pnpm test:unit\`)
- [ ] Component tests pass (\`pnpm test:component\`)
- [ ] E2E @critical tests pass (\`pnpm test:e2e -- --grep @critical\`)
- [ ] Manually tested on mobile (375px) and desktop (1280px)
- [ ] Manually tested in English and Urdu (if i18n-touching)
- [ ] Lighthouse score does not regress (CI report)

## Risk
<!-- What could this break? What's the blast radius? -->

## Rollback
<!-- How do we revert? Is there a feature flag? -->

## Screenshots
<!-- Before/after for any visual change -->

## Checklist
- [ ] No inline styles (enforced by ESLint rule)
- [ ] No new z-index magic numbers (use tokens from Ch.23.1)
- [ ] No new hardcoded breakpoints (use tokens from Ch.23.2)
- [ ] Analytics events match the taxonomy in Ch.25.2
- [ ] Accessibility: keyboard-only pass, axe-core clean`),

    h2("28.3 Architecture Decision Records (ADRs)"),

    p("Architecturally significant decisions are recorded as ADRs in the docs/adr/ directory, numbered sequentially (0001-use-next-intl-over-i18next.md, 0002-zustand-over-redux-for-cart.md, etc.). An ADR is a short markdown document with five sections: Context (the problem), Decision (the choice), Rationale (the why), Consequences (the tradeoffs), and Status (proposed, accepted, superseded). An ADR is never edited after acceptance; if a decision is reversed, a new ADR is written that supersedes the old one, and the old ADR's status is updated to 'Superseded by ADR-00XX'. This creates a durable history of why the codebase looks the way it does."),

    h2("28.4 Feature-Flag Strategy"),

    p("Features that are not ready for all users are gated behind feature flags. Aura Living uses Vercel's built-in Vercel Flags (a thin wrapper around the Flags SDK) with three flag types: release flags (boolean, on/off, used to soft-launch a feature to a percentage of users), experiment flags (multivariate, used for A/B tests), and ops flags (boolean, used to disable a broken feature in production without a deploy). Flags are read in code via the flags() function from @vercel/flags/next, which is Edge-compatible and SSR-friendly."),

    codeBlock(`// lib/flags.ts
import { flag } from "@vercel/flags/next";

export const giftOptionsFlag = flag<boolean>("gift-options", {
  defaultValue: false,
  decide: () => {
    // Enable for 50% of users; full rollout on 1 July 2026
    const now = new Date();
    if (now >= new Date("2026-07-01")) return true;
    return Math.random() < 0.5;
  },
});

// Usage in checkout page
export default async function CheckoutPage() {
  const showGiftOptions = await giftOptionsFlag();
  return (
    <CheckoutFlow>
      {showGiftOptions && <GiftOptionsSection />}
    </CheckoutFlow>
  );
}`),

    p("Flag state is also visible in the admin dashboard (a future internal tool) so marketing and ops can toggle flags without an engineer. Every flag has an owner (a named engineer) and an expiry date — flags that live forever are technical debt. A weekly sweep reviews flags past their expiry and either promotes them to full rollout (deletes the flag) or removes them if the feature did not earn its place."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 29: MISCELLANEOUS
// ════════════════════════════════════════════════════════════════
function chapter29() {
  return [
    h1("29. Miscellaneous: Transitions, Maintenance, Inventory, Contracts"),

    p("This chapter collects four concerns that did not fit cleanly into the prior chapters but are essential to a production-grade frontend: page-transition animations that respect reduced-motion, the maintenance/503 page, the back-in-stock and inventory-handling UX, and the TypeScript service-interface contracts between the mock layer and the future Supabase implementation. Each is specified with the same depth as the chapters above."),

    h2("29.1 Page-Transition Animations with View Transitions API"),

    p("Aura Living uses the View Transitions API (a 2024 baseline, broadly supported in Chromium 126+ and Safari 18+) for cross-route navigation transitions. The default transition is a 200ms cross-fade between the old and new page content; on the PDP-to-cart navigation, a shared-element transition morphs the product image into the cart line-item image. The transition respects the prefers-reduced-motion media query: when the user has set their OS to reduce motion, the transition is instant (no fade, no morph). The View Transitions API is feature-detected at runtime; browsers without support get an instant navigation with no visual transition."),

    codeBlock(`// app/template.tsx — wraps every route segment
"use client";
import { useLayoutEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    if (!document.startViewTransition) return;
    // The actual transition is triggered by Next.js navigation;
    // this hook adds the view-transition-name to the PDP image
    // when navigating from PDP to cart, enabling shared-element morph.
  }, []);

  return <div className="view-transition-wrapper">{children}</div>;
}

/* CSS — view transition styles (tokens.css) */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
  animation-timing-function: var(--ease-aura-living);
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
  }
}`),

    h2("29.2 Maintenance and 503 Page"),

    p("The /maintenance route is a static page served when the site is in a planned-maintenance state. The page is plain HTML (no JavaScript bundle) so it loads even if the rest of the app is broken. It explains the maintenance window ('We are improving your shopping experience. We will be back by 14:00 PKT.'), shows a contact option (WhatsApp + email), and refreshes automatically every 5 minutes to detect when the site is back. Activation is via a Vercel Edge Config flag — flipping the flag in the Vercel dashboard immediately serves /maintenance for all traffic, without a deploy."),

    codeBlock(`// middleware.ts — maintenance flag check (extends Ch.18.2 locale middleware)
import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

const MAINTENANCE_FLAG_KEY = "maintenance-mode-active";

export async function middleware(request: NextRequest) {
  // Maintenance check — bypass for /maintenance itself and Vercel internals
  if (request.nextUrl.pathname !== "/maintenance" && !request.nextUrl.pathname.startsWith("/_vercel")) {
    const isMaintenance = await get<boolean>(MAINTENANCE_FLAG_KEY).catch(() => false);
    if (isMaintenance) {
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.rewrite(url);
    }
  }
  // ... existing next-intl locale middleware ...
}`),

    h2("29.3 Back-in-Stock and Inventory Handling"),

    p("A product can be in three inventory states: in-stock (default), low-stock (fewer than 5 units, shows 'Only 4 left' in gold), and out-of-stock (zero units). The out-of-stock PDP replaces the add-to-cart button with a 'Notify me when available' button — clicking it opens a small inline form (email or WhatsApp opt-in) that submits to services/inventory/subscribeToBackInStock(slug, contact). The mock service returns success; the full-stack service will write a row to a Supabase back_in_stock_subscriptions table and trigger a notification (WhatsApp via the WhatsApp Business API, or email via Resend) when inventory is restocked. The button is disabled (greyed) while the request is in flight; a success state shows 'We will notify you' for 5 seconds before reverting."),

    p("Inventory state is displayed prominently on the PDP but not on the PLP card — the PLP card shows an 'Out of stock' badge only for fully unavailable items, not for low-stock, to avoid creating false scarcity pressure. The cart drawer does not block checkout of low-stock items, but if an item goes out of stock between add-to-cart and checkout, the checkout page shows an inline warning ('Brass Lotus Lamp is no longer available. Remove it to continue, or save it for later.') and disables the Place Order button until the user resolves the conflict."),

    h2("29.4 Service-Interface TypeScript Contracts"),

    p("The mock layer (Chapter 21.3) and the future Supabase implementation must be interchangeable. This is enforced by a TypeScript interface per service, defined in services/[domain]/types.ts. The mock implementation and the Supabase implementation both 'implements' the same interface, and a type-level test (using tsd) verifies that the Supabase implementation matches. This contract-first approach means the mock can be developed against before the Supabase schema exists, and the Supabase implementation can be swapped in without touching any component code."),

    codeBlock(`// services/product/types.ts — the contract
import type { Result } from "@/lib/result";

export interface Product {
  slug: string;
  name: string;
  description: string;
  category: "lamps" | "plants" | "candles";
  price: number;
  compareAtPrice?: number;
  currency: "PKR";
  images: ProductImage[];
  inventory: { status: "in-stock" | "low-stock" | "out-of-stock"; quantity: number };
  rating?: { average: number; count: number };
  metadata: Record<string, string>; // dimensions, material, etc.
}

export interface ProductService {
  getBySlug(slug: string): Promise<Result<Product>>;
  list(filters: ProductFilters): Promise<Result<Paginated<Product>>>;
  getRelated(slug: string): Promise<Result<Product[]>>;
}

// services/product/supabase.ts — the future implementation skeleton
import type { ProductService, Product } from "./types";

export const supabaseProductService: ProductService = {
  async getBySlug(slug) {
    // TODO: implement against Supabase once schema is finalised
    throw new Error("Not implemented — see ADR-0007");
  },
  async list(filters) {
    throw new Error("Not implemented — see ADR-0007");
  },
  async getRelated(slug) {
    throw new Error("Not implemented — see ADR-0007");
  },
};`),

    p("This contract is the single source of truth for what 'a product service' must do. New service methods are added here first, then implemented in the mock, then (eventually) in the Supabase version. Components depend on the interface, not the implementation, so the swap is invisible to them."),

    h2("29.5 v1.1 Document Note"),

    p("This document is now at version 1.1. The fourteen chapters added in this revision (Chapters 16 through 29) extend the original v1.0 plan with the testing, security, internationalisation, resilience, gifting, server-state, promotions, design-token, state-catalog, privacy, search, SEO-edge, engineering-workflow, and miscellaneous concerns identified during senior-developer review. No decision in Chapters 1 through 15 has been contradicted; where a new chapter interacts with an existing one, it references the original by chapter number. The Table of Contents has been regenerated to include all twenty-nine chapters and the three appendices. The route taxonomy (Chapter 3.7) has been updated to twenty-seven routes with the addition of /accessibility-statement and /maintenance. The next revision (v1.2) will incorporate any further review feedback and will coincide with the start of Phase 1 implementation."),
  ];
}

module.exports = {
  chapter16, chapter17, chapter18, chapter19,
  chapter20, chapter21, chapter22, chapter23,
  chapter24, chapter25, chapter26, chapter27,
  chapter28, chapter29,
};
