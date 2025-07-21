import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { VideoProcessor } from '@/lib/video-processor'
import { usageTracker } from '@/lib/usage-tracker'
import { getVideoMetadata, extractVideoId } from '@/lib/youtube'
import { ProcessingRequest } from '@/types'

const videoProcessor = new VideoProcessor()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body: ProcessingRequest = await request.json()

    if (!body.url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      )
    }

    // Validate YouTube URL
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    if (!youtubePattern.test(body.url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    // Check usage limits for authenticated users
    let canCreate: { canCreate: boolean; tier: string; limits: { maxClipLength: number }; reason?: string } = { 
      canCreate: true, 
      tier: 'FREE', 
      limits: { maxClipLength: 10 } 
    }
    
    if (session?.user?.id) {
      canCreate = await usageTracker.canCreateGif(session.user.id)
      if (!canCreate.canCreate) {
        return NextResponse.json(
          { error: canCreate.reason || 'Usage limit exceeded' },
          { status: 403 }
        )
      }
    }

    // Set defaults based on user tier
    const maxClipLength = canCreate.limits.maxClipLength
    const clipDuration = (body.endTime || 10) - (body.startTime || 0)
    
    if (clipDuration > maxClipLength) {
      return NextResponse.json(
        { error: `Clip length exceeds ${maxClipLength}s limit for ${canCreate.tier} tier` },
        { status: 400 }
      )
    }

    const processingRequest: ProcessingRequest = {
      url: body.url,
      startTime: body.startTime || 0,
      endTime: body.endTime || 10,
      quality: body.quality || (canCreate.tier === 'FREE' ? 'low' : 'high'),
      watermark: canCreate.tier === 'FREE' ? true : (body.watermark !== false)
    }

    // Get video metadata
    const metadata = await getVideoMetadata(body.url)
    
    // Process video to GIF
    const { gifPath, fileSize } = await videoProcessor.processToGif(
      processingRequest,
      (stage, progress) => {
        console.log(`${stage}: ${progress}%`)
      }
    )

    // Track usage for authenticated users
    let gifRecord = null
    if (session?.user?.id) {
      gifRecord = await usageTracker.trackGifCreation(session.user.id, {
        youtubeUrl: body.url,
        videoId: extractVideoId(body.url) || '',
        videoTitle: metadata.title,
        fileName: gifPath.split('/').pop() || '',
        filePath: gifPath,
        fileSize,
        duration: clipDuration,
        startTime: processingRequest.startTime || 0,
        endTime: processingRequest.endTime || 10,
        quality: processingRequest.quality || 'low',
        hasWatermark: processingRequest.watermark !== false,
      })
    }

    // Generate download URL (temporary file path)
    const fileName = gifPath.split('/').pop()
    const downloadUrl = `/api/download/${fileName}`

    return NextResponse.json({
      success: true,
      gifUrl: downloadUrl,
      downloadUrl,
      fileSize,
      duration: clipDuration,
      videoId: gifRecord?.id,
    })
  } catch (error) {
    console.error('Error processing video:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}