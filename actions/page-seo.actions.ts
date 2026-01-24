"use server";

import prisma from "@/db";
import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import { siteConfig } from "@/site.config";
import * as z from "zod";

async function authenticateAndRedirect(): Promise<string> {
    const { userId } = await auth();
    if (!userId) redirect('/');
    return userId;
}

// Validation schema
const pageSeoSchema = z.object({
    path: z.string().min(1, "Path is required").regex(/^\//, "Path must start with /"),
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    noIndex: z.boolean().default(false),
});

// Auto-seed default pages from site.config.ts
// NOTE: Store only base titles here. The root layout template will add " - ${siteConfig.name}"
const DEFAULT_PAGES = [
    { path: "/", title: siteConfig.name, description: siteConfig.description, keywords: siteConfig.meta.keywords },
    { path: "/about", title: "About", description: siteConfig.description, keywords: siteConfig.meta.keywords },
    { path: "/projects", title: "Projects", description: `View projects by ${siteConfig.name}`, keywords: siteConfig.meta.keywords },
    { path: "/experience", title: "Experience", description: `Professional experience of ${siteConfig.name}`, keywords: siteConfig.meta.keywords },
    { path: "/education", title: "Education", description: `Educational background of ${siteConfig.name}`, keywords: siteConfig.meta.keywords },
    { path: "/certification", title: "Certifications", description: `Professional certifications of ${siteConfig.name}`, keywords: siteConfig.meta.keywords },
    { path: "/contact", title: "Contact", description: `Get in touch with ${siteConfig.name}`, keywords: siteConfig.meta.keywords },
    { path: "/techstack", title: "Tech Stack", description: `Technologies used by ${siteConfig.name}`, keywords: siteConfig.meta.keywords },
];

export async function getAllPageSeoAction() {
    try {
        let pages = await prisma.pageSEO.findMany({
            orderBy: { path: 'asc' }
        });

        // Auto-seed if DB is empty
        if (pages.length === 0) {
            pages = await Promise.all(
                DEFAULT_PAGES.map(page =>
                    prisma.pageSEO.create({ data: page })
                )
            );
        }

        return { pages };
    } catch (error) {
        console.error("Error getting page SEO:", error);
        return { error: "Failed to get page SEO" };
    }
}

export async function getPageSeoByPathAction(path: string) {
    try {
        const page = await prisma.pageSEO.findUnique({
            where: { path }
        });

        return { page };
    } catch (error) {
        console.error("Error getting page SEO by path:", error);
        return { error: "Failed to get page SEO" };
    }
}

export async function upsertPageSeoAction(data: z.infer<typeof pageSeoSchema>) {
    // Authenticate admin
    await authenticateAndRedirect();

    try {
        // Validate input
        const validated = pageSeoSchema.parse(data);

        const page = await prisma.pageSEO.upsert({
            where: { path: validated.path },
            update: {
                title: validated.title,
                description: validated.description,
                keywords: validated.keywords,
                noIndex: validated.noIndex,
            },
            create: validated,
        });

        return { page };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        console.error("Error upserting page SEO:", error);
        return { error: "Failed to update page SEO" };
    }
}

export async function deletePageSeoAction(id: string) {
    // Authenticate admin
    await authenticateAndRedirect();

    try {
        await prisma.pageSEO.delete({
            where: { id }
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting page SEO:", error);
        return { error: "Failed to delete page SEO" };
    }
}
