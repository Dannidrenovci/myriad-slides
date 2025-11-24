'use client'

import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ZoomControlsProps {
    zoom: number
    onZoomChange: (zoom: number | 'fit') => void
}

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5]

export function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
    const currentZoomIndex = ZOOM_LEVELS.indexOf(zoom)
    const canZoomIn = currentZoomIndex < ZOOM_LEVELS.length - 1
    const canZoomOut = currentZoomIndex > 0

    const handleZoomIn = () => {
        if (canZoomIn) {
            onZoomChange(ZOOM_LEVELS[currentZoomIndex + 1])
        }
    }

    const handleZoomOut = () => {
        if (canZoomOut) {
            onZoomChange(ZOOM_LEVELS[currentZoomIndex - 1])
        }
    }

    return (
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
                onClick={handleZoomOut}
                disabled={!canZoomOut}
                className={cn(
                    "p-2 rounded transition-colors",
                    canZoomOut
                        ? "hover:bg-gray-700 text-gray-300"
                        : "text-gray-600 cursor-not-allowed"
                )}
                title="Zoom out"
            >
                <ZoomOut className="w-4 h-4" />
            </button>

            <select
                value={zoom}
                onChange={(e) => onZoomChange(Number(e.target.value))}
                className="bg-transparent text-gray-300 text-sm font-medium px-2 py-1 rounded hover:bg-gray-700 cursor-pointer outline-none"
            >
                {ZOOM_LEVELS.map(level => (
                    <option key={level} value={level} className="bg-gray-800">
                        {Math.round(level * 100)}%
                    </option>
                ))}
            </select>

            <button
                onClick={handleZoomIn}
                disabled={!canZoomIn}
                className={cn(
                    "p-2 rounded transition-colors",
                    canZoomIn
                        ? "hover:bg-gray-700 text-gray-300"
                        : "text-gray-600 cursor-not-allowed"
                )}
                title="Zoom in"
            >
                <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-700" />

            <button
                onClick={() => onZoomChange('fit')}
                className="p-2 rounded hover:bg-gray-700 text-gray-300 transition-colors"
                title="Fit to screen"
            >
                <Maximize2 className="w-4 h-4" />
            </button>
        </div>
    )
}
