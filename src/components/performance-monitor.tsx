'use client'

import { useEffect } from 'react'
import { reportWebVitals, registerServiceWorker } from '@/lib/performance'

export function PerformanceMonitor() {
  useEffect(() => {
    // Register service worker for caching
    registerServiceWorker()

    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            reportWebVitals({
              name: 'CLS',
              value: (entry as any).value,
              id: entry.name,
            })
          }
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          reportWebVitals({
            name: 'FID',
            value: (entry as any).processingStart - entry.startTime,
            id: entry.name,
          })
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        reportWebVitals({
          name: 'LCP',
          value: lastEntry.startTime,
          id: lastEntry.name,
        })
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Cleanup observers
      return () => {
        clsObserver.disconnect()
        fidObserver.disconnect()
        lcpObserver.disconnect()
      }
    }
  }, [])

  // Monitor memory usage on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
          console.warn('High memory usage detected:', {
            used: memory.usedJSHeapSize,
            total: memory.jsHeapSizeLimit,
            percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(2) + '%'
          })
        }
      }

      const interval = setInterval(checkMemory, 30000) // Check every 30 seconds
      return () => clearInterval(interval)
    }
  }, [])

  return null // This is a monitoring component, no UI
}

// Hook for monitoring component performance
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 100) { // Log slow renders (>100ms)
        console.warn(`Slow render detected in ${componentName}:`, `${renderTime.toFixed(2)}ms`)
      }
    }
  }, [componentName])
}

// Image lazy loading component with performance optimization
export function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  width,
  height,
  priority = false,
  onLoad,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  onLoad?: () => void
}) {
  useEffect(() => {
    if (priority) {
      // Preload critical images
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = src
      link.as = 'image'
      document.head.appendChild(link)
    }
  }, [src, priority])

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={onLoad}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: width && height ? `${width}px ${height}px` : 'auto',
      }}
    />
  )
}