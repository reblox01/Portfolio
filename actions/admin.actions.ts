'use server';

import prisma from "@/db";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createAndEditAdminSchema, CreateAndEditAdminType, AdminType } from '@/lib/types/admin-types';

async function authenticateAndRedirect(): Promise<string> {
    const { userId } = await auth();
    if (!userId) redirect('/');
    return userId;
}

export async function createAdminAction(values: CreateAndEditAdminType): Promise<AdminType | null> {
    const adminUserId = await authenticateAndRedirect();

    try {
        createAndEditAdminSchema.parse(values);

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
                ...values,
                adminUserId,
                resumeUrl: values.resumeUrl || ''
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
        // Find the existing admin to get its ID, assuming there's only one admin per userId
        const existingAdmin = await prisma.admin.findFirst({
            where: {
                adminUserId: userId,
            },
        });

        if (!existingAdmin) {
            throw new Error("Admin not found.");
        }

        const admin: AdminType = await prisma.admin.update({
            where: {
                id: existingAdmin.id,
            },
            data: {
                ...values,
                // Ensure resumeUrl is handled consistently if it's part of the update
                ...(values.resumeUrl !== undefined && { resumeUrl: values.resumeUrl || '' })
            },
        });
        return admin;
    } catch (error) {
        return null;
    }
}