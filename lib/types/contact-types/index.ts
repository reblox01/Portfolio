import * as z from 'zod';

// Define the contact type
export type ContactType = {
    id: string;
    email: string;
    phone: string;
    password: string;
    address: string;
};

// Define the schema for creating and editing a contact
export const createAndEditContactSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required." })
        .email({ message: "Invalid email address." }),
    phone: z.string().min(3, {
        message: "Phone number is required and must be at least 3 characters.",
    }),
    password: z.string().min(1, {
        message: "Password is required."
    }),
    address: z.string().min(1, {
        message: 'Address is required.',
    }),
});

// Infer the type from the schema
export type CreateAndEditContactType = z.infer<typeof createAndEditContactSchema>;
