'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface ProcessingStatusProps {
  stage: string
  progress: number
  isComplete: boolean
  error?: string
}

const stages = [
  { key: 'downloading', label: 'Downloading video', icon: Clock },
  { key: 'converting', label: 'Converting to GIF', icon: Clock },
  { key: 'watermarking', label: 'Adding watermark', icon: Clock },
  { key: 'optimizing', label: 'Optimizing file', icon: Clock },
]

export function ProcessingStatus({ stage, progress, isComplete, error }: ProcessingStatusProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)

  useEffect(() => {
    const stageIndex = stages.findIndex(s => s.key === stage)
    if (stageIndex >= 0) {
      setCurrentStageIndex(stageIndex)
    }
  }, [stage])

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">
              Processing Failed
            </h3>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              GIF Ready!
            </h3>
            <p className="text-green-600 dark:text-green-300 text-sm">
              Your GIF has been successfully generated
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Processing your video...
        </h3>
        
        <div className="space-y-3">
          {stages.map((stageInfo, index) => {
            const isActive = index === currentStageIndex
            const isCompleted = index < currentStageIndex
            const Icon = isCompleted ? CheckCircle : stageInfo.icon
            
            return (
              <div key={stageInfo.key} className="flex items-center space-x-3">
                <Icon 
                  className={`h-5 w-5 ${
                    isCompleted 
                      ? 'text-green-500' 
                      : isActive 
                        ? 'text-blue-500 animate-spin' 
                        : 'text-gray-400'
                  }`} 
                />
                <span 
                  className={`text-sm ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400 font-medium' 
                      : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500'
                  }`}
                >
                  {stageInfo.label}
                  {isActive && ` (${progress}%)`}
                </span>
              </div>
            )
          })}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.round((currentStageIndex * 25) + (progress * 0.25))}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}