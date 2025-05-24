// app/profile/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CreatePlayerProfile() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [foot, setFoot] = useState('Derecha')
  const [speed, setSpeed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser()

    if (sessionError || !user) {
      setError('No se pudo obtener el usuario actual.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('players').insert({
      name,
      position,
      preferred_foot: foot,
      max_speed: speed,
      user_id: user.id,
    })

    if (insertError) setError(insertError.message)
    else router.push('/dashboard')

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear perfil de jugador</h1>

        <label className="block mb-2">Nombre</label>
        <input
          type="text"
          className="w-full border p-2 mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="block mb-2">Posición</label>
        <input
          type="text"
          className="w-full border p-2 mb-4 rounded"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />

        <label className="block mb-2">Pierna hábil</label>
        <select
          className="w-full border p-2 mb-4 rounded"
          value={foot}
          onChange={(e) => setFoot(e.target.value)}
        >
          <option>Derecha</option>
          <option>Izquierda</option>
          <option>Ambas</option>
        </select>

        <label className="block mb-2">Velocidad máxima (km/h)</label>
        <input
          type="number"
          className="w-full border p-2 mb-4 rounded"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Crear perfil'}
        </button>
      </form>
    </div>
  )
}
