import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs-extra'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const resolvedParams = await params
    const filename = resolvedParams.filename
    const filePath = path.join(process.cwd(), 'temp', filename)

    // Check if file exists
    if (!await fs.pathExists(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath)
    
    // Set appropriate headers
    const headers = new Headers()
    headers.set('Content-Type', 'image/gif')
    headers.set('Content-Length', fileBuffer.length.toString())
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)
    headers.set('Cache-Control', 'no-cache')

    return new Response(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    )
  }
}