'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, analytics } from '@/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize PostHog
  useEffect(() => {
    initPostHog()
  }, [])

  // Track page views
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    analytics.pageView(pathname)
  }, [pathname, searchParams])

  // Identify user when logged in
  useEffect(() => {
    if (session?.user) {
      analytics.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        tier: session.user.tier,
      })
    }
  }, [session])

  return <>{children}</>
}

// Hook for tracking analytics events
export function useAnalytics() {
  return {
    track: analytics,
    
    // Convenience methods for common events
    trackVideoSubmission: (url: string) => {
      analytics.videoUrlSubmitted(url)
    },
    
    trackGifConversion: (options: any) => {
      analytics.gifConversionStarted(options)
    },
    
    trackGifDownload: (filename: string) => {
      analytics.gifDownloaded(filename)
    },
    
    trackError: (error: Error, context?: Record<string, any>) => {
      analytics.error(error, context)
    },
    
    trackFeatureUsage: (feature: string, properties?: Record<string, any>) => {
      analytics.featureUsed(feature, properties)
    },
  }
}

// Error boundary with Sentry integration
import * as Sentry from '@sentry/nextjs'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  eventId?: string
}

export class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })
    
    this.setState({ eventId })
    
    // Also track in PostHog
    analytics.error(error, {
      component_stack: errorInfo.componentStack,
      event_id: eventId,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We&apos;ve been notified of this error and are working to fix it.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Reload Page
              </button>
              {this.state.eventId && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Error ID: {this.state.eventId}
                </p>
              )}
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}