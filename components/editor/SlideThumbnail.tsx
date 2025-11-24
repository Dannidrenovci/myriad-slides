'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Layouts } from '@/components/layouts'

interface Slide {
    id: string
    layout_id: string
    content: any
    order_index: number
}

interface SlideThumbnailProps {
    slide: Slide
    index: number
    isActive: boolean
    onSelect: () => void
    onDuplicate: () => void
    onDelete: () => void
}

export function SlideThumbnail({
    slide,
    index,
    isActive,
    onSelect,
    onDuplicate,
    onDelete,
}: SlideThumbnailProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: slide.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const LayoutComponent = Layouts[slide.layout_id] || Layouts.TitleAndBody

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onSelect}
            className={cn(
                "group relative rounded-lg overflow-hidden cursor-pointer mb-3 transition-all",
                isActive
                    ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/50"
                    : "hover:ring-2 hover:ring-gray-500"
            )}
        >
            {/* Thumbnail Preview */}
            <div className="aspect-video bg-white relative overflow-hidden">
                <div
                    className="absolute inset-0 origin-top-left pointer-events-none"
                    style={{
                        transform: 'scale(0.15)',
                        width: '666.67%',
                        height: '666.67%'
                    }}
                >
                    <LayoutComponent content={slide.content} isEditable={false} />
                </div>
            </div>

            {/* Slide Number */}
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                {index + 1}
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                    className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
                    title="Duplicate slide"
                >
                    <Copy className="w-4 h-4 text-gray-900" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-2 bg-white hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete slide"
                >
                    <Trash2 className="w-4 h-4 text-red-600" />
                </button>
            </div>
        </div>
    )
}
