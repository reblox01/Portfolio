'use server';

import prisma from "@/db";
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ContactType, createAndEditContactSchema, CreateAndEditContactType } from '@/lib/types/contact-types';

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

        const contact: ContactType = await prisma.contact.create({
            data: {
                ...values
            }
        });

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
        const contacts: ContactType[] = await prisma.contact.findMany({});
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
        const contact = await prisma.contact.findUnique({
            where: { id },
        });
        if (!contact) {
            redirect('/admin-dashboard/manage-contact');
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
    values: CreateAndEditContactType
): Promise<ContactType | null> {
    const userId = authenticateAndRedirect();
    try {
        createAndEditContactSchema.parse(values);

        const contact: ContactType = await prisma.contact.update({
            where: { id },
            data: { ...values },
        });
        return contact;
    } catch (error) {
        console.log(error);
        return null;
    }
}
