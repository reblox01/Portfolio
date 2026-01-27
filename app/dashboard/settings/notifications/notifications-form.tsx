"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Mail, Shield, Megaphone, AlertTriangle, Settings } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"
import { updateNotificationSettingsAction } from "@/actions/notification.actions"
import Link from "next/link"
import { requestNotificationPermission, getNotificationPermission } from "@/utils/browser-notifications"

interface NotificationSettings {
    id: string
    emailContact: boolean
    emailContact_method: string
    emailMarketing: boolean
    emailMarketing_method: string
    securityLogin: boolean
    securityLogin_method: string
    securityChanges: boolean
    securityChanges_method: string
    systemUpdates: boolean
    systemUpdates_method: string
    systemMaintenance: boolean
    systemMaintenance_method: string
}

interface SmtpStatus {
    configured: boolean
    provider?: string | null
}

export default function NotificationsForm({
    initialSettings,
    smtpStatus
}: {
    initialSettings: NotificationSettings | null
    smtpStatus: SmtpStatus
}) {
    const [settings, setSettings] = useState({
        email_contact: initialSettings?.emailContact ?? true,
        email_contact_method: initialSettings?.emailContact_method ?? "browser",
        email_marketing: initialSettings?.emailMarketing ?? false,
        email_marketing_method: initialSettings?.emailMarketing_method ?? "browser",
        security_login: initialSettings?.securityLogin ?? true,
        security_login_method: initialSettings?.securityLogin_method ?? "browser",
        security_changes: initialSettings?.securityChanges ?? true,
        security_changes_method: initialSettings?.securityChanges_method ?? "browser",
        system_updates: initialSettings?.systemUpdates ?? true,
        system_updates_method: initialSettings?.systemUpdates_method ?? "browser",
        system_maintenance: initialSettings?.systemMaintenance ?? false,
        system_maintenance_method: initialSettings?.systemMaintenance_method ?? "browser"
    })

    // Check if any notification uses email delivery
    const hasEmailDelivery = useMemo(() => {
        return Object.keys(settings).some(key =>
            key.endsWith('_method') &&
            (settings[key as keyof typeof settings] === 'email' || settings[key as keyof typeof settings] === 'both')
        )
    }, [settings])

    const handleToggle = async (key: keyof typeof settings) => {
        const newState = { ...settings, [key]: !settings[key] }
        setSettings(newState)
        await persistSettings(newState)
    }

    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')

    useEffect(() => {
        setPermissionStatus(getNotificationPermission())
    }, []
    )

    // Check if any notification uses browser delivery
    const hasBrowserDelivery = useMemo(() => {
        return Object.keys(settings).some(key =>
            key.endsWith('_method') &&
            (settings[key as keyof typeof settings] === 'browser' || settings[key as keyof typeof settings] === 'both')
        )
    }, [settings])

    const handleMethodChange = async (key: keyof typeof settings, value: string) => {
        // If enabling browser notifications, request permission
        if ((value === 'browser' || value === 'both') && permissionStatus === 'default') {
            const granted = await requestNotificationPermission()
            setPermissionStatus(granted ? 'granted' : 'denied')

            if (!granted) {
                toast.error("Browser notifications blocked", {
                    description: "Please enable notifications in your browser settings to receive alerts."
                })
            }
        }

        const newState = { ...settings, [key]: value }
        setSettings(newState)
        await persistSettings(newState)
    }

    const requestPermissionManual = async () => {
        const granted = await requestNotificationPermission()
        setPermissionStatus(granted ? 'granted' : 'denied')
        if (granted) {
            toast.success("Notifications enabled")
        }
    }

    const persistSettings = async (newState: typeof settings) => {
        const result = await updateNotificationSettingsAction({
            emailContact: newState.email_contact,
            emailContact_method: newState.email_contact_method,
            emailMarketing: newState.email_marketing,
            emailMarketing_method: newState.email_marketing_method,
            securityLogin: newState.security_login,
            securityLogin_method: newState.security_login_method,
            securityChanges: newState.security_changes,
            securityChanges_method: newState.security_changes_method,
            systemUpdates: newState.system_updates,
            systemUpdates_method: newState.system_updates_method,
            systemMaintenance: newState.system_maintenance,
            systemMaintenance_method: newState.system_maintenance_method
        })

        if (result) {
            toast.success("Preferences updated", {
                description: "Your notification settings have been saved."
            })
        } else {
            toast.error("Failed to update", {
                description: "Please try again."
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Notification Preferences</h1>
                <p className="text-muted-foreground">
                    Manage how and when you receive alerts and updates
                </p>
            </div>

            {/* SMTP Warning Banner */}
            {hasEmailDelivery && !smtpStatus.configured && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <div className="flex flex-col gap-2">
                            <p className="font-medium">Email delivery requires SMTP configuration</p>
                            <p className="text-sm">
                                You have selected email notifications but haven't configured your SMTP settings yet.
                                <Link
                                    href="/dashboard/manage-contact-smtp"
                                    className="ml-1 underline font-medium inline-flex items-center gap-1 hover:opacity-80"
                                >
                                    Configure SMTP now <Settings className="h-3 w-3" />
                                </Link>
                            </p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Browser Permission Warning Banner */}
            {hasBrowserDelivery && permissionStatus !== 'granted' && (
                <Alert variant={permissionStatus === 'denied' ? "destructive" : "default"} className="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
                    <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription>
                        <div className="flex flex-col gap-2">
                            <p className="font-medium">
                                {permissionStatus === 'denied'
                                    ? "Browser notifications are blocked"
                                    : "Enable browser notifications"}
                            </p>
                            <div className="text-sm">
                                {permissionStatus === 'denied' ? (
                                    <span>You have blocked notifications for this site. Please update your browser settings to receive alerts.</span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Please allow notifications to receive alerts in your browser.</span>
                                        <button
                                            onClick={requestPermissionManual}
                                            className="underline font-medium hover:opacity-80"
                                        >
                                            Enable now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6">
                {/* Email Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-500" />
                            <CardTitle>Email Notifications</CardTitle>
                        </div>
                        <CardDescription>
                            Configure exactly which emails you want to receive.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-start justify-between space-x-4">
                            <div className="flex flex-col space-y-3 flex-1">
                                <div className="space-y-1">
                                    <Label htmlFor="contact" className="font-medium">Contact Form Submissions</Label>
                                    <p className="text-sm text-muted-foreground">Receive alerts when someone sends a message via your portfolio.</p>
                                </div>
                                <Select
                                    value={settings.email_contact_method}
                                    onValueChange={(value) => handleMethodChange('email_contact_method', value)}
                                    disabled={!settings.email_contact}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="browser">Browser only</SelectItem>
                                        <SelectItem value="email">Email only</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Switch
                                id="contact"
                                checked={settings.email_contact}
                                onCheckedChange={() => handleToggle('email_contact')}
                            />
                        </div>
                        <div className="flex items-start justify-between space-x-4">
                            <div className="flex flex-col space-y-3 flex-1">
                                <div className="space-y-1">
                                    <Label htmlFor="marketing" className="font-medium">Marketing & Tips</Label>
                                    <p className="text-sm text-muted-foreground">Receive periodic tips on portfolio optimization.</p>
                                </div>
                                <Select
                                    value={settings.email_marketing_method}
                                    onValueChange={(value) => handleMethodChange('email_marketing_method', value)}
                                    disabled={!settings.email_marketing}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="browser">Browser only</SelectItem>
                                        <SelectItem value="email">Email only</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Switch
                                id="marketing"
                                checked={settings.email_marketing}
                                onCheckedChange={() => handleToggle('email_marketing')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Alerts */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-red-500" />
                            <CardTitle>Security Alerts</CardTitle>
                        </div>
                        <CardDescription>
                            Critical alerts regarding your account security.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-start justify-between space-x-4">
                            <div className="flex flex-col space-y-3 flex-1">
                                <div className="space-y-1">
                                    <Label htmlFor="security-login" className="font-medium">New Device Sign-in</Label>
                                    <p className="text-sm text-muted-foreground">Alert when your account is accessed from a new device/IP.</p>
                                </div>
                                <Select
                                    value={settings.security_login_method}
                                    onValueChange={(value) => handleMethodChange('security_login_method', value)}
                                    disabled={!settings.security_login}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="browser">Browser only</SelectItem>
                                        <SelectItem value="email">Email only</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Switch
                                id="security-login"
                                checked={settings.security_login}
                                onCheckedChange={() => handleToggle('security_login')}
                            />
                        </div>
                        <div className="flex items-start justify-between space-x-4">
                            <div className="flex flex-col space-y-3 flex-1">
                                <div className="space-y-1">
                                    <Label htmlFor="security-changes" className="font-medium">Account Changes</Label>
                                    <p className="text-sm text-muted-foreground">Alert when password or email is modified.</p>
                                </div>
                                <Select
                                    value={settings.security_changes_method}
                                    onValueChange={(value) => handleMethodChange('security_changes_method', value)}
                                    disabled={!settings.security_changes}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="browser">Browser only</SelectItem>
                                        <SelectItem value="email">Email only</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Switch
                                id="security-changes"
                                checked={settings.security_changes}
                                onCheckedChange={() => handleToggle('security_changes')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* System Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-amber-500" />
                            <CardTitle>System Updates</CardTitle>
                        </div>
                        <CardDescription>
                            Stay informed about platform changes and status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-start justify-between space-x-4">
                            <div className="flex flex-col space-y-3 flex-1">
                                <div className="space-y-1">
                                    <Label htmlFor="system-updates" className="font-medium">Feature Updates</Label>
                                    <p className="text-sm text-muted-foreground">News about new dashboard features and improvements.</p>
                                </div>
                                <Select
                                    value={settings.system_updates_method}
                                    onValueChange={(value) => handleMethodChange('system_updates_method', value)}
                                    disabled={!settings.system_updates}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="browser">Browser only</SelectItem>
                                        <SelectItem value="email">Email only</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Switch
                                id="system-updates"
                                checked={settings.system_updates}
                                onCheckedChange={() => handleToggle('system_updates')}
                            />
                        </div>
                        <div className="flex items-start justify-between space-x-4">
                            <div className="flex flex-col space-y-3 flex-1">
                                <div className="space-y-1">
                                    <Label htmlFor="maintenance" className="font-medium">Maintenance Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Heads-up for scheduled downtime or maintenance.</p>
                                </div>
                                <Select
                                    value={settings.system_maintenance_method}
                                    onValueChange={(value) => handleMethodChange('system_maintenance_method', value)}
                                    disabled={!settings.system_maintenance}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="browser">Browser only</SelectItem>
                                        <SelectItem value="email">Email only</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Switch
                                id="maintenance"
                                checked={settings.system_maintenance}
                                onCheckedChange={() => handleToggle('system_maintenance')}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
