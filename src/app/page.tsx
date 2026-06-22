import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { StorySection } from "@/components/home/story-section";
import { CollectionShowcase } from "@/components/home/collection-showcase";
import { EidBanner } from "@/components/home/eid-banner";
import { BestsellersSection } from "@/components/home/bestsellers-section";
import { BrandPromise } from "@/components/home/brand-promise";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { NewsletterCta } from "@/components/home/newsletter-cta";

/**
 * Home Page — Aura Living storefront.
 *
 * Section order is editorially deliberate:
 *   1. Hero (cinematic first impression, sets the brand voice)
 *   2. TrustBar (operational reassurance: COD, free shipping, returns)
 *   3. CategoryShowcase (the three disciplines: lamps, plants, candles)
 *   4. FeaturedProducts (curated catalogue — first "shop now" opportunity)
 *   5. StorySection (craft narrative — slows the scroll, builds desire)
 *   6. EidBanner (seasonal promo — leverages Eid buying cycle in Pakistan)
 *   7. BestsellersSection (social proof via sales data)
 *   8. CollectionShowcase (curated edits — moments, not products)
 *   9. BrandPromise (editorial pull-quote — emotional anchor)
 *  10. Testimonials (social proof via customer voices)
 *  11. InstagramFeed (community proof + Instagram traffic)
 *  12. NewsletterCta (email capture with 10% incentive)
 *
 * Total weight target: < 130KB First Load JS (per architecture plan Ch.10).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryShowcase />
      <FeaturedProducts />
      <StorySection
        eyebrow="Our Craft"
        title="Made by hand, in small batches."
        body="Every Aura Living piece starts in a workshop — not a factory. Our brass lamps are spun by master craftsmen in Multan whose families have worked the metal for four generations. Our candles are hand-poured in Lahore in batches of fifty. Our plants are potted in Hala terracotta thrown on wheels older than Pakistan itself. We pay fair wages, we work at human pace, and we sign every piece with the quiet pride of its maker."
        imageSrc="https://images.unsplash.com/photo-1565193298357-c5b46b0ff68a?auto=format&fit=crop&w=1200&q=80"
        imageAlt="A craftsman hand-finishing a brass lamp in a workshop"
      />
      <EidBanner />
      <BestsellersSection />
      <CollectionShowcase />
      <BrandPromise />
      <StorySection
        eyebrow="Our Promise"
        title="From our home to yours — with care."
        body="We pack every order as if it were a gift — because it is. Recycled paper, hand-tied jute, a handwritten note on request. We ship within 24 hours from Lahore and deliver to every district in Pakistan within 2–5 business days. Cash on Delivery is available everywhere, no questions asked. If a piece doesn't sing to you when you open the box, send it back within 7 days for a full refund. That's our promise."
        imageSrc="https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1200&q=80"
        imageAlt="A beautifully packaged Aura Living order with handwritten note"
        reverse
      />
      <Testimonials />
      <InstagramFeed />
      <NewsletterCta />
    </>
  );
}
