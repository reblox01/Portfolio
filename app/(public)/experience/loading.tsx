import { Skeleton } from "@/components/ui/skeleton"

export default function ExperienceLoading() {
    return (
        <div className="relative min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>

                {/* Timeline skeleton */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-6">
                            {/* Timeline dot */}
                            <div className="flex flex-col items-center">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                {i < 3 && <Skeleton className="h-full w-0.5 mt-2" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-8 space-y-3">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-7 w-3/4" />
                                <Skeleton className="h-5 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="flex gap-2 mt-4">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-18 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
