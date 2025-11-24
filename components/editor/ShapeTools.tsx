'use client'

import { Square, Circle, Minus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ShapeToolsProps {
    onShapeAdd?: (shape: {
        type: 'rectangle' | 'circle' | 'line'
        color: string
        opacity: number
    }) => void
}

export function ShapeTools({ onShapeAdd }: ShapeToolsProps) {
    const [selectedShape, setSelectedShape] = useState<'rectangle' | 'circle' | 'line'>('rectangle')
    const [shapeColor, setShapeColor] = useState('#3b82f6')
    const [shapeOpacity, setShapeOpacity] = useState(100)

    const handleAddShape = () => {
        onShapeAdd?.({
            type: selectedShape,
            color: shapeColor,
            opacity: shapeOpacity / 100
        })
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Shape Tools</h3>

            {/* Shape Type Selection */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Shape Type</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setSelectedShape('rectangle')}
                        className={cn(
                            "p-3 rounded-lg transition-all border-2",
                            selectedShape === 'rectangle'
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                        )}
                        title="Rectangle"
                    >
                        <Square className="w-5 h-5 mx-auto text-gray-300" />
                    </button>
                    <button
                        onClick={() => setSelectedShape('circle')}
                        className={cn(
                            "p-3 rounded-lg transition-all border-2",
                            selectedShape === 'circle'
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                        )}
                        title="Circle"
                    >
                        <Circle className="w-5 h-5 mx-auto text-gray-300" />
                    </button>
                    <button
                        onClick={() => setSelectedShape('line')}
                        className={cn(
                            "p-3 rounded-lg transition-all border-2",
                            selectedShape === 'line'
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                        )}
                        title="Line"
                    >
                        <Minus className="w-5 h-5 mx-auto text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Shape Color */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Shape Color</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={shapeColor}
                        onChange={(e) => setShapeColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer bg-transparent"
                    />
                    <input
                        type="text"
                        value={shapeColor}
                        onChange={(e) => setShapeColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="#3b82f6"
                    />
                </div>
            </div>

            {/* Shape Opacity */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Opacity</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={shapeOpacity}
                    onChange={(e) => setShapeOpacity(Number(e.target.value))}
                    className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span className="font-medium text-gray-300">{shapeOpacity}%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Preview */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Preview</label>
                <div className="h-24 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-center">
                    {selectedShape === 'rectangle' && (
                        <div
                            className="w-16 h-12 rounded"
                            style={{
                                backgroundColor: shapeColor,
                                opacity: shapeOpacity / 100
                            }}
                        />
                    )}
                    {selectedShape === 'circle' && (
                        <div
                            className="w-16 h-16 rounded-full"
                            style={{
                                backgroundColor: shapeColor,
                                opacity: shapeOpacity / 100
                            }}
                        />
                    )}
                    {selectedShape === 'line' && (
                        <div
                            className="w-20 h-1 rounded"
                            style={{
                                backgroundColor: shapeColor,
                                opacity: shapeOpacity / 100
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Add Shape Button */}
            <button
                onClick={handleAddShape}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
                Add {selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1)}
            </button>
        </div>
    )
}
