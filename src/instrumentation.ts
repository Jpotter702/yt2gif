export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    const { init } = await import('@sentry/nextjs')
    
    init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION,
      beforeSend(event) {
        if (process.env.NODE_ENV === 'development') {
          return null
        }
        return event
      },
      initialScope: {
        tags: {
          component: 'server',
        },
      },
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry initialization
    const { init } = await import('@sentry/nextjs')
    
    init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_APP_VERSION,
      initialScope: {
        tags: {
          component: 'edge',
        },
      },
    })
  }
}