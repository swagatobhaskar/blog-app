import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const jwt_access_token = request.cookies.get('access_token')?.value
  // console.log("MIddleWare:: ", jwt_access_token)

  const protectedPaths = [
    '/blog/new',
    '/blog/draft',
    '/blog/:id*/edit',
  ]

  // If the cookie is missing, the user is redirected to your login page.
  if (protectedPaths.includes(request.nextUrl.pathname) && !jwt_access_token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Optionally verify the JWT here, or let FastAPI handle it on API call
  // If the JWT cookie does exist, allow the request to continue as normal — load the page, call API, etc.
  return NextResponse.next()
}

// This middleware will only run for requests to /admin/** (e.g., /admin, /admin/new-post, etc.)
// All other routes in your app are unaffected.
export const config = {
  matcher: ['/blog/:path*/edit', '/blog/new', '/blog/draft'],
}
