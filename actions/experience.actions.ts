'use server';

import prisma from "@/db";
import { ExperienceType, createAndEditExperienceSchema, CreateAndEditExperienceType } from "@/lib/types/experience-types";

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { validateObjectId, validateObjectIds } from '@/lib/validation';


async function authenticateAndRedirect(): Promise<string> {
    const { userId } = await auth();
    if (!userId) redirect('/');
    return userId;
}


export async function createExperienceAction(values: CreateAndEditExperienceType): Promise<ExperienceType | null> {
    await authenticateAndRedirect();

    try {
        createAndEditExperienceSchema.parse(values);

        const raw = await prisma.experience.create({
            data: {
                ...values
            }
        });

        const exp: ExperienceType = normalizeExperienceRow(raw);
        revalidatePath('/dashboard/manage-experience');
        return exp;
    } catch (error) {
        console.log(error);
        return null;
    }
}


import { getSortSettingsAction } from "./sortSettings.actions";

export async function getAllExperienceAction(publishedOnly: boolean = false): Promise<{
    experience: ExperienceType[];
    sortType: string;
}> {
    try {
        const whereClause = publishedOnly ? { isPublished: true } : {};

        // Fetch sort settings
        const settings = await getSortSettingsAction();
        const sortType = settings.experienceSortType || 'newest';

        let orderBy: any = { startDate: 'desc' }; // Default

        if (sortType === 'newest') {
            orderBy = { startDate: 'desc' };
        } else if (sortType === 'oldest') {
            orderBy = { startDate: 'asc' };
        } else if (sortType === 'custom') {
            orderBy = [
                { displayOrder: 'asc' },
                { startDate: 'desc' }
            ];
        }

        const rows = await prisma.experience.findMany({
            where: whereClause,
            orderBy: orderBy
        })
        const experience: ExperienceType[] = rows.map(normalizeExperienceRow)
        return { experience, sortType };
    } catch (error) {
        console.log(error);
        return { experience: [], sortType: 'newest' };
    }
}

export async function reorderExperienceAction(items: { id: string; displayOrder: number }[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        await prisma.$transaction(
            items.map((item) =>
                prisma.experience.update({
                    where: { id: item.id },
                    data: { displayOrder: item.displayOrder }
                })
            )
        );

        revalidatePath('/dashboard/manage-experience');
        revalidatePath('/experience');
        return true;
    } catch (error) {
        console.error("Error reordering experience:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}


export async function deleteExperienceAction(id: string): Promise<ExperienceType | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const raw = await prisma.experience.delete({
            where: {
                id,
            },
        });
        revalidatePath('/dashboard/manage-experience');
        revalidatePath('/experience');
        return normalizeExperienceRow(raw);
    } catch (error) {
        console.error("Error deleting experience:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function getSingleExperienceAction(id: string): Promise<ExperienceType | null> {
    let experience: ExperienceType | null = null;

    try {
        validateObjectId(id);
        const raw = await prisma.experience.findUnique({
            where: {
                id,
            },
        });
        experience = raw ? normalizeExperienceRow(raw) : null;
    } catch (error) {
        console.error("Error fetching experience:", error instanceof Error ? error.message : "Unknown error");
        experience = null;
    }
    if (!experience) {
        redirect('/dashboard/manage-experience');
    }
    return experience;
}


export async function updateExperienceAction(
    id: string,
    values: CreateAndEditExperienceType
): Promise<ExperienceType | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        createAndEditExperienceSchema.parse(values);

        const raw = await prisma.experience.update({
            where: {
                id,
            },
            data: {
                ...values,
                isPublished: values.isPublished ?? true,
            },
        });
        revalidatePath('/dashboard/manage-experience');
        revalidatePath('/experience');
        return normalizeExperienceRow(raw);
    } catch (error) {
        console.error("Error updating experience:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function toggleExperiencePublishAction(
    id: string,
    currentStatus: boolean
): Promise<ExperienceType | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const raw = await prisma.experience.update({
            where: {
                id,
            },
            data: {
                isPublished: !currentStatus,
            },
        });
        revalidatePath('/dashboard/manage-experience');
        revalidatePath('/experience');
        return normalizeExperienceRow(raw);
    } catch (error) {
        console.error("Error toggling experience publish:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function bulkDeleteExperienceAction(ids: string[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        validateObjectIds(ids);
        await prisma.experience.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        revalidatePath('/dashboard/manage-experience');
        revalidatePath('/experience');
        return true;
    } catch (error) {
        console.error("Bulk delete error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}

export async function bulkTogglePublishExperienceAction(ids: string[], isPublished: boolean): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        validateObjectIds(ids);
        await prisma.experience.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                isPublished
            }
        });
        revalidatePath('/dashboard/manage-experience');
        revalidatePath('/experience');
        return true;
    } catch (error) {
        console.error("Bulk toggle publish error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}


// Normalize Prisma row to ExperienceType (convert null workMode -> undefined, ensure dates)
function normalizeExperienceRow(row: any): ExperienceType {
    return {
        ...row,
        workMode: row.workMode ?? undefined,
        learned: Array.isArray(row.learned) ? row.learned : (row.learned ? row.learned : []),
        startDate: row.startDate instanceof Date ? row.startDate : new Date(row.startDate),
        endDate: row.endDate === null ? null : (row.endDate instanceof Date ? row.endDate : new Date(row.endDate)),
    } as ExperienceType;
}