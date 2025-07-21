'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VideoPreview } from '@/components/video-preview'
import { RangeSelector } from '@/components/range-selector'
import { ProcessingStatus } from '@/components/processing-status'
import { GifResult } from '@/components/gif-result'
import { VideoMetadata, ProcessingResponse } from '@/types'

export default function ConvertPage() {
  const router = useRouter()
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [selectedRange, setSelectedRange] = useState({ start: 0, end: 10 })
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [result, setResult] = useState<ProcessingResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load metadata from sessionStorage on component mount
  useEffect(() => {
    const storedMetadata = sessionStorage.getItem('videoMetadata')
    if (storedMetadata) {
      try {
        const parsedMetadata = JSON.parse(storedMetadata)
        setMetadata(parsedMetadata)
        // Clear from sessionStorage after loading
        sessionStorage.removeItem('videoMetadata')
      } catch (error) {
        console.error('Failed to parse stored metadata:', error)
      }
    }
  }, [])

  const handleRangeChange = useCallback((start: number, end: number) => {
    setSelectedRange({ start, end })
  }, [])

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

  const handleGenerateGif = async () => {
    if (!metadata) return

    setIsProcessing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: metadata.url,
          startTime: selectedRange.start,
          endTime: selectedRange.end,
          quality: 'low',
          watermark: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Processing failed')
      }

      setResult(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNewConversion = () => {
    window.location.href = '/'
  }

  // Show loading or redirect message if no metadata
  if (!metadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No video selected
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please go back and select a video to convert.
            </p>
            <a 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto py-8 space-y-8">
        {result ? (
          <GifResult result={result} onNewConversion={handleNewConversion} />
        ) : (
          <>
            <VideoPreview metadata={metadata} onTimeUpdate={handleTimeUpdate} />
            
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select clip range
              </h3>
              <RangeSelector
                duration={metadata.duration}
                currentTime={currentTime}
                onRangeChange={handleRangeChange}
                maxClipLength={30}
              />
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleGenerateGif}
                  disabled={isProcessing || (selectedRange.end - selectedRange.start) > 30}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {isProcessing ? 'Generating...' : 'Generate GIF'}
                </button>
              </div>
            </div>

            {(isProcessing || error) && (
              <div className="max-w-2xl mx-auto">
                <ProcessingStatus
                  stage={processingStage}
                  progress={processingProgress}
                  isComplete={false}
                  error={error || undefined}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}