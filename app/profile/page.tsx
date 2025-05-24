'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ProfilePage() {
  const supabase = createClientComponentClient()

  const [jugador, setJugador] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', preferred_foot: '', position: '' })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJugador = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        setError('Error al buscar el jugador.')
      } else {
        setJugador(data)
      }
      setLoading(false)
    }

    fetchJugador()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()

    const { error } = await supabase.from('players').insert({
      ...form,
      user_id: session?.user.id,
    })

    if (error) {
      setError('Error al crear jugador')
    } else {
      window.location.reload()
    }
  }

  if (loading) return <p className="p-4">Cargando...</p>

  if (!jugador) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Crear jugador</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Nombre"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="preferred_foot"
            placeholder="Pierna hábil"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="position"
            placeholder="Posición"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Crear jugador
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Perfil del Jugador</h1>
      <p><strong>Nombre:</strong> {jugador.name}</p>
      <p><strong>Pierna hábil:</strong> {jugador.preferred_foot}</p>
      <p><strong>Posición:</strong> {jugador.position}</p>
    </div>
  )
}
