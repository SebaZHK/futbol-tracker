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

  // Función helper para obtener el ID del jugador
  const getPlayerId = async (userId: string) => {
    const { data: player, error } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', userId)
      .single()
    if (error || !player) throw new Error('No player found')
    return player.id
  }

  // Cargar partidos desde Supabase
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

  // Guardar nuevo partido
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
      // reset form
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
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold mb-2">Registrar Partido</h2>

        <label className="block">
          Fecha:
          <input type="date" className="mt-1 w-full p-2 border rounded" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <label className="block">
          Rival:
          <input type="text" className="mt-1 w-full p-2 border rounded" value={opponent} onChange={(e) => setOpponent(e.target.value)} required />
        </label>

		<label className="block">
          Tipo de Partido:
          <input type="text" className="mt-1 w-full p-2 border rounded" value={type} onChange={(e) => setType(e.target.value)} required />
        </label>

        <label className="block">
          Goles:
          <input type="number" className="mt-1 w-full p-2 border rounded" value={goals} onChange={(e) => setGoals(Number(e.target.value))} />
        </label>

        <label className="block">
          Asistencias:
          <input type="number" className="mt-1 w-full p-2 border rounded" value={assists} onChange={(e) => setAssists(Number(e.target.value))} />
        </label>

        <label className="block">
          Minutos jugados:
          <input type="number" className="mt-1 w-full p-2 border rounded" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
        </label>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar Partido
        </button>
      </form>

      {/* Mostrar partidos */}
      <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Partidos Registrados</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : matches.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no has registrado ningún partido.</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {matches.map((m) => (
              <li key={m.id} className="border-b pb-2 flex justify-between items-center">
                <span>{m.date} vs {m.opponent} — {m.type},{m.goals} goles, {m.assists} asistencias, {m.minutes} min</span>
                <button onClick={() => handleDelete(m.id)} className="ml-2 text-red-500 hover:underline text-xs">Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
