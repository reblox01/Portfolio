'use server';

import prisma from "@/db";

import { CreateAndEditTechstackType, createAndEditTechstackType, Techstack } from './../lib/types/techstack-types/index';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { validateObjectId, validateObjectIds } from '@/lib/validation';
import { apiRateLimit, getClientIp } from '@/lib/rate-limit';
import { headers } from 'next/headers';
// Removed top-level sanitization import


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


export async function createTechstackAction(values: CreateAndEditTechstackType): Promise<Techstack | null> {
    await authenticateAndRedirect();

    try {
        const { sanitizeObject } = await import('@/lib/sanitizer');
        const validated = createAndEditTechstackType.parse(values);
        const sanitized = sanitizeObject(validated);

        const techstack: Techstack = await prisma.techstack.create({
            data: {
                ...sanitized
            }
        });

        revalidatePath('/dashboard/manage-techstack');
        return techstack;
    } catch (error) {
        console.log(error);
        return null;
    }
}


import { getSortSettingsAction } from "./sortSettings.actions";

export async function getAllTechstacksAction(): Promise<{
    techstacks: Techstack[];
    sortType: string;
}> {
    try {
        // Fetch sort settings
        const settings = await getSortSettingsAction();
        const sortType = settings.techstackSortType || 'newest';

        let orderBy: any = { createdAt: 'desc' }; // Default

        if (sortType === 'newest') {
            orderBy = { createdAt: 'desc' };
        } else if (sortType === 'oldest') {
            orderBy = { createdAt: 'asc' };
        } else if (sortType === 'custom') {
            orderBy = [
                { displayOrder: 'asc' },
                { createdAt: 'desc' }
            ];
        }

        const techstacks: Techstack[] = await prisma.techstack.findMany({
            orderBy: orderBy
        })
        return { techstacks, sortType };
    } catch (error) {
        console.log(error);
        return { techstacks: [], sortType: 'newest' };
    }
}

export async function reorderTechstackAction(items: { id: string; displayOrder: number }[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        await prisma.$transaction(
            items.map((item) =>
                prisma.techstack.update({
                    where: { id: item.id },
                    data: { displayOrder: item.displayOrder }
                })
            )
        );

        revalidatePath('/dashboard/manage-techstack');
        return true;
    } catch (error) {
        console.error("Error reordering techstack:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}

export async function getSingleTechstackAction(id: string): Promise<Techstack | null> {
    let techstack: Techstack | null = null;
    const userId = await authenticateAndRedirect();

    try {
        validateObjectId(id);
        techstack = await prisma.techstack.findUnique({
            where: {
                id,
            },
        });
    } catch (error) {
        console.error("Error fetching techstack:", error instanceof Error ? error.message : "Unknown error");
        techstack = null;
    }
    if (!techstack) {
        redirect('/dashboard/manage-techstack');
    }
    return techstack;
}

export async function deleteTechstackAction(id: string): Promise<Techstack | null> {
    const userId = await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const techstack: Techstack = await prisma.techstack.delete({
            where: {
                id,
            },
        });
        revalidatePath('/dashboard/manage-techstack');
        return techstack;
    } catch (error) {
        console.error("Error deleting techstack:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}
export async function updateTechstackAction(
    id: string,
    values: CreateAndEditTechstackType
): Promise<Techstack | null> {
    const userId = await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const { sanitizeObject } = await import('@/lib/sanitizer');
        const validated = createAndEditTechstackType.parse(values);
        const sanitized = sanitizeObject(validated);

        const techtstack: Techstack = await prisma.techstack.update({
            where: {
                id,
            },
            data: {
                ...sanitized,
            },
        });
        revalidatePath('/dashboard/manage-techstack');
        return techtstack;
    } catch (error) {
        console.error("Error updating techstack:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function bulkDeleteTechstackAction(ids: string[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        validateObjectIds(ids);
        await prisma.techstack.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        revalidatePath('/dashboard/manage-techstack');
        return true;
    } catch (error) {
        console.error("Bulk delete error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}
