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
