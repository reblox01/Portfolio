import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes a string to prevent XSS attacks.
 * Removes all HTML tags by default.
 * @param input - The string to sanitize
 * @param options - DOMPurify configuration options
 * @returns Sanitized string
 */
export function sanitizeInput(input: string, options: any = { ALLOWED_TAGS: [] }): string {
    if (!input) return input;
    return (DOMPurify.sanitize(input, options) as unknown) as string;
}

/**
 * Recursively sanitizes all string properties in an object.
 * Useful for sanitizing Zod-validated data before saving to DB.
 * @param obj - The object to sanitize
 * @returns A new object with sanitized string properties
 */
export function sanitizeObject<T>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item)) as unknown as T;
    }

    const sanitized = { ...obj } as any;

    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            sanitized[key] = sanitizeInput(sanitized[key]);
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeObject(sanitized[key]);
        }
    }

    return sanitized as T;
}
