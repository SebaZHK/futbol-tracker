// components/MatchForm.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Match = {
  id: string
  date: string
  opponent: string
  type: string
  goals: number
  assists: number
  minutes: number
}

export default function MatchForm() {
  const supabase = createClientComponentClient()
  const [matches, setMatches] = useState<Match[]>([])
  const [date, setDate] = useState('')
  const [opponent, setOpponent] = useState('')
  const [type, setType] = useState('')
  const [goals, setGoals] = useState(0)
  const [assists, setAssists] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [loading, setLoading] = useState(true)

  const getPlayerId = async (userId: string) => {
    const { data: player, error } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', userId)
      .single()
    if (error || !player) throw new Error('No player found')
    return player.id
  }

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
          .select('*')
          .eq('player_id', playerId)
          .order('date', { ascending: false })

        if (error) throw error
        setMatches(data)
      } catch (err: any) {
        console.error('Error fetching matches:', err.message || err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user.id
    if (!userId) return

    try {
      const playerId = await getPlayerId(userId)
      const { data, error } = await supabase
        .from('matches')
        .insert({
          date,
          opponent,
          type,
          goals,
          assists,
          minutes,
          player_id: playerId,
        })
        .select()
        .single()

      if (error) throw error
      setMatches([data as Match, ...matches])
      setDate('')
      setOpponent('')
      setType('')
      setGoals(0)
      setAssists(0)
      setMinutes(0)
    } catch (err: any) {
      console.error('Error adding match:', err.message || err)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('matches').delete().eq('id', id)
    if (!error) {
      setMatches(matches.filter(m => m.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-graphite-light p-6 rounded-xl shadow-md max-w-md mx-auto space-y-4"
      >
        <h2 className="text-xl font-semibold text-soft-blush">Registrar Partido</h2>

        <label className="block text-soft-blush">
          Fecha:
          <input
            type="date"
            className="mt-1 w-full p-2 bg-night-black text-soft-blush border border-graphite rounded"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </label>

        <label className="block text-soft-blush">
          Rival:
          <input
            type="text"
            className="mt-1 w-full p-2 bg-night-black text-soft-blush border border-graphite rounded"
            value={opponent}
            onChange={e => setOpponent(e.target.value)}
            required
          />
        </label>

        <label className="block text-soft-blush">
          Tipo de Partido:
          <input
            type="text"
            className="mt-1 w-full p-2 bg-night-black text-soft-blush border border-graphite rounded"
            value={type}
            onChange={e => setType(e.target.value)}
            required
          />
        </label>

        <label className="block text-soft-blush">
          Goles:
          <input
            type="number"
            className="mt-1 w-full p-2 bg-night-black text-soft-blush border border-graphite rounded"
            value={goals}
            onChange={e => setGoals(Number(e.target.value))}
          />
        </label>

        <label className="block text-soft-blush">
          Asistencias:
          <input
            type="number"
            className="mt-1 w-full p-2 bg-night-black text-soft-blush border border-graphite rounded"
            value={assists}
            onChange={e => setAssists(Number(e.target.value))}
          />
        </label>

        <label className="block text-soft-blush">
          Minutos jugados:
          <input
            type="number"
            className="mt-1 w-full p-2 bg-night-black text-soft-blush border border-graphite rounded"
            value={minutes}
            onChange={e => setMinutes(Number(e.target.value))}
          />
        </label>

        <button type="submit" className="btn-primary w-full">
          Guardar Partido
        </button>
      </form>

      <div className="max-w-md mx-auto bg-graphite-light p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-soft-blush mb-2">Partidos Registrados</h3>
        {loading ? (
          <p className="text-soft-blush">Cargando...</p>
        ) : matches.length === 0 ? (
          <p className="text-sm text-soft-blush">Aún no has registrado ningún partido.</p>
        ) : (
          <ul className="space-y-2 text-soft-blush">
            {matches.map(m => (
              <li
                key={m.id}
                className="border-b border-graphite pb-2 flex justify-between items-center"
              >
                <span>
                  <span className="font-medium">{m.date}</span> vs{' '}
                  <span className="font-medium">{m.opponent}</span> — {m.type},{' '}
                  <strong className="text-code-cyan">{m.goals} goles</strong>,{' '}
                  <strong className="text-code-cyan">{m.assists} asistencias</strong>,{' '}
                  <strong className="text-code-cyan">{m.minutes} min</strong>
                </span>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="btn-secondary text-xs"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
