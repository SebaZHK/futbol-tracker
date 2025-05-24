'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import StatCard from '@/components/StatCard'

type Match = {
  id: string
  date: string
  opponent: string
  goals: number
  assists: number
  minutes: number
}

export default function DashboardPage() {
  const supabase = createClientComponentClient()

  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  // helper para obtener player_id
  const getPlayerId = async (userId: string) => {
    const { data: player, error } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', userId)
      .single()
    if (error || !player) throw new Error('Player not found')
    return player.id
  }

  // cargar partidos reales
  useEffect(() => {
    const fetchMatches = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user.id
      if (!userId) return

      try {
        const playerId = await getPlayerId(userId)
        const { data, error } = await supabase
          .from('matches')
          .select('id, date, opponent, goals, assists, minutes')
          .eq('player_id', playerId)

        if (error) throw error
        setMatches(data)
      } catch (err: any) {
        console.error('Error loading dashboard matches:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [supabase])

  if (loading) {
    return <p>Cargando estadísticas…</p>
  }

  const totalGoals = matches.reduce((sum, m) => sum + m.goals, 0)
  const totalAssists = matches.reduce((sum, m) => sum + m.assists, 0)
  const totalMatches = matches.length
  const totalMinutes = matches.reduce((sum, m) => sum + m.minutes, 0)

  const stats = [
    { label: 'Goles', value: totalGoals },
    { label: 'Asistencias', value: totalAssists },
    { label: 'Partidos', value: totalMatches },
    { label: 'Minutos', value: totalMinutes },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {matches.length === 0 ? (
        <p className="text-gray-500">Aún no tienes partidos registrados.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      )}
    </div>
  )
}
