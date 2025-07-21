'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlayCircle } from 'lucide-react'
import { VideoMetadata } from '@/types'
import { LoadingButton } from './loading-spinner'
import { useErrorHandler } from './error-handler'
import { useAnalytics } from './analytics-provider'

interface YoutubeUrlInputProps {
  onVideoLoaded?: (metadata: VideoMetadata) => void
}

export function YoutubeUrlInput({ onVideoLoaded }: YoutubeUrlInputProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { handleError, handleSuccess } = useErrorHandler()
  const { trackVideoSubmission } = useAnalytics()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    
    // Track video URL submission
    trackVideoSubmission(url)
    
    try {
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load video')
      }

      handleSuccess('Video loaded successfully!')

      if (onVideoLoaded) {
        onVideoLoaded(data.metadata)
      } else {
        // Store metadata and navigate to convert page
        sessionStorage.setItem('videoMetadata', JSON.stringify(data.metadata))
        router.push('/convert')
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('An error occurred'), 'Video Loading')
    } finally {
      setIsLoading(false)
    }
  }

  const isValidYouTubeUrl = (url: string) => {
    if (!url.trim()) return false
    
    // YouTube URL patterns
    const patterns = [
      // youtube.com regular videos
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/v\/[\w-]+/,
      // youtube.com shorts
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
      // youtu.be variations
      /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
      // mobile youtube
      /^(https?:\/\/)?(www\.)?m\.youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?m\.youtube\.com\/shorts\/[\w-]+/,
    ]
    
    return patterns.some(pattern => pattern.test(url.trim()))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none dark:bg-gray-800 dark:text-white touch-manipulation ${
              url.trim() && isValidYouTubeUrl(url)
                ? 'border-green-500 focus:border-green-500 dark:border-green-400'
                : url.trim()
                  ? 'border-red-500 focus:border-red-500 dark:border-red-400'
                  : 'border-gray-300 focus:border-blue-500 dark:border-gray-600'
            }`}
            disabled={isLoading}
            autoComplete="url"
            inputMode="url"
          />
          <PlayCircle className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        
        {url.trim() && !isValidYouTubeUrl(url) && (
          <p className="text-sm text-red-500 dark:text-red-400">
            Please enter a valid YouTube URL (e.g., https://youtube.com/watch?v=VIDEO_ID)
          </p>
        )}
        
        <button
          type="submit"
          disabled={!url.trim() || isLoading || !isValidYouTubeUrl(url)}
          className={`w-full font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg touch-manipulation transition-colors ${
            !url.trim() || isLoading || !isValidYouTubeUrl(url)
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? 'Loading video...' : 'Convert to GIF'}
        </button>
      </form>
      
      {url && !isValidYouTubeUrl(url) && (
        <p className="text-red-500 text-sm mt-2 text-center">
          Please enter a valid YouTube URL
        </p>
      )}
    </div>
  )
}