'use server';

import prisma from "@/db";
import {
    CreateAndEditProjectType,
    Project,
    createAndEditProjectSchema,
} from "@/lib/types/project-types";

import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';


function authenticateAndRedirect(): string | null {
    const { userId } = auth();
    if (!userId) {
        redirect('/');
        return null;
    }
    return userId;
}



export async function createProjectAction(values: CreateAndEditProjectType): Promise<Project | null> {
    try {
        createAndEditProjectSchema.parse(values);

        const project: Project = await prisma.project.create({
            data: {
                ...values,
                liveURL: values.liveURL ?? undefined,
                sourceURL: values.sourceURL ?? undefined,
            }
        });

        return project;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function getAllProjectsAction(): Promise<{
    projects: Project[]
}> {
    try {
        const projects: Project[] = await prisma.project.findMany({})
        return { projects };
    } catch (error) {
        console.log(error);
        return { projects: [] };
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
  source: string; title: string; link: string; thumbnail: string 
}[]> {
    try {
        const randomProjects = await prisma.project.findMany({
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
                thumbnail: project.screenshot
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
        redirect('/admin-dashboard/manage-projects');
    }
    return project;
}

export async function deleteProjectAction(id: string): Promise<Project | null> {
    const userId = authenticateAndRedirect();
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

export async function updateProjectAction(
    id: string,
    values: CreateAndEditProjectType
): Promise<Project | null> {
    const userId = authenticateAndRedirect();
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
            },
        });
        return project;
    } catch (error) {
        return null;
    }
}