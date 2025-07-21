'use client'

import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { YoutubeUrlInput } from '@/components/youtube-url-input'
import { OnboardingModal, useOnboarding } from '@/components/onboarding-modal'

export default function HomePage() {
  const { shouldShowOnboarding, hideOnboarding } = useOnboarding()

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 sm:py-16">
          <div className="text-center space-y-6 sm:space-y-8">
            <header className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                yt2gif.app
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
                Convert any YouTube video into a shareable GIF in seconds
              </p>
            </header>
            
            <YoutubeUrlInput />
            
            <div className="text-sm text-gray-500 dark:text-gray-400 px-4 sm:px-0">
              Free watermarked exports • Premium HD options available
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
              Why Choose yt2gif.app?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <article className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Convert videos to GIFs in seconds with our optimized processing engine
                </p>
              </article>

              <article className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Precise Control
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Select exactly the part of the video you want with our intuitive range selector
                </p>
              </article>

              <article className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  HD Quality
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Premium users get high-definition GIFs without watermarks
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-8 sm:py-12 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Paste URL
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Copy and paste any YouTube video URL
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Select Range
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose the start and end time for your GIF
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Convert
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click convert and wait a few seconds
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Download
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download your GIF and share it anywhere
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <OnboardingModal 
        isOpen={shouldShowOnboarding} 
        onClose={hideOnboarding} 
      />
    </>
  )
}