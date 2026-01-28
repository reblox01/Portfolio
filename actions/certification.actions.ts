'use server';

import prisma from "@/db";
import { Prisma } from '@prisma/client';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { CertificateType, createAndEditCertificateSchema, CreateAndEditCertificateType } from '@/lib/types/certification-types';
import { validateObjectId, validateObjectIds } from '@/lib/validation';
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


export async function createCertificationAction(values: CreateAndEditCertificateType): Promise<CertificateType | null> {
    await authenticateAndRedirect();

    try {
        const validated = createAndEditCertificateSchema.parse(values);
        const sanitized = sanitizeObject(validated);

        const certificate: CertificateType = await prisma.certification.create({
            data: {
                ...sanitized
            }
        });

        revalidatePath('/dashboard/manage-certifications');
        return certificate;
    } catch (error) {
        console.log(error);
        return null;
    }
}


import { getSortSettingsAction } from "./sortSettings.actions";

export async function getAllCertificationsAction(publishedOnly: boolean = false): Promise<{
    certifications: CertificateType[];
    sortType: string;
}> {
    try {
        const whereClause: Prisma.CertificationWhereInput = publishedOnly ? { isPublished: true } : {};

        // Fetch sort settings
        const settings = await getSortSettingsAction();
        const sortType = settings.certificationSortType || 'newest';

        let orderBy: any = { completionDate: 'desc' }; // Default for Certs

        if (sortType === 'newest') {
            orderBy = { completionDate: 'desc' };
        } else if (sortType === 'oldest') {
            orderBy = { completionDate: 'asc' };
        } else if (sortType === 'custom') {
            orderBy = [
                { displayOrder: 'asc' },
                { completionDate: 'desc' }
            ];
        }

        const certifications: CertificateType[] = await prisma.certification.findMany({
            where: whereClause,
            orderBy: orderBy
        })
        return { certifications, sortType };
    } catch (error) {
        console.log(error);
        return { certifications: [], sortType: 'newest' };
    }
}

export async function reorderCertificationsAction(items: { id: string; displayOrder: number }[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        await prisma.$transaction(
            items.map((item) =>
                prisma.certification.update({
                    where: { id: item.id },
                    data: { displayOrder: item.displayOrder }
                })
            )
        );

        revalidatePath('/dashboard/manage-certifications');
        revalidatePath('/certification');
        return true;
    } catch (error) {
        console.error("Error reordering certifications:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}


export async function deleteCertificationAction(id: string): Promise<CertificateType | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const certificate: CertificateType = await prisma.certification.delete({
            where: {
                id,
            },
        });
        revalidatePath('/dashboard/manage-certifications');
        revalidatePath('/certification');
        return certificate;
    } catch (error) {
        console.error("Error deleting certification:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}


export async function getSingleCertificationAction(id: string): Promise<CertificateType | null> {
    let certification: CertificateType | null = null;

    try {
        validateObjectId(id);
        certification = await prisma.certification.findUnique({
            where: {
                id,
            },
        });
    } catch (error) {
        console.error("Error fetching certification:", error instanceof Error ? error.message : "Unknown error");
        certification = null;
    }
    if (!certification) {
        redirect('/dashboard/manage-certifications');
    }
    return certification;
}


export async function updateCertificationAction(
    id: string,
    values: CreateAndEditCertificateType
): Promise<CertificateType | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const validated = createAndEditCertificateSchema.parse(values);
        const sanitized = sanitizeObject(validated);

        const certificate: CertificateType = await prisma.certification.update({
            where: {
                id,
            },
            data: {
                ...sanitized,
            },
        });
        revalidatePath('/dashboard/manage-certifications');
        revalidatePath('/certification');
        return certificate;
    } catch (error) {
        console.error("Error updating certification:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function bulkDeleteCertificationsAction(ids: string[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        validateObjectIds(ids);
        await prisma.certification.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        revalidatePath('/dashboard/manage-certifications');
        revalidatePath('/certification');
        return true;
    } catch (error) {
        console.error("Bulk delete error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}

export async function bulkTogglePublishCertificationsAction(ids: string[], isPublished: boolean): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        validateObjectIds(ids);
        await prisma.certification.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                isPublished
            }
        });
        revalidatePath('/dashboard/manage-certifications');
        revalidatePath('/certification');
        return true;
    } catch (error) {
        console.error("Bulk toggle publish error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}


export async function toggleCertificationPublishAction(
    id: string,
    currentStatus: boolean
): Promise<CertificateType | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const certificate: CertificateType = await prisma.certification.update({
            where: {
                id,
            },
            data: {
                isPublished: !currentStatus,
            },
        });
        revalidatePath('/dashboard/manage-certifications');
        revalidatePath('/certification');
        return certificate;
    } catch (error) {
        console.error("Error toggling certification publish:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}