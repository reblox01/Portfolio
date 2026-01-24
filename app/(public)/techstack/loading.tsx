import { Skeleton } from "@/components/ui/skeleton"

export default function TechstackLoading() {
    return (
        <div className="relative min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-56 mx-auto mb-4" />
                    <Skeleton className="h-6 w-80 mx-auto" />
                </div>

                {/* Categories skeleton */}
                <div className="space-y-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <div key={j} className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                                        <Skeleton className="h-16 w-16 rounded-lg" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
