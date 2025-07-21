'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'white' | 'gray'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600'
  }

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2 border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function LoadingButton({
  isLoading,
  children,
  className,
  disabled,
  onClick,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isLoading && (
        <LoadingSpinner size="sm" color="white" className="mr-2" />
      )}
      {children}
    </button>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  children: React.ReactNode
}

export function LoadingOverlay({ isLoading, message, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            {message && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-200 dark:bg-gray-700 rounded',
            lines > 1 ? 'h-4 mb-2 last:mb-0' : 'h-4',
            className
          )}
        />
      ))}
    </div>
  )
}