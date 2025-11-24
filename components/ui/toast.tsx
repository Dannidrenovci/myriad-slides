'use client'

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    type: ToastType
    message: string
    description?: string
}

let toastId = 0
const toasts: Toast[] = []
const listeners: Set<(toasts: Toast[]) => void> = new Set()

export const toast = {
    success: (message: string, description?: string) => {
        addToast({ type: 'success', message, description })
    },
    error: (message: string, description?: string) => {
        addToast({ type: 'error', message, description })
    },
    info: (message: string, description?: string) => {
        addToast({ type: 'info', message, description })
    },
    warning: (message: string, description?: string) => {
        addToast({ type: 'warning', message, description })
    },
}

function addToast(toast: Omit<Toast, 'id'>) {
    const id = String(toastId++)
    toasts.push({ ...toast, id })
    notifyListeners()

    // Auto-remove after 5 seconds
    setTimeout(() => removeToast(id), 5000)
}

function removeToast(id: string) {
    const index = toasts.findIndex(t => t.id === id)
    if (index > -1) {
        toasts.splice(index, 1)
        notifyListeners()
    }
}

function notifyListeners() {
    listeners.forEach(listener => listener([...toasts]))
}

export function Toaster() {
    const [toastList, setToastList] = useState<Toast[]>([])

    useEffect(() => {
        listeners.add(setToastList)
        return () => {
            listeners.delete(setToastList)
        }
    }, [])

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md">
            <AnimatePresence>
                {toastList.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle,
    }

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    }

    const Icon = icons[toast.type]

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 flex items-start gap-3 min-w-[320px] border border-gray-200 dark:border-gray-700"
        >
            <div className={`flex-shrink-0 w-5 h-5 rounded-full ${colors[toast.type]} flex items-center justify-center`}>
                <Icon className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {toast.message}
                </p>
                {toast.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {toast.description}
                    </p>
                )}
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    )
}
