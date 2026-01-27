import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsLoading() {
    return (
        <div className="space-y-6">
            {/* Page Header skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid gap-6">
                {/* Generate 3 card skeletons for Email, Security, System */}
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-6 w-48" />
                            </div>
                            <Skeleton className="h-4 w-72 mt-2" />
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            {/* Two toggle rows per card */}
                            {Array.from({ length: 2 }).map((_, j) => (
                                <div key={j} className="flex items-center justify-between space-x-4">
                                    <div className="div flex flex-col space-y-2 w-full">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-full max-w-sm" />
                                    </div>
                                    <Skeleton className="h-6 w-11 rounded-full" /> {/* Switch shape */}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
