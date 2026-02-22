/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Cache static assets (JS, CSS, fonts, images) for 1 year — they have content-hashed filenames
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache public folder static files for 30 days
        source: '/(favicon.*|robots\.txt|sitemap.*|.*\.svg|.*\.png|.*\.jpg|.*\.webp|.*\.ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      {
        // Default: allow indexing for all public-facing pages.
        // This sets the X-Robots-Tag HTTP header at the Next.js/CDN level,
        // which is what Googlebot reads. This must come before the more-specific
        // dashboard/auth rules below so those can override it.
        source: '/((?!dashboard|sign-in|sign-up).*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },
      {
        // Prevent search engines from indexing admin/auth routes.
        source: '/(dashboard|sign-in|sign-up)(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — no framing by any site
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer information sent on navigation
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict access to browser features not used by this app
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // Force HTTPS for 1 year (includeSubDomains)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Basic CSP: tighten as needed. unsafe-inline is required for Next.js
          // inline scripts (JSON-LD, Clerk) and Tailwind. Add nonce support to
          // remove unsafe-inline from script-src when ready.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://*.cloudflare.com https://vercel.live https://upload-widget.cloudinary.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://*.clerk.com https://*.clerk.accounts.dev https://d1oco4z2z1fhwp.cloudfront.net",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://vercel.live wss://*.clerk.com wss://*.clerk.accounts.dev",
              "frame-src https://*.clerk.com https://*.clerk.accounts.dev https://upload-widget.cloudinary.com",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // Compress responses
  compress: true,
  serverExternalPackages: ["jsdom"],
};

export default nextConfig;
