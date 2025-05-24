'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Training = {
  id: string
  date: string
  type: string
  duration: number
  notes: string
}

export default function TrainingForm() {
  const supabase = createClientComponentClient()

  const [trainings, setTrainings] = useState<Training[]>([])
  const [date, setDate] = useState('')
  const [type, setType] = useState('')
  const [duration, setDuration] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  // Helper: devuelve el player_id asociado al user_id
  const getPlayerId = async (userId: string) => {
    const { data: player, error } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', userId)
      .single()
    if (error || !player) throw new Error('Player not found')
    return player.id
  }

  // Cargar entrenamientos desde Supabase
  useEffect(() => {
    const fetchTrainings = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user.id
      if (!userId) return

      try {
        const playerId = await getPlayerId(userId)
        const { data, error } = await supabase
          .from('trainings')
          .select('*')
          .eq('player_id', playerId)
          .order('date', { ascending: false })

        if (error) throw error
        setTrainings(data)
      } catch (err: any) {
        console.error('Error fetching trainings:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainings()
  }, [supabase])

  // Guardar nuevo entrenamiento
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
        .from('trainings')
        .insert({
          date,
          type,
          duration,
          notes,
          player_id: playerId,
        })
        .select()
        .single()

      if (error) throw error
      setTrainings([data as Training, ...trainings])
      // reset
      setDate('')
      setType('')
      setDuration(0)
      setNotes('')
    } catch (err: any) {
      console.error('Error adding training:', err.message)
    }
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
        {loading ? (
          <p>Cargando...</p>
        ) : trainings.length === 0 ? (
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
