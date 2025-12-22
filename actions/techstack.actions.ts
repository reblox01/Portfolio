'use server';

import prisma from "@/db";

import { CreateAndEditTechstackType, createAndEditTechstackType, Techstack } from './../lib/types/techstack-types/index';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


async function authenticateAndRedirect(): Promise<string> {
    const { userId } = await auth();
    if (!userId) redirect('/');
    return userId;
}


export async function createTechstackAction(values: CreateAndEditTechstackType): Promise<Techstack | null> {
    await authenticateAndRedirect();

    try {
        createAndEditTechstackType.parse(values);

        const techstack: Techstack = await prisma.techstack.create({
            data: {
                ...values
            }
        });

        revalidatePath('/dashboard/manage-techstack');
        return techstack;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function getAllTechstacksAction(): Promise<{
    techstacks: Techstack[]
}> {
    try {
        const techstacks: Techstack[] = await prisma.techstack.findMany({})
        return { techstacks };
    } catch (error) {
        console.log(error);
        return { techstacks: [] };
    }
}

export async function getSingleTechstackAction(id: string): Promise<Techstack | null> {
    let techstack: Techstack | null = null;
    const userId = await authenticateAndRedirect();

    try {
        techstack = await prisma.techstack.findUnique({
            where: {
                id,
            },
        });
    } catch (error) {
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
        const techstack: Techstack = await prisma.techstack.delete({
            where: {
                id,
            },
        });
        revalidatePath('/dashboard/manage-techstack');
        return techstack;
    } catch (error) {
        console.error("Error deleting techstack:", error);
        return null;
    }
}
export async function updateTechstackAction(
    id: string,
    values: CreateAndEditTechstackType
): Promise<Techstack | null> {
    const userId = await authenticateAndRedirect();

    try {
        const techtstack: Techstack = await prisma.techstack.update({
            where: {
                id,
            },
            data: {
                ...values,
            },
        });
        revalidatePath('/dashboard/manage-techstack');
        return techtstack;
    } catch (error) {
        return null;
    }
}

export async function bulkDeleteTechstackAction(ids: string[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        await prisma.techstack.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        revalidatePath('/dashboard/manage-techstack');
        return true;
    } catch (error) {
        console.error("Bulk delete error:", error);
        return false;
    }
}
