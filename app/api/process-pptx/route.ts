import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { openai } from '@/lib/openai'
import officeParser from 'officeparser'
import fs from 'fs'
import path from 'path'
import os from 'os'

export async function POST(request: Request) {
    try {
        const { presentationId, filePath } = await request.json()

        if (!presentationId || !filePath) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Get the file from Supabase Storage
        const { data: fileData, error: downloadError } = await supabase.storage
            .from('presentations')
            .download(filePath)

        if (downloadError) {
            throw new Error('Failed to download file: ' + downloadError.message)
        }

        // 2. Save to temp file (Required for officeparser)
        const tempFilePath = path.join(os.tmpdir(), 'temp_' + presentationId + '.pptx')
        const buffer = Buffer.from(await fileData.arrayBuffer())
        fs.writeFileSync(tempFilePath, buffer)

        // 3. Parse PPTX
        let text = ''
        try {
            text = await new Promise((resolve, reject) => {
                officeParser.parseOffice(tempFilePath, (data: string, err: any) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            })
        } finally {
            // Cleanup temp file
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath)
            }
        }

        // 4. Send to OpenAI to determine layouts
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a presentation assistant. Analyze the following slide text and determine the best HTML layout for each slide. Available layouts: 1. TitleSlide (Title, Subtitle) 2. TitleAndBody (Title, Body text) 3. BulletedList (Title, List of items) 4. SectionHeader (Title only, centered) 5. TwoColumn (Title, Left column, Right column) 6. Quote (Quote text, Author). Return a JSON object with a "slides" array. Each slide should have: - layoutId (string, one of the names above) - content (object with fields matching the layout requirements). Example: { "slides": [ { "layoutId": "TitleSlide", "content": { "title": "My Presentation", "subtitle": "By Me" } } ] }'
                },
                {
                    role: 'user',
                    content: text,
                }
            ],
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
        })

        const result = JSON.parse(completion.choices[0].message.content || '{}')
        const slides = result.slides || []

        // 5. Save slides to Database
        const slidesToInsert = slides.map((slide: any, index: number) => ({
            presentation_id: presentationId,
            layout_id: slide.layoutId,
            content: slide.content,
            order_index: index
        }))

        const { error: slidesError } = await supabase
            .from('slides')
            .insert(slidesToInsert)

        if (slidesError) throw slidesError

        // 6. Update Presentation Status
        await supabase
            .from('presentations')
            .update({ status: 'ready' })
            .eq('id', presentationId)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Processing error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
