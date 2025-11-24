import React from 'react'

export const TitleSlide = ({ content }: { content: any }) => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 text-center">
        <h1 className="text-6xl font-bold mb-6">{content.title || 'Title'}</h1>
        <h2 className="text-3xl font-light opacity-90">{content.subtitle || 'Subtitle'}</h2>
    </div>
)

export const TitleAndBody = ({ content }: { content: any }) => (
    <div className="h-full w-full flex flex-col bg-white p-12">
        <h2 className="text-4xl font-bold text-indigo-900 mb-8 border-b-4 border-indigo-500 pb-4">{content.title || 'Title'}</h2>
        <div className="flex-1 text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content.body || 'Body text goes here...'}
        </div>
    </div>
)

export const BulletedList = ({ content }: { content: any }) => (
    <div className="h-full w-full flex flex-col bg-white p-12">
        <h2 className="text-4xl font-bold text-indigo-900 mb-8 border-b-4 border-indigo-500 pb-4">{content.title || 'Title'}</h2>
        <ul className="list-disc list-inside space-y-4 text-xl text-gray-700">
            {(content.bullets || ['Point 1', 'Point 2', 'Point 3']).map((bullet: string, i: number) => (
                <li key={i}>{bullet}</li>
            ))}
        </ul>
    </div>
)

export const SectionHeader = ({ content }: { content: any }) => (
    <div className="h-full w-full flex items-center justify-center bg-indigo-900 text-white p-12">
        <h1 className="text-5xl font-bold tracking-wider uppercase border-4 border-white p-8">
            {content.title || 'Section Title'}
        </h1>
    </div>
)

export const TwoColumn = ({ content }: { content: any }) => (
    <div className="h-full w-full flex flex-col bg-white p-12">
        <h2 className="text-4xl font-bold text-indigo-900 mb-8 border-b-4 border-indigo-500 pb-4">{content.title || 'Title'}</h2>
        <div className="flex-1 grid grid-cols-2 gap-8">
            <div className="text-lg text-gray-700 whitespace-pre-wrap">{content.leftColumn || 'Left column text...'}</div>
            <div className="text-lg text-gray-700 whitespace-pre-wrap">{content.rightColumn || 'Right column text...'}</div>
        </div>
    </div>
)

export const Quote = ({ content }: { content: any }) => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 p-16">
        <blockquote className="text-4xl font-serif italic text-gray-800 text-center leading-relaxed">
            "{content.quote || 'Insert quote here'}"
        </blockquote>
        <cite className="mt-8 text-xl font-bold text-indigo-600">- {content.author || 'Author'}</cite>
    </div>
)

// Map of layout IDs to components
export const Layouts: Record<string, React.FC<{ content: any }>> = {
    TitleSlide,
    TitleAndBody,
    BulletedList,
    SectionHeader,
    TwoColumn,
    Quote,
}
