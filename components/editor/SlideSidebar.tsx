'use client'

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { SlideThumbnail } from './SlideThumbnail'

interface Slide {
    id: string
    layout_id: string
    content: any
    order_index: number
}

interface SlideSidebarProps {
    slides: Slide[]
    currentSlideIndex: number
    onSelectSlide: (index: number) => void
    onReorderSlides: (slides: Slide[]) => void
    onDuplicateSlide: (index: number) => void
    onDeleteSlide: (index: number) => void
    onAddSlide: () => void
}

export function SlideSidebar({
    slides,
    currentSlideIndex,
    onSelectSlide,
    onReorderSlides,
    onDuplicateSlide,
    onDeleteSlide,
    onAddSlide,
}: SlideSidebarProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = slides.findIndex(s => s.id === active.id)
            const newIndex = slides.findIndex(s => s.id === over.id)

            const newSlides = [...slides]
            const [movedSlide] = newSlides.splice(oldIndex, 1)
            newSlides.splice(newIndex, 0, movedSlide)

            // Update order_index
            const reorderedSlides = newSlides.map((slide, index) => ({
                ...slide,
                order_index: index
            }))

            onReorderSlides(reorderedSlides)
        }
    }

    return (
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300">Slides</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        {slides.map((slide, index) => (
                            <SlideThumbnail
                                key={slide.id}
                                slide={slide}
                                index={index}
                                isActive={index === currentSlideIndex}
                                onSelect={() => onSelectSlide(index)}
                                onDuplicate={() => onDuplicateSlide(index)}
                                onDelete={() => onDeleteSlide(index)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={onAddSlide}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Slide
                </button>
            </div>
        </div>
    )
}
