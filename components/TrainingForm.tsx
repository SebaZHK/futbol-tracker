// components/TrainingForm.tsx
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

  const getPlayerId = async (userId: string) => {
    const { data: player, error } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', userId)
      .single()
    if (error || !player) throw new Error('Player not found')
    return player.id
  }

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
      <form
        onSubmit={handleSubmit}
        className="bg-graphite-light p-6 rounded-xl shadow-md max-w-md mx-auto space-y-4"
      >
        <h2 className="text-xl font-semibold text-code-cyan">Registrar Entrenamiento</h2>

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
          Tipo de entrenamiento:
          <input
            type="text"
            className="mt-1 w-full p-2 bg-night-black text-soft-blush border border-graphite rounded"
            value={type}
            onChange={e => setType(e.target.value)}
            placeholder="Ej: cardio, técnica, táctica"
          />
        </label>

        <label className="block text-soft-blush">
          Duración (minutos):
          <input
            type="number"
            className="mt-1 w-full p-2 bg-night-black text-soft-blush border border-graphite rounded"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
          />
        </label>

        <label className="block text-soft-blush">
          Notas:
          <textarea
            className="mt-1 w-full p-2 bg-night-black text-soft-blush border border-graphite rounded"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </label>

        <button type="submit" className="btn-primary w-full">
          Guardar Entrenamiento
        </button>
      </form>

      <div className="max-w-md mx-auto bg-graphite-light p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-soft-blush mb-2">
          Entrenamientos Registrados
        </h3>
        {loading ? (
          <p className="text-soft-blush">Cargando...</p>
        ) : trainings.length === 0 ? (
          <p className="text-sm text-soft-blush">No hay sesiones aún.</p>
        ) : (
          <ul className="space-y-2 text-soft-blush">
            {trainings.map(t => (
              <li key={t.id} className="border-b border-graphite pb-2">
                <span className="font-medium">{t.date}</span> — {t.type},{' '}
                {t.duration} min
                <br />
                <span className="text-xs text-soft-blush-dark">Notas: {t.notes}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
