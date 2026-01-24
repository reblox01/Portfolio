import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ManageCertificationsLoading() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-8 w-56" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-36" />
                </div>
            </div>

            {/* Table skeleton */}
            <div className="rounded-md border">
                {/* Table header */}
                <div className="flex items-center gap-4 px-4 py-3 border-b bg-muted/50">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32 flex-1" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Table rows */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-4 border-b last:border-0">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
