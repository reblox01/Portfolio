'use server';

import prisma from "@/db";
import { ExperienceType, createAndEditExperienceSchema, CreateAndEditExperienceType } from "@/lib/types/experience-types";

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


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


export async function getAllExperienceAction(publishedOnly: boolean = false): Promise<{
    experience: ExperienceType[]
}> {
    try {
        const whereClause = publishedOnly ? { isPublished: true } : {};
        const rows = await prisma.experience.findMany({
            where: whereClause
        })
        const experience: ExperienceType[] = rows.map(normalizeExperienceRow)
        return { experience };
    } catch (error) {
        console.log(error);
        return { experience: [] };
    }
}


export async function deleteExperienceAction(id: string): Promise<ExperienceType | null> {
    await authenticateAndRedirect();

    try {
        const raw = await prisma.experience.delete({
            where: {
                id,
            },
        });
        return normalizeExperienceRow(raw);
    } catch (error) {
        return null;
    }
}

export async function getSingleExperienceAction(id: string): Promise<ExperienceType | null> {
    let experience: ExperienceType | null = null;

    try {
        const raw = await prisma.experience.findUnique({
            where: {
                id,
            },
        });
        experience = raw ? normalizeExperienceRow(raw) : null;
    } catch (error) {
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
        return null;
    }
}

export async function toggleExperiencePublishAction(
    id: string,
    currentStatus: boolean
): Promise<ExperienceType | null> {
    await authenticateAndRedirect();

    try {
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
        console.error(error);
        return null;
    }
}

export async function bulkDeleteExperienceAction(ids: string[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        await prisma.experience.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        revalidatePath('/dashboard/manage-experience');
        revalidatePath('/experience');
        return true;
    } catch (error) {
        console.error("Bulk delete error:", error);
        return false;
    }
}

export async function bulkTogglePublishExperienceAction(ids: string[], isPublished: boolean): Promise<boolean> {
    await authenticateAndRedirect();

    try {
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
        console.error("Bulk toggle publish error:", error);
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