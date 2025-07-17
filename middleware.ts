import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Validate if token is valid and not expired (simplified for middleware)
 */
function isValidTokenForMiddleware(token: string, expiryDate?: string): boolean {
  if (!token) return false;
  
  try {
    // Check expiry date if provided
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const now = new Date();
      if (expiry <= now) {
        return false;
      }
    }
    
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    return true;
  } catch {
    return false;
  }
}

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
  const userCredCookie = request.cookies.get('userCred')
  
  let isAuthenticated = false
  
  if (userCredCookie?.value) {
    try {
      const userCred = JSON.parse(userCredCookie.value)
      
      // Validate token and expiry
      if (userCred?.token && isValidTokenForMiddleware(userCred.token, userCred.expiryDate)) {
        isAuthenticated = true
      }
    } catch (error) {
      // Invalid cookie data
      console.error('Invalid userCred cookie:', error)
      isAuthenticated = false
    }
  }
  
  // If user is authenticated and trying to access login, redirect to orders
  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/orders', request.url))
  }
  
  // If no valid authentication and not a public path, redirect to login
  if (!isAuthenticated) {
    // Clear invalid cookie if it exists
    const response = NextResponse.redirect(new URL('/login', request.url))
    if (userCredCookie?.value) {
      response.cookies.delete('userCred')
    }
    return response
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