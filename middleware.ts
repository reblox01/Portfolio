import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Public routes that should not require authentication
const isPublicRoute = createRouteMatcher([
    '/',
    "/about",
    "/projects(.*)",
    "/experience(.*)",
    "/certification(.*)",
    "/techstack(.*)",
    "/contact",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/email",
    "/sitemap.xml",
    "/robots.txt",
    "/api/(.*)"
]);

// Comprehensive bot detection for search engines and social crawlers
const BOT_UA_REGEX = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit|twitterbot|whatsapp|telegram|skype|linkedinbot|pinterest|crawler|spider|bot\/|robot/i;

// Check if request is from a search engine or crawler
function isCrawler(userAgent: string, ip?: string): boolean {
    // Check user agent
    if (BOT_UA_REGEX.test(userAgent)) {
        return true;
    }

    // Check for common crawler patterns in user agent
    const crawlerPatterns = [
        'google',
        'bing',
        'yahoo',
        'duck',
        'search',
        'crawler',
        'spider',
        'bot',
        'indexer'
    ];

    const ua = userAgent.toLowerCase();
    return crawlerPatterns.some(pattern => ua.includes(pattern));
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const ua = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';

    // Allow all crawlers to pass through without authentication
    if (isCrawler(ua, typeof ip === 'string' ? ip : '')) {
        return NextResponse.next();
    }

    if (isPublicRoute(req)) {
        return NextResponse.next();
    }

    await auth.protect();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
