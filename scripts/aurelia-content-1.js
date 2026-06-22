// AURELIA Plan — Content Part 1: Executive Summary + Market Context
const H = require("./aurelia-plan.js");
const { h1, h2, h3, p, pr, bullet, bulletRich, spacer, divider, codeBlock, caption, dataTable, callout } = H;

// ════════════════════════════════════════════════════════════════
// CHAPTER 1: EXECUTIVE SUMMARY
// ════════════════════════════════════════════════════════════════
function chapter1() {
  return [
    h1("1. Executive Summary"),

    p("AURELIA is a premium home-decor e-commerce storefront designed for the Pakistani market, specialising in three carefully curated product categories: artisanal lamps, living plants, and hand-poured candles. This document is the complete frontend architecture plan for AURELIA, covering every page, every component, every design token, every animation, every performance budget, and every deployment consideration required to build a production-grade storefront that competes with international luxury e-commerce brands while remaining deeply relevant to Pakistani consumers."),

    p("The plan is anchored in 2026 web standards. Next.js 16 with the App Router provides the rendering foundation, leveraging stable Partial Prerendering to deliver sub-second page loads on Pakistan's predominantly 3G and 4G mobile networks. TypeScript enforces type safety across the entire codebase. Tailwind CSS, combined with a strict design-token layer, ensures visual consistency without a single inline style. Three animation libraries work in concert: GSAP drives scroll-triggered and timeline-based motion, Framer Motion (Motion) handles component-level enter and exit transitions, and Lenis provides buttery-smooth scrolling across desktop and mobile. The visual identity is built on a refined gold and black palette with warm-white backgrounds, evoking the warmth of candlelight and the elegance of brass."),

    h2("1.1 Project Vision"),

    p("The vision for AURELIA is to become Pakistan's most loved online destination for thoughtfully designed home accents. The Pakistani home-decor market is dominated either by informal furniture markets that lack digital presence or by international marketplaces that lack curation and local trust. AURELIA occupies the whitespace between these two extremes: a single-brand, curated, premium digital storefront that delivers a world-class shopping experience tuned for local payment habits, mobile-first browsing, and culturally resonant merchandising."),

    p("Every interaction in AURELIA is designed to communicate two feelings: warmth and craft. Warmth comes from the gold and cream palette, from generous spacing, from soft motion that feels like turning pages of a beautifully printed magazine. Craft comes from the precision of the typography, the discipline of the grid, the tactility of the hover states, and the rigour of the performance budget. Together, these feelings transform what could be a transactional product page into a moment of pause and appreciation — the same feeling a customer has when lighting a well-made candle in a quiet room."),

    h2("1.2 Brand Identity — AURELIA"),

    p("The name AURELIA is derived from the Latin aureus, meaning golden. It carries connotations of warmth, radiance, and enduring value — qualities that map directly to the three product categories. A lamp is golden light. A plant is golden life. A candle is golden warmth. The brand name itself encodes the colour strategy and the emotional promise of the products."),

    p("The AURELIA brand voice is unhurried, confident, and sensory. Product copy describes the weight of a brass base, the warm tone of a 2700K bulb, the slow burn of a soy-wax candle. Marketing copy speaks to the rituals of home — the first coffee of the morning under a pendant lamp, the slow evening unwind by candlelight, the Sunday repotting of a monstera. The voice deliberately avoids the hyperbolic urgency common in Pakistani e-commerce (\"Limited time! Buy now!\") in favour of a quieter, more durable persuasion."),

    pr([
      { text: "Brand promise: ", bold: true, color: H.P.body.accent },
      "\"Light, life, and living beauty — for the home you are becoming.\""
    ]),

    h2("1.3 Document Scope"),

    p("This document covers the frontend of AURELIA end-to-end. The full-stack implementation (Supabase as the database and auth provider, Next.js Server Actions and Route Handlers as the backend) will be addressed in a separate architecture document once the frontend foundation is in place. The decision to ship the frontend plan first is deliberate: a premium e-commerce brand lives or dies by its frontend experience, and locking the design system, page architecture, and motion language before backend work begins prevents costly rework."),

    p("Specifically, this document covers: the technical stack and its rationale; the production-grade folder structure; the complete design system (colour, typography, spacing, motion); the animation strategy across GSAP, Framer Motion, and Lenis; a page-by-page blueprint for all twenty frontend routes; a component inventory covering primitives, composites, and page sections; the SEO strategy with 2026 Schema.org patterns; the performance strategy with Core Web Vitals targets; the accessibility strategy targeting WCAG 2.2 AA; Pakistani-specific UX patterns including cash-on-delivery-first checkout and WhatsApp integration; the deployment and DevOps strategy; and a phased implementation roadmap."),

    h2("1.4 Key Decisions Summary"),

    p("The following table summarises the most consequential architectural decisions made in this plan. Each decision is examined in detail in the relevant chapter, but capturing them here provides a single-glance overview for stakeholders who need to validate the direction before reading the full document."),

    spacer(120),
    dataTable(
      ["Decision", "Choice", "Rationale"],
      [
        ["Framework", "Next.js 16 (App Router)", "Stable PPR, RSC by default, best SEO, Turbopack dev speed"],
        ["Language", "TypeScript (strict)", "Type safety across shared schemas, fewer runtime errors"],
        ["Styling", "Tailwind CSS + design tokens", "Zero inline styles, consistent spacing, fast iteration"],
        ["Animation", "GSAP + Framer Motion + Lenis", "Best-in-class for scroll, component, and smooth-scroll UX"],
        ["State", "Zustand (cart, UI) + React Hook Form", "Minimal boilerplate, persist middleware for cart"],
        ["Forms", "React Hook Form + Zod", "Shared client/server validation schemas"],
        ["Icons", "Lucide React", "Tree-shakeable, consistent line weight, MIT licensed"],
        ["Fonts", "Fraunces (display) + Inter (body) via next/font", "Premium serif + neutral sans, zero CLS"],
        ["Images", "next/image + AVIF + WebP fallback", "Smallest payloads, lazy by default, no CLS"],
        ["Deployment", "Vercel (with Edge runtime)", "Native Next.js support, global edge CDN, preview deploys"],
        ["Analytics", "Vercel Analytics + Plausible", "RUM + privacy-friendly product analytics"],
        ["Currency", "PKR via Intl.NumberFormat('ur-PK')", "Locally formatted prices, no third-party lib"],
        ["Payments UX", "COD default + JazzCash, Easypaisa, Cards, Bank", "Matches Pakistani consumer behaviour (80%+ COD)"],
        ["Mobile strategy", "Mobile-first, scales up to desktop", "Pakistan is ~80% mobile traffic"],
        ["Accessibility", "WCAG 2.2 AA", "Legal compliance pressure by April 2026"],
      ],
      [22, 28, 50]
    ),
    caption("Table 1.1 — Key architectural decisions at a glance"),

    h2("1.5 Reading Guide"),

    p("This document is structured to be read either linearly by a developer implementing the build, or non-linearly by a stakeholder reviewing specific concerns. Chapter 2 establishes the market context and brand positioning. Chapters 3 and 4 define the technical architecture and folder structure. Chapter 5 specifies the complete design system. Chapter 6 details the animation strategy. Chapter 7 is the largest chapter and contains the page-by-page blueprint for every frontend route. Chapters 8 through 13 cover the cross-cutting concerns of components, SEO, performance, accessibility, Pakistani UX patterns, and deployment. Chapter 14 provides the implementation roadmap. Chapter 15 catalogues risks and mitigations. Appendices contain the full design-token reference, the dependency manifest, and a glossary of terms."),
  ];
}

// ════════════════════════════════════════════════════════════════
// CHAPTER 2: MARKET CONTEXT & STRATEGIC FOUNDATION
// ════════════════════════════════════════════════════════════════
function chapter2() {
  return [
    h1("2. Market Context & Strategic Foundation"),

    p("Before specifying any technical or design decision, it is essential to ground the plan in the realities of the Pakistani e-commerce market and the specific opportunity within home decor. A technically excellent site that ignores market context will fail; a market-aware site built on a solid technical foundation will compound its advantages. This chapter establishes that foundation."),

    h2("2.1 Pakistani E-Commerce Landscape in 2026"),

    p("Pakistani e-commerce has matured significantly since 2020. Internet penetration crossed the 50 percent mark in 2024, driven almost entirely by affordable mobile data and sub-Rs-30,000 smartphones. The State Bank of Pakistan's Raast instant payment system has reduced friction for digital transactions, though adoption among end consumers remains uneven. The major players — Daraz, Naheed, Gul Ahmed, Khaadi, Junaid Jamshed, and a long tail of Instagram and WhatsApp-based sellers — collectively process billions of rupees in annual gross merchandise value, but the market is still fragmented and trust-deficient."),

    p("Three structural realities shape every product decision in AURELIA. First, mobile traffic dominates: across Pakistani e-commerce sites, between 75 and 85 percent of sessions originate from a mobile device, and a meaningful share of those sessions occur on 3G or entry-level 4G connections with high latency and intermittent coverage. Second, cash on delivery remains the default payment method for the vast majority of online orders, accounting for 70 to 85 percent of completed purchases depending on category and price point. Third, WhatsApp is the de facto customer-support channel — Pakistani consumers expect to be able to message a brand on WhatsApp with questions about an order, and brands that hide behind contact forms lose conversions."),

    p("These three realities translate directly into architecture decisions: a mobile-first responsive strategy with aggressive image optimisation; a checkout flow that defaults to cash on delivery with OTP-verified phone numbers to mitigate fraud; and a persistent WhatsApp floating action button on every page that opens a pre-filled chat with the support team."),

    h2("2.2 Home Decor Market Opportunity"),

    p("The Pakistani home-decor market is large, growing, and chronically underserved digitally. Traditional channels — physical home stores in major cities (Karachi, Lahore, Islamabad), weekly bazaars, and informal Instagram sellers — dominate the category. The few players with significant digital presence tend to be either broad marketplaces (Daraz, which treats home decor as one of dozens of categories) or single-product Instagram sellers with no real e-commerce infrastructure. There is no dominant Pakistani brand that owns the premium curated home-decor niche online."),

    p("Within home decor, AURELIA has deliberately chosen three product categories that share a customer mindset but avoid the operational complexity of large furniture. Lamps, plants, and candles are small enough to ship via standard courier, light enough to keep shipping costs reasonable, and aesthetic enough to merit the editorial treatment that justifies premium pricing. They also share a sensory language — light, life, warmth — that unifies the brand storytelling across categories. The explicit exclusion of furniture, bedsheets, and large textiles is a strategic choice to keep the catalogue focused, the logistics simple, and the brand voice coherent."),

    h2("2.3 Target Customer Personas"),

    p("AURELIA is designed for two primary personas and one secondary persona. Understanding these personas in concrete detail shapes everything from the photography art direction to the copy tone to the speed of the checkout flow."),

    h3("Primary Persona 1 — Aspiring Ayesha"),

    p("Ayesha is 28, works in marketing at a multinational in Karachi, earns Rs 200,000 to 400,000 per month, and recently moved into her first owned apartment. She furnishes her home incrementally — a lamp here, a plant there, a candle for the bathroom — and treats each purchase as a small act of self-expression. She discovers products on Instagram and Pinterest, validates them via WhatsApp conversations with friends, and expects the brand's website to feel as polished as the international stores she browses (COS, Hay, Muji). She will pay a 30 to 50 percent premium over Daraz for a lamp if the brand story, photography, and unboxing experience justify it. She pays via JazzCash or card, rarely COD."),

    h3("Primary Persona 2 — Newlywed Nida"),

    p("Nida is 30, recently married, lives in Lahore with her husband in a jointly-funded home, and is in the process of setting up the household. She has a budget of Rs 50,000 to 150,000 for decor spread over six months. She shops on her phone during commutes and late evenings, prefers cash on delivery because she wants to inspect products before committing, and is highly sensitive to delivery timelines (she will abandon a cart if delivery exceeds five days). She relies heavily on WhatsApp to ask product questions before ordering. She values reviews from other Pakistani women more than any other signal."),

    h3("Secondary Persona — Gifting Gohar"),

    p("Gohar is 35, male, works in tech in Islamabad, and frequently buys gifts for family and corporate contacts. He values speed, gift-wrapping options, and the ability to ship to a different address with a handwritten note. He pays by card, expects delivery within 48 hours in major cities, and is willing to pay a premium for a premium gifting experience. He is a secondary persona because the volume of gifting orders is meaningful but not the core revenue driver."),

    h2("2.4 Competitive Landscape"),

    p("AURELIA's competitive set is best understood as three concentric rings. The inner ring is direct Pakistani competitors in the home-decor category: Instagram-led sellers with thin web presence (low threat, high friction for customers), a handful of mid-tier e-commerce sites (medium threat, weak branding), and broad marketplaces (high threat on price, low threat on curation). The middle ring is international home-decor brands with Pakistani awareness: West Elm, Hay, Muji, IKEA (none ship to Pakistan officially, but their visual language sets the bar AURELIA must clear). The outer ring is luxury Pakistani retailers in adjacent categories: Khaadi Home, Elements (medium threat, strong brand, but broader assortment)."),

    p("AURELIA's defensible position is the intersection of three capabilities that no current competitor combines: a single-category-focused curated catalogue (depth over breadth), a premium editorial design language that meets or exceeds international standards, and a payment and logistics experience tuned for Pakistani realities. The plan that follows is engineered to deliver all three."),

    h2("2.5 Brand Positioning Statement"),

    callout(
      "POSITIONING",
      "For Pakistani women and men aged 25 to 40 who are intentionally building a home that reflects their taste and aspirations, AURELIA is the premium online destination for curated lamps, plants, and candles. Unlike Daraz (broad, price-led, uncurated) or Instagram sellers (informal, inconsistent, untrustworthy), AURELIA delivers a world-class digital shopping experience with locally-tuned payment and delivery, backed by a clear brand point of view on what makes a home beautiful."
    ),

    spacer(160),
    p("This positioning is not marketing copy; it is an architectural constraint. Every page, every component, every animation in this plan must serve this positioning. A homepage carousel that feels like Daraz violates the positioning. A product page that hides the brand story violates the positioning. A checkout that pushes card payment above cash-on-delivery violates the positioning. The positioning is the north star; the rest of this document is the navigation."),
  ];
}

module.exports = { chapter1, chapter2 };
