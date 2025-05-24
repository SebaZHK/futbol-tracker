// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseToken = request.cookies.get('sb-access-token')?.value

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                           request.nextUrl.pathname.startsWith('/matches') ||
                           request.nextUrl.pathname.startsWith('/training') ||
                           request.nextUrl.pathname.startsWith('/tournaments') ||
                           request.nextUrl.pathname.startsWith('/profile') ||
                           request.nextUrl.pathname.startsWith('/stats')

  if (isProtectedRoute && !supabaseToken) {
    const loginUrl = new URL('/signup', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
