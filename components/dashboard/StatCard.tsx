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
    peach: 'bg-[#FFB4A3]/10 text-[#FFB4A3]',
    coral: 'bg-[#FF9B85]/10 text-[#FF9B85]',
    purple: 'bg-[#9B87FF]/10 text-[#9B87FF]',
    blue: 'bg-[#87B7FF]/10 text-[#87B7FF]',
}

export function StatCard({ value, label, icon: Icon, trend, color = 'peach' }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2a2a2a] rounded-xl p-6 border border-[#404040] hover:border-[#505050] transition-all"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[#a0a0a0] text-sm mb-1">{label}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>
                    {trend && (
                        <p className="text-[#707070] text-xs mt-2">{trend}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    )
}
