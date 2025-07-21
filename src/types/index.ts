export interface VideoMetadata {
  id: string
  title: string
  duration: number
  thumbnail: string
  url: string
}

export interface ProcessingRequest {
  url: string
  startTime?: number
  endTime?: number
  quality?: 'low' | 'high'
  watermark?: boolean
}

export interface ProcessingResponse {
  success: boolean
  videoId: string
  gifUrl?: string
  downloadUrl?: string
  fileSize?: number
  duration?: number
  error?: string
}

export interface GifOptions {
  startTime: number
  endTime: number
  quality: 'low' | 'high'
  fps: number
  width: number
  height: number
  watermark: boolean
}