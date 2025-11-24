'use client'

import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface TextFormattingProps {
    onFormatChange?: (format: any) => void
}

export function TextFormatting({ onFormatChange }: TextFormattingProps) {
    const [fontSize, setFontSize] = useState(24)
    const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal')
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left')
    const [textColor, setTextColor] = useState('#000000')

    const handleFontSizeChange = (value: number) => {
        setFontSize(value)
        onFormatChange?.({ fontSize: value })
    }

    const handleFontWeightChange = (weight: 'normal' | 'bold') => {
        setFontWeight(weight)
        onFormatChange?.({ fontWeight: weight })
    }

    const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
        setTextAlign(align)
        onFormatChange?.({ textAlign: align })
    }

    const handleTextColorChange = (color: string) => {
        setTextColor(color)
        onFormatChange?.({ textColor: color })
    }

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-300">Text Formatting</h3>

            {/* Font Size */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Font Size</label>
                <input
                    type="range"
                    min="12"
                    max="72"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                    className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>12px</span>
                    <span className="font-medium text-gray-300">{fontSize}px</span>
                    <span>72px</span>
                </div>
            </div>

            {/* Font Weight */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Font Weight</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleFontWeightChange('normal')}
                        className={cn(
                            "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            fontWeight === 'normal'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                    >
                        Normal
                    </button>
                    <button
                        onClick={() => handleFontWeightChange('bold')}
                        className={cn(
                            "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",
                            fontWeight === 'bold'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                    >
                        <Bold className="w-4 h-4" />
                        Bold
                    </button>
                </div>
            </div>

            {/* Text Alignment */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Alignment</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleTextAlignChange('left')}
                        className={cn(
                            "flex-1 p-2 rounded-lg transition-colors",
                            textAlign === 'left'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                    >
                        <AlignLeft className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                        onClick={() => handleTextAlignChange('center')}
                        className={cn(
                            "flex-1 p-2 rounded-lg transition-colors",
                            textAlign === 'center'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                    >
                        <AlignCenter className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                        onClick={() => handleTextAlignChange('right')}
                        className={cn(
                            "flex-1 p-2 rounded-lg transition-colors",
                            textAlign === 'right'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                    >
                        <AlignRight className="w-4 h-4 mx-auto" />
                    </button>
                </div>
            </div>

            {/* Text Color */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Text Color</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={textColor}
                        onChange={(e) => handleTextColorChange(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer bg-transparent"
                    />
                    <input
                        type="text"
                        value={textColor}
                        onChange={(e) => handleTextColorChange(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="#000000"
                    />
                </div>
            </div>
        </div>
    )
}
