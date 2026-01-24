import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ManageAdminLoading() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-40" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-28" />
                </div>
            </div>

            {/* Admin Card skeleton */}
            <Card className="border-muted-foreground/20">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <Skeleton className="h-32 w-32 rounded-full mx-auto md:mx-0" />

                        {/* Details */}
                        <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-36" />
                                </div>
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-44" />
                                </div>
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>

                            {/* Social links */}
                            <div className="flex gap-2 flex-wrap">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-8 w-8 rounded" />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
