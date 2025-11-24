import { useState, useCallback } from 'react'

export function useHistory<T>(initialState: T) {
    const [history, setHistory] = useState<T[]>([initialState])
    const [currentIndex, setCurrentIndex] = useState(0)

    const current = history[currentIndex]
    const canUndo = currentIndex > 0
    const canRedo = currentIndex < history.length - 1

    const push = useCallback((newState: T) => {
        const newHistory = history.slice(0, currentIndex + 1)
        newHistory.push(newState)
        setHistory(newHistory)
        setCurrentIndex(newHistory.length - 1)
    }, [history, currentIndex])

    const undo = useCallback(() => {
        if (canUndo) {
            setCurrentIndex(currentIndex - 1)
        }
    }, [canUndo, currentIndex])

    const redo = useCallback(() => {
        if (canRedo) {
            setCurrentIndex(currentIndex + 1)
        }
    }, [canRedo, currentIndex])

    const reset = useCallback((newState: T) => {
        setHistory([newState])
        setCurrentIndex(0)
    }, [])

    return { current, push, undo, redo, canUndo, canRedo, reset }
}
