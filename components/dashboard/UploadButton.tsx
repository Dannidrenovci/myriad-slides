'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function UploadButton() {
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }

        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        setUploading(true)

        try {
            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('presentations')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            // 2. Create record in database (initial status)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { data: presentation, error: dbError } = await supabase
                .from('presentations')
                .insert({
                    user_id: user.id,
                    title: file.name,
                    status: 'processing',
                    file_path: filePath
                })
                .select()
                .single()

            if (dbError) throw dbError

            // 3. Trigger processing API
            await fetch('/api/process-pptx', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ presentationId: presentation.id, filePath }),
            })

            // Redirect to editor
            router.push(`/editor/${presentation.id}`)
        } catch (error) {
            console.error('Error uploading:', error)
            alert('Error uploading presentation')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <label
                htmlFor="file-upload"
                className={`cursor-pointer inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {uploading ? 'Uploading...' : 'New Presentation'}
                <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pptx"
                    onChange={handleUpload}
                    disabled={uploading}
                />
            </label>
        </div>
    )
}
