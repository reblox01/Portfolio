import { Skeleton } from "@/components/ui/skeleton"

export default function EducationLoading() {
    return (
        <div className="relative min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-56 mx-auto mb-4" />
                    <Skeleton className="h-6 w-80 mx-auto" />
                </div>

                {/* Education cards skeleton */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="border rounded-lg p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
