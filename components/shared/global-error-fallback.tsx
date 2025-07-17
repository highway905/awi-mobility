"use client"

import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlobalErrorFallbackProps {
  error?: string | Error
  variant?: "page" | "card" | "inline" | "fullscreen"
  title?: string
  description?: string
  showRetry?: boolean
  showHome?: boolean
  showBack?: boolean
  onRetry?: () => void
  onHome?: () => void
  onBack?: () => void
  className?: string
}

export function GlobalErrorFallback({
  error,
  variant = "card",
  title,
  description,
  showRetry = true,
  showHome = false,
  showBack = false,
  onRetry,
  onHome,
  onBack,
  className
}: GlobalErrorFallbackProps) {
  
  // Extract error message
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred'
  
  // Default titles and descriptions based on variant
  const defaultTitle = variant === "page" ? "Page Not Found" : "Something went wrong"
  const defaultDescription = variant === "page" 
    ? "Sorry, we could not find the page you are looking for."
    : "We encountered an error while loading this content. Please try again."

  const finalTitle = title || defaultTitle
  const finalDescription = description || defaultDescription

  const ErrorContent = () => (
    <>
      {/* Error Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          {/* Large 404 text for page variant */}
          {variant === "page" && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="text-6xl font-bold text-gray-400">404</div>
            </div>
          )}
        </div>
      </div>

      {/* Error Text */}
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          {finalTitle}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {finalDescription}
        </p>
        {error && variant !== "page" && (
          <details className="text-left mt-4">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Technical Details
            </summary>
            <pre className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded border overflow-auto">
              {errorMessage}
            </pre>
          </details>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {variant === "page" && (
          <Button 
            onClick={onHome || (() => window.location.href = '/dashboard')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        )}
        
        {showBack && onBack && (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="px-6 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        )}
        
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            className="px-6 py-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        
        {showHome && onHome && (
          <Button 
            variant="outline" 
            onClick={onHome}
            className="px-6 py-2"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        )}
      </div>
    </>
  )

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="max-w-md w-full mx-4">
          <ErrorContent />
        </div>
      </div>
    )
  }

  if (variant === "page") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <ErrorContent />
        </div>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">{errorMessage}</p>
          {showRetry && onRetry && (
            <Button size="sm" onClick={onRetry}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Default card variant
  return (
    <Card className={cn("max-w-lg mx-auto border-none", className)}>
      <CardContent className="p-12">
        <ErrorContent />
      </CardContent>
    </Card>
  )
}

// Pre-configured error variants for common use cases
export const PageErrorFallback = (props: Partial<GlobalErrorFallbackProps>) => (
  <GlobalErrorFallback 
    variant="page" 
    showHome={true}
    {...props} 
  />
)

export const CardErrorFallback = (props: Partial<GlobalErrorFallbackProps>) => (
  <GlobalErrorFallback 
    variant="card" 
    showRetry={true}
    {...props} 
  />
)

export const InlineErrorFallback = (props: Partial<GlobalErrorFallbackProps>) => (
  <GlobalErrorFallback 
    variant="inline" 
    showRetry={true}
    {...props} 
  />
)

export const FullscreenErrorFallback = (props: Partial<GlobalErrorFallbackProps>) => (
  <GlobalErrorFallback 
    variant="fullscreen" 
    showRetry={true}
    showHome={true}
    {...props} 
  />
)
