'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { YoutubeUrlInput } from '@/components/youtube-url-input'
import { UserProfile } from '@/components/user-profile'
import { UsageStats } from '@/components/usage-stats'
import { RecentGifs } from '@/components/recent-gifs'
import { VideoMetadata } from '@/types'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const handleVideoLoaded = (metadata: VideoMetadata) => {
    setVideoMetadata(metadata)
    sessionStorage.setItem('videoMetadata', JSON.stringify(metadata))
    router.push('/convert')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="text-center space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {session.user?.name?.split(' ')[0] || 'there'}!
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                  Ready to create your next GIF?
                </p>
              </div>
              
              <YoutubeUrlInput onVideoLoaded={handleVideoLoaded} />
              
              <RecentGifs />
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6 order-first lg:order-last">
              <UserProfile />
              <UsageStats />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}