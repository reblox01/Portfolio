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


async function authenticateAndRedirect(): Promise<string | null> {
    const { userId } = await auth();
    if (!userId) {
        redirect('/');
        return null;
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


export const getAllProjectsAction = async (publishedOnly: boolean = false) => {
    try {
        const whereClause = publishedOnly ? { isPublished: true } : {};
        const projects = await prisma.project.findMany({
            where: whereClause,
        });
        return { projects };
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

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
        project = await prisma.project.findUnique({
            where: {
                id,
            },
        });
    } catch (error) {
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
        const project: Project = await prisma.project.delete({
            where: {
                id,
            },
        });
        return project;
    } catch (error) {
        return null;
    }
}

export async function bulkDeleteProjectsAction(ids: string[]): Promise<boolean> {
    const userId = await authenticateAndRedirect();
    if (!userId) return false;

    try {
        await prisma.project.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        revalidatePath('/dashboard/manage-projects');
        revalidatePath('/projects');
        return true;
    } catch (error) {
        console.error("Bulk delete error:", error);
        return false;
    }
}

export async function bulkTogglePublishProjectsAction(ids: string[], isPublished: boolean): Promise<boolean> {
    const userId = await authenticateAndRedirect();
    if (!userId) return false;

    try {
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
        console.error("Bulk toggle publish error:", error);
        return false;
    }
}

export async function toggleProjectPublishAction(
    id: string,
    currentStatus: boolean
): Promise<Project | null> {
    await authenticateAndRedirect();

    try {
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
        console.error(error);
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
        return null;
    }
}