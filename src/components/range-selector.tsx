'use client'

import { useState, useEffect, useRef } from 'react'
import { formatDuration } from '@/lib/youtube'

interface RangeSelectorProps {
  duration: number
  currentTime?: number
  onRangeChange: (start: number, end: number) => void
  maxClipLength?: number
}

export function RangeSelector({ 
  duration, 
  currentTime = 0, 
  onRangeChange,
  maxClipLength = 30 
}: RangeSelectorProps) {
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(Math.min(10, duration))
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onRangeChange(startTime, endTime)
  }, [startTime, endTime, onRangeChange])

  const handleTrackClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!trackRef.current) return
    
    const rect = trackRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clickPosition = (clientX - rect.left) / rect.width
    const clickTime = clickPosition * duration
    
    // Set current position as start of selection
    const newEndTime = Math.min(clickTime + 10, duration)
    setStartTime(clickTime)
    setEndTime(newEndTime)
  }

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!trackRef.current) return
      
      const rect = trackRef.current.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const newStartTime = position * duration
      
      if (newStartTime < endTime) {
        setStartTime(newStartTime)
      }
    }
    
    const handleEnd = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
    
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
  }

  const handleEndDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!trackRef.current) return
      
      const rect = trackRef.current.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const newEndTime = position * duration
      const maxEndTime = Math.min(startTime + maxClipLength, duration)
      
      if (newEndTime > startTime && newEndTime <= maxEndTime) {
        setEndTime(newEndTime)
      }
    }
    
    const handleEnd = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
    
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
  }

  const startPercent = (startTime / duration) * 100
  const endPercent = (endTime / duration) * 100
  const currentPercent = (currentTime / duration) * 100
  const clipDuration = endTime - startTime

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Start: {formatDuration(Math.floor(startTime))}</span>
        <span>Clip Length: {formatDuration(Math.floor(clipDuration))}</span>
        <span>End: {formatDuration(Math.floor(endTime))}</span>
      </div>
      
      <div 
        ref={trackRef}
        className="relative h-12 md:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer overflow-hidden touch-manipulation"
        onClick={handleTrackClick}
        onTouchStart={handleTrackClick}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800" />
        
        {/* Selected range */}
        <div 
          className="absolute top-0 bottom-0 bg-blue-500 bg-opacity-50"
          style={{
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`
          }}
        />
        
        {/* Current playback position */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
          style={{ left: `${currentPercent}%` }}
        />
        
        {/* Start handle */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-10 md:w-4 md:h-8 bg-blue-600 rounded cursor-ew-resize shadow-md z-10 touch-manipulation"
          style={{ left: `calc(${startPercent}% - 12px)` }}
          onMouseDown={handleStartDrag}
          onTouchStart={handleStartDrag}
        />
        
        {/* End handle */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-10 md:w-4 md:h-8 bg-blue-600 rounded cursor-ew-resize shadow-md z-10 touch-manipulation"
          style={{ left: `calc(${endPercent}% - 12px)` }}
          onMouseDown={handleEndDrag}
          onTouchStart={handleEndDrag}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>0:00</span>
        <span>{formatDuration(duration)}</span>
      </div>
      
      {clipDuration > maxClipLength && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
            ⚠️ Clip length exceeds {maxClipLength}s limit
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Upgrade to Premium for longer clips up to 30s
          </p>
        </div>
      )}
    </div>
  )
}