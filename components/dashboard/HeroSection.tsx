'use client'

import { motion } from 'framer-motion'
import { Sparkles, LayoutTemplate, Upload } from 'lucide-react'
import { fadeInUp } from '@/lib/animations'
import UploadButton from './UploadButton'

export function HeroSection() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="blob blob-purple animate-blob" />
                <div className="blob blob-pink animate-blob animation-delay-2000" />
                <div className="blob blob-cyan animate-blob animation-delay-4000" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                >
                    <h1 className="text-5xl font-bold gradient-text">
                        Your Presentations
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                        Create stunning slides in seconds with AI
                    </p>
                </motion.div>

                {/* Quick actions */}
                <motion.div
                    className="mt-8 flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <UploadButton />
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow">
                        <Sparkles className="w-5 h-5" />
                        Start from AI
                    </button>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                        <LayoutTemplate className="w-5 h-5" />
                        Browse Templates
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
