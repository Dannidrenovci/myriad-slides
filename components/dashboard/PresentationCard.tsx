'use client'

import { motion } from 'framer-motion'
import { Play, Share2, MoreVertical, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { scaleIn, hoverLift } from '@/lib/animations'

interface Presentation {
    id: string
    title: string
    created_at: string
    status: string
    slide_count?: number
}

interface PresentationCardProps {
    presentation: Presentation
}

export function PresentationCard({ presentation }: PresentationCardProps) {
    const router = useRouter()
    const slideCount = presentation.slide_count || 0
    const isProcessing = presentation.status === 'processing'

    // Calculate time ago
    const timeAgo = new Date(presentation.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    })

    return (
        <motion.div
            variants={scaleIn}
            {...hoverLift}
            onClick={() => !isProcessing && router.push(`/editor/${presentation.id}`)}
            className={cn(
                "group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300",
                !isProcessing && "cursor-pointer"
            )}
        >
            {/* Thumbnail with gradient overlay */}
            <div className="relative aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
                {/* TODO: Actual slide thumbnail */}
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-indigo-300 dark:text-indigo-700">
                    {presentation.title.charAt(0).toUpperCase()}
                </div>

                {/* Hover overlay with actions */}
                {!isProcessing && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); router.push(`/editor/${presentation.id}`) }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Play className="w-4 h-4" /> Present
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); /* TODO: Share */ }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); /* TODO: More actions */ }}
                                className="ml-auto px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 rounded-lg text-sm font-medium transition-colors"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Card content */}
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {presentation.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {slideCount} {slideCount === 1 ? 'slide' : 'slides'} · Updated {timeAgo}
                        </p>
                    </div>

                    {/* Status badge */}
                    {presentation.status === 'ready' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Ready
                        </span>
                    )}
                </div>
            </div>

            {/* Processing indicator overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            AI is analyzing your slides...
                        </p>
                        <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
                            <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-progress" />
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
