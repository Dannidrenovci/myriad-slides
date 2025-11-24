import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { openai } from '@/lib/openai'
import officeParser from 'officeparser'
import fs from 'fs'
import path from 'path'
import os from 'os'

export const runtime = 'edge'

export async function POST(request: Request) {
    try {
        const { presentationId, filePath } = await request.json()

        if (!presentationId || !filePath) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Download file from Supabase Storage
        const { data: fileData, error: downloadError } = await supabase.storage
            .from('presentations')
            .download(filePath)

        if (downloadError || !fileData) {
            throw new Error(`Download error: ${downloadError?.message}`)
        }

        // 2. Save to temp file
        const tempFilePath = path.join(os.tmpdir(), path.basename(filePath))
        const buffer = Buffer.from(await fileData.arrayBuffer())
        fs.writeFileSync(tempFilePath, buffer)

        // 3. Parse PPTX
        // officeParser.parseOfficeAsync returns a Promise<string>
        const text = await officeParser.parseOfficeAsync(tempFilePath)

        // 4. Clean up temp file
        fs.unlinkSync(tempFilePath)

        // 5. Send to OpenAI for Layout Selection
        // This is a simplified prompt. In reality, we'd want to split by slides if possible.
        // officeparser might just give one big text blob.
        // If we need per-slide text, we might need a different library or parsing strategy.
        // For now, we'll assume we get a blob and ask AI to split it into "slides" based on context.

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an expert presentation designer.
          I will give you the text content of a presentation.
          Your job is to:
          1. Split the content into logical slides.
          2. For each slide, choose one of the following layouts:
             - 'TitleSlide': Title and Subtitle
             - 'TitleAndBody': Title and Bullet points
             - 'SectionHeader': Section Title
             - 'TwoColumn': Title and two columns of text
             - 'Quote': A big quote
          3. Return a JSON object with a 'slides' array.
             Each slide object should have:
             - 'layoutId': string (one of the above)
             - 'content': object (keys depend on layout, e.g., title, subtitle, body, bullets)
          `
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
        })

        const result = completion.choices[0].message.content
        if (!result) throw new Error('No response from OpenAI')

        const parsedResult = JSON.parse(result)
        const slides = parsedResult.slides

        // 6. Save slides to Database
        const slidesToInsert = slides.map((slide: any, index: number) => ({
            presentation_id: presentationId,
            order_index: index,
            layout_id: slide.layoutId,
            content: slide.content
        }))

        const { error: slidesError } = await supabase
            .from('slides')
            .insert(slidesToInsert)

        if (slidesError) throw slidesError

        // 7. Update presentation status
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
