import type { NextConfig } from 'next'

const nextConfig: NextConfig = {

}

export default nextConfig

// Para que el middleware se aplique solo a rutas protegidas
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/matches/:path*',
    '/training/:path*',
    '/tournaments/:path*',
    '/profile/:path*',
    '/stats7:path*'
  ],
}
