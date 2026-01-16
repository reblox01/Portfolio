/**
 * In-Memory Rate Limiter
 * Provides protection against spam and DDoS attacks without external dependencies
 * Automatically cleans up old entries to prevent memory leaks
 */

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

class InMemoryRateLimiter {
    private storage: Map<string, RateLimitRecord> = new Map();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Clean up expired entries every 5 minutes to prevent memory leaks
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }

    /**
     * Check if request should be rate limited
     * @param identifier - Unique identifier (usually IP address)
     * @param maxRequests - Maximum requests allowed in window
     * @param windowMs - Time window in milliseconds
     * @returns true if request is allowed, false if rate limited
     */
    check(identifier: string, maxRequests: number, windowMs: number): boolean {
        const now = Date.now();
        const record = this.storage.get(identifier);

        // No record or window expired - allow and create new record
        if (!record || now > record.resetTime) {
            this.storage.set(identifier, {
                count: 1,
                resetTime: now + windowMs,
            });
            return true;
        }

        // Within window but under limit - increment and allow
        if (record.count < maxRequests) {
            record.count++;
            return true;
        }

        // Rate limit exceeded
        return false;
    }

    /**
     * Remove expired entries from storage
     */
    private cleanup(): void {
        const now = Date.now();
        for (const [key, record] of this.storage.entries()) {
            if (now > record.resetTime) {
                this.storage.delete(key);
            }
        }
    }

    /**
     * Get current stats (for debugging/monitoring)
     */
    getStats() {
        return {
            totalEntries: this.storage.size,
            activeIps: Array.from(this.storage.keys()),
        };
    }

    /**
     * Clear all rate limit records (use carefully!)
     */
    reset(): void {
        this.storage.clear();
    }

    /**
     * Cleanup on shutdown
     */
    destroy(): void {
        clearInterval(this.cleanupInterval);
        this.storage.clear();
    }
}

// Create singleton instances for different rate limit types
const emailRateLimiter = new InMemoryRateLimiter();
const apiRateLimiter = new InMemoryRateLimiter();
const visitorRateLimiter = new InMemoryRateLimiter();

/**
 * Rate limit for email API: 10 emails per hour per IP
 */
export const emailRateLimit = {
    limit: (identifier: string) => {
        const success = emailRateLimiter.check(identifier, 10, 60 * 60 * 1000); // 10 per hour
        return Promise.resolve({ success });
    },
};

/**
 * Rate limit for general API: 100 requests per minute per IP
 */
export const apiRateLimit = {
    limit: (identifier: string) => {
        const success = apiRateLimiter.check(identifier, 100, 60 * 1000); // 100 per minute
        return Promise.resolve({ success });
    },
};

/**
 * Rate limit for visitor tracking: 10 per minute per IP
 */
export const visitorRateLimit = {
    limit: (identifier: string) => {
        const success = visitorRateLimiter.check(identifier, 10, 60 * 1000); // 10 per minute
        return Promise.resolve({ success });
    },
};

/**
 * Get IP address from request headers
 * @param headers - Next.js request headers
 * @returns IP address or fallback
 */
export function getClientIp(headers: Headers): string {
    return (
        headers.get("x-forwarded-for")?.split(",")[0] ||
        headers.get("x-real-ip") ||
        "127.0.0.1"
    );
}

/**
 * Get stats for all rate limiters (for debugging)
 */
export function getRateLimiterStats() {
    return {
        email: emailRateLimiter.getStats(),
        api: apiRateLimiter.getStats(),
        visitor: visitorRateLimiter.getStats(),
    };
}
