'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { LogOut, FileText, Layers, Clock, HardDrive, Upload, Sparkles, LayoutTemplate } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { PresentationCard } from '@/components/dashboard/PresentationCard'
import { SearchBar } from '@/components/dashboard/SearchBar'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { PresentationCardSkeleton } from '@/components/ui/skeleton'

interface Presentation {
    id: string
    title: string
    created_at: string
    status: string
    slide_count?: number
}

export default function DashboardPage() {
    const [presentations, setPresentations] = useState<Presentation[]>([])
    const [filteredPresentations, setFilteredPresentations] = useState<Presentation[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [stats, setStats] = useState({
        totalPresentations: 0,
        totalSlides: 0,
        recentCount: 0,
        storageUsed: '0 MB'
    })
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Fetch presentations with slide counts
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
                setFilteredPresentations(presentationsWithCounts)

                // Calculate stats
                const totalSlides = presentationsWithCounts.reduce((sum, p) => sum + (p.slide_count || 0), 0)
                const recentCount = presentationsWithCounts.filter(p => {
                    const dayAgo = new Date()
                    dayAgo.setDate(dayAgo.getDate() - 7)
                    return new Date(p.created_at) > dayAgo
                }).length

                setStats({
                    totalPresentations: presentationsWithCounts.length,
                    totalSlides,
                    recentCount,
                    storageUsed: `${(totalSlides * 0.5).toFixed(1)} MB` // Rough estimate
                })
            }
            setLoading(false)
        }

        fetchData()
    }, [router])

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPresentations(presentations)
        } else {
            const filtered = presentations.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredPresentations(filtered)
        }
    }, [searchQuery, presentations])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] gradient-mesh">
            {/* Navigation */}
            <nav className="bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-[#2a2a2a]">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 gradient-orange-pink rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold text-white">
                                Myriad Slides
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="py-8">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                        <p className="text-[#a0a0a0]">Manage your presentations and create stunning slides</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            value={stats.totalPresentations}
                            label="Total Presentations"
                            icon={FileText}
                            color="peach"
                        />
                        <StatCard
                            value={stats.totalSlides}
                            label="Total Slides"
                            icon={Layers}
                            color="coral"
                        />
                        <StatCard
                            value={stats.recentCount}
                            label="Recent Activity"
                            icon={Clock}
                            trend="Last 7 days"
                            color="purple"
                        />
                        <StatCard
                            value={stats.storageUsed}
                            label="Storage Used"
                            icon={HardDrive}
                            color="blue"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <button className="flex items-center gap-3 p-4 gradient-orange-pink animate-gradient rounded-xl text-white font-medium hover:shadow-2xl hover:shadow-orange-500/30 transition-all transform hover:scale-105">
                            <Upload className="w-5 h-5" />
                            Upload PPTX
                        </button>
                        <button className="flex items-center gap-3 p-4 gradient-blue-purple animate-gradient rounded-xl text-white font-medium hover:shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:scale-105">
                            <Sparkles className="w-5 h-5" />
                            Start from AI
                        </button>
                        <button className="flex items-center gap-3 p-4 gradient-teal-yellow animate-gradient rounded-xl text-white font-medium hover:shadow-2xl hover:shadow-teal-500/30 transition-all transform hover:scale-105">
                            <LayoutTemplate className="w-5 h-5" />
                            Browse Templates
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                    </div>

                    {/* Presentations Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Your Presentations</h2>
                            <span className="text-sm text-[#707070]">
                                {filteredPresentations.length} {filteredPresentations.length === 1 ? 'presentation' : 'presentations'}
                            </span>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <PresentationCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredPresentations.length === 0 ? (
                            searchQuery ? (
                                <div className="text-center py-12">
                                    <p className="text-[#a0a0a0]">No presentations found matching "{searchQuery}"</p>
                                </div>
                            ) : (
                                <EmptyState />
                            )
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredPresentations.map((presentation) => (
                                    <PresentationCard key={presentation.id} presentation={presentation} />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
