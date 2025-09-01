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

// Create the clerk middleware handler once
const clerkMiddlewareHandler = authMiddleware({ publicRoutes });

// Bypass auth for known crawlers to prevent accidental 401 responses
const BOT_UA_REGEX = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit|twitterbot/i;

export default function middleware(req: NextRequest, ev: any) {
    const ua = req.headers.get('user-agent') || '';

    if (BOT_UA_REGEX.test(ua)) {
        // Allow crawlers to pass through without auth
        return NextResponse.next();
    }

    // For regular requests, delegate to Clerk's auth middleware
    return clerkMiddlewareHandler(req, ev);
}

export const config = {
    // Protects all routes except those specified in publicRoutes
    // and Next.js internal routes like _next and API routes.
    // Do not run the auth middleware on API routes to allow public API endpoints like /api/email
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/"],
};
