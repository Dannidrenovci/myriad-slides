'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search presentations..." }: SearchBarProps) {
    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#707070]" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-3 bg-[#2a2a2a] border border-[#404040] rounded-lg text-white placeholder-[#707070] focus:outline-none focus:border-[#FFB4A3] transition-colors"
            />
        </div>
    )
}
