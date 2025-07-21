'use client'

import { Download, Share2, RotateCcw } from 'lucide-react'
import { ProcessingResponse } from '@/types'

interface GifResultProps {
  result: ProcessingResponse
  onNewConversion: () => void
}

export function GifResult({ result, onNewConversion }: GifResultProps) {
  const handleDownload = () => {
    if (result.downloadUrl) {
      const link = document.createElement('a')
      link.href = result.downloadUrl
      link.download = `yt2gif-${result.videoId}.gif`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async () => {
    if (navigator.share && result.downloadUrl) {
      try {
        await navigator.share({
          title: 'Check out this GIF!',
          text: 'Created with yt2gif.app',
          url: window.location.origin + result.downloadUrl,
        })
      } catch (error) {
        console.log('Share failed:', error)
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.origin + result.downloadUrl)
      }
    } else if (result.downloadUrl) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + result.downloadUrl)
      alert('Download URL copied to clipboard!')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Your GIF is ready!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Duration: {result.duration}s • Size: {result.fileSize ? formatFileSize(result.fileSize) : 'N/A'}
          </p>
        </div>

        {/* GIF Preview */}
        <div className="flex justify-center">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
            {result.gifUrl ? (
              <img 
                src={result.gifUrl} 
                alt="Generated GIF" 
                className="max-w-full h-auto rounded"
                style={{ maxHeight: '400px' }}
              />
            ) : (
              <div className="w-64 h-48 flex items-center justify-center text-gray-500">
                GIF Preview
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download GIF</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>

        <button
          onClick={onNewConversion}
          className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Convert Another Video</span>
        </button>

        {/* Free Tier Notice */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t pt-4">
          <p>Free tier includes watermark • Upgrade for HD quality and no watermark</p>
        </div>
      </div>
    </div>
  )
}