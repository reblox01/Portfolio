import * as z from 'zod';

// Define the contact type
export type ContactType = {
    id: string;
    email: string;
    emailPassword?: string;
    phone: string;
    address: string;
    smtpServer?: string;
    smtpPort?: number;
    smtpUsername?: string;
    smtpPassword?: string;
    emailIntegration: boolean;
    emailProvider?: string;
    mailboxSettings?: any;
};

// Define the schema for creating and editing a contact
export const createAndEditContactSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required." })
        .email({ message: "Invalid email address." }),
    phone: z.string().min(3, {
        message: "Phone number is required and must be at least 3 characters.",
    }),
    emailPassword: z.string().optional().default(""),
    address: z.string().min(1, {
        message: 'Address is required.',
    }),
    smtpServer: z.string().optional().default(""),
    smtpPort: z.number().optional(),
    smtpUsername: z.string().optional().default(""),
    smtpPassword: z.string().optional().default(""),
    emailIntegration: z.boolean().default(false),
    emailProvider: z.string().optional().default(""),
    mailboxSettings: z.any().optional(),
});

// Schema for updates that allows empty password (keeps existing one)
export const updateContactSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required." })
        .email({ message: "Invalid email address." }),
    phone: z.string().optional().default(""),
    emailPassword: z.string().optional().default(""),
    address: z.string().optional().default(""),
    smtpServer: z.string().optional().default(""),
    smtpPort: z.number().optional(),
    smtpUsername: z.string().optional().default(""),
    smtpPassword: z.string().optional().default(""),
    emailIntegration: z.boolean().default(false),
    emailProvider: z.string().optional().default(""),
    mailboxSettings: z.any().optional(),
});

// Infer the type from the schema
export type CreateAndEditContactType = z.infer<typeof createAndEditContactSchema>;
