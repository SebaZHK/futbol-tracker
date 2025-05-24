// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const PROTECTED_PATHS = [
  '/dashboard',
  '/matches',
  '/training',
  '/tournaments',
  '/profile',
]
const PUBLIC_ONLY_PATHS = ['/', '/login', '/signup']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // No sesión + ruta protegida → login
  if (!session && PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Sí sesión + ruta pública-only → dashboard
  if (session && PUBLIC_ONLY_PATHS.includes(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/matches/:path*',
    '/training/:path*',
    '/tournaments/:path*',
    '/profile/:path*',
    '/',            // home pública
    '/login',       // login
    '/signup',      // signup
  ],
}
