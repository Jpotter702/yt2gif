'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, createContext, useContext } from 'react'

// Create analytics context
const AnalyticsContext = createContext<{
  trackVideoSubmission: (url: string) => void
} | null>(null)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <AnalyticsContextProvider>{children}</AnalyticsContextProvider>
    </PHProvider>
  )
}

function AnalyticsContextProvider({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog()

  const trackVideoSubmission = (url: string) => {
    try {
      posthog?.capture('video_url_submitted', {
        video_url: url,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.debug('Analytics tracking failed:', error)
    }
  }

  return (
    <AnalyticsContext.Provider value={{ trackVideoSubmission }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    // Return safe fallback functions
    return {
      trackVideoSubmission: () => {},
    }
  }
  return context
}
