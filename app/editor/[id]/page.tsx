'use client'

import { use, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Undo2, Redo2, Download } from 'lucide-react'
import { Layouts } from '@/components/layouts'
import { SlideSidebar } from '@/components/editor/SlideSidebar'
import { ZoomControls } from '@/components/editor/ZoomControls'
import { LayoutSelector } from '@/components/editor/LayoutSelector'
import { TextFormatting } from '@/components/editor/TextFormatting'
import { ImageTools } from '@/components/editor/ImageTools'
import { ShapeTools } from '@/components/editor/ShapeTools'
import { useHistory } from '@/lib/useHistory'
import { cn } from '@/lib/utils'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

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
    const [zoom, setZoom] = useState(1)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // History management
    const { current: historySlides, push: pushHistory, undo, redo, canUndo, canRedo, reset } = useHistory<Slide[]>([])

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
                reset(slidesData || [])
            }
            setLoading(false)
        }

        fetchData()
    }, [id, router, reset])

    // Sync history with slides
    useEffect(() => {
        if (historySlides.length > 0 && historySlides !== slides) {
            setSlides(historySlides)
        }
    }, [historySlides])

    const currentSlide = slides[currentSlideIndex]

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault()
                    undo()
                }
                if (e.key === 'y') {
                    e.preventDefault()
                    redo()
                }
                if (e.key === 's') {
                    e.preventDefault()
                    saveAllSlides()
                }
                if (e.key === 'd') {
                    e.preventDefault()
                    handleDuplicateSlide(currentSlideIndex)
                }
            }

            if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
                e.preventDefault()
                setCurrentSlideIndex(currentSlideIndex - 1)
            }
            if (e.key === 'ArrowRight' && currentSlideIndex < slides.length - 1) {
                e.preventDefault()
                setCurrentSlideIndex(currentSlideIndex + 1)
            }

            if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement?.tagName !== 'INPUT') {
                e.preventDefault()
                handleDeleteSlide(currentSlideIndex)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentSlideIndex, slides.length, undo, redo])

    const saveAllSlides = async () => {
        for (const slide of slides) {
            await supabase
                .from('slides')
                .update({ content: slide.content, layout_id: slide.layout_id, order_index: slide.order_index })
                .eq('id', slide.id)
        }
    }

    const handleContentChange = async (newContent: any) => {
        const newSlides = [...slides]
        newSlides[currentSlideIndex] = { ...currentSlide, content: newContent }
        pushHistory(newSlides)

        // Auto-save
        await supabase
            .from('slides')
            .update({ content: newContent })
            .eq('id', currentSlide.id)
    }

    const handleLayoutChange = async (layoutId: string) => {
        const newSlides = [...slides]
        newSlides[currentSlideIndex] = { ...currentSlide, layout_id: layoutId }
        pushHistory(newSlides)

        await supabase
            .from('slides')
            .update({ layout_id: layoutId })
            .eq('id', currentSlide.id)
    }

    const handleReorderSlides = async (reorderedSlides: Slide[]) => {
        pushHistory(reorderedSlides)

        // Update database
        for (const slide of reorderedSlides) {
            await supabase
                .from('slides')
                .update({ order_index: slide.order_index })
                .eq('id', slide.id)
        }
    }

    const handleAddSlide = async () => {
        const newSlide = {
            presentation_id: id,
            order_index: slides.length,
            layout_id: 'TitleAndBody',
            content: { title: 'New Slide', body: 'Add your content here...' }
        }

        const { data, error } = await supabase
            .from('slides')
            .insert(newSlide)
            .select()
            .single()

        if (!error && data) {
            const newSlides = [...slides, data]
            pushHistory(newSlides)
            setCurrentSlideIndex(newSlides.length - 1)
        }
    }

    const handleDuplicateSlide = async (index: number) => {
        const slideToDuplicate = slides[index]
        const newSlide = {
            presentation_id: id,
            order_index: index + 1,
            layout_id: slideToDuplicate.layout_id,
            content: { ...slideToDuplicate.content }
        }

        const { data, error } = await supabase
            .from('slides')
            .insert(newSlide)
            .select()
            .single()

        if (!error && data) {
            const newSlides = [
                ...slides.slice(0, index + 1),
                data,
                ...slides.slice(index + 1).map(s => ({ ...s, order_index: s.order_index + 1 }))
            ]
            pushHistory(newSlides)
        }
    }

    const handleDeleteSlide = async (index: number) => {
        if (slides.length === 1) {
            alert('Cannot delete the last slide')
            return
        }

        const slideToDelete = slides[index]
        await supabase.from('slides').delete().eq('id', slideToDelete.id)

        const newSlides = slides
            .filter((_, i) => i !== index)
            .map((s, i) => ({ ...s, order_index: i }))

        pushHistory(newSlides)
        if (currentSlideIndex >= newSlides.length) {
            setCurrentSlideIndex(newSlides.length - 1)
        }
    }

    const handleZoomChange = (newZoom: number | 'fit') => {
        if (newZoom === 'fit') {
            // Calculate fit zoom based on container size
            setZoom(0.75)
        } else {
            setZoom(newZoom)
        }
    }

    const exportToPDF = async () => {
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [1280, 720]
        })

        for (let i = 0; i < slides.length; i++) {
            const slideElement = document.getElementById(`slide-export-${i}`)
            if (slideElement) {
                const canvas = await html2canvas(slideElement, { scale: 2 })
                const imgData = canvas.toDataURL('image/png')

                if (i > 0) pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, 0, 1280, 720)
            }
        }

        pdf.save(`${presentation?.title || 'presentation'}.pdf`)
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            {/* Top Toolbar */}
            <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <h1 className="text-lg font-semibold text-white">{presentation?.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            canUndo ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 cursor-not-allowed"
                        )}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            canRedo ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 cursor-not-allowed"
                        )}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-700 mx-2" />
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Slide Thumbnails */}
                <SlideSidebar
                    slides={slides}
                    currentSlideIndex={currentSlideIndex}
                    onSelectSlide={setCurrentSlideIndex}
                    onReorderSlides={handleReorderSlides}
                    onDuplicateSlide={handleDuplicateSlide}
                    onDeleteSlide={handleDeleteSlide}
                    onAddSlide={handleAddSlide}
                />

                {/* Main Canvas */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-8 overflow-auto">
                    <div className="mb-4">
                        <ZoomControls zoom={zoom} onZoomChange={handleZoomChange} />
                    </div>

                    {currentSlide && (
                        <div
                            className="bg-white shadow-2xl"
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: 'center',
                                width: '1280px',
                                height: '720px'
                            }}
                        >
                            {(() => {
                                const LayoutComponent = Layouts[currentSlide.layout_id] || Layouts.TitleAndBody
                                return (
                                    <LayoutComponent
                                        content={currentSlide.content}
                                        onContentChange={handleContentChange}
                                        isEditable={true}
                                    />
                                )
                            })()}
                        </div>
                    )}
                </div>

                {/* Right Panel - Editing Controls */}
                <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto p-4">
                    {currentSlide && (
                        <div className="space-y-6">
                            <LayoutSelector
                                currentLayout={currentSlide.layout_id}
                                onLayoutChange={handleLayoutChange}
                            />

                            <div className="border-t border-gray-700 pt-6">
                                <TextFormatting />
                            </div>

                            <div className="border-t border-gray-700 pt-6">
                                <ImageTools />
                            </div>

                            <div className="border-t border-gray-700 pt-6">
                                <ShapeTools />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden slides for PDF export */}
            <div className="hidden">
                {slides.map((slide, index) => {
                    const LayoutComponent = Layouts[slide.layout_id] || Layouts.TitleAndBody
                    return (
                        <div
                            key={slide.id}
                            id={`slide-export-${index}`}
                            style={{ width: '1280px', height: '720px' }}
                        >
                            <LayoutComponent content={slide.content} isEditable={false} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
