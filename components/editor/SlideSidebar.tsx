'use client'

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Copy, Trash2, FileText } from 'lucide-react'
import { SlideThumbnail } from './SlideThumbnail'
import { AddSlideButton } from './AddSlideButton'
import { ContextMenu } from '../ui/context-menu'
import { Tooltip } from '../ui/tooltip'

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
    onAddSlideAt?: (index: number) => void
}

export function SlideSidebar({
    slides,
    currentSlideIndex,
    onSelectSlide,
    onReorderSlides,
    onDuplicateSlide,
    onDeleteSlide,
    onAddSlide,
    onAddSlideAt,
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

    const handleAddSlideAt = (index: number) => {
        if (onAddSlideAt) {
            onAddSlideAt(index)
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
                            <div key={slide.id}>
                                {/* Add slide button between slides */}
                                {index > 0 && onAddSlideAt && (
                                    <AddSlideButton onAddSlide={() => handleAddSlideAt(index)} />
                                )}

                                {/* Slide thumbnail with context menu */}
                                <ContextMenu
                                    items={[
                                        {
                                            label: 'Duplicate',
                                            icon: <Copy className="w-4 h-4" />,
                                            onClick: () => onDuplicateSlide(index)
                                        },
                                        {
                                            label: 'Delete',
                                            icon: <Trash2 className="w-4 h-4" />,
                                            onClick: () => onDeleteSlide(index),
                                            danger: true,
                                            disabled: slides.length === 1
                                        }
                                    ]}
                                >
                                    <SlideThumbnail
                                        slide={slide}
                                        index={index}
                                        isActive={index === currentSlideIndex}
                                        onSelect={() => onSelectSlide(index)}
                                        onDuplicate={() => onDuplicateSlide(index)}
                                        onDelete={() => onDeleteSlide(index)}
                                    />
                                </ContextMenu>
                            </div>
                        ))}

                        {/* Add slide button after last slide */}
                        {onAddSlideAt && slides.length > 0 && (
                            <AddSlideButton onAddSlide={() => handleAddSlideAt(slides.length)} />
                        )}
                    </SortableContext>
                </DndContext>
            </div>

            <div className="p-4 border-t border-gray-700">
                <Tooltip content="Add a new slide (Ctrl+Enter)" side="top">
                    <button
                        onClick={onAddSlide}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Slide
                    </button>
                </Tooltip>
            </div>
        </div>
    )
}
