'use client'

import { useRef, useEffect } from 'react'
import { VideoMetadata } from '@/types'
import { formatDuration } from '@/lib/youtube'

interface VideoPreviewProps {
  metadata: VideoMetadata
  onTimeUpdate?: (currentTime: number) => void
}

export function VideoPreview({ metadata, onTimeUpdate }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [onTimeUpdate])

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {metadata.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Duration: {formatDuration(metadata.duration)}
        </p>
      </div>
      
      <div className="relative bg-black">
        <video
          ref={videoRef}
          className="w-full h-auto"
          controls
          preload="metadata"
          poster={metadata.thumbnail}
        >
          <source src={`/api/stream/${metadata.id}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}