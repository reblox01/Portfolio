'use server'

import prisma from "@/db"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { apiRateLimit, getClientIp } from "@/lib/rate-limit"
import { headers } from "next/headers"
// Removed top-level sanitization import

export async function getSmtpStatusAction() {
    try {
        const contact = await prisma.contact.findFirst()

        if (!contact) return { configured: false }

        // Check if SMTP is configured - either through emailIntegration flag
        // OR if any SMTP fields are populated (smtpServer, smtpEmail, etc.)
        const hasSmtpFields = !!(
            contact.smtpServer ||
            contact.smtpEmail ||
            contact.smtpUsername ||
            contact.smtpPassword
        )

        const configured = contact.emailIntegration === true || hasSmtpFields

        return {
            configured,
            provider: contact.emailProvider || null
        }
    } catch (error) {
        console.error("Error checking SMTP status:", error)
        return { configured: false }
    }
}

export async function getNotificationSettingsAction() {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        // Find the first settings document (assuming single user dashboard for now)
        let settings = await prisma.notificationSettings.findFirst()

        if (!settings) {
            settings = await prisma.notificationSettings.create({
                data: {
                    emailContact: true,
                    emailContact_method: "browser",
                    emailMarketing: false,
                    emailMarketing_method: "browser",
                    securityLogin: true,
                    securityLogin_method: "browser",
                    securityChanges: true,
                    securityChanges_method: "browser",
                    systemUpdates: true,
                    systemUpdates_method: "browser",
                    systemMaintenance: false,
                    systemMaintenance_method: "browser"
                }
            })
        }

        return settings
    } catch (error) {
        console.error("Error fetching notification settings:", error)
        return null
    }
}

export async function updateNotificationSettingsAction(data: {
    emailContact: boolean;
    emailContact_method: string;
    emailMarketing: boolean;
    emailMarketing_method: string;
    securityLogin: boolean;
    securityLogin_method: string;
    securityChanges: boolean;
    securityChanges_method: string;
    systemUpdates: boolean;
    systemUpdates_method: string;
    systemMaintenance: boolean;
    systemMaintenance_method: string;
}) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // Rate Limiting
        const ip = getClientIp(await headers());
        const { success } = await apiRateLimit.limit(ip);
        if (!success) throw new Error("Rate limit exceeded");

        const { sanitizeObject } = await import('@/lib/sanitizer');
        const sanitized = sanitizeObject(data);

        const settings = await prisma.notificationSettings.findFirst()

        if (!settings) throw new Error("Settings not found")

        const updated = await prisma.notificationSettings.update({
            where: { id: settings.id },
            data: { ...sanitized }
        })

        revalidatePath('/dashboard/settings/notifications')
        return updated
    } catch (error) {
        console.error("Error updating notification settings:", error)
        return null
    }
}
