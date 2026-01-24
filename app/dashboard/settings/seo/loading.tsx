import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SeoSettingsLoading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Card skeleton */}
            <Card className="border-muted-foreground/20 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-10 w-28" />
                    </div>
                </CardHeader>
                <CardContent className="pt-2">
                    {/* Table header skeleton */}
                    <div className="flex items-center gap-4 py-3 border-b">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32 flex-1" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Table rows skeleton */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 py-4 border-b last:border-0">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-48 flex-1" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
