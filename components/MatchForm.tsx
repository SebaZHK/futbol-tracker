'use client'

import { useState } from 'react'

export default function MatchForm() {
  const [date, setDate] = useState('')
  const [opponent, setOpponent] = useState('')
  const [goals, setGoals] = useState(0)
  const [assists, setAssists] = useState(0)
  const [minutes, setMinutes] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría lógica para guardar el partido (en localStorage o BD)
    console.log({ date, opponent, goals, assists, minutes })
    alert('Partido registrado (simulado)')
  }

  return (
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
  )
}
