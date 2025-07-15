"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function NoInternet() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Set initial online status
      setIsOnline(navigator.onLine)

      // Function to handle network status changes
      const handleNetworkChange = () => {
        setIsOnline(navigator.onLine)
        
        // If back online, navigate back
        if (navigator.onLine) {
          setTimeout(() => {
            router.back()
          }, 1000)
        }
      }

      // Add event listeners
      window.addEventListener('online', handleNetworkChange)
      window.addEventListener('offline', handleNetworkChange)

      // Clean up
      return () => {
        window.removeEventListener('online', handleNetworkChange)
        window.removeEventListener('offline', handleNetworkChange)
      }
    }
  }, [router])

  // If we're online, show a redirecting message
  if (isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-amber-500 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-700">Connection restored. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 bg-gray-50">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.68387 14.5161C9.32286 13.877 10.1552 13.5161 11.0323 13.5161C11.9093 13.5161 12.7417 13.877 13.3807 14.5161M6.09677 11.9291C7.42742 10.5984 9.18064 9.83871 11 9.83871C12.8194 9.83871 14.5726 10.5984 15.9032 11.9291M3.51613 9.34194C5.5129 7.34516 8.19355 6.16129 11 6.16129C13.8065 6.16129 16.4871 7.34516 18.4839 9.34194M11 18.5L11.0161 18.4839" 
              stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
          No Internet Connection
        </h1>
        <p className="text-gray-500 mb-6">
          Please check your internet connection and try again. We&apos;ll automatically reconnect when your connection is restored.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-amber-500 hover:bg-amber-600 text-black"
        >
          Retry Connection
        </Button>
      </div>
    </div>
  )
}