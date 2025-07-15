"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ServerError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 bg-gray-50">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4M4 7H20M19 7L18.287 18.9312C18.1324 21.1873 16.2516 22.9944 14 23H10C7.74843 22.9944 5.86756 21.1873 5.71296 18.9312L5 7" 
              stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
          Server Error
        </h1>
        <p className="text-gray-500 mb-6">
          We&apos;re sorry, but something went wrong on our server. Our team has been notified and is working to fix the issue.
        </p>
        <div className="flex gap-4">
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            <Link href="/">Go back home</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </Button>
        </div>
      </div>
    </div>
  )
}