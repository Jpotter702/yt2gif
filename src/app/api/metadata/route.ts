import { NextRequest, NextResponse } from 'next/server'
import { getVideoMetadata } from '@/lib/youtube'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      )
    }

    const metadata = await getVideoMetadata(url)

    return NextResponse.json({
      success: true,
      metadata,
    })
  } catch (error) {
    console.error('Error fetching metadata:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch video metadata',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}