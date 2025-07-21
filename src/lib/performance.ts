// Performance optimization utilities

// Debounce function for search inputs and API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for scroll events and resize handlers
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Preload critical resources
export function preloadResource(href: string, as: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }
}

// Lazy load images with intersection observer
export function createImageObserver(
  callback: (entry: IntersectionObserverEntry) => void
) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry)
        }
      })
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  )
}

// Memory cleanup utility
export function cleanup(fn: () => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', fn)
    return () => window.removeEventListener('beforeunload', fn)
  }
}

// Optimize video playback
export function optimizeVideo(video: HTMLVideoElement) {
  video.preload = 'metadata'
  video.playsInline = true
  
  // Reduce memory usage on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    video.poster = '' // Remove poster on mobile to save memory
  }
}

// Bundle size optimization - dynamic imports
export const lazyComponents = {
  VideoPreview: () => import('@/components/video-preview'),
  RangeSelector: () => import('@/components/range-selector'),
  GifResult: () => import('@/components/gif-result'),
  ProcessingStatus: () => import('@/components/processing-status'),
}

// Web Vitals tracking
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric)
  }
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: send to Google Analytics, PostHog, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vital', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: metric.value,
        non_interaction: true,
      })
    }
  }
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production'
  ) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration)
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error)
      })
  }
}