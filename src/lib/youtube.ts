import ytdl from 'ytdl-core'
import { VideoMetadata } from '@/types'

export async function getVideoMetadata(url: string): Promise<VideoMetadata> {
  try {
    const videoId = extractVideoId(url)
    if (!videoId) {
      throw new Error('Invalid YouTube URL')
    }

    // Use getBasicInfo instead of getInfo for better reliability
    const info = await ytdl.getBasicInfo(url)
    const videoDetails = info.videoDetails

    return {
      id: videoId,
      title: videoDetails.title,
      duration: parseInt(videoDetails.lengthSeconds),
      thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
      url: url,
    }
  } catch (error) {
    console.error('Error fetching video metadata:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack',
      url: url
    })
    throw new Error(`Failed to fetch video information: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    // Regular YouTube videos
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    // YouTube Shorts
    /youtube\.com\/shorts\/([^&\n?#]+)/,
    // Mobile YouTube
    /m\.youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /m\.youtube\.com\/shorts\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function validateYouTubeUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  return pattern.test(url) && extractVideoId(url) !== null
}