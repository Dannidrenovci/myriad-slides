import { cn } from "@/lib/utils"

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
                className
            )}
        />
    )
}

export function PresentationCardSkeleton() {
    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            {/* Thumbnail skeleton */}
            <Skeleton className="aspect-video" />

            {/* Content skeleton */}
            <div className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 mt-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
    )
}
