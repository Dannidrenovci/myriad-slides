'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { HeroSection } from '@/components/dashboard/HeroSection'
import { PresentationCard } from '@/components/dashboard/PresentationCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { PresentationCardSkeleton } from '@/components/ui/skeleton'
import { staggerContainer, listItem } from '@/lib/animations'

interface Presentation {
    id: string
    title: string
    created_at: string
    status: string
    slide_count?: number
}

export default function DashboardPage() {
    const [presentations, setPresentations] = useState<Presentation[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchPresentations = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('presentations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching presentations:', error)
            } else {
                // Fetch slide counts for each presentation
                const presentationsWithCounts = await Promise.all(
                    (data || []).map(async (pres) => {
                        const { count } = await supabase
                            .from('slides')
                            .select('*', { count: 'exact', head: true })
                            .eq('presentation_id', pres.id)

                        return { ...pres, slide_count: count || 0 }
                    })
                )
                setPresentations(presentationsWithCounts)
            }
            setLoading(false)
        }

        fetchPresentations()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold gradient-text">
                                Myriad Slides
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <HeroSection />

            {/* Main Content */}
            <main className="py-12">
                <div className="mx-auto max-w-7xl px-6">
                    {loading ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <motion.div key={i} variants={listItem}>
                                    <PresentationCardSkeleton />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : presentations.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {presentations.map((presentation) => (
                                <motion.div key={presentation.id} variants={listItem}>
                                    <PresentationCard presentation={presentation} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    )
}
