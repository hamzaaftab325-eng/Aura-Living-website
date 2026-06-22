import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { QueryProvider } from "@/components/providers/query-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { CartDrawer } from "@/components/cart/cart-drawer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0e0e0e",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "home decor Pakistan",
    "lamps Pakistan",
    "candles Pakistan",
    "indoor plants Pakistan",
    "brass lamps",
    "soy candles",
    "Aura Living",
    "Lahore",
    "Karachi",
    "Islamabad",
    "cash on delivery",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE.url,
    languages: {
      "en-PK": SITE.url,
      "ur-PK": `${SITE.url}/ur`,
    },
  },
  category: "shopping",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 14, Main Boulevard, Gulberg III",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    postalCode: "54660",
    addressCountry: "PK",
  },
  sameAs: [SITE.instagram, SITE.facebook],
  priceRange: "PKR 2,400 – PKR 42,500",
  paymentAccepted: "Cash on Delivery, JazzCash, Easypaisa, Visa, Mastercard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-PK"
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <QueryProvider>
          <SmoothScrollProvider>
            <a href="#main" className="skip-link">
              Skip to main content
            </a>
            <div className="app-shell">
              <AnnouncementBar />
              <Header />
              <main id="main" className="app-main">
                {children}
              </main>
              <Footer />
            </div>
            <CartDrawer />
            <WhatsAppFab />
          </SmoothScrollProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
