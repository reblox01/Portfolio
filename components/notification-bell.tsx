"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState, useRef } from "react"
import { markAsReadAction, markAllAsReadAction, getNotificationsAction, getUnreadCountAction } from "@/actions/notifications-display.actions"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
    id: string
    title: string
    message: string
    read: boolean
    createdAt: Date
    type: string
}

import { showBrowserNotification } from "@/utils/browser-notifications"

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const lastNotifIdRef = useRef<string | null>(null)

    const fetchNotifications = async () => {
        const [notifsData, countData] = await Promise.all([
            getNotificationsAction(),
            getUnreadCountAction()
        ])

        const latestNotif = notifsData.notifications[0]

        // Check for new notification to trigger browser alert
        if (latestNotif && !latestNotif.read && latestNotif.id !== lastNotifIdRef.current) {
            // Only notify if we have a new ID and it's less than 1 minute old
            // to avoid spamming on page load of old unread stuff
            const now = new Date().getTime()
            const notifTime = new Date(latestNotif.createdAt).getTime()

            if (now - notifTime < 60000) {
                showBrowserNotification(latestNotif.title, {
                    body: latestNotif.message,
                    tag: latestNotif.id
                })
            }

            lastNotifIdRef.current = latestNotif.id
        }

        setNotifications(notifsData.notifications)
        setUnreadCount(countData.count)
    }

    useEffect(() => {
        fetchNotifications()

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        await markAsReadAction(id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const handleMarkAllRead = async () => {
        await markAllAsReadAction()
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (open) fetchNotifications()
        }}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto px-2"
                            onClick={handleMarkAllRead}
                        >
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                                onClick={() => !notification.read && handleMarkAsRead(notification.id, {} as any)}
                            >
                                <div className="flex w-full justify-between gap-2">
                                    <span className={`text-sm font-medium ${!notification.read ? 'text-primary' : ''}`}>
                                        {notification.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                </p>
                                {!notification.read && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 absolute left-1 top-4" />
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center text-xs" asChild>
                    <a href="/dashboard/settings/notifications">Manage notifications</a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
