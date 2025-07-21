'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight, ArrowLeft, Play, Download, Crown } from 'lucide-react'

interface OnboardingStep {
  title: string
  description: string
  icon: React.ReactNode
  image?: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Welcome to yt2gif.app!",
    description: "Convert any YouTube video into a shareable GIF in seconds. Let's show you how it works.",
    icon: <Play className="h-8 w-8 text-blue-500" />
  },
  {
    title: "Paste YouTube URL",
    description: "Simply paste any YouTube video URL into the input field. We'll automatically load the video for you.",
    icon: <div className="text-2xl">📎</div>
  },
  {
    title: "Select Your Clip",
    description: "Use our visual range selector to choose exactly which part of the video you want to turn into a GIF.",
    icon: <div className="text-2xl">✂️</div>
  },
  {
    title: "Generate & Download",
    description: "Click generate and we'll create your GIF in seconds. Download it or share it directly from the app.",
    icon: <Download className="h-8 w-8 text-green-500" />
  },
  {
    title: "Upgrade for More",
    description: "Free users get 5 GIFs per day with watermarks. Upgrade for unlimited GIFs, longer clips, and HD quality!",
    icon: <Crown className="h-8 w-8 text-yellow-500" />
  }
]

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
    }
  }, [isOpen])

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('yt2gif_onboarding_completed', 'true')
    onClose()
  }

  if (!isOpen) return null

  const step = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overscroll-contain">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YG</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">yt2gif.app</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 -m-2 touch-manipulation"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-500">
                {Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-6">
              {step.icon}
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {step.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200 transition-colors touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {isLastStep ? (
              <button
                onClick={handleComplete}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg transition-colors flex items-center touch-manipulation text-sm sm:text-base"
              >
                Get Started
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center px-3 sm:px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors touch-manipulation"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="h-4 w-4 sm:ml-1" />
              </button>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center mt-4 sm:mt-6">
            <button
              onClick={handleComplete}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline touch-manipulation p-2 -m-2"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('yt2gif_onboarding_completed')
    if (!hasCompletedOnboarding) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        setShouldShowOnboarding(true)
      }, 1000)
    }
  }, [])

  const hideOnboarding = () => {
    setShouldShowOnboarding(false)
  }

  const showOnboarding = () => {
    setShouldShowOnboarding(true)
  }

  return {
    shouldShowOnboarding,
    hideOnboarding,
    showOnboarding,
  }
}