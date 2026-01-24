'use server';

import prisma from "@/db";
import {
    CreateAndEditProjectType,
    Project,
    createAndEditProjectSchema,
} from "@/lib/types/project-types";

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { validateObjectId, validateObjectIds } from '@/lib/validation';
import { apiRateLimit, getClientIp } from '@/lib/rate-limit';
import { headers } from 'next/headers';


async function authenticateAndRedirect(): Promise<string | null> {
    const { userId } = await auth();
    if (!userId) {
        redirect('/');
        return null;
    }

    // Rate Limiting Check
    const ip = getClientIp(await headers());
    const { success } = await apiRateLimit.limit(ip);
    if (!success) {
        throw new Error("Rate limit exceeded. Please try again later.");
    }

    return userId;
}



export async function createProjectAction(values: CreateAndEditProjectType): Promise<Project | null> {
    await authenticateAndRedirect();

    try {
        createAndEditProjectSchema.parse(values);

        const project: Project = await prisma.project.create({
            data: {
                ...values,
                liveURL: values.liveURL ?? undefined,
                sourceURL: values.sourceURL ?? undefined,
                isPublished: values.isPublished ?? true,
            }
        });

        return project;
    } catch (error) {
        console.log(error);
        return null;
    }
}


import { getSortSettingsAction } from "./sortSettings.actions";

export const getAllProjectsAction = async (publishedOnly: boolean = false): Promise<{
    projects: Project[];
    sortType: string;
}> => {
    try {
        const whereClause = publishedOnly ? { isPublished: true } : {};

        // Fetch sort settings
        const settings = await getSortSettingsAction();
        const sortType = settings.projectSortType || 'newest';

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

        const projects: Project[] = await prisma.project.findMany({
            where: whereClause,
            orderBy: orderBy,
        });
        return { projects, sortType };
    } catch (error) {
        console.log(error);
        return { projects: [], sortType: 'newest' };
    }
}

export async function reorderProjectsAction(items: { id: string; displayOrder: number }[]): Promise<boolean> {
    await authenticateAndRedirect();

    try {
        await prisma.$transaction(
            items.map((item) =>
                prisma.project.update({
                    where: { id: item.id },
                    data: { displayOrder: item.displayOrder }
                })
            )
        );

        revalidatePath('/dashboard/manage-projects');
        revalidatePath('/projects');
        return true;
    } catch (error) {
        console.error("Error reordering projects:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}

function shuffleProjects(projects: Project[]): Project[] {
    // Deep copy the original array to avoid mutating the original array
    const shuffledProjects = [...projects];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledProjects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledProjects[i], shuffledProjects[j]] = [shuffledProjects[j], shuffledProjects[i]];
    }

    return shuffledProjects;
}

export async function getRandomProjectsAction(): Promise<{
    source: string; title: string; link: string; thumbnail: string; oneLiner?: string
}[]> {
    try {
        const randomProjects = await prisma.project.findMany({
            where: { isPublished: true },
            take: 15,
            orderBy: {
                id: 'asc'
            }
        });

        const shuffledProjects = shuffleProjects(randomProjects);

        // Map and filter out projects with a null link
        const projects = shuffledProjects
            .filter(project => project.liveURL !== null)
            .map(project => ({
                title: project.title,
                link: project.liveURL as string,
                source: project.sourceURL as string,
                thumbnail: project.screenshot,
                oneLiner: (project as any).oneLiner || project.oneLiner || project.oneLiner === undefined ? (project as any).oneLiner ?? project.oneLiner ?? "" : "",
                techStack: project.techStack || []
            }));

        return projects;
    } catch (error) {
        console.error('Error fetching and mapping random projects:', error);
        throw error;
    }
}


export async function getSingleProjectAction(id: string): Promise<Project | null> {
    let project: Project | null = null;

    try {
        validateObjectId(id);
        project = await prisma.project.findUnique({
            where: {
                id,
            },
        });
    } catch (error) {
        console.error("Error fetching project:", error instanceof Error ? error.message : "Unknown error");
        project = null;
    }
    if (!project) {
        redirect('/dashboard/manage-projects');
    }
    return project;
}

export async function deleteProjectAction(id: string): Promise<Project | null> {
    const userId = await authenticateAndRedirect();
    if (!userId) {
        return null;
    }

    try {
        validateObjectId(id);
        const project: Project = await prisma.project.delete({
            where: {
                id,
            },
        });
        revalidatePath('/dashboard/manage-projects');
        revalidatePath('/projects');
        return project;
    } catch (error) {
        console.error("Error deleting project:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function bulkDeleteProjectsAction(ids: string[]): Promise<boolean> {
    const userId = await authenticateAndRedirect();
    if (!userId) return false;

    try {
        validateObjectIds(ids);
        await prisma.project.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        revalidatePath('/dashboard/manage-projects');
        revalidatePath('/projects');
        return true;
    } catch (error) {
        console.error("Bulk delete error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}

export async function bulkTogglePublishProjectsAction(ids: string[], isPublished: boolean): Promise<boolean> {
    const userId = await authenticateAndRedirect();
    if (!userId) return false;

    try {
        validateObjectIds(ids);
        await prisma.project.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                isPublished
            }
        });
        revalidatePath('/dashboard/manage-projects');
        revalidatePath('/projects');
        return true;
    } catch (error) {
        console.error("Bulk toggle publish error:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}

export async function toggleProjectPublishAction(
    id: string,
    currentStatus: boolean
): Promise<Project | null> {
    await authenticateAndRedirect();

    try {
        validateObjectId(id);
        const project: Project = await prisma.project.update({
            where: {
                id,
            },
            data: {
                isPublished: !currentStatus,
            },
        });
        revalidatePath('/dashboard/manage-projects');
        revalidatePath('/projects');
        return project;
    } catch (error) {
        console.error("Error toggling project publish:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}

export async function updateProjectAction(
    id: string,
    values: CreateAndEditProjectType
): Promise<Project | null> {
    const userId = await authenticateAndRedirect();
    if (!userId) {
        return null;
    }

    try {
        validateObjectId(id);
        createAndEditProjectSchema.parse(values);

        const project: Project = await prisma.project.update({
            where: {
                id,
            },
            data: {
                ...values,
                liveURL: values.liveURL ?? undefined,
                sourceURL: values.sourceURL ?? undefined,
                isPublished: values.isPublished ?? true,
            },
        });
        revalidatePath('/dashboard/manage-projects');
        revalidatePath('/projects');
        return project;
    } catch (error) {
        console.error("Error updating project:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}