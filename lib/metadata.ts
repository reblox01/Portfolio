import { Metadata } from "next";
import { getPageSeoByPathAction } from "@/actions/page-seo.actions";
import { siteConfig } from "@/site.config";

type MetadataParams = {
    path: string;
    defaultTitle?: string;
    defaultDescription?: string;
    defaultKeywords?: string;
};

export async function constructMetadata({
    path,
    defaultTitle,
    defaultDescription,
    defaultKeywords,
}: MetadataParams): Promise<Metadata> {
    // Fetch page-specific SEO from database
    const { page } = await getPageSeoByPathAction(path);

    // Merge with defaults
    const title = page?.title || defaultTitle || siteConfig.name;
    const description = page?.description || defaultDescription || siteConfig.description;
    const keywords = page?.keywords || defaultKeywords || siteConfig.meta.keywords;
    // Force index in production unless absolutely necessary
    const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
    const noIndex = isProduction ? false : (page?.noIndex || false);

    // Build full URL for OG tags
    const siteUrl = (
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        siteConfig.structuredData?.url ||
        siteConfig.meta?.["og:url"] ||
        ""
    ).replace(/\/$/, "");

    const fullUrl = `${siteUrl}${path}`;
    const ogImage = siteConfig.meta["og:image"]?.startsWith("/")
        ? `${siteUrl}${siteConfig.meta["og:image"]}`
        : siteConfig.meta["og:image"];

    // If we're on the home page or the title exactly matches the site name,
    // we want to use an absolute title to avoid duplication from the root layout template
    const isHomePage = path === "/";
    const isSiteNameOnly = title === siteConfig.name;

    const titleObj = (isHomePage && isSiteNameOnly) || title === siteConfig.name
        ? { absolute: siteConfig.name }
        : title;

    return {
        title: titleObj,
        description,
        keywords,
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title,
            description,
            url: fullUrl,
            images: ogImage ? [ogImage] : undefined,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
        alternates: {
            canonical: fullUrl,
        },
    };
}
