import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
const inter = Inter({ subsets: ["latin"] });
import { dark } from "@clerk/themes";
import { siteConfig } from "@/site.config";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { getSiteSettingsAction } from "@/actions/site-settings.actions";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  icons: [
    {
      url: siteConfig?.logo?.url,
      href: siteConfig?.logo?.href,
    },
  ],
};

// Prepare JSON-LD structured data and OG meta defaults
const jsonLd = JSON.stringify(siteConfig.structuredData || {});

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}>
      <html className="scrollbar" lang="en" suppressHydrationWarning>
        <head>
          {/* JSON-LD structured data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
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
    </ClerkProvider>
  );
}
