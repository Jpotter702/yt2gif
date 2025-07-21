'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { X, Crown, Check, Zap } from 'lucide-react'
import { getTierFeatures, getUpgradePath, UserTier } from '@/lib/tier-checker'

interface TierLimitModalProps {
  isOpen: boolean
  onClose: () => void
  limitType: 'daily' | 'length' | 'storage'
  currentTier: UserTier
}

export function TierLimitModal({ isOpen, onClose, limitType, currentTier }: TierLimitModalProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  
  if (!isOpen) return null

  const currentFeatures = getTierFeatures(currentTier)
  const upgrade = getUpgradePath(currentTier)

  const getLimitMessage = () => {
    switch (limitType) {
      case 'daily':
        return `You've reached your daily limit of ${currentFeatures.maxGifsPerDay} GIFs.`
      case 'length':
        return `Your clip length exceeds the ${currentFeatures.maxClipLength}s limit.`
      case 'storage':
        return `You've reached your storage limit of ${(currentFeatures.maxStorageBytes / (1024 * 1024)).toFixed(0)}MB.`
      default:
        return 'You\'ve reached a tier limit.'
    }
  }

  const handleUpgrade = async () => {
    setIsLoading(true)
    
    try {
      if (!upgrade.nextTier) return
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: upgrade.nextTier }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Failed to start upgrade process. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Upgrade Required
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {getLimitMessage()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Upgrade to continue creating amazing GIFs!
            </p>
          </div>

          {upgrade.nextTier && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {upgrade.nextTier} Plan
                </h3>
                {upgrade.price && (
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {upgrade.price}
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {upgrade.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Upgrade Now
                  </>
                )}
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              ✨ 7-day free trial • Cancel anytime • Instant upgrade
            </p>
            
            <button
              onClick={onClose}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
            >
              Continue with {currentTier} plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}