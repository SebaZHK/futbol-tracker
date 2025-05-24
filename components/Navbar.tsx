// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from '@/components/LogoutButton'

export default function Navbar() {
  const [sessionExists, setSessionExists] = useState<boolean>(false)
  const [hasPlayer, setHasPlayer] = useState<boolean>(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let listener: any
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const loggedIn = !!session
      setSessionExists(loggedIn)

      if (loggedIn) {
        const { data: player, error } = await supabase
          .from('players')
          .select('id')
          .eq('user_id', session.user.id)
          .single()
        setHasPlayer(!!player && !error)
      } else {
        setHasPlayer(false)
      }
    }

    checkSession()
    listener = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        setSessionExists(true)
        supabase
          .from('players')
          .select('id')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data, error }) => {
            setHasPlayer(!!data && !error)
          })
      } else {
        setSessionExists(false)
        setHasPlayer(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  return (
    <nav className="sticky top-0 z-50 bg-graphite">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        <Link href="/">
          <span className="text-2xl font-bold text-code-cyan">Fútbol Tracker</span>
        </Link>
        {(!sessionExists || (sessionExists && hasPlayer)) && (
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
            {sessionExists && hasPlayer && <LogoutButton />}
          </ul>
        )}
      </div>
    </nav>
  )
}
