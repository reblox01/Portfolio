import { Prisma } from '@prisma/client';
import * as z from 'zod';

export type Project = {
    id: string;
    logo: string; // Project Logo: string URL or File
    screenshot: string; // Project Screenshot: string URL or File
    title: string; // Title
    oneLiner: string; // One-Liner
    projectType: string; // Project Type
    liveURL: string | null; // Live URL
    sourceURL: string | null; // Source Code URL
    description: string; // Description
    keywords: Prisma.JsonValue[];
    techStack: Prisma.JsonValue[];
};
export type ObjectTag = {
    id: string;
    text: string;
}

export enum ProjectType {
    Frontend = 'frontend',
    Backend = 'backend',
    CMS = 'CMS',
    FullStack = 'full-stack',
}

const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?(\?[^\s]*)?$/;

export const createAndEditProjectSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    oneLiner: z.string().min(2, {
        message: 'One-liner must be at least 2 characters.',
    }),
    logo: z.string(),
    screenshot: z.string(),
    projectType: z.nativeEnum(ProjectType),
    liveURL: z.string().optional().refine(value => !value || urlRegex.test(value), {
        message: 'Live URL must be a valid URL.',
    }),
    sourceURL: z.string().optional().refine(value => !value || urlRegex.test(value), {
        message: 'Source URL must be a valid URL.',
    }),
    techStack: z.array(
        z.object({
            id: z.string(),
            text: z.string(),
        })
    ).min(1, {
        message: 'At least one tech stack is required.',
    }),
    keywords: z.array(
        z.object({
            id: z.string(),
            text: z.string(),
        })
    ).min(1, {
        message: 'At least one keyword is required.',
    }),
    description: z.string().min(2, {
        message: 'Description must be at least 2 characters.',
    })
});

export type CreateAndEditProjectType = z.infer<typeof createAndEditProjectSchema>;
