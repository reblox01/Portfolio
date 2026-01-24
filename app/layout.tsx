import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
const inter = Inter({ subsets: ["latin"] });
import { siteConfig } from "@/site.config";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { getSiteSettingsAction } from "@/actions/site-settings.actions";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/favicon.svg',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
  ],
};

// Prepare JSON-LD structured data and OG meta defaults
const jsonLd = JSON.stringify(siteConfig.structuredData || {});

// Build site URL and enhanced JSON-LD for navigation and sitelinks
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteConfig.structuredData?.url || siteConfig.meta?.["og:url"] || "").replace(/\/$/, "")

// Enhanced navigation structure for Google sitelinks
const navigationItems = [
  { name: "About", url: `${SITE_URL}/about`, description: "Learn more about my background and skills" },
  { name: "Projects", url: `${SITE_URL}/projects`, description: "View my portfolio and recent work" },
  { name: "Experience", url: `${SITE_URL}/experience`, description: "Professional experience and career history" },
  { name: "Certifications", url: `${SITE_URL}/certification`, description: "Professional certifications and achievements" },
  { name: "Contact", url: `${SITE_URL}/contact`, description: "Get in touch for opportunities" },
  { name: "Tech Stack", url: `${SITE_URL}/techstack`, description: "Technologies and tools I use" }
]

// Navigation structured data for better sitelinks
const navJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Site Navigation",
  "numberOfItems": navigationItems.length,
  "itemListElement": navigationItems.map((item, index) => ({
    "@type": "SiteNavigationElement",
    "position": index + 1,
    "name": item.name,
    "description": item.description,
    "url": item.url
  }))
})

const websiteJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": SITE_URL || siteConfig.structuredData?.url || siteConfig.meta?.["og:url"] || "",
  "name": siteConfig.name,
  "alternateName": `${siteConfig.name} - Portfolio`,
  "description": siteConfig.description,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SITE_URL || ""}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
})

// Organization structured data for better professional context
const organizationJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": siteConfig.name,
  "url": SITE_URL,
  "logo": `${SITE_URL}${siteConfig.favicon.dark}`,
  "description": siteConfig.description,
  "serviceType": ["Web Development", "Full Stack Development", "Software Engineering"],
  "areaServed": "Global",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MA" // Morocco
  }
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize query client for site settings
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["siteSettings"],
    queryFn: () => getSiteSettingsAction(),
  });

  return (
    <>
      <html className="scrollbar" lang="en" suppressHydrationWarning>
        <head>
          {/* JSON-LD structured data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
          {/* Enhanced site navigation for better sitelinks */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: navJsonLd }} />
          {/* Website and search structured data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
          {/* Professional service organization data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJsonLd }} />
          {/* Open Graph / Twitter meta (defaults from siteConfig.meta) */}
          {/* Use process.env.SITE_URL at runtime when available to build full URLs */}
          {(() => {
            const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteConfig.structuredData?.url || siteConfig.meta["og:url"] || "").replace(/\/$/, "")
            const ogImage = siteConfig.meta["og:image"]?.startsWith("/") ? `${siteUrl}${siteConfig.meta["og:image"]}` : siteConfig.meta["og:image"]
            const ogUrl = siteUrl || siteConfig.meta["og:url"] || ""
            return (
              <>
                <meta property="og:title" content={siteConfig.meta["og:title"]} />
                <meta property="og:description" content={siteConfig.meta["og:description"]} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:url" content={ogUrl} />
                <meta name="twitter:card" content={siteConfig.meta["twitter:card"]} />
                <meta name="twitter:title" content={siteConfig.meta["twitter:title"]} />
                <meta name="twitter:description" content={siteConfig.meta["twitter:description"]} />
                <meta name="twitter:image" content={ogImage} />
                <link rel="canonical" href={ogUrl} />
              </>
            )
          })()}
        </head>
        <body className={inter.className}>
          <Providers>
            <HydrationBoundary state={dehydrate(queryClient)}>
              {children}
              <SmoothCursor />
            </HydrationBoundary>
          </Providers>
        </body>
      </html>
    </>
  );
}
