'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Navbar() {
  const [sessionExists, setSessionExists] = useState<boolean>(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionExists(!!session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSessionExists(!!session)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  return (
    <nav className="sticky top-0 z-50 bg-graphite">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        <Link href="/">
          <span className="text-2xl font-bold text-code-cyan">Fútbol Tracker</span>
        </Link>
        <ul className="flex items-center gap-6">
          {sessionExists ? (
            [
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/profile', label: 'Perfil' },
              { href: '/matches', label: 'Partidos' },
              { href: '/training', label: 'Entrenamientos' },
              { href: '/tournaments', label: 'Torneos' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="link-secondary">
                  {label}
                </Link>
              </li>
            ))
          ) : (
            [
              { href: '/', label: 'Home' },
              { href: '/login', label: 'Iniciar sesión' },
              { href: '/signup', label: 'Registrarse' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="link-secondary">
                  {label}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </nav>
  )
}
