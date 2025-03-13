import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('image') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const path = `./public/uploads/${file.name}`
    await writeFile(path, buffer)
    console.log(`Uploaded file saved at ${path}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
