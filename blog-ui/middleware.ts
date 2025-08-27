import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get('access_token')?.value

  if (!jwt) {
    // If the cookie is missing, the user is redirected to /secret-login (or wherever your login page is).
    return NextResponse.redirect(new URL('/secret-login', request.url))
  }

  // Optionally verify the JWT here, or let FastAPI handle it on API call
  // If the JWT cookie does exist, allow the request to continue as normal — load the page, call API, etc.
  return NextResponse.next()
}

// This middleware will only run for requests to /admin/** (e.g., /admin, /admin/new-post, etc.)
// All other routes in your app are unaffected.
export const config = {
  matcher: ['/admin/:path*'],
}
