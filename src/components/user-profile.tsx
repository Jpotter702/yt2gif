'use client'

import { useSession, signOut } from 'next-auth/react'
import { User, Crown, LogOut, Settings } from 'lucide-react'

export function UserProfile() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'PREMIUM':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </span>
        )
      case 'PRO':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Free
          </span>
        )
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {session.user.image ? (
            <img
              className="h-12 w-12 rounded-full"
              src={session.user.image}
              alt={session.user.name || 'User'}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {session.user.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {session.user.email}
          </p>
          <div className="mt-1">
            {getTierBadge(session.user.tier || 'FREE')}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
          <Settings className="h-4 w-4 mr-2" />
          Account Settings
        </button>
        
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  )
}