// Analytics and monitoring setup

import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_KEY !== '') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only', // Create profiles only for identified users
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
      capture_pageview: false, // We'll capture pageviews manually
      capture_pageleave: true,
      autocapture: {
        dom_event_allowlist: ['click', 'change', 'submit'],
        url_allowlist: ['yt2gif.app', 'localhost'],
      },
      session_recording: {
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
          email: true,
        },
      },
    })
  }
}

// Safe PostHog wrapper
const safePostHog = {
  capture: (event: string, properties?: any) => {
    try {
      if (typeof window !== 'undefined' && posthog && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture(event, properties)
      }
    } catch (error) {
      // Silently fail analytics
      console.debug('Analytics tracking failed:', error)
    }
  },
  identify: (userId: string, properties?: any) => {
    try {
      if (typeof window !== 'undefined' && posthog && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.identify(userId, properties)
      }
    } catch (error) {
      console.debug('Analytics identify failed:', error)
    }
  }
}

// Analytics event tracking
export const analytics = {
  // Page tracking
  pageView: (pageName?: string) => {
    safePostHog.capture('$pageview', {
      page_name: pageName,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    })
  },

  // User identification
  identify: (userId: string, properties?: Record<string, any>) => {
    safePostHog.identify(userId, properties)
  },

  // Video conversion events
  videoUrlSubmitted: (url: string) => {
    safePostHog.capture('video_url_submitted', {
      video_url: url,
      timestamp: new Date().toISOString(),
    })
  },

  videoMetadataLoaded: (metadata: any) => {
    safePostHog.capture('video_metadata_loaded', {
      video_title: metadata.title,
      video_duration: metadata.duration,
      video_quality: metadata.quality,
      timestamp: new Date().toISOString(),
    })
  },

  gifConversionStarted: (options: any) => {
    safePostHog.capture('gif_conversion_started', {
      start_time: options.startTime,
      end_time: options.endTime,
      duration: options.duration,
      quality: options.quality,
      timestamp: new Date().toISOString(),
    })
  },

  gifConversionCompleted: (options: any) => {
    safePostHog.capture('gif_conversion_completed', {
      file_size: options.fileSize,
      processing_time: options.processingTime,
      quality: options.quality,
      timestamp: new Date().toISOString(),
    })
  },

  gifDownloaded: (filename: string) => {
    safePostHog.capture('gif_downloaded', {
      filename,
      timestamp: new Date().toISOString(),
    })
  },

  // User interaction events
  signUpStarted: (provider?: string) => {
    safePostHog.capture('sign_up_started', {
      provider: provider || 'email',
      timestamp: new Date().toISOString(),
    })
  },

  signUpCompleted: (userId: string, provider?: string) => {
    safePostHog.capture('sign_up_completed', {
      user_id: userId,
      provider: provider || 'email',
      timestamp: new Date().toISOString(),
    })
  },

  signInCompleted: (userId: string, provider?: string) => {
    safePostHog.capture('sign_in_completed', {
      user_id: userId,
      provider: provider || 'email',
      timestamp: new Date().toISOString(),
    })
  },

  upgradeStarted: (plan: string) => {
    safePostHog.capture('upgrade_started', {
      plan,
      timestamp: new Date().toISOString(),
    })
  },

  upgradeCompleted: (plan: string, userId: string) => {
    safePostHog.capture('upgrade_completed', {
      plan,
      user_id: userId,
      timestamp: new Date().toISOString(),
    })
  },

  // Error tracking
  error: (error: Error, context?: Record<string, any>) => {
    safePostHog.capture('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      context,
      timestamp: new Date().toISOString(),
    })
  },

  // Feature usage
  featureUsed: (feature: string, properties?: Record<string, any>) => {
    safePostHog.capture('feature_used', {
      feature,
      ...properties,
      timestamp: new Date().toISOString(),
    })
  },

  // Onboarding events
  onboardingStarted: () => {
    safePostHog.capture('onboarding_started', {
      timestamp: new Date().toISOString(),
    })
  },

  onboardingCompleted: (stepCount: number) => {
    safePostHog.capture('onboarding_completed', {
      steps_completed: stepCount,
      timestamp: new Date().toISOString(),
    })
  },

  onboardingSkipped: (stepIndex: number) => {
    safePostHog.capture('onboarding_skipped', {
      step_index: stepIndex,
      timestamp: new Date().toISOString(),
    })
  },

  // Performance tracking
  performanceMetric: (metric: string, value: number, metadata?: Record<string, any>) => {
    safePostHog.capture('performance_metric', {
      metric,
      value,
      ...metadata,
      timestamp: new Date().toISOString(),
    })
  },
}

// Feature flags
export const featureFlags = {
  isEnabled: (flag: string): boolean => {
    try {
      if (typeof window !== 'undefined' && posthog && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        return posthog.isFeatureEnabled(flag) ?? false
      }
    } catch (error) {
      console.debug('Feature flag check failed:', error)
    }
    return false
  },

  onFeatureFlags: (callback: (flags: string[]) => void) => {
    try {
      if (typeof window !== 'undefined' && posthog && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.onFeatureFlags(callback)
      }
    } catch (error) {
      console.debug('Feature flags callback failed:', error)
    }
  },
}

// A/B testing
export const experiments = {
  getVariant: (experiment: string): string | undefined => {
    try {
      if (typeof window !== 'undefined' && posthog && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        return posthog.getFeatureFlag(experiment) as string | undefined
      }
    } catch (error) {
      console.debug('Experiment variant check failed:', error)
    }
    return undefined
  },
}