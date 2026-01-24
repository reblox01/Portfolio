import { Skeleton } from "@/components/ui/skeleton"

export default function ManageExperienceLoading() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-8 w-52" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-36" />
                </div>
            </div>

            <div className="rounded-md border">
                <div className="flex items-center gap-4 px-4 py-3 border-b bg-muted/50">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32 flex-1" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-4 border-b last:border-0">
                        <Skeleton className="h-4 w-4" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-28" />
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
