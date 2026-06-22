// Aura Living Plan — Content Part 4: Page-by-Page Blueprint (Chapter 7)
const H = require("./aurelia-plan.js");
const { h1, h2, h3, p, pr, bullet, bulletRich, spacer, divider, codeBlock, caption, dataTable, callout } = H;

function chapter7() {
  return [
    h1("7. Page-by-Page Blueprint"),

    p("This chapter is the heart of the document. Every frontend route in Aura Living is specified here in enough detail that a developer can implement it without further design input. For each page, the specification includes: the route and its purpose, the layout and key sections above the fold and below, the components used, the animations applied, the SEO metadata, the data dependencies (with a note on whether they are static, ISR, or dynamic), the performance budget, and any page-specific UX considerations. Pages are ordered by their importance to the customer journey, not alphabetically."),

    h2("7.1 Home Page (/)"),

    p("The homepage is the single most important page in Aura Living. It must communicate the brand promise in under five seconds, surface the three product categories within one scroll, and provide clear paths to shop, learn, and contact. The homepage is the only page where the design takes liberty with the standard grid; subsequent pages return to the disciplined grid system."),

    h3("7.1.1 Above the Fold"),

    p("The hero section is full-viewport-height (100svh on mobile, 100vh on desktop) with a full-bleed editorial image of a warmly lit interior featuring a lamp, a plant, and a candle. The image has a subtle multi-layer parallax (background -50, midground -25, foreground text 0) on scroll. The headline, set in Fraunces display weight, reads \"Light, life, and living beauty.\" and animates in with a character-stagger reveal (each word fades up with a 80ms stagger). A secondary line in Inter reads \"Premium lamps, plants, and candles — curated for the Pakistani home.\" Two call-to-action buttons sit below: a primary gold-filled \"Shop the Collection\" button (magnetic hover effect) and a secondary outline \"Explore Lookbook\" button. The page header is transparent at the top of the page and transitions to a solid dark background with a subtle shadow after 100 pixels of scroll."),

    h3("7.1.2 Below the Fold Sections"),

    p("The homepage contains six sections below the fold, each designed to be a complete visual unit that fits on a single mobile screen. First, the category tiles: three full-width stacked images on mobile (or three-column on desktop), each showing a representative product from lamps, plants, and candles, with a hover effect that zooms the image slightly and reveals the category name. Second, the featured collection: a pinned section where a curated collection's image stays fixed while product cards scroll past it (desktop only; mobile uses a horizontal swipe carousel). Third, the bestsellers grid: a four-column desktop / two-column mobile grid of the top eight products, with reveal-on-scroll stagger and a quick-add-to-cart button on hover."),

    p("Fourth, the editorial banner: a full-bleed image with overlay text introducing the current season's story (e.g., \"The Monsoon Edit\"), linking to the relevant collection. Fifth, the testimonials: a horizontal-scrolling strip of customer reviews with star ratings, names, and cities (\"Ayesha from Karachi\"), with a subtle infinite marquee on desktop and swipe-on-mobile. Sixth, the newsletter signup: a centered form with a single email input and a gold subscribe button, with copy framing it as joining the Aura Living community rather than a generic \"subscribe for updates.\""),

    h3("7.1.3 Animation and Performance"),

    p("The homepage hero animation runs once on mount (not on scroll) and takes 1200ms total. All below-the-fold sections use scroll-triggered reveals with 80ms staggers. The featured collection's pinned section is the most expensive animation on the page and is gated behind a 1024px min-width check (disabled on mobile, where it falls back to a static carousel). The homepage targets LCP under 2.0 seconds on 4G, INP under 150ms, and CLS under 0.05. The hero image is preloaded with fetchpriority=\"high\"."),

    h2("7.2 Shop / Product Listing Page (/shop, /shop/[category])"),

    p("The product listing page (PLP) is where customers browse the catalogue. It must balance two competing demands: showing as many products as possible per screen (high information density) and giving each product enough space to feel premium (low information density). Aura Living resolves this with a four-column desktop grid (16px gap) collapsing to two columns on mobile (8px gap), with each card showing the product image, name, price, and a quick-add-to-cart button that appears on hover (desktop) or always visible (mobile)."),

    h3("7.2.1 Filter and Sort Bar"),

    p("A sticky filter bar sits below the header on desktop (and inside a slide-up sheet on mobile), with filter chips for category, price range, material, and availability, plus a sort dropdown (featured, price low-to-high, price high-to-low, newest, best-selling). Filters update the product grid via URL search parameters (not client state), so filtered views are shareable and SEO-crawlable. The filter bar uses a sticky position with a subtle backdrop blur effect to maintain visual hierarchy as the user scrolls."),

    h3("7.2.2 Product Card Specification"),

    p("The product card is the most reused component in Aura Living. Its specification is therefore critical. The card has a fixed aspect-ratio image (4:5 portrait, the standard for fashion and decor photography), the product name in Fraunces h4, the price in Inter with the PKR currency formatted via Intl.NumberFormat('ur-PK'), and a quick-add button that appears as a gold-filled bar at the bottom of the card on hover (desktop) or as a small persistent button (mobile). Out-of-stock products show a muted \"Sold Out\" overlay and disable the add button. The card has a subtle border that becomes the brand gold on hover, and the image scales to 1.05x with a 400ms ease."),

    h3("7.2.3 Empty and Loading States"),

    p("When filters return no products, the page shows a centered empty state with a soft illustration (an empty shelf icon), the heading \"No products match your filters,\" and a button to clear all filters. When the page is loading (initial load or filter change), a skeleton grid of 8 to 12 cards with pulse-animated placeholders is shown. The skeleton has the exact dimensions of the real card to prevent layout shift."),

    h2("7.3 Product Detail Page (/product/[slug])"),

    p("The product detail page (PDP) is where the customer makes the purchase decision. It must answer every question the customer has about the product (What does it look like? What is it made of? How big is it? How do I care for it? What does it cost? When will it arrive?) without overwhelming them. Aura Living uses a two-column layout on desktop (gallery left, info right) collapsing to stacked sections on mobile."),

    h3("7.3.1 Gallery"),

    p("The gallery is a Client Component with five to eight images per product. On desktop, it is a vertical thumbnail strip on the left with a large main image on the right; clicking a thumbnail or scrolling the main image changes the active image. On mobile, it is a horizontal swipe carousel with dot pagination. The main image supports click-to-zoom (opening a full-screen modal with a pinch-zoomable image). The first image is the hero shot (product on a clean background); subsequent images show the product in a lifestyle context, detail shots (texture, base, switch), and a dimensions diagram."),

    h3("7.3.2 Product Information"),

    p("The information column contains, in order: the breadcrumb (Home > Lamps > Table Lamps > Product Name), the product name in Fraunces h1, the price in large Inter bold with the PKR formatting, a one-line subtitle (e.g., \"Hand-finished brass table lamp with linen shade\"), the rating summary (stars plus review count, linking to the reviews section), the variant selectors (if applicable: colour, size), the quantity selector and Add to Cart button (sticky on mobile), the trust badges row (Cash on Delivery available, 7-day returns, WhatsApp support), an accordion with tabs for Description, Materials & Care, Dimensions, and Shipping & Returns, and finally a WhatsApp enquiry button for customers with questions."),

    h3("7.3.3 Below the Fold"),

    p("Below the main two-column section, the PDP includes three more sections. First, the related products carousel (\"You may also like\") showing six products from the same category, horizontally scrollable. Second, the recently viewed products carousel (populated from the UI store's recently-viewed array). Third, the reviews section with a summary header (average rating, total count, distribution histogram) and a paginated list of individual reviews with the customer name, city, rating, date, and review text. Reviews are read-only in the frontend phase; submission is part of the full-stack phase."),

    h3("7.3.4 SEO and Structured Data"),

    p("The PDP is the most SEO-critical page in Aura Living. Each PDP includes a complete Product schema.org JSON-LD with name, image, description, sku, brand, aggregateRating, offers (with price, priceCurrency PKR, availability, and seller), and a BreadcrumbList. The page title follows the pattern \"[Product Name] — Aura Living | [Category]\". The meta description is the one-line subtitle. Open Graph and Twitter Card tags use the hero image. The page is statically generated via ISR with a 300-second revalidation window."),

    codeBlock(`// lib/seo.ts — Product JSON-LD builder
export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => absoluteUrl(i.url)),
    description: product.subtitle,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Aura Living" },
    aggregateRating: product.rating ? {
      "@type": "AggregateRating",
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
    } : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Aura Living" },
    },
  };
}`),

    h2("7.4 Cart Drawer and Cart Page"),

    p("Aura Living uses a hybrid cart pattern: a slide-in cart drawer for quick add-to-cart feedback (right side on desktop, full-screen sheet on mobile), and a full cart page at /cart for customers who want to review or edit their cart in detail. The drawer opens automatically when an item is added (via the cart store's addItem action setting drawerOpen: true), shows the line items with quantity steppers, and offers a \"Checkout\" button. The full cart page has the same line items plus an order summary with subtotal, shipping estimate, and total, plus a \"Continue Shopping\" link."),

    p("The empty cart state is intentionally delightful: a hand-drawn illustration of an empty Aura Living bag with the text \"Your cart is waiting to be filled with beautiful things\" and a prominent \"Start Shopping\" button. The empty state is shown both in the drawer (when all items are removed) and on the full cart page."),

    h2("7.5 Checkout Flow (/checkout)"),

    p("The checkout page is the highest-stakes page in Aura Living. Every choice here is optimised for conversion. Aura Living uses a single-page checkout (not a multi-step wizard) because Pakistani users on mobile abandon multi-step flows at higher rates, and because a single page lets the customer see the full commitment upfront. The page is laid out as a two-column desktop split (form left, order summary right with sticky positioning) collapsing to a stacked layout on mobile with the order summary collapsing into a disclosure at the top."),

    h3("7.5.1 Form Sections"),

    p("The checkout form has four visually-grouped sections, each clearly numbered. Section 1 is Contact: full name, phone number (with +92 prefix and OTP verification for COD orders), optional email. Section 2 is Shipping Address: address line 1, address line 2 (optional), city, province (dropdown of all Pakistani provinces and territories), postal code (5 digits). Section 3 is Delivery Method: standard (3-5 days, free over Rs 5,000), express (1-2 days, Rs 250), same-day (Karachi/Lahore/Islamabad only, Rs 500), with delivery instructions (optional, max 200 chars). Section 4 is Payment: Cash on Delivery (default, selected), JazzCash, Easypaisa, Card, Bank Transfer."),

    h3("7.5.2 Order Summary"),

    p("The order summary is a sticky sidebar on desktop (and a collapsible disclosure on mobile) showing line items with thumbnails and quantities, the subtotal, the shipping cost (calculated based on the selected delivery method), any discount code (with an input and apply button), and the total in large bold text. The Place Order button is a full-width gold-filled button at the bottom of the form, with the total amount displayed on the button itself (\"Place Order — Rs 12,450\")."),

    h3("7.5.3 Trust and Reassurance"),

    p("Below the Place Order button, three trust badges are displayed: a COD badge (\"Pay when you receive\"), a returns badge (\"7-day easy returns\"), and a WhatsApp badge (\"Questions? Message us\"). These badges directly address the top three concerns Pakistani shoppers have about online purchases."),

    h2("7.6 Account Authentication Pages"),

    p("Account authentication uses a minimal, focused layout. The login page (/login) and registration page (/register) are deliberately simple: a centered card on a warm cream background, with the Aura Living logo at the top, the form fields (email/phone and password for login; name, email/phone, password for register), the primary action button, and a link to the alternate auth page. There is no social login in the frontend phase; that is added in the full-stack phase along with OTP-based phone login."),

    p("The password field has a show/hide toggle and a real-time strength meter (only on registration). Form validation fires onBlur for each field and on submit for the whole form, with errors displayed inline below each field in the signal error colour. The forms are fully keyboard-accessible, with visible focus rings and a logical tab order."),

    h2("7.7 Account Dashboard (/account)"),

    p("The account dashboard is a protected route requiring authentication. It uses a two-column layout on desktop (sidebar nav left, content right) collapsing to a tab bar on mobile. The sidebar (or tab bar) contains: Overview, Orders, Addresses, Wishlist, Settings, and Sign Out. The Overview tab shows a greeting (\"Salam, [First Name]\"), a summary card with the order count and total spent, a recent orders list (last 3 with a link to view all), and a quick link to the wishlist."),

    p("The Orders tab shows a paginated list of past orders, each as a card with the order number, date, status badge (Processing, Shipped, Delivered, Cancelled), total, and a link to view order details. The Addresses tab shows saved addresses with the ability to add, edit, and delete (with a confirmation modal for delete). The Wishlist tab shows the saved products in a grid identical to the PLP. The Settings tab allows updating the name, email, phone, password, and communication preferences."),

    h2("7.8 Wishlist"),

    p("The wishlist is accessible both as a page (/account/wishlist for logged-in users) and as a drawer (for guests, with items persisted to localStorage). Adding to wishlist is via a heart icon on each product card and on the PDP. The wishlist drawer (similar in pattern to the cart drawer) shows wishlisted items with the option to move them to the cart or remove them. When a logged-in user adds to wishlist, the item is also synced to their account (in the full-stack phase)."),

    h2("7.9 Collections and Category Pages"),

    p("Collections are curated groupings of products (e.g., \"The Monsoon Edit\", \"Brass & Linen\", \"Under Rs 5,000\"). Categories are the three primary product categories (Lamps, Plants, Candles) and their subcategories. Both use the same underlying PLP component but with different page chrome. Collection pages have an editorial banner at the top with a hero image and a paragraph of curatorial copy explaining the collection's theme; category pages have a simpler header with the category name and a one-line description."),

    h2("7.10 Search Results (/search)"),

    p("The search page is reached either via the search overlay (opened from the header) or directly via URL with a q parameter. It uses the same product grid as the PLP, with a header showing the query and result count. If no results are found, the page shows the empty state with suggestions (popular searches, popular categories). The search overlay itself is a full-screen sheet that opens with a smooth fade and slide, with a large input at the top, real-time suggestions below (categories, products, journal posts), and a recent searches list (from localStorage)."),

    h2("7.11 Lookbook (/lookbook)"),

    p("The lookbook is Aura Living's editorial showcase — a grid of lifestyle photographs that link to curated product collections. The lookbook index page uses a masonry grid on desktop (alternating tall and short images) and a single-column stacked layout on mobile. Each image has a subtle hover effect (image dims, a \"Shop the Look\" button appears) and links to a lookbook detail page. The detail page presents a single editorial story with full-bleed imagery, paragraphs of curatorial copy, and embedded product cards that link to the PDP."),

    h2("7.12 Journal (/journal)"),

    p("The journal is Aura Living's blog, covering topics like home rituals, plant care, candle-making, and interior design. Posts are written in MDX, stored in /content/journal/, and rendered via a custom MDX renderer with Tailwind Typography styling. The journal index shows a paginated grid of post cards (image, title, excerpt, date, reading time). The post page has a hero image, the title in Fraunces h1, the metadata (author, date, reading time), the MDX content, and a related-posts section at the bottom."),

    h2("7.13 About Us (/about)"),

    p("The about page tells the Aura Living brand story in three acts: why we started (the gap in the Pakistani market for premium curated home decor), what we believe (the brand values, expressed as five short principles), and how we work (sourcing, craft, partnerships with Pakistani artisans). The page uses full-bleed editorial imagery, parallax banners, and large Fraunces headings to feel like a magazine feature. A call-to-action at the bottom invites the customer to explore the collection."),

    h2("7.14 Contact (/contact)"),

    p("The contact page has three sections: a contact form (name, email, subject, message) on the left, and contact information on the right (WhatsApp number with a click-to-chat button, email address, business hours, business address with an embedded Google Map). Below the fold, an FAQ accordion answers the most common contact questions to deflect repetitive enquiries. The form uses React Hook Form with Zod validation and submits to a future server action."),

    h2("7.15 FAQ (/faq)"),

    p("The FAQ page uses a single-column accordion layout with categories (Orders, Shipping, Returns, Payments, Products, Account). Each category is a heading, and the questions are accordion items that expand to reveal answers. The accordion uses Framer Motion's height animation for smooth open/close. A search box at the top of the page filters the FAQ items in real time. The page includes FAQPage schema.org JSON-LD for rich snippets in search results."),

    h2("7.16 Shipping and Returns (/shipping-returns)"),

    p("This page documents Aura Living's shipping and returns policies in plain language. It covers: delivery methods and timeframes (with a table of cities and standard/express/same-day availability), shipping costs (free over Rs 5,000, otherwise Rs 200 standard / Rs 450 express / Rs 700 same-day), the returns window (7 days from delivery), return eligibility (unused items in original packaging), the returns process (step-by-step), and refund processing time (5-7 business days for digital payments, instant for store credit)."),

    h2("7.17 Privacy Policy (/privacy)"),

    p("The privacy policy is a standard legal page covering: what information Aura Living collects (name, contact, address, order history, browsing data via cookies), how it is used (order fulfilment, communication, analytics, marketing with consent), how it is stored (encrypted, hosted on Vercel and Supabase), user rights (access, correction, deletion), cookie usage (essential, analytics, marketing with consent), and contact for privacy enquiries. The page is set in a narrow reading column for legibility."),

    h2("7.18 Terms of Service (/terms)"),

    p("The terms of service covers: acceptance of terms, account responsibilities, ordering and pricing, payment terms, shipping and delivery, returns and refunds, intellectual property, prohibited uses, limitation of liability, governing law (Pakistan), and changes to terms. Like the privacy policy, it is set in a narrow reading column."),

    h2("7.19 404 and Error Pages"),

    p("The 404 page is intentionally delightful. It features a hand-drawn illustration of a missing lamp (a lamp cord with no lamp), the headline \"This page has gone dark,\" a paragraph of friendly copy acknowledging the broken link, and two buttons: \"Back to Home\" and \"Shop the Collection\". The error boundary page (error.tsx) is similar in tone, with a slightly different illustration and copy acknowledging that something went wrong on our end, plus a retry button."),

    h2("7.20 Order Confirmation (/orders/[id]/confirmed)"),

    p("The order confirmation page is shown immediately after a successful checkout. It is a celebratory page with a large checkmark animation (SVG with a Framer Motion path-draw animation), the heading \"Thank you, [Name]!\", the order number prominently displayed, the order summary (items, totals), the delivery address and estimated delivery date, and two CTAs: \"Track Order\" (linking to the account orders page) and \"Continue Shopping\". The page also includes Order schema.org JSON-LD and triggers an analytics purchase event."),

    callout(
      "PAGE COUNT SUMMARY",
      "Aura Living has 25 distinct frontend routes: 1 homepage, 3 PLP variants (shop, category, subcategory), 1 PDP, 1 collection, 1 cart, 1 checkout, 1 order confirmation, 6 account pages, 1 login, 1 register, 2 lookbook (index + detail), 2 journal (index + detail), 4 marketing (about, contact, faq, shipping-returns), 2 legal (privacy, terms), 1 search, 1 404. Each route is fully specified above."
    ),
  ];
}

module.exports = { chapter7 };
