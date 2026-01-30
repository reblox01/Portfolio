'use server';

import prisma from "@/db";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ContactType, createAndEditContactSchema, CreateAndEditContactType, updateContactSchema } from '@/lib/types/contact-types';
import { apiRateLimit, getClientIp } from '@/lib/rate-limit';
import { headers } from 'next/headers';
// Removed top-level sanitization import

// Function to authenticate the user and redirect if not authenticated
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

// Function to create a new contact
export async function createContactAction(values: CreateAndEditContactType): Promise<ContactType | null> {
    await authenticateAndRedirect();
    try {
        const { sanitizeObject } = await import('@/lib/sanitizer');
        const validated = createAndEditContactSchema.parse(values);
        const sanitized = sanitizeObject(validated);

        const contactRaw = await prisma.contact.create({
            data: {
                // allow creating with only public contact fields or full SMTP fields
                email: sanitized.email,
                smtpEmail: (sanitized as any).smtpEmail || undefined,
                emailPassword: (sanitized as any).emailPassword || undefined,
                phone: sanitized.phone,
                address: sanitized.address,
                smtpServer: (sanitized as any).smtpServer || undefined,
                smtpPort: (sanitized as any).smtpPort || undefined,
                smtpUsername: (sanitized as any).smtpUsername || undefined,
                smtpPassword: (sanitized as any).smtpPassword || undefined,
                emailIntegration: (sanitized as any).emailIntegration ?? false,
                emailProvider: (sanitized as any).emailProvider || undefined,
                mailboxSettings: (sanitized as any).mailboxSettings || undefined,
            }
        });


        // Normalize null values from Prisma to undefined for our ContactType
        const contact: ContactType = {
            id: (contactRaw as any).id,
            email: (contactRaw as any).email,
            smtpEmail: (contactRaw as any).smtpEmail ?? undefined,
            emailPassword: (contactRaw as any).emailPassword ?? undefined,
            phone: (contactRaw as any).phone,
            address: (contactRaw as any).address,
            smtpServer: (contactRaw as any).smtpServer ?? undefined,
            smtpPort: (contactRaw as any).smtpPort ?? undefined,
            smtpUsername: (contactRaw as any).smtpUsername ?? undefined,
            smtpPassword: (contactRaw as any).smtpPassword ?? undefined,
            emailIntegration: (contactRaw as any).emailIntegration,
            emailProvider: (contactRaw as any).emailProvider ?? undefined,
            mailboxSettings: (contactRaw as any).mailboxSettings ?? undefined,
        };

        revalidatePath('/dashboard/manage-contact');
        return contact;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Function to get all contacts
export async function getAllContactsAction(): Promise<{
    contacts: ContactType[]
}> {
    try {
        const contactsRaw = await prisma.contact.findMany({});
        const contacts: ContactType[] = (contactsRaw as any[]).map((c) => ({
            id: c.id,
            email: c.email,
            smtpEmail: c.smtpEmail ?? undefined,
            emailPassword: c.emailPassword ?? undefined,
            phone: c.phone,
            address: c.address,
            smtpServer: c.smtpServer ?? undefined,
            smtpPort: c.smtpPort ?? undefined,
            smtpUsername: c.smtpUsername ?? undefined,
            smtpPassword: c.smtpPassword ?? undefined,
            emailIntegration: c.emailIntegration,
            emailProvider: c.emailProvider ?? undefined,
            mailboxSettings: c.mailboxSettings ?? undefined,
        }));
        return { contacts };
    } catch (error) {
        console.log(error);
        return { contacts: [] };
    }
}

// Function to delete a contact by ID
export async function deleteContactAction(id: string): Promise<ContactType | null> {
    const userId = await authenticateAndRedirect();
    let contact: ContactType | null = null;
    try {
        contact = await prisma.contact.delete({
            where: { id },
        }) as ContactType;
    } catch (error) {
        console.error("Error deleting contact:", error);
        return null;
    }
    revalidatePath('/dashboard/manage-contact');
    return contact;
}

// Function to get a single contact by ID
export async function getSingleContactAction(id: string): Promise<ContactType | null> {
    try {
        const contactRaw = await prisma.contact.findUnique({
            where: { id },
        });
        const contact = contactRaw ? {
            id: (contactRaw as any).id,
            email: (contactRaw as any).email,
            smtpEmail: (contactRaw as any).smtpEmail ?? undefined,
            emailPassword: (contactRaw as any).emailPassword ?? undefined,
            phone: (contactRaw as any).phone,
            address: (contactRaw as any).address,
            smtpServer: (contactRaw as any).smtpServer ?? undefined,
            smtpPort: (contactRaw as any).smtpPort ?? undefined,
            smtpUsername: (contactRaw as any).smtpUsername ?? undefined,
            smtpPassword: (contactRaw as any).smtpPassword ?? undefined,
            emailIntegration: (contactRaw as any).emailIntegration,
            emailProvider: (contactRaw as any).emailProvider ?? undefined,
            mailboxSettings: (contactRaw as any).mailboxSettings ?? undefined,
        } : null;
        if (!contact) {
            redirect('/dashboard/manage-contact');
        }
        return contact;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Function to update a contact by ID
export async function updateContactAction(
    id: string,
    values: any
): Promise<ContactType | null> {
    await authenticateAndRedirect();
    try {
        const { sanitizeObject } = await import('@/lib/sanitizer');
        const validated = updateContactSchema.parse(values);
        const sanitized = sanitizeObject(validated);

        // For updates, we'll handle the password logic here
        const existingContact = await prisma.contact.findUnique({
            where: { id }
        });

        if (!existingContact) {
            throw new Error("Contact not found");
        }

        // Use the existing emailPassword if new emailPassword is empty
        const finalEmailPassword = sanitized.emailPassword || existingContact.emailPassword;

        const updateData = {
            email: sanitized.email || existingContact.email,
            smtpEmail: (sanitized as any).smtpEmail || existingContact.smtpEmail,
            emailPassword: finalEmailPassword,
            phone: sanitized.phone || existingContact.phone,
            address: sanitized.address || existingContact.address,
            smtpServer: sanitized.smtpServer || existingContact.smtpServer,
            smtpPort: sanitized.smtpPort || existingContact.smtpPort,
            smtpUsername: sanitized.smtpUsername || existingContact.smtpUsername,
            smtpPassword: sanitized.smtpPassword || existingContact.smtpPassword,
            emailIntegration: sanitized.emailIntegration ?? existingContact.emailIntegration,
            emailProvider: sanitized.emailProvider || existingContact.emailProvider,
            mailboxSettings: sanitized.mailboxSettings || existingContact.mailboxSettings,
        };

        const contactRaw = await prisma.contact.update({
            where: { id },
            data: updateData,
        });


        const updatedContact: ContactType = {
            id: (contactRaw as any).id,
            email: (contactRaw as any).email,
            smtpEmail: (contactRaw as any).smtpEmail ?? undefined,
            emailPassword: (contactRaw as any).emailPassword ?? undefined,
            phone: (contactRaw as any).phone,
            address: (contactRaw as any).address,
            smtpServer: (contactRaw as any).smtpServer ?? undefined,
            smtpPort: (contactRaw as any).smtpPort ?? undefined,
            smtpUsername: (contactRaw as any).smtpUsername ?? undefined,
            smtpPassword: (contactRaw as any).smtpPassword ?? undefined,
            emailIntegration: (contactRaw as any).emailIntegration,
            emailProvider: (contactRaw as any).emailProvider ?? undefined,
            mailboxSettings: (contactRaw as any).mailboxSettings ?? undefined,
        };
        revalidatePath('/dashboard/manage-contact');
        return updatedContact;
    } catch (error) {
        console.log(error);
        return null;
    }
}
