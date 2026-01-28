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

// Comprehensive bot detection for search engines, AI crawlers, and social platforms
const BOT_UA_REGEX = /googlebot|google-inspectiontool|storebot-google|googleother|google-extended|bingbot|bingpreview|msnbot|slurp|duckduckbot|baiduspider|yandex|yandexbot|sogou|exabot|facebot|facebookexternalhit|ia_archiver|twitterbot|whatsapp|telegram|skype|linkedinbot|pinterest|pinterestbot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider|gptbot|chatgpt-user|oai-searchbot|claudebot|anthropic-ai|claude-web|perplexitybot|cohere-ai|youbot|ccbot|diffbot|rogerbot|seznambot|mojeekbot|discordbot|slackbot|embedly|quora|outbrain|flipboardproxy|tumblr|newsbot|mediapartners-google|adsbot-google|apis-google|feedfetcher-google|crawler|spider|bot\/|robot|scraper|archiver|indexer/i;

// Check if request is from a search engine, AI crawler, or social platform
function isCrawler(userAgent: string, ip?: string): boolean {
    // Check user agent against comprehensive regex
    if (BOT_UA_REGEX.test(userAgent)) {
        return true;
    }

    // Check for crawler and AI patterns in user agent
    const crawlerPatterns = [
        // Major Search Engines
        'google', 'bing', 'yahoo', 'duckduck', 'baidu', 'yandex', 'sogou', 'naver', 'seznam',
        // AI Assistants & Crawlers
        'gpt', 'chatgpt', 'openai', 'claude', 'anthropic', 'perplexity', 'cohere', 'you.com',
        'meta-externalagent', 'bytedance', 'gemini', 'bard',
        // SEO Tools
        'semrush', 'ahrefs', 'moz', 'majestic', 'screaming', 'sitebulb',
        // Social Platforms
        'facebook', 'twitter', 'linkedin', 'pinterest', 'instagram', 'tiktok', 'snapchat',
        'discord', 'slack', 'telegram', 'whatsapp', 'skype',
        // Generic patterns
        'search', 'crawler', 'spider', 'bot', 'indexer', 'fetch', 'preview',
        // Browsers in headless mode
        'headless', 'phantom', 'puppeteer', 'playwright', 'selenium'
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
