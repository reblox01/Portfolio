import { authMiddleware } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";

// Public routes that should not require authentication
const publicRoutes = [
    '/',
    "/about",
    "/projects",
    "/projects/(.*)",
    "/experience",
    "/experience/(.*)",
    "/certification",
    "/certification/(.*)",
    "/techstack",
    "/contact",
    "/api/email",
    "/techstack/(.*)",
    "/sitemap.xml",
    "/robots.txt",
];

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

// Create the clerk middleware handler once with comprehensive public routes
const clerkMiddlewareHandler = authMiddleware({
    publicRoutes: [
        '/',
        "/about",
        "/projects",
        "/projects/(.*)",
        "/experience", 
        "/experience/(.*)",
        "/certification",
        "/certification/(.*)",
        "/techstack",
        "/techstack/(.*)",
        "/contact",
        "/api/email",
        "/sitemap.xml",
        "/robots.txt",
        "/(api|trpc)(.*)", // Allow all API routes
    ],
    // Ignore authentication for these paths completely
    ignoredRoutes: [
        "/sitemap.xml",
        "/robots.txt",
        "/favicon.ico",
        "/_next/(.*)",
        "/api/(.*)"
    ]
});

export default function middleware(req: NextRequest, ev: any) {
    const ua = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    
    // Allow all crawlers to pass through without authentication
    if (isCrawler(ua, ip)) {
        console.log(`Crawler detected: ${ua.substring(0, 100)}`);
        return NextResponse.next();
    }

    // For regular users, use Clerk's auth middleware
    return clerkMiddlewareHandler(req, ev);
}

export const config = {
    // Protects all routes except those specified in publicRoutes
    // and Next.js internal routes like _next and API routes.
    // Do not run the auth middleware on API routes to allow public API endpoints like /api/email
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/"],
};
