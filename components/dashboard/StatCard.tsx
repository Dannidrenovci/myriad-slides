'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatCardProps {
    value: string | number
    label: string
    icon: LucideIcon
    trend?: string
    color?: 'peach' | 'coral' | 'purple' | 'blue'
}

const colorClasses = {
    peach: 'gradient-orange-pink',
    coral: 'gradient-pink-purple',
    purple: 'gradient-blue-purple',
    blue: 'gradient-teal-yellow',
}

export function StatCard({ value, label, icon: Icon, trend, color = 'peach' }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#111111] rounded-2xl p-6 border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all duration-200"
        >
            <div className="flex items-start justify-between">
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm mb-1">{label}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>
                    {trend && (
                        <p className="text-gray-500 text-xs mt-2">{trend}</p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </motion.div>
    )
}
