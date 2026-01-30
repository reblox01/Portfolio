'use server'

import prisma from "@/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { apiRateLimit, getClientIp } from "@/lib/rate-limit"
import { headers } from "next/headers"

export async function getNotificationsAction() {
    try {
        const { userId } = await auth();
        if (!userId) return { notifications: [] };

        const ip = getClientIp(await headers());
        const { success } = await apiRateLimit.limit(ip);
        if (!success) return { notifications: [] };

        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to last 50 notifications
        })

        return { notifications }
    } catch (error) {
        console.error("Error fetching notifications:", error)
        return { notifications: [] }
    }
}

export async function getUnreadCountAction() {
    try {
        const { userId } = await auth();
        if (!userId) return { count: 0 };

        const count = await prisma.notification.count({
            where: { read: false }
        })

        return { count }
    } catch (error) {
        console.error("Error counting unread notifications:", error)
        return { count: 0 }
    }
}

export async function markAsReadAction(notificationId: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const headersList = await headers();
        const ip = getClientIp(headersList);
        const { success } = await apiRateLimit.limit(ip);
        if (!success) throw new Error("Rate limit exceeded");

        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        })

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Error marking notification as read:", error)
        return { success: false }
    }
}

export async function markAllAsReadAction() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const headersList = await headers();
        const ip = getClientIp(headersList);
        const { success } = await apiRateLimit.limit(ip);
        if (!success) throw new Error("Rate limit exceeded");

        await prisma.notification.updateMany({
            where: { read: false },
            data: { read: true }
        })

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Error marking all notifications as read:", error)
        return { success: false }
    }
}

export async function createNotificationAction(data: {
    type: string;
    title: string;
    message: string;
    data?: any;
}) {
    try {
        const { sanitizeObject } = await import('@/lib/sanitizer');
        const sanitized = sanitizeObject(data);

        const notification = await prisma.notification.create({
            data: {
                type: sanitized.type,
                title: sanitized.title,
                message: sanitized.message,
                data: sanitized.data || {}
            }
        })

        revalidatePath('/dashboard')
        return notification
    } catch (error) {
        console.error("Error creating notification:", error)
        return null
    }
}
