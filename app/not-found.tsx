import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 bg-gray-50">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" 
              stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 mb-6">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may have been moved, deleted, or never existed.
        </p>
        <Button
          asChild
          className="bg-amber-500 hover:bg-amber-600 text-black"
        >
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
}