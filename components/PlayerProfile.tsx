// components/PlayerProfile.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Session, User } from '@supabase/supabase-js'

type Player = {
  id: string
  name: string
  position: string
  preferred_foot: string
  speed: number
  created_at: string
}

type Tournament = {
  id: string
  name: string
}

export default function PlayerProfile() {
  const supabase = createClientComponentClient()
  const [player, setPlayer] = useState<Player | null>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [accountCreated, setAccountCreated] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        // Obtener sesión y usuario
        const {
          data: { session },
        }: { data: { session: Session | null } } = await supabase.auth.getSession()
        if (!session) {
          setError('No estás autenticado')
          return
        }

        // Fecha de creación de la cuenta
        const { data: {user}, } = await supabase.auth.getUser()
        setAccountCreated(user?.created_at ?? null)

        // Cargar perfil
        const { data: p, error: errP } = await supabase
          .from('players')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
        if (errP && errP.code !== 'PGRST116') {
          throw new Error('Error al cargar perfil')
        }
        if (p) {
          setPlayer(p)
          // Cargar torneos donde participa
          const { data: ts, error: errT } = await supabase
            .from('tournaments')
            .select('id,name')
            .eq('player_id', p.id)
            .order('name', { ascending: true })
          if (errT) throw new Error('Error al cargar torneos')
          setTournaments(ts || [])
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [supabase])

  if (loading) {
    return <p className="text-soft-blush p-4 text-center">Cargando perfil…</p>
  }
  if (error) {
    return <p className="text-alert-rose p-4 text-center">{error}</p>
  }
  if (!player) {
    return (
      <p className="text-soft-blush p-4 text-center">
        No se encontró perfil. Ve a “Crear jugador” para empezar.
      </p>
    )
  }

  return (
    <div className="bg-graphite-light p-6 rounded-xl shadow-md max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-code-cyan">Perfil del Jugador</h2>
      <div className="space-y-2 text-soft-blush">
        <p>
          <strong>Nombre:</strong> {player.name}
        </p>
        <p>
          <strong>Posición:</strong> {player.position}
        </p>
        <p>
          <strong>Pierna hábil:</strong> {player.preferred_foot}
        </p>
        <p>
          <strong>Cuenta creada:</strong>{' '}
          {accountCreated
            ? new Date(accountCreated).toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : '—'}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-code-cyan">Torneos</h3>
        {tournaments.length === 0 ? (
          <p className="text-soft-blush">Aún no participas en ningún torneo.</p>
        ) : (
          <ul className="list-disc list-inside text-soft-blush">
            {tournaments.map((t) => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
