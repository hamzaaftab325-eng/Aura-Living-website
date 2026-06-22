// Aura Living Plan — Content Part 6: Pakistani UX, Deployment, Roadmap, Risks, Appendices
const H = require("./aurelia-plan.js");
const { h1, h2, h3, p, pr, bullet, bulletRich, spacer, divider, codeBlock, caption, dataTable, callout } = H;

// ════════════════════════════════════════════════════════════════
// CHAPTER 12: PAKISTANI MARKET UX CONSIDERATIONS
// ════════════════════════════════════════════════════════════════
function chapter12() {
  return [
    h1("12. Pakistani Market UX Considerations"),

    p("A premium e-commerce experience cannot be copy-pasted from western brands and shipped to Pakistan. Pakistani consumers have specific behaviours, expectations, and constraints that must be reflected in every UX decision. This chapter catalogues the most consequential considerations and how Aura Living addresses each. These are not minor localisation tweaks; they are foundational architecture decisions that shape the entire checkout flow, the trust signals on every page, and the support model."),

    h2("12.1 Cash-on-Delivery-First Checkout"),

    p("Cash on delivery (COD) accounts for 70 to 85 percent of Pakistani e-commerce orders, depending on category and price point. A checkout that treats COD as a second-class option — buried below card payment, requiring extra steps, or marked with disclaimers — actively reduces conversion. Aura Living's checkout defaults to COD: the COD radio button is selected by default when the checkout loads, the COD option appears first in the payment method list, and the COD copy is reassuring (\"Pay with cash when your order is delivered. Inspect before paying.\") rather than cautionary."),

    p("To mitigate the higher return rate of COD orders (customers refuse delivery, costing the seller shipping both ways), Aura Living verifies the customer's phone number via OTP before allowing COD checkout. The OTP is sent via SMS to the entered +92 number, and the customer must enter the 4-digit code to proceed. This adds 10 seconds to checkout but reduces fraudulent and accidental COD orders by an estimated 30 to 40 percent, a worthwhile trade."),

    h2("12.2 Payment Method UX"),

    p("Beyond COD, Aura Living supports JazzCash, Easypaisa, card payments (via a future payment gateway), and bank transfer. Each method has its own UX pattern. JazzCash and Easypaisa use a redirect flow: the customer enters their mobile number, is redirected to the wallet's app or web flow to confirm, and is returned to Aura Living's order confirmation page. Card payments use a hosted checkout (the customer is redirected to a PCI-compliant page) — Aura Living never sees or stores card details. Bank transfer shows the Aura Living bank account details and asks the customer to email or WhatsApp the transfer receipt; the order is held in \"Pending Payment\" status until manual confirmation."),

    p("Each payment method's radio button in the checkout shows the method's logo (small, 24x24 pixels), the method name, and a one-line description of the flow (\"You will be redirected to JazzCash\"). The selected method's specific fields appear below the radio group. The total amount is always visible at the bottom of the form, on the Place Order button, so the customer never loses sight of what they are committing to."),

    h2("12.3 Mobile-First Patterns"),

    p("Pakistan is approximately 80 percent mobile traffic, and the mobile experience is therefore the primary experience, not a fallback. Every page in Aura Living is designed mobile-first: the layout, the typography, the touch targets, and the animations are all designed for a 375-pixel-wide phone with a thumb, then scaled up to desktop. Touch targets are at least 44x44 pixels (the Apple HIG minimum, also recommended by WCAG 2.2 target size). The mobile menu is a full-screen sheet with a large tap-friendly accordion. The cart drawer is a full-screen sheet on mobile (not a side drawer). The PDP gallery is a swipe carousel (not a click-through)."),

    p("Mobile-specific interaction patterns include: pull-to-refresh is disabled (it conflicts with Lenis and is rarely useful on e-commerce pages); swipe gestures are used only where they are discoverable (the PDP gallery, the testimonials carousel); the WhatsApp FAB is positioned bottom-right but lifts above the iOS Safari bottom bar; the search overlay uses the native mobile keyboard's search key rather than a custom button."),

    h2("12.4 WhatsApp Integration"),

    p("WhatsApp is the default customer support channel in Pakistan. Aura Living integrates WhatsApp at three levels. First, a persistent floating action button (FAB) on every page, bottom-right on mobile and desktop, that opens a WhatsApp chat with a pre-filled message (\"Hi Aura Living team, I have a question about [page URL]\"). Second, a WhatsApp enquiry button on every PDP that opens a chat with a product-specific message (\"Hi, I have a question about [product name]\"). Third, a WhatsApp confirmation message after order placement (in the full-stack phase) with the order summary and tracking link."),

    p("The WhatsApp number is a single business number (+92 3XX XXXXXXX) configured for WhatsApp Business. The FAB uses the WhatsApp brand green only inside the icon (the surrounding button uses the brand gold); this respects both the WhatsApp brand guidelines and the Aura Living visual system. The FAB is hidden on the checkout page (to avoid distraction during the highest-stakes step) and reappears on the order confirmation page."),

    h2("12.5 Trust Signals"),

    p("Pakistani online shoppers are sceptical by default. New e-commerce brands must earn trust through visible signals throughout the customer journey. Aura Living places trust signals at three touchpoints. On the homepage, a row of trust badges below the hero (\"Cash on Delivery\", \"7-Day Returns\", \"Pakistani Owned\", \"Secure Checkout\"). On every PDP, a row of trust badges below the add-to-cart button (\"COD Available\", \"7-Day Returns\", \"WhatsApp Support\", \"[N] Happy Customers\"). On the checkout page, below the Place Order button (\"Pay When You Receive\", \"7-Day Easy Returns\", \"Questions? Message Us\")."),

    p("Beyond badges, trust is built through customer reviews (visible on every PDP, with the customer's city for local social proof), through transparent shipping and returns policies (linked from the footer and from every PDP), through visible contact information (WhatsApp number and email in the footer and on the contact page), and through a professional visual design that signals competence and permanence."),

    h2("12.6 Localised Content"),

    p("Content localisation goes beyond currency and units. Aura Living localises at four levels. First, currency: all prices in PKR, formatted via Intl.NumberFormat('ur-PK') as \"Rs 12,450\" (with the Rs symbol and the Pakistani thousands separator). Second, units: dimensions in centimetres (not inches), weight in kilograms, temperature in Celsius (for candle burn temperature references). Third, names and examples: customer personas, testimonials, and journal post examples use Pakistani names (Ayesha, Nida, Gohar, Bilal) and Pakistani cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad). Fourth, cultural references: journal posts reference Pakistani seasons (monsoon, winter, the pre-Eid spring), Pakistani homes (apartments with terraces, joint-family living rooms), and Pakistani design traditions (brass work, kilim, block print)."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 13: DEPLOYMENT & DEVOPS
// ════════════════════════════════════════════════════════════════
function chapter13() {
  return [
    h1("13. Deployment & DevOps"),

    p("Aura Living is deployed on Vercel, the company behind Next.js, with a deployment strategy that prioritises reliability, observability, and fast iteration. This chapter specifies the hosting, the CDN configuration, the environment management, the CI/CD pipeline, the analytics and monitoring stack, and the preview deployment workflow. The choices are deliberately conservative — Vercel is the path of least resistance for a Next.js 16 application, and the operational overhead of self-hosting or alternative platforms is not justified at Aura Living's scale."),

    h2("13.1 Hosting Strategy"),

    p("Vercel is the hosting platform. The production deployment runs on Vercel's Edge Network with global Points of Presence (POPs), though the primary audience is Pakistan and the relevant POPs are in Karachi (planned), Mumbai, Singapore, and Dubai. The application runs on Vercel's default Node.js runtime for most routes, with the Edge runtime used selectively for middleware (auth checks, locale routing) and for high-frequency lightweight routes (the cart count API, the search suggest API). ISR (Incremental Static Regeneration) is used for product pages with a 300-second revalidation window."),

    h2("13.2 CDN Configuration"),

    p("Vercel's CDN is configured with sensible defaults: static assets (JS, CSS, images, fonts) are cached at the edge with immutable, max-age=31536000 directives. ISR pages are cached at the edge until revalidation. The custom cache headers for dynamic routes are set in next.config.ts. A custom CDN header (X-Aura Living-Cache) is added to every response indicating the cache status (HIT, MISS, BYPASS) for debugging. A purge-on-deploy hook clears the edge cache for any route that has changed, ensuring new deploys are immediately visible."),

    h2("13.3 Environment Management"),

    p("Three deployment environments are maintained: Production (the live site at auraliving.pk), Staging (the internal testing site at staging.auraliving.pk, protected by basic auth), and Preview (automatic per-PR deployments at <branch>.aura-living.preview.vercel.com). Environment variables are managed in Vercel's dashboard, with separate values for Production, Staging, and Preview. Secrets (the future Supabase service key, payment gateway keys, analytics tokens) are marked as encrypted and are never exposed to the client. A lib/env.ts module validates the presence of all required environment variables at build time and fails the build if any are missing."),

    h2("13.4 CI/CD Pipeline"),

    p("The CI/CD pipeline runs on GitHub Actions (for code-level checks) and Vercel's built-in pipeline (for build and deploy). On every PR, GitHub Actions runs: TypeScript type check (tsc --noEmit), ESLint (including import-boundaries rules), Prettier format check, Jest unit tests, Playwright end-to-end tests on the preview deployment, axe-core accessibility scan, Lighthouse performance audit, and bundlesize budget check. If all checks pass, the PR is eligible for review. When the PR is merged to main, Vercel automatically deploys to Production; the deployment is gated on a manual approval step (Vercel's Promote feature) for the first 30 days after launch."),

    codeBlock(`# .github/workflows/ci.yml (excerpt)
name: CI
on: [pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run build
      - name: Bundle size check
        run: npx bundlesize
  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
        env:
          BASE_URL: \${{ secrets.VERCEL_PREVIEW_URL }}
  lighthouse:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            \${{ secrets.VERCEL_PREVIEW_URL }}
            \${{ secrets.VERCEL_PREVIEW_URL }}/shop
          budgetPath: ./lighthouse-budget.json`),

    h2("13.5 Analytics and Monitoring"),

    p("Two analytics systems run in parallel. Vercel Analytics provides Real User Monitoring (RUM) of Core Web Vitals, captured from real user sessions and reported at the 75th percentile. This is the source of truth for production performance. Plausible Analytics (self-hosted on a separate Vercel project, privacy-friendly, cookieless) provides product analytics: page views, conversion funnels, traffic sources, and custom events (add-to-cart, begin-checkout, purchase). Both systems are integrated via the lib/analytics.ts module, which initialises both in the root layout and exposes a single track() function for custom events."),

    p("Error monitoring is via Sentry (the free tier is sufficient at Aura Living's scale). Sentry captures both client-side errors (React render errors, unhandled promise rejections) and server-side errors (Next.js route handler exceptions, edge function failures). Errors are grouped, deduplicated, and routed to the engineering Slack channel via a webhook. Sentry's release tracking is integrated with Vercel so that regressions introduced by a specific deploy are automatically attributed."),

    h2("13.6 Preview Deployments"),

    p("Every PR automatically gets a preview deployment on Vercel at <branch>.aura-living.preview.vercel.com. Preview deployments are full-stack: they have their own database (a snapshot of staging for the frontend phase, a separate Supabase project in the full-stack phase) and their own environment variables. This allows designers, stakeholders, and QA to test a PR in isolation before merge. Preview deployments are linked in the PR description via Vercel's GitHub integration, and a Lighthouse audit is run against each preview on every push, with results posted as a PR comment."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 14: IMPLEMENTATION ROADMAP
// ════════════════════════════════════════════════════════════════
function chapter14() {
  return [
    h1("14. Implementation Roadmap"),

    p("The Aura Living frontend is built in five phases over approximately nine weeks. Each phase has a clear deliverable, a clear definition of done, and a clear exit criterion. The phases are sequenced to deliver the highest-risk work first (the design system and the core page architecture) and the highest-polish work last (the animations and the performance optimisations). The roadmap assumes one full-time frontend engineer and one part-time designer; the timeline can be compressed with more resources, but the phase sequence should not be reordered."),

    h2("14.1 Phase 1: Foundation (Weeks 1-2)"),

    p("Phase 1 establishes the technical foundation. The deliverables are: the Next.js 16 project scaffolded with TypeScript, Tailwind, ESLint, Prettier, and the folder structure from Chapter 4; the design tokens implemented in globals.css and tailwind.config.ts; the font loading via next/font; the root layout with providers (Zustand, future analytics, future theme); the basic routing structure (placeholder pages for all routes from Chapter 3); the CI/CD pipeline (GitHub Actions + Vercel) with all quality checks passing; and the first deployment to staging."),

    p("The exit criterion for Phase 1 is: the staging site loads the homepage placeholder with the correct fonts and colours, all routes return their placeholder pages without errors, the CI pipeline runs green on every PR, and a preview deployment is generated for every PR. Phase 1 is the foundation; skipping or rushing it compounds problems in every subsequent phase."),

    h2("14.2 Phase 2: Core Pages (Weeks 3-5)"),

    p("Phase 2 builds the core customer journey: homepage, PLP, PDP, cart, checkout, order confirmation. The deliverables are: the homepage with all six sections from Chapter 7.1 (using placeholder imagery); the PLP with filter bar, product grid, and product card; the PDP with gallery, info column, related products, and reviews; the cart drawer and cart page; the checkout flow with form, payment selector, and order summary; the order confirmation page; and the basic header, footer, mobile menu, and search overlay. All pages use placeholder data and have no animations beyond basic hover states."),

    p("The exit criterion for Phase 2 is: a user can complete the full purchase journey from homepage to order confirmation using placeholder data, all pages are responsive (mobile, tablet, desktop), all forms validate correctly, and the Lighthouse performance score is above 70 on the homepage and PDP. Animations and polish are explicitly out of scope for Phase 2."),

    h2("14.3 Phase 3: Polish and Animations (Weeks 6-7)"),

    p("Phase 3 adds the Aura Living signature polish: the GSAP, Framer Motion, and Lenis animations that distinguish the site. The deliverables are: the smooth scroll provider (Lenis); the parallax wrapper (GSAP ScrollTrigger); the reveal wrapper (Framer Motion); the homepage hero entrance animation; the homepage section reveals; the pinned featured collection section; the PDP gallery transitions; the cart drawer and mobile menu enter/exit animations; the magnetic button effect; the testimonial marquee; the 404 and order confirmation illustrations and animations; and the reduced-motion fallbacks for all of the above."),

    p("The exit criterion for Phase 3 is: the site feels premium and choreographed on desktop, all animations respect prefers-reduced-motion, no animation causes visible jank on a mid-range mobile device, and the Lighthouse performance score has not regressed from Phase 2."),

    h2("14.4 Phase 4: SEO and Performance (Week 8)"),

    p("Phase 4 is the optimisation phase: SEO implementation and performance tuning. The deliverables are: the metadata API integration on every page; the JSON-LD structured data (Product, BreadcrumbList, Organization, FAQPage, Article, WebSite); the dynamic sitemap; the robots.txt; the Open Graph and Twitter Card tags; the image optimisation pass (correct sizes, AVIF/WebP, lazy loading, explicit dimensions); the bundle size audit and code splitting of any oversized routes; the font loading verification; and the Lighthouse performance audit on every page hitting the targets in Chapter 10."),

    p("The exit criterion for Phase 4 is: Lighthouse performance score 90+ on all primary pages, all Core Web Vitals in the green, all structured data valid via the Rich Results Test, and the sitemap submitted to Google Search Console."),

    h2("14.5 Phase 5: Pre-Launch QA (Week 9)"),

    p("Phase 5 is the final pre-launch quality assurance phase. The deliverables are: cross-browser testing (Chrome, Safari, Firefox, Edge, Samsung Internet on Android, Safari on iOS); cross-device testing (iPhone SE, iPhone 14, Samsung Galaxy S22, iPad, MacBook, low-end Android); accessibility audit (axe-core, NVDA, VoiceOver); performance testing on simulated 4G; content review (all copy, all images, all links); legal review (privacy policy, terms of service); and the production deployment runbook. The site is deployed to production at the end of Week 9 with a soft launch (no marketing, monitoring for issues) before the official marketing launch in Week 10."),

    spacer(120),
    dataTable(
      ["Phase", "Weeks", "Focus", "Exit Criterion"],
      [
        ["1. Foundation", "1-2", "Stack, design tokens, CI/CD", "Staging live, CI green, all routes placeholder"],
        ["2. Core Pages", "3-5", "Homepage, PLP, PDP, cart, checkout", "Full journey works, Lighthouse 70+"],
        ["3. Animations", "6-7", "GSAP, Framer Motion, Lenis", "Premium feel, no jank, reduced-motion OK"],
        ["4. SEO + Perf", "8", "Metadata, JSON-LD, image opt, bundle", "Lighthouse 90+, CWV green, schema valid"],
        ["5. Pre-Launch", "9", "QA, cross-browser, accessibility", "All tests pass, soft launch to production"],
      ],
      [16, 10, 36, 38]
    ),
    caption("Table 14.1 — Aura Living frontend implementation roadmap"),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 15: RISK ANALYSIS & MITIGATIONS
// ════════════════════════════════════════════════════════════════
function chapter15() {
  return [
    h1("15. Risk Analysis & Mitigations"),

    p("Every project carries risk. Aura Living's frontend build carries three categories of risk: technical risks (things that might not work as expected), market risks (things that might make the site less effective than planned), and operational risks (things that might disrupt the build process). This chapter catalogues the most consequential risks in each category and specifies the mitigation. Risks are not problems to be solved now; they are scenarios to be prepared for."),

    h2("15.1 Technical Risks"),

    spacer(120),
    dataTable(
      ["Risk", "Likelihood", "Impact", "Mitigation"],
      [
        ["Next.js 16 PPR instability in production", "Low", "High", "PPR is stable since Oct 2025; fallback to non-PPR if needed"],
        ["Lenis conflicts with iOS Safari scroll", "Medium", "Medium", "Lenis disabled on touch devices; native scroll on mobile"],
        ["GSAP ScrollTrigger jank on low-end Android", "Medium", "High", "Animation budget enforced; reduced-motion fallback tested on Moto G4"],
        ["Image payload too large for 3G", "Medium", "High", "AVIF + responsive sizes + 800KB mobile budget enforced in CI"],
        ["Font FOUT causes layout shift", "Low", "Medium", "next/font with display:swap + tuned fallback metrics"],
        ["Bundle size creep over time", "High", "Medium", "bundlesize check in CI on every PR; quarterly audit"],
        ["Vercel outage in Pakistan region", "Low", "High", "Vercel fallback to Mumbai/Singapore POP; monitor via uptime checker"],
      ],
      [32, 12, 12, 44]
    ),
    caption("Table 15.1 — Technical risks and mitigations"),

    h2("15.2 Market Risks"),

    spacer(120),
    dataTable(
      ["Risk", "Likelihood", "Impact", "Mitigation"],
      [
        ["Customer adoption slower than projected", "Medium", "High", "Soft launch with WhatsApp-led audience before paid marketing"],
        ["COD return rate higher than 30%", "Medium", "High", "OTP phone verification; manual confirmation for first-time high-value orders"],
        ["Competitor (e.g., Daraz) launches premium tier", "Medium", "Medium", "Brand differentiation through editorial content + curated catalogue"],
        ["Rupee depreciation increases imported product cost", "High", "Medium", "Local sourcing priority; price-lock for 30-day windows"],
        ["Customer expectation of free shipping", "High", "Medium", "Free shipping over Rs 5,000; clear messaging throughout site"],
        ["WhatsApp spam from FAB exposure", "Medium", "Low", "Business WhatsApp with auto-responder; FAQ deflection"],
      ],
      [36, 12, 12, 40]
    ),
    caption("Table 15.2 — Market risks and mitigations"),

    h2("15.3 Operational Risks"),

    spacer(120),
    dataTable(
      ["Risk", "Likelihood", "Impact", "Mitigation"],
      [
        ["Single frontend engineer availability", "Medium", "High", "Comprehensive documentation; backup contractor identified"],
        ["Designer availability gaps", "Medium", "Medium", "Design system + Storybook enables dev-led implementation"],
        ["Scope creep (adding features mid-build)", "High", "High", "Roadmap frozen; new features deferred to v2"],
        ["Content (copy, images) delayed", "Medium", "High", "Placeholder content with the same dimensions from day 1"],
        ["Payment gateway integration delays (full-stack phase)", "Medium", "Medium", "COD-first means frontend launch is not blocked"],
        ["Domain / DNS / SSL issues at launch", "Low", "High", "Domain registered and DNS configured in Week 8; SSL verified"],
      ],
      [36, 12, 12, 40]
    ),
    caption("Table 15.3 — Operational risks and mitigations"),
  ];
}

// ════════════════════════════════════════════════════════════════
// APPENDICES
// ════════════════════════════════════════════════════════════════
function appendices() {
  return [
    h1("Appendix A: Design Token Reference (CSS)"),

    p("The complete CSS custom property definitions for the Aura Living design system. This file is the source of truth and is referenced by tailwind.config.ts to generate utility classes. These tokens should never be overridden in component code; new tokens are added here and surfaced through Tailwind."),

    codeBlock(`/* app/globals.css — Aura Living design tokens */
@import "tailwindcss";

@theme {
  /* ═══ Fonts ═══ */
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-body: var(--font-inter), system-ui, sans-serif;

  /* ═══ Colors — Gold family ═══ */
  --color-gold-100: #F5E6B8;
  --color-gold-300: #E8C766;
  --color-gold-500: #C9A84C;  /* Primary brand gold */
  --color-gold-600: #B08D3A;  /* Hover/active */
  --color-gold-700: #8A6B26;  /* Gold on light backgrounds */

  /* ═══ Colors — Black family ═══ */
  --color-ink-0: #FFFFFF;     /* Pure white */
  --color-ink-50: #FAF8F2;    /* Warm cream surface */
  --color-ink-100: #F0EBDC;   /* Mid warm border */
  --color-ink-400: #8A8275;   /* Muted text on dark */
  --color-ink-600: #5A5A5A;   /* Muted text on light */
  --color-ink-700: #2A2A2A;   /* Soft black for dark sections */
  --color-ink-900: #0A0A0A;   /* Deepest black for headings */
  --color-ink-950: #0E0E0E;   /* Rich black for dark backgrounds */

  /* ═══ Signal colors ═══ */
  --color-success: #2E7D5B;
  --color-warning: #B8860B;
  --color-error:   #B23A3A;

  /* ═══ Typography ═══ */
  --text-display: clamp(2.5rem, 5vw, 4.5rem);
  --text-h1: clamp(2rem, 4vw, 3rem);
  --text-h2: clamp(1.5rem, 3vw, 2.25rem);
  --text-h3: clamp(1.25rem, 2vw, 1.5rem);
  --text-h4: clamp(1.125rem, 1.5vw, 1.25rem);
  --text-body-lg: clamp(1.0625rem, 1vw, 1.125rem);
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.75rem;
  --text-overline: 0.6875rem;

  /* ═══ Spacing ═══ */
  --spacing-section: clamp(3rem, 8vw, 6rem);
  --spacing-page-x: clamp(1rem, 5vw, 4rem);

  /* ═══ Radius ═══ */
  --radius-sharp: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-pill: 9999px;

  /* ═══ Shadows (warm-tinted) ═══ */
  --shadow-sm: 0 1px 2px 0 rgba(10, 10, 10, 0.05);
  --shadow-md: 0 4px 12px -2px rgba(10, 10, 10, 0.08);
  --shadow-lg: 0 8px 24px -4px rgba(10, 10, 10, 0.12);

  /* ═══ Motion ═══ */
  --ease-aura-living: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 800ms;

  /* ═══ Layout ═══ */
  --container-page: 90rem;     /* 1440px */
  --container-narrow: 48rem;   /* 768px */
  --container-wide: 105rem;    /* 1680px */
}`),

    h1("Appendix B: Library Versions & Dependencies"),

    p("The pinned versions of every dependency in the Aura Living frontend. Versions are pinned to a minor version for predictability; patch updates are applied via Dependabot. Major version upgrades require a dedicated migration PR with full regression testing."),

    codeBlock(`{
  "dependencies": {
    "next": "16.0.0",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "gsap": "3.13.0",
    "@gsap/react": "2.1.2",
    "motion": "11.15.0",
    "lenis": "1.1.13",
    "zustand": "5.0.2",
    "react-hook-form": "7.54.0",
    "@hookform/resolvers": "3.9.1",
    "zod": "3.24.1",
    "lucide-react": "0.468.0",
    "clsx": "2.1.1",
    "tailwind-merge": "2.6.0",
    "class-variance-authority": "0.7.1"
  },
  "devDependencies": {
    "typescript": "5.7.2",
    "tailwindcss": "4.0.0",
    "@types/node": "22.10.0",
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "eslint": "9.17.0",
    "eslint-config-next": "16.0.0",
    "prettier": "3.4.2",
    "prettier-plugin-tailwindcss": "0.6.9",
    "@playwright/test": "1.49.0",
    "@axe-core/playwright": "4.10.1",
    "vitest": "2.1.8",
    "@testing-library/react": "16.1.0",
    "bundlesize": "0.18.2",
    "@lhci/cli": "0.14.0"
  }
}`),

    h1("Appendix C: Glossary"),

    p("Definitions of terms used throughout this document, ordered alphabetically. Familiarity with these terms is assumed in the page blueprints and architecture chapters."),

    spacer(120),
    dataTable(
      ["Term", "Definition"],
      [
        ["App Router", "Next.js 13+ routing system using nested layouts and Server Components; the only router in Next.js 16"],
        ["CLS", "Cumulative Layout Shift — a Core Web Vital measuring visual stability; lower is better"],
        ["COD", "Cash on Delivery — payment method where customer pays in cash when the order is delivered"],
        ["Core Web Vitals", "Google's user-experience metrics: LCP, INP, CLS; ranking signals since 2021"],
        ["CSR", "Client-Side Rendering — the browser renders the page from JavaScript; not used for primary routes in Aura Living"],
        ["FAB", "Floating Action Button — a persistent circular button, e.g., the WhatsApp FAB"],
        ["Framer Motion", "Now published as 'motion'; React animation library for component-level animations"],
        ["GSAP", "GreenSock Animation Platform; the industry-standard JavaScript animation library"],
        ["INP", "Interaction to Next Paint — a Core Web Vital measuring interaction responsiveness; ≤200ms passing"],
        ["ISR", "Incremental Static Regeneration; Next.js feature for rebuilding static pages on a schedule"],
        ["JSON-LD", "JavaScript Object Notation for Linked Data; the recommended format for schema.org structured data"],
        ["LCP", "Largest Contentful Paint — a Core Web Vital measuring loading performance; ≤2.5s passing"],
        ["Lenis", "A modern smooth-scroll library; the successor to @studio-freight/lenis"],
        ["MDX", "Markdown with JSX; used for the Aura Living Journal content"],
        ["PDP", "Product Detail Page — the page for a single product (e.g., /product/[slug])"],
        ["PLP", "Product Listing Page — a page listing multiple products (e.g., /shop, /shop/lamps)"],
        ["PPR", "Partial Prerendering — Next.js 16 feature combining static shell with dynamic content via Suspense"],
        ["RSC", "React Server Components — React components that render on the server and ship zero JS to the client"],
        ["Schema.org", "A vocabulary of structured data types that search engines understand (Product, Article, etc.)"],
        ["shadcn/ui", "A collection of accessible React components built on Radix UI and Tailwind"],
        ["TTFB", "Time to First Byte — the time from request to first byte of response; a perf metric"],
        ["WCAG 2.2", "Web Content Accessibility Guidelines version 2.2; Aura Living targets AA conformance"],
        ["Zustand", "A minimal React state management library; used for Aura Living's cart and UI stores"],
      ],
      [22, 78]
    ),
    caption("Appendix C — Glossary of terms"),
  ];
}

module.exports = { chapter12, chapter13, chapter14, chapter15, appendices };
