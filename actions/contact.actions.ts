'use server';

import prisma from "@/db";
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ContactType, createAndEditContactSchema, CreateAndEditContactType, updateContactSchema } from '@/lib/types/contact-types';

// Function to authenticate the user and redirect if not authenticated
function authenticateAndRedirect(): string {
    const { userId } = auth();
    if (!userId) redirect('/');
    return userId;
}

// Function to create a new contact
export async function createContactAction(values: CreateAndEditContactType): Promise<ContactType | null> {
    const userId = authenticateAndRedirect();
    try {
        createAndEditContactSchema.parse(values);

        const contactRaw = await prisma.contact.create({
            data: {
                // allow creating with only public contact fields or full SMTP fields
                email: values.email,
                smtpEmail: (values as any).smtpEmail || undefined,
                emailPassword: (values as any).emailPassword || undefined,
                phone: values.phone,
                address: values.address,
                smtpServer: (values as any).smtpServer || undefined,
                smtpPort: (values as any).smtpPort || undefined,
                smtpUsername: (values as any).smtpUsername || undefined,
                smtpPassword: (values as any).smtpPassword || undefined,
                emailIntegration: (values as any).emailIntegration ?? false,
                emailProvider: (values as any).emailProvider || undefined,
                mailboxSettings: (values as any).mailboxSettings || undefined,
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
    const userId = authenticateAndRedirect();
    try {
        const contact: ContactType = await prisma.contact.delete({
            where: { id },
        });
        return contact;
    } catch (error) {
        console.log(error);
        return null;
    }
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
    const userId = authenticateAndRedirect();
    try {
        // For updates, we'll handle the password logic here
        const existingContact = await prisma.contact.findUnique({
            where: { id }
        });
        
        if (!existingContact) {
            throw new Error("Contact not found");
        }
        
        // Use the existing emailPassword if new emailPassword is empty
        const finalEmailPassword = values.emailPassword || existingContact.emailPassword;
        
        const updateData = {
            email: values.email || existingContact.email,
            smtpEmail: (values as any).smtpEmail || existingContact.smtpEmail,
            emailPassword: finalEmailPassword,
            phone: values.phone || existingContact.phone,
            address: values.address || existingContact.address,
            smtpServer: values.smtpServer || existingContact.smtpServer,
            smtpPort: values.smtpPort || existingContact.smtpPort,
            smtpUsername: values.smtpUsername || existingContact.smtpUsername,
            smtpPassword: values.smtpPassword || existingContact.smtpPassword,
            emailIntegration: values.emailIntegration ?? existingContact.emailIntegration,
            emailProvider: values.emailProvider || existingContact.emailProvider,
            mailboxSettings: values.mailboxSettings || existingContact.mailboxSettings,
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
        return updatedContact;
    } catch (error) {
        console.log(error);
        return null;
    }
}
