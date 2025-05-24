// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Navbar() {
  const [sessionExists, setSessionExists] = useState<boolean>(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // 1. Al montar, pedimos el estado inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionExists(!!session)
    })

    // 2. Nos suscribimos a cambios futuros (login, logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSessionExists(!!session)
      }
    )

    // 3. Limpiamos al desmontar
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <nav className="bg-white shadow p-4">
      <ul className="flex gap-4">
        <li><Link href="/">Home</Link></li>
        {sessionExists ? (
          <>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/profile">Perfil</Link></li>
            <li><Link href="/matches">Partidos</Link></li>
            <li><Link href="/training">Entrenamientos</Link></li>
            <li><Link href="/tournaments">Torneos</Link></li>
          </>
        ) : (
          <>
            <li><Link href="/login">Iniciar sesión</Link></li>
            <li><Link href="/signup">Registrarse</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}
