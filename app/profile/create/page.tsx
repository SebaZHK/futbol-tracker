// app/profile/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from '@/components/LogoutButton'

export default function CreatePlayerProfile() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [foot, setFoot] = useState('Derecha')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      setError('No se pudo obtener la sesión actual.')
      setLoading(false)
      return
    }

    const userId = session.user.id
    const { error: insertError } = await supabase
      .from('players')
      .insert({
        name,
        position,
        preferred_foot: foot,
        user_id: userId,
      })

    if (insertError) {
      setError(insertError.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-graphite p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-graphite-light p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-code-cyan text-center">
          Crear perfil de jugador
        </h1>

        <label className="block text-soft-blush">
          Nombre
          <input
            type="text"
            className="w-full bg-night-black text-soft-blush border border-graphite p-2 rounded mt-1"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>

        <label className="block text-soft-blush">
          Posición
          <input
            type="text"
            className="w-full bg-night-black text-soft-blush border border-graphite p-2 rounded mt-1"
            value={position}
            onChange={e => setPosition(e.target.value)}
            required
          />
        </label>

        <label className="block text-soft-blush">
          Pierna hábil
          <select
            className="w-full bg-night-black text-soft-blush border border-graphite p-2 rounded mt-1"
            value={foot}
            onChange={e => setFoot(e.target.value)}
          >
            <option>Derecha</option>
            <option>Izquierda</option>
            <option>Ambas</option>
          </select>
        </label>

        {error && <p className="text-alert-rose text-sm">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Crear perfil'}
        </button>

        <div className="text-center">
          <LogoutButton />
        </div>
      </form>
    </div>
  )
}
