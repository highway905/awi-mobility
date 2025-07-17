"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlobalLoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "overlay" | "fullscreen" | "inline"
  message?: string
  className?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

export function GlobalLoader({ 
  size = "md", 
  variant = "default", 
  message = "Loading...",
  className 
}: GlobalLoaderProps) {
  
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={cn(sizeClasses[size], "animate-spin text-blue-600")} />
          {message && (
            <p className="text-sm text-gray-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    )
  }

  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className={cn(sizeClasses[size], "animate-spin text-blue-600")} />
          {message && (
            <p className="text-sm text-gray-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Loader2 className={cn(sizeClasses[size], "animate-spin text-blue-600")} />
        {message && (
          <span className="text-sm text-gray-600">{message}</span>
        )}
      </div>
    )
  }

  // Default centered loader
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-3", className)}>
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-blue-600")} />
      {message && (
        <p className="text-sm text-gray-600 font-medium text-center">{message}</p>
      )}
    </div>
  )
}

// Pre-configured loader variants for common use cases
export const PageLoader = () => (
  <GlobalLoader variant="fullscreen" size="lg" message="Loading page..." />
)

export const CardLoader = () => (
  <GlobalLoader variant="default" size="md" message="Loading..." />
)

export const TableLoader = () => (
  <GlobalLoader variant="overlay" size="md" message="Loading data..." />
)

export const ButtonLoader = () => (
  <GlobalLoader variant="inline" size="sm" message="" />
)

export const FormLoader = () => (
  <GlobalLoader variant="overlay" size="md" message="Processing..." />
)
