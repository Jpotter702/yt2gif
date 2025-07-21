'use client'

import { useSession } from 'next-auth/react'
import { BarChart3, HardDrive, Zap, Crown } from 'lucide-react'

const TIER_LIMITS = {
  FREE: {
    gifsPerDay: 5,
    maxClipLength: 10, // seconds
    storageLimit: 50 * 1024 * 1024, // 50MB
  },
  PREMIUM: {
    gifsPerDay: 50,
    maxClipLength: 30,
    storageLimit: 1024 * 1024 * 1024, // 1GB
  },
  PRO: {
    gifsPerDay: -1, // unlimited
    maxClipLength: 60,
    storageLimit: 10 * 1024 * 1024 * 1024, // 10GB
  }
}

export function UsageStats() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  const userTier = (session.user.tier || 'FREE') as keyof typeof TIER_LIMITS
  const limits = TIER_LIMITS[userTier]
  const gifsCreated = session.user.gifsCreated || 0
  const storageUsed = session.user.storageUsed || 0

  const formatStorage = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }

  const getUsagePercentage = (used: number, limit: number): number => {
    if (limit === -1) return 0 // unlimited
    return Math.min((used / limit) * 100, 100)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2" />
        Usage Stats
      </h3>

      <div className="space-y-6">
        {/* GIFs Created */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              GIFs Today
            </span>
            <span className="text-sm font-medium">
              {limits.gifsPerDay === -1 ? `${gifsCreated}` : `${gifsCreated}/${limits.gifsPerDay}`}
            </span>
          </div>
          {limits.gifsPerDay !== -1 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getUsagePercentage(gifsCreated, limits.gifsPerDay)}%` }}
              />
            </div>
          )}
        </div>

        {/* Storage Used */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <HardDrive className="h-4 w-4 mr-1" />
              Storage
            </span>
            <span className="text-sm font-medium">
              {formatStorage(storageUsed)} / {formatStorage(limits.storageLimit)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getUsagePercentage(storageUsed, limits.storageLimit)}%` }}
            />
          </div>
        </div>

        {/* Tier Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {userTier} Plan
            </span>
            {userTier === 'FREE' && (
              <button 
                onClick={() => window.location.href = '/upgrade'}
                className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>
          
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Zap className="h-3 w-3 mr-2" />
              Max clip: {limits.maxClipLength}s
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-3 w-3 mr-2" />
              {limits.gifsPerDay === -1 ? 'Unlimited GIFs' : `${limits.gifsPerDay} GIFs/day`}
            </div>
            <div className="flex items-center">
              <HardDrive className="h-3 w-3 mr-2" />
              {formatStorage(limits.storageLimit)} storage
            </div>
          </div>
        </div>

        {userTier === 'FREE' && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Crown className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Upgrade to Premium
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Remove watermarks, longer clips, and more storage
            </p>
            <button 
              onClick={() => window.location.href = '/upgrade'}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Start Free Trial
            </button>
          </div>
        )}
      </div>
    </div>
  )
}