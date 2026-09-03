import { z } from 'zod';

/**
 * Validates ID format (compatible with CUID, UUID, or legacy MongoDB ObjectIds)
 */
export const objectIdSchema = z.string().min(1, "Invalid ID format");

/**
 * Validates an array of IDs
 */
export const objectIdArraySchema = z.array(objectIdSchema).min(1, "At least one ID required");

/**
 * Validates ID and throws error if invalid
 * @param id - The ID to validate
 * @throws Error if ID is invalid
 */
export function validateObjectId(id: string): void {
    objectIdSchema.parse(id);
}

/**
 * Validates multiple IDs and throws error if any invalid
 * @param ids - Array of IDs to validate
 * @throws Error if any ID is invalid
 */
export function validateObjectIds(ids: string[]): void {
    objectIdArraySchema.parse(ids);
}

/**
 * Allowed sort types for ordering functionality
 */
export const sortTypeSchema = z.enum(['newest', 'oldest', 'custom']);

/**
 * Validates sort type parameter
 * @param sortType - The sort type to validate
 */
export function validateSortType(sortType: string): 'newest' | 'oldest' | 'custom' {
    return sortTypeSchema.parse(sortType);
}
