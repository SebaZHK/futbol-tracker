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
const PROFILE_CREATE_PATH = '/profile/create'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // Sin sesión + ruta protegida → login
  if (!session && PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Con sesión + rutas públicas → dashboard
  if (session && PUBLIC_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Con sesión pero sin jugador → solo allow /profile/create
  if (session) {
    // solo comprobar si no estamos ya en /profile or create
    if (
      !pathname.startsWith(PROFILE_CREATE_PATH) &&
      pathname !== PROFILE_CREATE_PATH
    ) {
      // Chequear en DB si el player existe
      const { data: player, error } = await supabase
        .from('players')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (!error && !player) {
        // redirigir para crear perfil
        const url = req.nextUrl.clone()
        url.pathname = PROFILE_CREATE_PATH
        return NextResponse.redirect(url)
      }
    }
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
    '/',
    '/login',
    '/signup',
  ],
}
