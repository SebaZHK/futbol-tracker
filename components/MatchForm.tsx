'use client'

import { useState, useEffect } from 'react'

type Match = {
  id: string
  date: string
  opponent: string
  goals: number
  assists: number
  minutes: number
}

export default function MatchForm() {
  const [date, setDate] = useState('')
  const [opponent, setOpponent] = useState('')
  const [goals, setGoals] = useState(0)
  const [assists, setAssists] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [matches, setMatches] = useState<Match[]>([])

  // Cargar partidos guardados al inicio
  useEffect(() => {
    const stored = localStorage.getItem('matches')
    if (stored) setMatches(JSON.parse(stored))
  }, [])

  // Guardar nuevo partido
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newMatch: Match = {
      id: crypto.randomUUID(),
      date,
      opponent,
      goals,
      assists,
      minutes,
    }

    const updatedMatches = [newMatch, ...matches]
    setMatches(updatedMatches)
    localStorage.setItem('matches', JSON.stringify(updatedMatches))

    // Reset form
    setDate('')
    setOpponent('')
    setGoals(0)
    setAssists(0)
    setMinutes(0)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold mb-2">Registrar Partido</h2>

        <label className="block">
          Fecha:
          <input
            type="date"
            className="mt-1 w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label className="block">
          Rival:
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            required
          />
        </label>

        <label className="block">
          Goles:
          <input
            type="number"
            className="mt-1 w-full p-2 border rounded"
            value={goals}
            onChange={(e) => setGoals(Number(e.target.value))}
          />
        </label>

        <label className="block">
          Asistencias:
          <input
            type="number"
            className="mt-1 w-full p-2 border rounded"
            value={assists}
            onChange={(e) => setAssists(Number(e.target.value))}
          />
        </label>

        <label className="block">
          Minutos jugados:
          <input
            type="number"
            className="mt-1 w-full p-2 border rounded"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </label>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar Partido
        </button>
      </form>

      {/* Mostrar partidos guardados */}
      <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Partidos Registrados</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {matches.map((m) => (
            <li key={m.id} className="border-b pb-2">
              {m.date} vs {m.opponent} — {m.goals} goles, {m.assists} asistencias, {m.minutes} min
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
