'use server';

import prisma from "@/db";
import { ExperienceType, createAndEditExperienceSchema, CreateAndEditExperienceType } from "@/lib/types/experience-types";

import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';


  function authenticateAndRedirect(): string {
    const { userId } = auth();
    if (!userId) redirect('/');
    return userId;
}


export async function createExperienceAction(values: CreateAndEditExperienceType): Promise<ExperienceType | null> {
    authenticateAndRedirect()
    try {
        createAndEditExperienceSchema.parse(values);

        const raw = await prisma.experience.create({
            data: {
                ...values
            }
        });

        const exp: ExperienceType = normalizeExperienceRow(raw);
        return exp;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function getAllExperienceAction(): Promise<{
    experience: ExperienceType[]
}> {
    try {
        const rows = await prisma.experience.findMany({})
        const experience: ExperienceType[] = rows.map(normalizeExperienceRow)
        return { experience };
    } catch (error) {
        console.log(error);
        return { experience: [] };
    }
}


export async function deleteExperienceAction(id: string): Promise<ExperienceType | null> {
    authenticateAndRedirect();

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
    authenticateAndRedirect();

    try {
        const raw = await prisma.experience.update({
            where: {
                id,
            },
            data: {
                ...values,
            },
        });
        return normalizeExperienceRow(raw);
    } catch (error) {
        return null;
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