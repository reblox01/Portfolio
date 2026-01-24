import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsLoading() {
    return (
        <div className="relative min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-56 mx-auto mb-4" />
                    <Skeleton className="h-6 w-80 mx-auto" />
                </div>

                {/* Filter skeleton */}
                <div className="mb-8 flex justify-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full" />
                    ))}
                </div>

                {/* Projects grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
