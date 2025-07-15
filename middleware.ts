import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/login',
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/no-internet',
    '/not-found',
    '/unauthorized',
    '/server-error',
    '/assets/'
  ]
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath)
  )
  
  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // Check for authentication
  const userCred = request.cookies.get('userCred')
  
  // If no authentication and not a public path, redirect to login
  if (!userCred?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // User is authenticated, allow access
  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}