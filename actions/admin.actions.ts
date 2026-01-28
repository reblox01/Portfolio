'use server';

import prisma from "@/db";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createAndEditAdminSchema, CreateAndEditAdminType, AdminType } from '@/lib/types/admin-types';
import { apiRateLimit, getClientIp } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { sanitizeObject } from '@/lib/security-utils';

async function authenticateAndRedirect(): Promise<string> {
    const { userId } = await auth();
    if (!userId) redirect('/');

    // Rate Limiting Check
    const ip = getClientIp(await headers());
    const { success } = await apiRateLimit.limit(ip);
    if (!success) {
        throw new Error("Rate limit exceeded. Please try again later.");
    }

    return userId;
}

export async function createAdminAction(values: CreateAndEditAdminType): Promise<AdminType | null> {
    const adminUserId = await authenticateAndRedirect();

    try {
        const validated = createAndEditAdminSchema.parse(values);
        const sanitized = sanitizeObject(validated);

        const checkAdminExists: AdminType[] = await prisma.admin.findMany({
            where: {
                adminUserId
            }
        });

        if (checkAdminExists.length > 0) {
            throw new Error("Cannot add more than one admin");
        }

        const admin: AdminType = await prisma.admin.create({
            data: {
                ...sanitized,
                adminUserId,
                resumeUrl: sanitized.resumeUrl || ''
            }
        });
        revalidatePath('/dashboard/manage-admin');
        return admin;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getAdminDetail(): Promise<AdminType | null> {
    try {
        const admin: AdminType[] = await prisma.admin.findMany({});
        return admin[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function deleteAdmin(id: string): Promise<AdminType | null> {
    await authenticateAndRedirect();

    try {
        const admin: AdminType = await prisma.admin.delete({
            where: {
                id,
            },
        });
        revalidatePath('/dashboard/manage-admin');
        return admin;
    } catch (error) {
        console.error("Error deleting admin:", error);
        return null;
    }
}

export async function updateAdminAction(values: Partial<AdminType>): Promise<AdminType | null> {
    const userId = await authenticateAndRedirect();

    try {
        const sanitized = sanitizeObject(values);

        // Find the existing admin to get its ID, assuming there's only one admin per userId
        const existingAdmin = await prisma.admin.findFirst({
            where: {
                adminUserId: userId,
            },
        });

        if (!existingAdmin) {
            throw new Error("Admin not found.");
        }

        const { skills, ...otherValues } = sanitized as any;

        const admin: AdminType = await prisma.admin.update({
            where: {
                id: existingAdmin.id,
            },
            data: {
                ...otherValues,
                ...(skills && { skills: skills as any }),
                // Ensure resumeUrl is handled consistently if it's part of the update
                ...(sanitized.resumeUrl !== undefined && { resumeUrl: sanitized.resumeUrl || '' })
            },
        });
        return admin;
    } catch (error) {
        return null;
    }
}