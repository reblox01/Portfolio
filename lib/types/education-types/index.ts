import { z } from 'zod';

// Zod schema for creating and editing education entries
export const createAndEditEducationSchema = z.object({
    degree: z.string().min(2, { message: 'Degree must be at least 2 characters' }).max(100),
    fieldOfStudy: z.string().min(2, { message: 'Field of study must be at least 2 characters' }).max(100),
    institution: z.string().min(2, { message: 'Institution name must be at least 2 characters' }).max(150),
    location: z.string().max(100).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional().nullable(),
    isCurrently: z.boolean().default(false),
    grade: z.string().max(50).optional(),
    achievements: z.array(z.string()).default([]),
    description: z.string().max(1000).optional(),
    isPublished: z.boolean().default(true),
});

export type CreateAndEditEducationType = z.infer<typeof createAndEditEducationSchema>;

// Type for Education from database (includes id, displayOrder, createdAt)
export type EducationType = {
    id: string;
    degree: string;
    fieldOfStudy: string;
    institution: string;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    isCurrently: boolean;
    grade: string | null;
    achievements: string[];
    description: string | null;
    isPublished: boolean;
    displayOrder: number | null;
    createdAt: Date;
};

// Helper to normalize Prisma JSON to string array
export function normalizeEducationRow(raw: any): EducationType {
    return {
        ...raw,
        achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
    };
}
