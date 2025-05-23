'use client'

import { useEffect, useState } from 'react'

type Training = {
  id: string
  date: string
  type: string
  duration: number
  notes: string
}

export default function TrainingForm() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [date, setDate] = useState('')
  const [type, setType] = useState('')
  const [duration, setDuration] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('trainings')
    if (stored) setTrainings(JSON.parse(stored))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTraining: Training = {
      id: crypto.randomUUID(),
      date,
      type,
      duration,
      notes,
    }

    const updatedTrainings = [newTraining, ...trainings]
    setTrainings(updatedTrainings)
    localStorage.setItem('trainings', JSON.stringify(updatedTrainings))

    // Reset
    setDate('')
    setType('')
    setDuration(0)
    setNotes('')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold mb-2">Registrar Entrenamiento</h2>

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
          Tipo de entrenamiento:
          <input
            type="text"
            className="mt-1 w-full p-2 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Ej: cardio, técnica, táctica"
          />
        </label>

        <label className="block">
          Duración (minutos):
          <input
            type="number"
            className="mt-1 w-full p-2 border rounded"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>

        <label className="block">
          Notas:
          <textarea
            className="mt-1 w-full p-2 border rounded"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar Entrenamiento
        </button>
      </form>

      <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Entrenamientos Registrados</h3>
        {trainings.length === 0 ? (
          <p className="text-sm text-gray-500">No hay sesiones aún.</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {trainings.map((t) => (
              <li key={t.id} className="border-b pb-2">
                {t.date} — {t.type}, {t.duration} min
                <br />
                <span className="text-xs text-gray-500">Notas: {t.notes}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
