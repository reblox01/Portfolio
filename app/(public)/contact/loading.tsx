import { Skeleton } from "@/components/ui/skeleton"

export default function ContactLoading() {
    return (
        <div className="relative min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-48 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact info skeleton */}
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-56" />
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-5 w-48" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact form skeleton */}
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48" />
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-32 w-full rounded-md" />
                            <Skeleton className="h-10 w-32 rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
