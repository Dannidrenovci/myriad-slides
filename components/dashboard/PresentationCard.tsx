'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FileText, MoreVertical, Copy, Trash2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

interface PresentationCardProps {
    presentation: {
        id: string
        title: string
        created_at: string
        status: string
        slide_count?: number
    }
}

export function PresentationCard({ presentation }: PresentationCardProps) {
    const router = useRouter()
    const [showMenu, setShowMenu] = useState(false)

    const handleClick = () => {
        router.push(`/editor/${presentation.id}`)
    }

    const timeAgo = formatDistanceToNow(new Date(presentation.created_at), { addSuffix: true })

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            onClick={handleClick}
            className="group bg-[#2a2a2a] rounded-xl border border-[#404040] hover:border-[#FFB4A3] transition-all cursor-pointer overflow-hidden"
        >
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-[#3a3a3a] to-[#2a2a2a] flex items-center justify-center relative">
                <FileText className="w-16 h-16 text-[#505050] group-hover:text-[#FFB4A3] transition-colors" />

                {/* Slide Count Badge */}
                {presentation.slide_count !== undefined && (
                    <div className="absolute bottom-3 right-3 bg-[#1a1a1a]/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#a0a0a0]" />
                        <span className="text-xs font-medium text-[#a0a0a0]">
                            {presentation.slide_count} {presentation.slide_count === 1 ? 'slide' : 'slides'}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white line-clamp-1 group-hover:text-[#FFB4A3] transition-colors">
                        {presentation.title}
                    </h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowMenu(!showMenu)
                        }}
                        className="p-1 hover:bg-[#3a3a3a] rounded transition-colors"
                    >
                        <MoreVertical className="w-4 h-4 text-[#a0a0a0]" />
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#707070]">
                    <Clock className="w-3 h-3" />
                    <span>{timeAgo}</span>
                </div>

                {/* Status Badge */}
                {presentation.status === 'processing' && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className="w-full bg-[#3a3a3a] rounded-full h-1 overflow-hidden">
                            <div className="h-full bg-[#FFB4A3] animate-pulse" style={{ width: '60%' }} />
                        </div>
                        <span className="text-xs text-[#FFB4A3]">Processing...</span>
                    </div>
                )}
            </div>

            {/* Quick Actions Menu */}
            {showMenu && (
                <div className="absolute right-4 top-16 bg-[#333333] border border-[#505050] rounded-lg shadow-xl py-1 z-10 min-w-[160px]">
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3a3a3a] flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        Duplicate
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-[#FF9B85] hover:bg-[#3a3a3a] flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            )}
        </motion.div>
    )
}
