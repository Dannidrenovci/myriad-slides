'use client'

import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface AddSlideButtonProps {
    onAddSlide: () => void
}

export function AddSlideButton({ onAddSlide }: AddSlideButtonProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="relative h-2 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Hover area */}
            <div className="absolute inset-0 -my-4" />

            {/* Line */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500"
            />

            {/* Add button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0
                }}
                onClick={onAddSlide}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
                title="Add slide here"
            >
                <Plus className="w-4 h-4" />
            </motion.button>
        </div>
    )
}
