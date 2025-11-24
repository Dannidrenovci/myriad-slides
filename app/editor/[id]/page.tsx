'use client'

import { use, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Layouts } from '@/components/layouts'

interface Slide {
    id: string
    order_index: number
    layout_id: string
    content: any
}

interface Presentation {
    id: string
    title: string
}

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [presentation, setPresentation] = useState<Presentation | null>(null)
    const [slides, setSlides] = useState<Slide[]>([])
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Fetch presentation
            const { data: presData, error: presError } = await supabase
                .from('presentations')
                .select('*')
                .eq('id', id)
                .single()

            if (presError) {
                console.error('Error fetching presentation:', presError)
                return
            }
            setPresentation(presData)

            // Fetch slides
            const { data: slidesData, error: slidesError } = await supabase
                .from('slides')
                .select('*')
                .eq('presentation_id', id)
                .order('order_index', { ascending: true })

            if (slidesError) {
                console.error('Error fetching slides:', slidesError)
            } else {
                setSlides(slidesData || [])
            }
            setLoading(false)
        }

        fetchData()
    }, [id, router])

    const handleSlideClick = (index: number) => {
        setCurrentSlideIndex(index)
    }

    const exportPDF = async () => {
        if (!presentation) return
        const html2canvas = (await import('html2canvas')).default
        const jsPDF = (await import('jspdf')).default

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [1280, 720] // 16:9 aspect ratio
        })

        // We need to render all slides to capture them. 
        // For this MVP, we'll just capture the current slide as a demo, 
        // or we'd need a hidden container rendering all slides.
        // Let's try to capture the current view for now.

        const element = document.getElementById('slide-canvas')
        if (!element) return

        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            useCORS: true
        })

        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, 1280, 720)
        pdf.save(`${presentation.title}.pdf`)
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading editor...</div>
    }

    if (!presentation) {
        return <div className="flex h-screen items-center justify-center">Presentation not found</div>
    }

    const currentSlide = slides[currentSlideIndex]

    return (
        <div className="flex h-screen flex-col bg-gray-100 overflow-hidden">
            {/* Toolbar */}
            <header className="flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                        ← Back
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">{presentation.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportPDF}
                        className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        Export PDF (Current Slide)
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 overflow-y-auto border-r bg-gray-50 p-4">
                    <div className="space-y-4">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                onClick={() => handleSlideClick(index)}
                                className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${index === currentSlideIndex
                                    ? 'border-indigo-600 ring-2 ring-indigo-100'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="aspect-video w-full bg-white shadow-sm flex items-center justify-center text-xs text-gray-400">
                                    Slide {index + 1}
                                </div>
                                <div className="mt-1 text-center text-xs font-medium text-gray-500">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Canvas */}
                <main className="flex-1 overflow-y-auto bg-gray-200 p-8 flex items-center justify-center">
                    <div id="slide-canvas" className="aspect-video w-full max-w-5xl bg-white shadow-lg rounded-sm overflow-hidden relative">
                        {currentSlide ? (
                            <div className="h-full w-full shadow-2xl">
                                {(() => {
                                    const LayoutComponent = Layouts[currentSlide.layout_id] || Layouts.TitleAndBody
                                    return <LayoutComponent
                                        content={currentSlide.content}
                                        onContentChange={async (newContent) => {
                                            // Update local state immediately
                                            const newSlides = [...slides]
                                            newSlides[currentSlideIndex] = { ...currentSlide, content: newContent }
                                            setSlides(newSlides)

                                            // Auto-save to database
                                            await supabase
                                                .from('slides')
                                                .update({ content: newContent })
                                                .eq('id', currentSlide.id)
                                        }}
                                    />
                                })()}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                No slides
                            </div>
                        )}
                    </div>
                </main>

                {/* Editor Panel (Right) - Optional, maybe inline editing is better? */}
                {/* For now, let's stick to inline or a simple right panel if needed. 
            User asked for "Editor (with slides on the left, edit features on the right)"
        */}
                <aside className="w-80 overflow-y-auto border-l bg-white p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Edit Slide</h3>
                    {currentSlide && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Layout</label>
                                <input
                                    type="text"
                                    value={currentSlide.layout_id}
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 sm:text-sm px-3 py-2"
                                />
                            </div>

                            {Object.keys(currentSlide.content).map((key) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                                    {Array.isArray(currentSlide.content[key]) ? (
                                        <div className="space-y-2 mt-1">
                                            {currentSlide.content[key].map((item: string, i: number) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newContent = { ...currentSlide.content }
                                                        newContent[key][i] = e.target.value
                                                        const newSlides = [...slides]
                                                        newSlides[currentSlideIndex] = { ...currentSlide, content: newContent }
                                                        setSlides(newSlides)
                                                    }}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <textarea
                                            rows={4}
                                            value={currentSlide.content[key]}
                                            onChange={(e) => {
                                                const newContent = { ...currentSlide.content }
                                                newContent[key] = e.target.value
                                                const newSlides = [...slides]
                                                newSlides[currentSlideIndex] = { ...currentSlide, content: newContent }
                                                setSlides(newSlides)
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                        />
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={async () => {
                                    const { error } = await supabase
                                        .from('slides')
                                        .update({ content: currentSlide.content })
                                        .eq('id', currentSlide.id)

                                    if (error) {
                                        alert('Error saving slide')
                                    } else {
                                        alert('Slide saved!')
                                    }
                                }}
                                className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    )
}
