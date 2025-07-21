'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Crown, CreditCard, Settings2, User, Calendar, ExternalLink } from 'lucide-react'
import { formatPrice } from '@/lib/stripe'

interface SubscriptionStatus {
  tier: string
  currentPeriodEnd?: string
  subscription?: {
    status: string
    cancelAtPeriodEnd: boolean
    currentPeriodEnd: Date
  }
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchSubscriptionStatus()
  }, [session, status, router])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error)
    }
  }

  const handleManageBilling = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url
    } catch (error) {
      console.error('Portal error:', error)
      alert('Failed to open billing portal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </>
    )
  }

  if (!session) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account, subscription, and billing information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900 dark:text-white">{session.user?.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{session.user?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {subscriptionStatus?.currentPeriodEnd && formatDate(subscriptionStatus.currentPeriodEnd)}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Subscription
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Plan
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.user?.tier === 'PRO'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : session.user?.tier === 'PREMIUM'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {session.user?.tier || 'FREE'}
                    </span>
                  </div>
                </div>

                {subscriptionStatus?.subscription && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <p className="text-gray-900 dark:text-white capitalize">
                        {subscriptionStatus.subscription.status}
                        {subscriptionStatus.subscription.cancelAtPeriodEnd && (
                          <span className="text-red-600 ml-2">(Canceling)</span>
                        )}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Next Billing Date
                      </label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-gray-900 dark:text-white">
                          {formatDate(subscriptionStatus.subscription.currentPeriodEnd.toISOString())}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-4 space-y-3">
                  {session.user?.tier === 'FREE' ? (
                    <button
                      onClick={() => router.push('/upgrade')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Upgrade Plan
                    </button>
                  ) : (
                    <button
                      onClick={handleManageBilling}
                      disabled={isLoading}
                      className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Manage Billing
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Settings2 className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Account Actions
                </h2>
              </div>

              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Change Password
                </button>
                
                <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Download Data
                </button>
                
                <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  Delete Account
                </button>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Settings2 className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Stats
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {session.user?.gifsCreated || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">GIFs Created</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((session.user?.storageUsed || 0) / (1024 * 1024))}MB
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Storage Used</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}