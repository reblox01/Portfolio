import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Public routes that should not require authentication
const isPublicRoute = createRouteMatcher([
    '/',
    "/about",
    "/projects(.*)",
    "/experience(.*)",
    "/education(.*)",
    "/certification(.*)",
    "/techstack(.*)",
    "/contact",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/email",
    "/api/track-visit", // Analytics tracking must be public
    "/sitemap.xml",
    "/robots.txt",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
    if (isPublicRoute(req)) {
        const response = NextResponse.next();
        // SEO: Explicitly allow indexing for all public routes.
        // This must apply to crawlers (Googlebot) too — the previous early-return
        // for crawlers bypassed this header, causing X-Robots-Tag: noindex to
        // reach Google from upstream/Next.js metadata processing.
        response.headers.set('X-Robots-Tag', 'index, follow');
        return response;
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
