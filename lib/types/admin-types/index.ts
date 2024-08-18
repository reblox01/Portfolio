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

// Updated regex to handle complex domains, paths, and wa.me URLs
const urlRegex = /^(https?:\/\/)?(www\.)?(wa\.me\/\+?\d{1,15}|web\.facebook\.com\/[\w.-]+|facebook\.com\/[\w.-]+|([\w-]+\.)+[\w-]{2,}|youtube\.com\/@[\w-]+)(\/[\w-]*)*\.?[\w-]*$/;

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
    github: z.string().optional().nullable().refine(value => !value || urlRegex.test(value), {
        message: 'GitHub URL must be a valid URL.',
    }),
    linkedIn: z.string().optional().nullable().refine(value => !value || urlRegex.test(value), {
        message: 'LinkedIn URL must be a valid URL.',
    }),
    whatsapp: z.string().optional().nullable().refine(value => !value || urlRegex.test(value), {
        message: 'WhatsApp URL must be a valid URL.',
    }),
    facebook: z.string().optional().nullable().refine(value => !value || urlRegex.test(value), {
        message: 'Facebook URL must be a valid URL.',
    }),
    instagram: z.string().optional().nullable().refine(value => !value || urlRegex.test(value), {
        message: 'Instagram URL must be a valid URL.',
    }),
    discord: z.string().optional().nullable().refine(value => !value || urlRegex.test(value), {
        message: 'Discord URL must be a valid URL.',
    }),
    gitlab: z.string().optional().nullable().refine(value => !value || urlRegex.test(value), {
        message: 'GitLab URL must be a valid URL.',
    }),
    twitter: z.string().optional().nullable().refine(value => !value || urlRegex.test(value), {
        message: 'Twitter URL must be a valid URL.',
    }),
    youtube: z.string().optional().nullable().refine(value => !value || urlRegex.test(value), {
        message: 'YouTube URL must be a valid URL.',
    }),
    email: z.string().email().min(1, {
        message: "Email is required!"
    }),
});

export type CreateAndEditAdminType = z.infer<typeof createAndEditAdminSchema>;
