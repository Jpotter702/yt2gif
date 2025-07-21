'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Download, Eye, Calendar } from 'lucide-react'
import { Skeleton } from './loading-spinner'

interface RecentGif {
  id: string
  videoTitle: string
  fileName: string
  fileSize: number
  duration: number
  createdAt: string
  downloads: number
  views: number
  hasWatermark: boolean
  quality: string
}

export function RecentGifs() {
  const { data: session } = useSession()
  const [gifs, setGifs] = useState<RecentGif[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchRecentGifs()
    }
  }, [session])

  const fetchRecentGifs = async () => {
    try {
      const response = await fetch('/api/user/gifs')
      if (response.ok) {
        const data = await response.json()
        setGifs(data.gifs)
      }
    } catch (error) {
      console.error('Failed to fetch recent GIFs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Recent GIFs
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-16 w-24 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : gifs.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V6a1 1 0 01-1 1H8a1 1 0 01-1-1V4m0 0H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-3" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No GIFs created yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Start by converting your first YouTube video above!
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {gifs.map((gif) => (
            <div
              key={gif.id}
              className="flex space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="h-12 w-16 sm:h-16 sm:w-24 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    GIF
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {gif.videoTitle}
                </h4>
                
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(gif.fileSize)}</span>
                  <span>{gif.duration.toFixed(1)}s</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    gif.quality === 'HIGH' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {gif.quality}
                  </span>
                  {gif.hasWatermark && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                      Watermarked
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(gif.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      {gif.downloads}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {gif.views}
                    </div>
                  </div>
                  
                  <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium self-start sm:self-auto">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}