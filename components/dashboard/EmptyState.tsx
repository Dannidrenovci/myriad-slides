'use client'

import { motion } from 'framer-motion'
import { FileText, Sparkles, Upload, Wand2 } from 'lucide-react'
import { fadeInUp } from '@/lib/animations'
import UploadButton from './UploadButton'

export function EmptyState() {
    return (
        <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center py-16"
        >
            {/* Animated illustration */}
            <div className="relative w-64 h-64 mx-auto mb-8">
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <FileText className="w-full h-full text-indigo-200 dark:text-indigo-800" />
                </motion.div>

                {/* Floating sparkles */}
                <motion.div
                    className="absolute top-0 right-0"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                No presentations yet
            </h3>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Upload a PowerPoint or start from scratch
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <UploadButton />
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                    <Wand2 className="w-5 h-5" />
                    Create with AI
                </button>
            </div>
        </motion.div>
    )
}
