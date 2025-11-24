'use client'

import { Upload, X, Crop } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface ImageToolsProps {
    onImageAdd?: (imageUrl: string) => void
    onImageRemove?: () => void
    currentImage?: string
}

export function ImageTools({ onImageAdd, onImageRemove, currentImage }: ImageToolsProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB')
            return
        }

        setUploading(true)
        setUploadProgress(0)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`

            const { data, error } = await supabase.storage
                .from('images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) throw error

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(fileName)

            setUploadProgress(100)
            onImageAdd?.(publicUrl)
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image. Please try again.')
        } finally {
            setUploading(false)
            setUploadProgress(0)
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Image Tools</h3>

            {currentImage ? (
                <div className="space-y-3">
                    {/* Current Image Preview */}
                    <div className="relative aspect-video bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700">
                        <img
                            src={currentImage}
                            alt="Current"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Image Actions */}
                    <div className="grid grid-cols-2 gap-2">
                        <label className="btn-secondary btn-sm cursor-pointer">
                            <Upload className="w-4 h-4" />
                            Replace
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                        <button
                            onClick={onImageRemove}
                            className="btn-secondary btn-sm text-red-400 hover:text-red-300"
                        >
                            <X className="w-4 h-4" />
                            Remove
                        </button>
                    </div>

                    {/* Crop/Fit Options */}
                    <div>
                        <label className="text-xs text-gray-400 block mb-2">Image Fit</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button className="px-3 py-2 bg-gray-900/50 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
                                Cover
                            </button>
                            <button className="px-3 py-2 bg-gray-900/50 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
                                Contain
                            </button>
                            <button className="px-3 py-2 bg-gray-900/50 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
                                Fill
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block">
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Click to upload image</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>

                    {uploading && (
                        <div className="mt-3">
                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-center">Uploading...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
