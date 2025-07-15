"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { resetUserCred } from '@/utils/helper'

export default function Unauthorized() {
  const router = useRouter()

  useEffect(() => {
    // Clear user credentials when this page is shown
    resetUserCred()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 bg-gray-50">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14V12M12 8H12.01M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z" 
              stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-6">
          You don&apos;t have permission to access this page. Please log in with an account that has the required permissions.
        </p>
        <div className="flex gap-4">
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}