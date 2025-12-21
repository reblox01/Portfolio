'use server';

import prisma from "@/db";
import { Prisma } from '@prisma/client';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { CertificateType, createAndEditCertificateSchema, CreateAndEditCertificateType } from '@/lib/types/certification-types';

async function authenticateAndRedirect(): Promise<string> {
    const { userId } = await auth();
    if (!userId) redirect('/');
    return userId;
}


export async function createCertificationAction(values: CreateAndEditCertificateType): Promise<CertificateType | null> {
    await authenticateAndRedirect();

    try {
        createAndEditCertificateSchema.parse(values);

        const certificate: CertificateType = await prisma.certification.create({
            data: {
                ...values
            }
        });

        revalidatePath('/dashboard/manage-certifications');
        return certificate;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function getAllCertificationsAction(publishedOnly: boolean = false): Promise<{
    certifications: CertificateType[]
}> {
    try {
        const whereClause: Prisma.CertificationWhereInput = publishedOnly ? { isPublished: true } : {};
        const certifications: CertificateType[] = await prisma.certification.findMany({
            where: whereClause,
        })
        return { certifications };
    } catch (error) {
        console.log(error);
        return { certifications: [] };
    }
}


export async function deleteCertificationAction(id: string): Promise<CertificateType | null> {
    await authenticateAndRedirect();

    try {
        const certificate: CertificateType = await prisma.certification.delete({
            where: {
                id,
            },
        });
        revalidatePath('/dashboard/manage-certifications');
        revalidatePath('/certification');
        return certificate;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function getSingleCertificationAction(id: string): Promise<CertificateType | null> {
    let certification: CertificateType | null = null;

    try {
        certification = await prisma.certification.findUnique({
            where: {
                id,
            },
        });
    } catch (error) {
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
        const certificate: CertificateType = await prisma.certification.update({
            where: {
                id,
            },
            data: {
                ...values,
            },
        });
        revalidatePath('/dashboard/manage-certifications');
        revalidatePath('/certification');
        return certificate;
    } catch (error) {
        return null;
    }
}


export async function toggleCertificationPublishAction(
    id: string,
    currentStatus: boolean
): Promise<CertificateType | null> {
    await authenticateAndRedirect();

    try {
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
        console.error(error);
        return null;
    }
}