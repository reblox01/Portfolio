
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
    github: z.string().optional().nullable(),
    linkedIn: z.string().optional().nullable(),
    whatsapp: z.string().optional().nullable(),
    facebook: z.string().optional().nullable(),
    instagram: z.string().optional().nullable(),
    discord: z.string().optional().nullable(),
    gitlab: z.string().optional().nullable(),
    twitter: z.string().optional().nullable(),
    youtube: z.string().optional().nullable(),
    email: z.string().email().min(1, {
        message: "Email is required!"
    }),
});


export type CreateAndEditAdminType = z.infer<typeof createAndEditAdminSchema>