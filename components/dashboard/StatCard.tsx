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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-xl p-6 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all gradient-hover"
        >
            <div className="flex items-start justify-between">
                <div className="relative z-10">
                    <p className="text-[#a0a0a0] text-sm mb-1">{label}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>
                    {trend && (
                        <p className="text-[#707070] text-xs mt-2">{trend}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </motion.div>
    )
}
