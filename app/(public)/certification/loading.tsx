import { Skeleton } from "@/components/ui/skeleton"

export default function CertificationLoading() {
    return (
        <div className="relative min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>

                {/* Certifications grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="border rounded-lg p-6 space-y-4">
                            <Skeleton className="h-32 w-full rounded-md" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
