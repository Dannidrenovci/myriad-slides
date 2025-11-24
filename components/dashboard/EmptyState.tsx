'use client'

import { motion } from 'framer-motion'
import { FileText, Upload } from 'lucide-react'

export function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
        >
            <div className="w-24 h-24 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-[#FFB4A3]" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">No presentations yet</h3>
            <p className="text-[#a0a0a0] text-center max-w-md mb-8">
                Get started by uploading a PowerPoint file or creating a new presentation from scratch
            </p>

            <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFB4A3] to-[#FF9B85] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#FFB4A3]/20 transition-all">
                    <Upload className="w-5 h-5" />
                    Upload PPTX
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] border border-[#404040] text-white rounded-lg font-medium hover:border-[#FFB4A3] transition-all">
                    <FileText className="w-5 h-5" />
                    Create New
                </button>
            </div>
        </motion.div>
    )
}
