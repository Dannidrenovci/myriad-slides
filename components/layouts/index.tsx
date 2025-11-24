import React from 'react'

interface LayoutProps {
    content: any
    onContentChange?: (newContent: any) => void
    isEditable?: boolean
}

export const TitleSlide = ({ content, onContentChange, isEditable = true }: LayoutProps) => {
    const handleEdit = (field: string, value: string) => {
        if (onContentChange) {
            onContentChange({ ...content, [field]: value })
        }
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 text-center">
            <h1
                className="text-6xl font-bold mb-6 outline-none hover:ring-2 hover:ring-white/50 rounded px-4 py-2 transition-all"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('title', e.currentTarget.textContent || '')}
            >
                {content.title || 'Title'}
            </h1>
            <h2
                className="text-3xl font-light opacity-90 outline-none hover:ring-2 hover:ring-white/50 rounded px-4 py-2 transition-all"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('subtitle', e.currentTarget.textContent || '')}
            >
                {content.subtitle || 'Subtitle'}
            </h2>
        </div>
    )
}

export const TitleAndBody = ({ content, onContentChange, isEditable = true }: LayoutProps) => {
    const handleEdit = (field: string, value: string) => {
        if (onContentChange) {
            onContentChange({ ...content, [field]: value })
        }
    }

    return (
        <div className="h-full w-full flex flex-col bg-white p-12">
            <h2
                className="text-4xl font-bold text-indigo-900 mb-8 border-b-4 border-indigo-500 pb-4 outline-none hover:ring-2 hover:ring-indigo-300 rounded px-2 transition-all"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('title', e.currentTarget.textContent || '')}
            >
                {content.title || 'Title'}
            </h2>
            <div
                className="flex-1 text-xl text-gray-700 leading-relaxed whitespace-pre-wrap outline-none hover:ring-2 hover:ring-indigo-300 rounded p-2 transition-all"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('body', e.currentTarget.textContent || '')}
            >
                {content.body || 'Body text goes here...'}
            </div>
        </div>
    )
}

export const BulletedList = ({ content, onContentChange, isEditable = true }: LayoutProps) => {
    const handleTitleEdit = (value: string) => {
        if (onContentChange) {
            onContentChange({ ...content, title: value })
        }
    }

    const handleItemEdit = (index: number, value: string) => {
        if (onContentChange) {
            const newItems = [...(content.items || content.bullets || [])]
            newItems[index] = value
            onContentChange({ ...content, items: newItems })
        }
    }

    return (
        <div className="h-full w-full flex flex-col bg-white p-12">
            <h2
                className="text-4xl font-bold text-indigo-900 mb-8 border-b-4 border-indigo-500 pb-4 outline-none hover:ring-2 hover:ring-indigo-300 rounded px-2 transition-all"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleTitleEdit(e.currentTarget.textContent || '')}
            >
                {content.title || 'Title'}
            </h2>
            <ul className="list-disc list-inside space-y-4 text-xl text-gray-700">
                {(content.items || content.bullets || ['Point 1', 'Point 2', 'Point 3']).map((bullet: string, i: number) => (
                    <li
                        key={i}
                        className="outline-none hover:ring-2 hover:ring-indigo-300 rounded px-2 transition-all"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleItemEdit(i, e.currentTarget.textContent || '')}
                    >
                        {bullet}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export const SectionHeader = ({ content, onContentChange, isEditable = true }: LayoutProps) => {
    const handleEdit = (value: string) => {
        if (onContentChange) {
            onContentChange({ ...content, title: value })
        }
    }

    return (
        <div className="h-full w-full flex items-center justify-center bg-indigo-900 text-white p-12">
            <h1
                className="text-5xl font-bold tracking-wider uppercase border-4 border-white p-8 outline-none hover:ring-2 hover:ring-white/50 rounded transition-all"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit(e.currentTarget.textContent || '')}
            >
                {content.title || 'Section Title'}
            </h1>
        </div>
    )
}

export const TwoColumn = ({ content, onContentChange, isEditable = true }: LayoutProps) => {
    const handleEdit = (field: string, value: string) => {
        if (onContentChange) {
            onContentChange({ ...content, [field]: value })
        }
    }

    return (
        <div className="h-full w-full flex flex-col bg-white p-12">
            <h2
                className="text-4xl font-bold text-indigo-900 mb-8 border-b-4 border-indigo-500 pb-4 outline-none hover:ring-2 hover:ring-indigo-300 rounded px-2 transition-all"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('title', e.currentTarget.textContent || '')}
            >
                {content.title || 'Title'}
            </h2>
            <div className="flex-1 grid grid-cols-2 gap-8">
                <div
                    className="text-lg text-gray-700 whitespace-pre-wrap outline-none hover:ring-2 hover:ring-indigo-300 rounded p-2 transition-all"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleEdit('left', e.currentTarget.textContent || '')}
                >
                    {content.left || content.leftColumn || 'Left column text...'}
                </div>
                <div
                    className="text-lg text-gray-700 whitespace-pre-wrap outline-none hover:ring-2 hover:ring-indigo-300 rounded p-2 transition-all"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleEdit('right', e.currentTarget.textContent || '')}
                >
                    {content.right || content.rightColumn || 'Right column text...'}
                </div>
            </div>
        </div>
    )
}

export const Quote = ({ content, onContentChange, isEditable = true }: LayoutProps) => {
    const handleEdit = (field: string, value: string) => {
        if (onContentChange) {
            onContentChange({ ...content, [field]: value })
        }
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 p-16">
            <blockquote
                className="text-4xl font-serif italic text-gray-800 text-center leading-relaxed outline-none hover:ring-2 hover:ring-indigo-300 rounded p-4 transition-all"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('quote', e.currentTarget.textContent || '')}
            >
                "{content.quote || 'Insert quote here'}"
            </blockquote>
            <cite
                className="mt-8 text-xl font-bold text-indigo-600 outline-none hover:ring-2 hover:ring-indigo-300 rounded px-4 py-2 transition-all"
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit('author', e.currentTarget.textContent || '')}
            >
                - {content.author || 'Author'}
            </cite>
        </div>
    )
}

// Map of layout IDs to components
export const Layouts: Record<string, React.FC<LayoutProps>> = {
    TitleSlide,
    TitleAndBody,
    BulletedList,
    SectionHeader,
    TwoColumn,
    Quote,
}
