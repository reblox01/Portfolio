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

// Known SEO audit / crawler bots that should access public pages without
// being caught by Clerk's auth handshake. These bots only ever hit public
// routes, so bypassing Clerk here has no security impact.
const SEO_BOT_PATTERN = /Sitechecker|AhrefsBot|SemrushBot|DotBot|MJ12bot|bingbot|BingPreview|Screaming\s?Frog/i;

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const ua = req.headers.get('user-agent') || '';
    const isSeoBot = SEO_BOT_PATTERN.test(ua);

    if (isPublicRoute(req) || isSeoBot) {
        const response = NextResponse.next();
        // SEO: Explicitly allow indexing for all public routes and known crawlers.
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
