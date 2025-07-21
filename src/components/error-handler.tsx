'use client'

import { useEffect } from 'react'
import { useToast } from './toast'

interface ErrorHandlerProps {
  error?: Error | null
  fallback?: string
  onRetry?: () => void
}

export function ErrorHandler({ error, fallback, onRetry }: ErrorHandlerProps) {
  const toast = useToast()

  useEffect(() => {
    if (error) {
      const message = getErrorMessage(error)
      toast.error('Error', message)
      
      // Log to console for debugging
      console.error('Component error:', error)
    }
  }, [error, toast])

  if (!error) return null

  return null // Toast will handle the display
}

function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase()
  
  // Network errors
  if (message.includes('fetch') || message.includes('network')) {
    return 'Network error. Please check your connection and try again.'
  }
  
  // Authentication errors
  if (message.includes('unauthorized') || message.includes('auth')) {
    return 'Authentication failed. Please sign in and try again.'
  }
  
  // Payment errors
  if (message.includes('payment') || message.includes('billing')) {
    return 'Payment processing error. Please check your payment method.'
  }
  
  // File processing errors
  if (message.includes('video') || message.includes('gif') || message.includes('processing')) {
    return 'Video processing failed. Please try a different video or contact support.'
  }
  
  // Quota/limit errors
  if (message.includes('limit') || message.includes('quota') || message.includes('exceeded')) {
    return 'Usage limit reached. Please upgrade your plan or try again later.'
  }
  
  // Generic API errors
  if (message.includes('api') || message.includes('server')) {
    return 'Server error. Please try again in a moment.'
  }
  
  // Default message for unknown errors
  return error.message || 'An unexpected error occurred. Please try again.'
}

// Global error handler hook
export function useErrorHandler() {
  const toast = useToast()

  const handleError = (error: Error | string, context?: string) => {
    const errorMessage = typeof error === 'string' ? error : getErrorMessage(error)
    const title = context ? `${context} Error` : 'Error'
    
    toast.error(title, errorMessage)
    
    // Log for debugging
    console.error('Handled error:', { error, context })
  }

  const handleNetworkError = () => {
    toast.error('Connection Error', 'Please check your internet connection and try again.')
  }

  const handleValidationError = (field: string, message: string) => {
    toast.warning('Validation Error', `${field}: ${message}`)
  }

  const handleSuccess = (message: string, details?: string) => {
    toast.success(message, details)
  }

  return {
    handleError,
    handleNetworkError,
    handleValidationError,
    handleSuccess,
  }
}