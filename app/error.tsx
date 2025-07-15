"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 bg-gray-50">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
              stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
          Something went wrong!
        </h1>
        <p className="text-gray-500 mb-6">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => reset()}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            Try again
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}