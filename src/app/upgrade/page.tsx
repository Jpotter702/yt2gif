'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Check, Crown, Zap, Star } from 'lucide-react'
import { PRICING_PLANS, formatPrice } from '@/lib/stripe'

export default function UpgradePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: 'PREMIUM' | 'PRO') => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    setIsLoading(plan)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
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
      setIsLoading(null)
    }
  }

  const currentTier = session?.user?.tier || 'FREE'

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Unlock premium features and create professional-quality GIFs without limits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Free
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  $0
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">5 GIFs per day</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Up to 10 second clips</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">50MB storage</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Watermarked GIFs</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Low quality (320px)</span>
                </li>
              </ul>

              <button
                disabled={currentTier === 'FREE'}
                className="w-full py-3 px-6 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentTier === 'FREE' ? 'Current Plan' : 'Downgrade'}
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                  Premium
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(PRICING_PLANS.PREMIUM.price)}
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {PRICING_PLANS.PREMIUM.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade('PREMIUM')}
                disabled={isLoading === 'PREMIUM' || currentTier === 'PREMIUM'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading === 'PREMIUM' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : currentTier === 'PREMIUM' ? (
                  'Current Plan'
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </>
                )}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-purple-500">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-500 mr-2" />
                  Pro
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(PRICING_PLANS.PRO.price)}
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {PRICING_PLANS.PRO.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade('PRO')}
                disabled={isLoading === 'PRO' || currentTier === 'PRO'}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading === 'PRO' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : currentTier === 'PRO' ? (
                  'Current Plan'
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              ✨ 7-day free trial on all plans • Cancel anytime • Secure payment with Stripe
            </p>
            
            <div className="flex justify-center space-x-8 text-xs text-gray-400">
              <span>🔒 SSL Encrypted</span>
              <span>💳 All major cards accepted</span>
              <span>🔄 Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}