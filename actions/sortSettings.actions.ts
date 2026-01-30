'use server';

import prisma from "@/db";
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiRateLimit, getClientIp } from "@/lib/rate-limit";
import { headers } from "next/headers";

export type SortSettingsType = {
    id: string;
    projectSortType: string;
    certificationSortType: string;
    experienceSortType: string;
    educationSortType: string;
    techstackSortType: string;
    applyProjectSortToPublic: boolean;
    applyCertificationSortToPublic: boolean;
    applyExperienceSortToPublic: boolean;
    applyEducationSortToPublic: boolean;
    applyTechstackSortToPublic: boolean;
};

async function authenticateAndRedirect() {
    const { userId } = await auth();
    if (!userId) {
        redirect('/');
    }
    return userId;
}

export async function getSortSettingsAction(): Promise<SortSettingsType> {
    // No auth needed for reading, but usually this is for admin dashboard. 
    // Public pages might need it too to know how to sort.

    try {
        let settings = await prisma.sortSettings.findFirst();

        if (!settings) {
            // Create default if not exists
            settings = await prisma.sortSettings.create({
                data: {
                    projectSortType: "newest",
                    certificationSortType: "newest",
                    experienceSortType: "newest",
                    educationSortType: "newest",
                    techstackSortType: "newest",
                }
            });
        }

        return settings as SortSettingsType;
    } catch (error) {
        console.error("Error fetching sort settings:", error instanceof Error ? error.message : "Unknown error");
        // Return default fallback
        return {
            id: "default",
            projectSortType: "newest",
            certificationSortType: "newest",
            experienceSortType: "newest",
            educationSortType: "newest",
            techstackSortType: "newest",
            applyProjectSortToPublic: true,
            applyCertificationSortToPublic: true,
            applyExperienceSortToPublic: true,
            applyEducationSortToPublic: true,
            applyTechstackSortToPublic: true,
        };
    }
}

export async function updateSortSettingsAction(values: Partial<SortSettingsType>): Promise<SortSettingsType | null> {
    // Authenticate admin
    await authenticateAndRedirect();

    const ip = getClientIp(await headers());
    const { success } = await apiRateLimit.limit(ip);
    if (!success) throw new Error("Rate limit exceeded");

    try {
        const { sanitizeObject } = await import('@/lib/sanitizer');
        const sanitized = sanitizeObject(values);
        const existing = await prisma.sortSettings.findFirst();

        let settings;
        if (existing) {
            settings = await prisma.sortSettings.update({
                where: { id: existing.id },
                data: sanitized
            });
        } else {
            settings = await prisma.sortSettings.create({
                data: {
                    projectSortType: values.projectSortType || "newest",
                    certificationSortType: values.certificationSortType || "newest",
                    experienceSortType: values.experienceSortType || "newest",
                    educationSortType: values.educationSortType || "newest",
                    techstackSortType: values.techstackSortType || "newest",
                    ...values
                }
            });
        }

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/manage-projects');
        revalidatePath('/dashboard/manage-education');
        revalidatePath('/dashboard/manage-experience');
        revalidatePath('/dashboard/manage-certifications');
        revalidatePath('/dashboard/manage-techstack');
        revalidatePath('/projects');
        revalidatePath('/education');
        revalidatePath('/experience');
        revalidatePath('/techstack');
        return settings as SortSettingsType;
    } catch (error) {
        console.error("Error updating sort settings:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}
