import { JsonValue } from '@prisma/client/runtime/library';
import * as z from 'zod';

export type AdminType = {
    id: string;
    name: string;
    adminUserId: string;
    imageUrl: string;
    resumeUrl: string | null;
    position: string;
    location: string;
    introduction: string;
    education: string;
    skills: JsonValue[];
    github?: string | null;
    linkedIn?: string | null;
    whatsapp?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    discord?: string | null;
    gitlab?: string | null;
    twitter?: string | null;
    email?: string | null;
    youtube?: string | null;
};

export type Skill = {
    id: string;
    text: string;
}

// Simple username/handle validation - allows alphanumeric, dots, underscores, hyphens
const usernameRegex = /^[a-zA-Z0-9._-]+$/;

export const createAndEditAdminSchema = z.object({
    name: z.string().min(1, {
        message: "Full-name is required!"
    }),

    imageUrl: z.string(),
    resumeUrl: z.string().nullable().optional(),
    position: z.string().min(1, {
        message: "Position is required!"
    }),
    location: z.string().min(1, {
        message: "Location is required!"
    }),
    introduction: z.string().min(1, {
        message: "Introduction is required!"
    }),
    education: z.string().min(1, {
        message: "Education is required!"
    }),
    skills: z.array(
        z.object({
            id: z.string(),
            text: z.string(),
        })
    ).min(1, {
        message: 'At least one skill is required',
    }),
    github: z.string().optional().nullable().refine(value => !value || usernameRegex.test(value), {
        message: 'GitHub username must contain only letters, numbers, dots, underscores, and hyphens.',
    }),
    linkedIn: z.string().optional().nullable().refine(value => !value || usernameRegex.test(value), {
        message: 'LinkedIn username must contain only letters, numbers, dots, underscores, and hyphens.',
    }),
    whatsapp: z.string().optional().nullable().refine(value => !value || /^[\d+\-\s()]+$/.test(value), {
        message: 'WhatsApp number must contain only numbers, +, -, spaces, and parentheses.',
    }),
    facebook: z.string().optional().nullable().refine(value => !value || usernameRegex.test(value), {
        message: 'Facebook username must contain only letters, numbers, dots, underscores, and hyphens.',
    }),
    instagram: z.string().optional().nullable().refine(value => !value || usernameRegex.test(value), {
        message: 'Instagram username must contain only letters, numbers, dots, underscores, and hyphens.',
    }),
    discord: z.string().optional().nullable().refine(value => !value || /^[\w#]+$/.test(value), {
        message: 'Discord username must contain only letters, numbers, underscores, and #.',
    }),
    gitlab: z.string().optional().nullable().refine(value => !value || usernameRegex.test(value), {
        message: 'GitLab username must contain only letters, numbers, dots, underscores, and hyphens.',
    }),
    twitter: z.string().optional().nullable().refine(value => !value || usernameRegex.test(value), {
        message: 'Twitter username must contain only letters, numbers, dots, underscores, and hyphens.',
    }),
    youtube: z.string().optional().nullable().refine(value => !value || usernameRegex.test(value), {
        message: 'YouTube username must contain only letters, numbers, dots, underscores, and hyphens.',
    }),
    email: z.string().email().min(1, {
        message: "Email is required!"
    }),
});

export type CreateAndEditAdminType = z.infer<typeof createAndEditAdminSchema>;
