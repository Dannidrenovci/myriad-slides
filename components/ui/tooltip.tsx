'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
    children: ReactNode
    content: string
    side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ children, content, side = 'top' }: TooltipProps) {
    return (
        <div className="group relative inline-block">
            {children}
            <div
                className={cn(
                    "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none",
                    side === 'top' && "bottom-full left-1/2 -translate-x-1/2 mb-2",
                    side === 'bottom' && "top-full left-1/2 -translate-x-1/2 mt-2",
                    side === 'left' && "right-full top-1/2 -translate-y-1/2 mr-2",
                    side === 'right' && "left-full top-1/2 -translate-y-1/2 ml-2"
                )}
            >
                {content}
                <div
                    className={cn(
                        "absolute w-2 h-2 bg-gray-900 transform rotate-45",
                        side === 'top' && "bottom-[-4px] left-1/2 -translate-x-1/2",
                        side === 'bottom' && "top-[-4px] left-1/2 -translate-x-1/2",
                        side === 'left' && "right-[-4px] top-1/2 -translate-y-1/2",
                        side === 'right' && "left-[-4px] top-1/2 -translate-y-1/2"
                    )}
                />
            </div>
        </div>
    )
}
