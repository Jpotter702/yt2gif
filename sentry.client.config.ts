import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay (disabled for compatibility)
  // replaysSessionSampleRate: 0.1,
  // replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION,
  
  // Error filtering
  beforeSend(event, hint) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null
    }
    
    // Filter out certain error types
    if (event.exception) {
      const error = hint.originalException
      if (error && typeof error === 'object') {
        // Skip network errors that are likely user-related
        if ('name' in error && error.name === 'NetworkError') {
          return null
        }
        
        // Skip CORS errors
        if ('message' in error && typeof error.message === 'string') {
          if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
            return null
          }
        }
      }
    }
    
    return event
  },
  
  // User context
  initialScope: {
    tags: {
      component: 'client',
    },
  },
  
  // Integration configuration (Replay integration might not be available in all versions)
  integrations: [],
})