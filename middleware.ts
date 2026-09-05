import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

// Force Node.js runtime — Edge Runtime crashes on Vercel with Clerk handshake
export const runtime = "nodejs";

// Public routes that should not require authentication
const isPublicRoute = createRouteMatcher([
    '/',
    '/about',
    '/projects(.*)',
    '/experience(.*)',
    '/education(.*)',
    '/certification(.*)',
    '/techstack(.*)',
    '/contact',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/email',
    '/api/track-visit',
    '/api/ai-chat',
    '/sitemap.xml',
    '/robots.txt',
]);

const clerkFn = clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
    try {
        return await clerkFn(req, event);
    } catch {
        // Stale session cookie (rotated keys) — let public routes through, redirect protected to sign-in
        if (isPublicRoute(req)) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};

