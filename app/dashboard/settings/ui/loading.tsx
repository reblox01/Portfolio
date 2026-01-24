import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function UiSettingsLoading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* UI Features Card skeleton */}
            <Card className="border-muted-foreground/20 shadow-sm">
                <CardContent className="pt-6">
                    {/* Toggle setting skeleton */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-full max-w-md" />
                        </div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>

                    {/* Save button skeleton */}
                    <div className="flex justify-end mt-6">
                        <Skeleton className="h-10 w-28" />
                    </div>
                </CardContent>
            </Card>

            {/* About Card skeleton */}
            <Card className="border-muted-foreground/20 shadow-sm">
                <CardHeader className="pb-4">
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="pt-2 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="mt-4 p-3 rounded-md border">
                        <Skeleton className="h-4 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
