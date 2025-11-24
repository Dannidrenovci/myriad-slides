import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { openai } from '@/lib/openai'
import officeParser from 'officeparser'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Create a Supabase client with service role for server-side operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export async function POST(request: Request) {
    try {
        const { presentationId, filePath } = await request.json()

        if (!presentationId || !filePath) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Get the file from Supabase Storage
        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
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

        console.log('Extracted text from PPTX:', text)

        // 4. Send to OpenAI to determine layouts and extract content
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a presentation assistant. Analyze the following text extracted from a PowerPoint presentation and convert it into structured slides.

Your task:
1. Identify individual slides based on the content structure
2. For each slide, determine the best layout from these options:
   - TitleSlide: For title slides (fields: title, subtitle)
   - TitleAndBody: For slides with a title and body text (fields: title, body)
   - BulletedList: For slides with bullet points (fields: title, items - array of strings)
   - SectionHeader: For section dividers (fields: title)
   - TwoColumn: For two-column layouts (fields: title, left, right)
   - Quote: For quotes (fields: quote, author)

3. Extract the ACTUAL text content from the presentation - do not create placeholders
4. Preserve the original wording as much as possible

Return a JSON object with this structure:
{
  "slides": [
    {
      "layoutId": "BulletedList",
      "content": {
        "title": "Actual slide title from the presentation",
        "items": ["First actual bullet point", "Second actual bullet point", "Third actual bullet point"]
      }
    }
  ]
}

IMPORTANT: Use the real text from the presentation, not generic placeholders like "Point 1", "Point 2".`
                },
                {
                    role: 'user',
                    content: text,
                }
            ],
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
        })

        console.log('OpenAI response:', completion.choices[0].message.content)

        const result = JSON.parse(completion.choices[0].message.content || '{}')
        const slides = result.slides || []

        // 5. Save slides to Database
        const slidesToInsert = slides.map((slide: any, index: number) => ({
            presentation_id: presentationId,
            layout_id: slide.layoutId,
            content: slide.content,
            order_index: index
        }))

        const { error: slidesError } = await supabaseAdmin
            .from('slides')
            .insert(slidesToInsert)

        if (slidesError) throw slidesError

        // 6. Update Presentation Status
        await supabaseAdmin
            .from('presentations')
            .update({ status: 'ready' })
            .eq('id', presentationId)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Processing error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
