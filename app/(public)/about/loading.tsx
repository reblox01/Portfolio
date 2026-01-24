import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
    return (
        <div className="relative min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-48 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>

                {/* Content skeleton */}
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-11/12" />
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-8 w-56" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-8 w-72" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
