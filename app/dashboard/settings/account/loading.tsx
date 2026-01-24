import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountSettingsLoading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-44" />
                <Skeleton className="h-4 w-80" />
            </div>

            {/* Quick Info Cards skeleton */}
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="border-muted-foreground/20">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Account Card skeleton */}
            <Card className="border-muted-foreground/20 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex gap-6">
                        {/* Sidebar skeleton */}
                        <div className="w-48 space-y-2 border-r pr-6">
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>

                        {/* Content skeleton */}
                        <div className="flex-1 space-y-6">
                            <Skeleton className="h-6 w-32" />

                            {/* Profile row */}
                            <div className="flex items-center justify-between py-4 border-b">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-4 w-20" />
                            </div>

                            {/* Email row */}
                            <div className="flex items-center justify-between py-4 border-b">
                                <Skeleton className="h-4 w-32" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>

                            {/* Connected accounts row */}
                            <div className="flex items-center justify-between py-4">
                                <Skeleton className="h-4 w-36" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Tips Card skeleton */}
            <Card className="border-muted-foreground/20 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <div className="space-y-3 flex-1">
                            <Skeleton className="h-4 w-40" />
                            <div className="space-y-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Skeleton className="h-1 w-1 rounded-full" />
                                        <Skeleton className="h-3 w-full max-w-xs" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
