'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FileText, MoreVertical, Copy, Trash2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

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
    const [firstSlide, setFirstSlide] = useState<any>(null)

    useEffect(() => {
        // Fetch first slide for preview
        const fetchFirstSlide = async () => {
            const { data } = await supabase
                .from('slides')
                .select('*')
                .eq('presentation_id', presentation.id)
                .order('order_index', { ascending: true })
                .limit(1)
                .single()

            if (data) {
                setFirstSlide(data)
            }
        }
        fetchFirstSlide()
    }, [presentation.id])

    const handleClick = () => {
        router.push(`/editor/${presentation.id}`)
    }

    const timeAgo = formatDistanceToNow(new Date(presentation.created_at), { addSuffix: true })

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -6 }}
            onClick={handleClick}
            className="group bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition-all duration-300 cursor-pointer overflow-hidden relative"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5" />
            </div>

            {/* Thumbnail */}
            <div className="aspect-video bg-[#0f0f0f] flex items-center justify-center relative overflow-hidden">
                {firstSlide ? (
                    <div className="absolute inset-0 p-8 text-white text-xs">
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] h-full rounded-lg p-6 border border-[#2a2a2a]">
                            <h3 className="text-lg font-bold mb-2 line-clamp-2">
                                {firstSlide.content?.title || 'Untitled Slide'}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-3">
                                {firstSlide.content?.body || firstSlide.content?.subtitle || ''}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
                        <FileText className="w-16 h-16 text-[#2a2a2a] group-hover:text-[#ff6b35] transition-colors duration-300 relative z-10" />
                    </>
                )}

                {/* Slide Count Badge */}
                {presentation.slide_count !== undefined && (
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10 border border-[#1a1a1a]">
                        <FileText className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-300">
                            {presentation.slide_count} {presentation.slide_count === 1 ? 'slide' : 'slides'}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 relative z-10">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 transition-all duration-300">
                        {presentation.title}
                    </h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowMenu(!showMenu)
                        }}
                        className="p-1.5 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                    >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{timeAgo}</span>
                </div>

                {/* Status Badge */}
                {presentation.status === 'processing' && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className="w-full bg-[#1a1a1a] rounded-full h-1 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-pink-500 animate-pulse" style={{ width: '60%' }} />
                        </div>
                        <span className="text-xs text-orange-400">Processing...</span>
                    </div>
                )}
            </div>

            {/* Quick Actions Menu */}
            {showMenu && (
                <div className="absolute right-4 top-16 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl shadow-2xl py-1.5 z-20 min-w-[160px]">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#1a1a1a] flex items-center gap-2 transition-colors">
                        <Copy className="w-4 h-4" />
                        Duplicate
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-[#1a1a1a] flex items-center gap-2 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            )}
        </motion.div>
    )
}
