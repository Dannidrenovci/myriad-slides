'use client'

import { FileText, AlignLeft, List, Heading, Columns, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LayoutSelectorProps {
    currentLayout: string
    onLayoutChange: (layoutId: string) => void
}

const LAYOUTS = [
    { id: 'TitleSlide', name: 'Title Slide', icon: FileText },
    { id: 'TitleAndBody', name: 'Title & Body', icon: AlignLeft },
    { id: 'BulletedList', name: 'Bulleted List', icon: List },
    { id: 'SectionHeader', name: 'Section Header', icon: Heading },
    { id: 'TwoColumn', name: 'Two Column', icon: Columns },
    { id: 'Quote', name: 'Quote', icon: MessageSquare },
]

export function LayoutSelector({ currentLayout, onLayoutChange }: LayoutSelectorProps) {
    return (
        <div className="mb-6">
            <label className="text-sm font-medium text-gray-300 mb-3 block">Layout</label>
            <div className="grid grid-cols-2 gap-2">
                {LAYOUTS.map(layout => {
                    const Icon = layout.icon
                    return (
                        <button
                            key={layout.id}
                            onClick={() => onLayoutChange(layout.id)}
                            className={cn(
                                "p-3 rounded-lg border-2 transition-all text-left",
                                currentLayout === layout.id
                                    ? "border-blue-500 bg-blue-500/10"
                                    : "border-gray-700 hover:border-gray-600 bg-gray-900/50"
                            )}
                        >
                            <Icon className="w-5 h-5 mb-1 text-gray-400" />
                            <p className="text-xs font-medium text-gray-300">{layout.name}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
