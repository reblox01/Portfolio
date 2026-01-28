'use server';

import prisma from "@/db";
import { EducationType, createAndEditEducationSchema, CreateAndEditEducationType, normalizeEducationRow } from "@/lib/types/education-types";


import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { validateObjectId, validateObjectIds } from '@/lib/validation';
import { apiRateLimit, getClientIp } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { sanitizeObject } from '@/lib/security-utils';

async function authenticateAndRedirect(): Promise<string> {
    const { userId } = await auth();
    if (!userId) {
        redirect('/');
    }

    // Rate Limiting Check
    const ip = getClientIp(await headers());
    const { success } = await apiRateLimit.limit(ip);
    if (!success) {
        throw new Error("Rate limit exceeded. Please try again later.");
    }

    return userId;
}

export async function createEducationAction(values: CreateAndEditEducationType): Promise<EducationType | null> {
    await authenticateAndRedirect();

    try {
        const validated = createAndEditEducationSchema.parse(values);
        const sanitized = sanitizeObject(validated);

        const raw = await prisma.education.create({
            data: {
                ...sanitized,
                location: sanitized.location ?? undefined,
                endDate: sanitized.endDate ?? undefined,
                grade: sanitized.grade ?? undefined,
                description: sanitized.description ?? undefined,
                isPublished: sanitized.isPublished ?? true,
            }
        });

        revalidatePath('/dashboard/manage-education');
        return normalizeEducationRow(raw);
    } catch (error) {
        console.error("Error creating education:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

import { getSortSettingsAction } from "./sortSettings.actions";

export async function getAllEducationAction(publishedOnly: boolean = false): Promise<{
    education: EducationType[];
    sortType: string;
}> {
    try {
        const whereClause = publishedOnly ? { isPublished: true } : {};

        // Fetch sort settings
        const settings = await getSortSettingsAction();
        const sortType = settings.educationSortType || 'newest';

        let orderBy: any = { startDate: 'desc' }; // Default

        if (sortType === 'newest') {
            orderBy = { startDate: 'desc' };
        } else if (sortType === 'oldest') {
            orderBy = { startDate: 'asc' };
        } else if (sortType === 'custom') {
            // MongoDB: nulls come first in ASC. We want defined orders first.
            // Actually standard practice: sort key ASC. Nulls handling varies.
            // Prisma doesn't support "nulls last" easily in all adapters.
            // We will rely on simple sort and client-side or assume updated items have order.
            orderBy = [
                { displayOrder: 'asc' },
                { startDate: 'desc' }
            ];
        }

        const rows = await prisma.education.findMany({
            where: whereClause,
            orderBy: orderBy
        });
        const education = rows.map(normalizeEducationRow);
        return { education, sortType };
    } catch (error) {
        console.error("Error fetching education:", error instanceof Error ? error.message : "Unknown error");
        return { education: [], sortType: 'newest' };
    }
}

export async function reorderEducationAction(items: { id: string; displayOrder: number }[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        // Use transaction for consistency
        await prisma.$transaction(
            items.map((item) =>
                prisma.education.update({
                    where: { id: item.id },
                    data: { displayOrder: item.displayOrder }
                })
            )
        );

        revalidatePath('/dashboard/manage-education');
        revalidatePath('/education');
        return true;
    } catch (error) {
        console.error("Error reordering education:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}

export async function deleteEducationAction(id: string): Promise<EducationType | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const raw = await prisma.education.delete({
            where: {
                id,
            },
        });
        revalidatePath('/dashboard/manage-education');
        revalidatePath('/education');
        return normalizeEducationRow(raw);
    } catch (error) {
        console.error("Error deleting education:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function getSingleEducationAction(id: string): Promise<EducationType | null> {
    let education: EducationType | null = null;

    try {
        validateObjectId(id);
        const raw = await prisma.education.findUnique({
            where: {
                id,
            },
        });
        education = raw ? normalizeEducationRow(raw) : null;
    } catch (error) {
        console.error("Error fetching education:", error instanceof Error ? error.message : "Unknown error");
        education = null;
    }
    if (!education) {
        redirect('/dashboard/manage-education');
    }
    return education;
}

export async function updateEducationAction(
    id: string,
    values: CreateAndEditEducationType
): Promise<EducationType | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const validated = createAndEditEducationSchema.parse(values);
        const sanitized = sanitizeObject(validated);

        const raw = await prisma.education.update({
            where: {
                id,
            },
            data: {
                ...sanitized,
                location: sanitized.location ?? undefined,
                endDate: sanitized.endDate ?? undefined,
                grade: sanitized.grade ?? undefined,
                description: sanitized.description ?? undefined,
                isPublished: sanitized.isPublished ?? true,
            },
        });
        revalidatePath('/dashboard/manage-education');
        revalidatePath('/education');
        return normalizeEducationRow(raw);
    } catch (error) {
        console.error("Error updating education:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function toggleEducationPublishAction(
    id: string,
    currentStatus: boolean
): Promise<EducationType | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const raw = await prisma.education.update({
            where: {
                id,
            },
            data: {
                isPublished: !currentStatus,
            },
        });
        revalidatePath('/dashboard/manage-education');
        revalidatePath('/education');
        return normalizeEducationRow(raw);
    } catch (error) {
        console.error("Error toggling education publish:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function bulkDeleteEducationAction(ids: string[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        validateObjectIds(ids);
        await prisma.education.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        revalidatePath('/dashboard/manage-education');
        revalidatePath('/education');
        return true;
    } catch (error) {
        console.error("Bulk delete error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}

export async function bulkTogglePublishEducationAction(ids: string[], isPublished: boolean): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        validateObjectIds(ids);
        await prisma.education.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                isPublished
            }
        });
        revalidatePath('/dashboard/manage-education');
        revalidatePath('/education');
        return true;
    } catch (error) {
        console.error("Bulk toggle publish error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}
