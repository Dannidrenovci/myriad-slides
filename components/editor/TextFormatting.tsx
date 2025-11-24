'use client'

import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface TextFormattingProps {
    onFormatChange?: (format: any) => void
}

const FONT_FAMILIES = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Verdana', label: 'Verdana' },
]

export function TextFormatting({ onFormatChange }: TextFormattingProps) {
    const [fontFamily, setFontFamily] = useState('Inter')
    const [fontSize, setFontSize] = useState(24)
    const [fontWeight, setFontWeight] = useState<'light' | 'normal' | 'bold'>('normal')
    const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left')
    const [textColor, setTextColor] = useState('#000000')
    const [lineHeight, setLineHeight] = useState(1.5)
    const [listType, setListType] = useState<'none' | 'bullet' | 'numbered'>('none')

    const handleFontFamilyChange = (value: string) => {
        setFontFamily(value)
        onFormatChange?.({ fontFamily: value })
    }

    const handleFontSizeChange = (value: number) => {
        setFontSize(value)
        onFormatChange?.({ fontSize: value })
    }

    const handleFontWeightChange = (weight: 'light' | 'normal' | 'bold') => {
        setFontWeight(weight)
        onFormatChange?.({ fontWeight: weight })
    }

    const handleTextAlignChange = (align: 'left' | 'center' | 'right' | 'justify') => {
        setTextAlign(align)
        onFormatChange?.({ textAlign: align })
    }

    const handleTextColorChange = (color: string) => {
        setTextColor(color)
        onFormatChange?.({ textColor: color })
    }

    const handleLineHeightChange = (value: number) => {
        setLineHeight(value)
        onFormatChange?.({ lineHeight: value })
    }

    const handleListTypeChange = (type: 'none' | 'bullet' | 'numbered') => {
        setListType(type)
        onFormatChange?.({ listType: type })
    }

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-300">Text Formatting</h3>

            {/* Font Family */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Font Family</label>
                <select
                    value={fontFamily}
                    onChange={(e) => handleFontFamilyChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                >
                    {FONT_FAMILIES.map(font => (
                        <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                            {font.label}
                        </option>
                    ))}
                </select>
            </div>

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
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => handleFontWeightChange('light')}
                        className={cn(
                            "px-3 py-2 rounded-lg text-sm font-light transition-colors",
                            fontWeight === 'light'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                    >
                        Light
                    </button>
                    <button
                        onClick={() => handleFontWeightChange('normal')}
                        className={cn(
                            "px-3 py-2 rounded-lg text-sm font-normal transition-colors",
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
                            "px-3 py-2 rounded-lg text-sm font-bold transition-colors",
                            fontWeight === 'bold'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                    >
                        Bold
                    </button>
                </div>
            </div>

            {/* Text Alignment */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Alignment</label>
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() => handleTextAlignChange('left')}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            textAlign === 'left'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                        title="Align left"
                    >
                        <AlignLeft className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                        onClick={() => handleTextAlignChange('center')}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            textAlign === 'center'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                        title="Align center"
                    >
                        <AlignCenter className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                        onClick={() => handleTextAlignChange('right')}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            textAlign === 'right'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                        title="Align right"
                    >
                        <AlignRight className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                        onClick={() => handleTextAlignChange('justify')}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            textAlign === 'justify'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                        title="Justify"
                    >
                        <AlignJustify className="w-4 h-4 mx-auto" />
                    </button>
                </div>
            </div>

            {/* Line Spacing */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">Line Spacing</label>
                <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => handleLineHeightChange(Number(e.target.value))}
                    className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1.0</span>
                    <span className="font-medium text-gray-300">{lineHeight.toFixed(1)}</span>
                    <span>3.0</span>
                </div>
            </div>

            {/* List Controls */}
            <div>
                <label className="text-xs text-gray-400 block mb-2">List Type</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => handleListTypeChange('none')}
                        className={cn(
                            "px-3 py-2 rounded-lg text-sm transition-colors",
                            listType === 'none'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                        title="No list"
                    >
                        None
                    </button>
                    <button
                        onClick={() => handleListTypeChange('bullet')}
                        className={cn(
                            "p-2 rounded-lg transition-colors flex items-center justify-center",
                            listType === 'bullet'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                        title="Bullet list"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleListTypeChange('numbered')}
                        className={cn(
                            "p-2 rounded-lg transition-colors flex items-center justify-center",
                            listType === 'numbered'
                                ? "bg-blue-500 text-white"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-700"
                        )}
                        title="Numbered list"
                    >
                        <ListOrdered className="w-4 h-4" />
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
