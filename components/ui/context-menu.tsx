'use client'

import { ReactNode, useEffect, useState } from 'react'

interface ContextMenuItem {
    label: string
    icon?: ReactNode
    onClick: () => void
    danger?: boolean
    disabled?: boolean
}

interface ContextMenuProps {
    items: ContextMenuItem[]
    children: ReactNode
}

export function ContextMenu({ items, children }: ContextMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleClick = () => setIsOpen(false)
        if (isOpen) {
            document.addEventListener('click', handleClick)
            return () => document.removeEventListener('click', handleClick)
        }
    }, [isOpen])

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setPosition({ x: e.clientX, y: e.clientY })
        setIsOpen(true)
    }

    return (
        <>
            <div onContextMenu={handleContextMenu}>
                {children}
            </div>

            {isOpen && (
                <div
                    className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-1 min-w-[180px]"
                    style={{ left: position.x, top: position.y }}
                >
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!item.disabled) {
                                    item.onClick()
                                    setIsOpen(false)
                                }
                            }}
                            disabled={item.disabled}
                            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${item.danger
                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    : item.disabled
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </>
    )
}
