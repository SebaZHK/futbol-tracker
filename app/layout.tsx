import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Mi Fútbol Tracker',
  description: 'Tu app personal para registrar tu rendimiento futbolístico amateur.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="max-w-5xl mx-auto p-4 bg-graphite">
          {children}
        </main>
       </body>
    </html>
  )
}
