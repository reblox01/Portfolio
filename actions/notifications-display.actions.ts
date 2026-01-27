'use server'

import prisma from "@/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function getNotificationsAction() {
    try {
        const { userId } = await auth();
        if (!userId) return { notifications: [] };

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
        const notification = await prisma.notification.create({
            data: {
                type: data.type,
                title: data.title,
                message: data.message,
                data: data.data || {}
            }
        })

        revalidatePath('/dashboard')
        return notification
    } catch (error) {
        console.error("Error creating notification:", error)
        return null
    }
}
