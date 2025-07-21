import type { Metadata } from 'next'
import { SessionWrapper } from '@/components/session-provider'
import { ToastProvider } from '@/components/toast'
import { ErrorBoundary } from '@/components/error-boundary'
import { PerformanceMonitor } from '@/components/performance-monitor'
import { AutoStructuredData } from '@/components/structured-data'
import { AnalyticsProvider, SentryErrorBoundary } from '@/components/analytics-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'yt2gif.app - Convert YouTube Videos to GIFs',
  description: 'Convert any YouTube video into a shareable GIF in seconds. Free watermarked exports and premium HD options.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3B82F6' },
    { media: '(prefers-color-scheme: dark)', color: '#1E40AF' }
  ],
  manifest: '/manifest.json',
  keywords: ['youtube', 'gif', 'converter', 'video', 'download', 'free'],
  authors: [{ name: 'yt2gif.app' }],
  creator: 'yt2gif.app',
  publisher: 'yt2gif.app',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    siteName: 'yt2gif.app',
    title: 'yt2gif.app - Convert YouTube Videos to GIFs',
    description: 'Convert any YouTube video into a shareable GIF in seconds',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'yt2gif.app - YouTube to GIF Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'yt2gif.app - Convert YouTube Videos to GIFs',
    description: 'Convert any YouTube video into a shareable GIF in seconds',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <AutoStructuredData />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SentryErrorBoundary>
          <ErrorBoundary>
            <SessionWrapper>
              <AnalyticsProvider>
                <ToastProvider>
                  <PerformanceMonitor />
                  {children}
                </ToastProvider>
              </AnalyticsProvider>
            </SessionWrapper>
          </ErrorBoundary>
        </SentryErrorBoundary>
      </body>
    </html>
  )
}