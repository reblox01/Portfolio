import { UserProfile } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Mail, User as UserIcon, Key } from "lucide-react"

export default function AccountSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your profile, email, password, and security settings
                </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-muted-foreground/20 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/10 p-2">
                                <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Profile</p>
                                <p className="text-xs text-muted-foreground">Update your details</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-muted-foreground/20 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-500/10 p-2">
                                <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-xs text-muted-foreground">Manage addresses</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-muted-foreground/20 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-500/10 p-2">
                                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Security</p>
                                <p className="text-xs text-muted-foreground">Password & 2FA</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Account Management */}
            <Card className="border-muted-foreground/20 shadow-sm">
                <CardContent className="p-6">
                    <UserProfile
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none border-0",
                                navbar: "hidden",
                                pageScrollBox: "p-0",
                            }
                        }}
                    />
                </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="border-muted-foreground/20 shadow-sm bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-amber-500/10 p-2">
                            <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Account Security Tips</h3>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-amber-500"></span>
                                    Use a strong, unique password for your account
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-amber-500"></span>
                                    Enable two-factor authentication for extra security
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-amber-500"></span>
                                    Keep your email address up to date
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-amber-500"></span>
                                    Review connected accounts regularly
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
