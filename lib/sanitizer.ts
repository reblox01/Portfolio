import striptags from 'striptags';

/**
 * Sanitizes a string to prevent XSS attacks.
 * Removes all HTML tags by default.
 * @param input - The string to sanitize
 * @param options - striptags configuration (allowed tags)
 * @returns Sanitized string
 */
export async function sanitizeInput(input: string, options: any = { ALLOWED_TAGS: [] }): Promise<string> {
    if (!input) return input;

    // Map DOMPurify ALLOWED_TAGS to striptags tags if provided
    const tags = options.ALLOWED_TAGS || [];

    return striptags(input, tags);
}

/**
 * Recursively sanitizes all string properties in an object.
 * Useful for sanitizing Zod-validated data before saving to DB.
 * @param obj - The object to sanitize
 * @returns A new object with sanitized string properties
 */
export async function sanitizeObject<T>(obj: T): Promise<T> {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        const sanitizedArray = await Promise.all(obj.map(item => sanitizeObject(item)));
        return sanitizedArray as unknown as T;
    }

    const sanitized = { ...obj } as any;

    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            // Skip sanitizing URLs and emails which might get mangled by aggressive HTML sanitization
            if (['email', 'github', 'linkedIn', 'twitter', 'facebook', 'instagram', 'discord', 'whatsapp', 'youtube', 'gitlab', 'imageUrl', 'resumeUrl'].includes(key)) {
                sanitized[key] = sanitized[key];
            } else {
                sanitized[key] = await sanitizeInput(sanitized[key]);
            }
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = await sanitizeObject(sanitized[key]);
        }
    }

    return sanitized as T;
}
