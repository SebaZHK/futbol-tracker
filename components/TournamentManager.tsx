// components/TournamentManager.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Team = {
  id: string
  name: string
  points: number
  goals_for: number
  goals_against: number
}

type Tournament = {
  id: string
  name: string
  player_id: string
}

export default function TournamentManager() {
  const supabase = createClientComponentClient()

  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [tournamentName, setTournamentName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [loadingTourn, setLoadingTourn] = useState(true)
  const [loadingTeams, setLoadingTeams] = useState(false)

  const getPlayerId = async (userId: string) => {
    const { data: p, error } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', userId)
      .single()
    if (error || !p) throw new Error('Player not found')
    return p.id
  }

  useEffect(() => {
    const fetchTournaments = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user.id
      if (!userId) return

      const playerId = await getPlayerId(userId)
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('player_id', playerId)
        .order('name', { ascending: true })

      if (!error && data) setTournaments(data)
      setLoadingTourn(false)
    }
    fetchTournaments()
  }, [supabase])

  useEffect(() => {
    if (!activeTournament) {
      setTeams([])
      return
    }
    const fetchTeams = async () => {
      setLoadingTeams(true)
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('tournament_id', activeTournament.id)
        .order('name', { ascending: true })

      if (!error && data) setTeams(data)
      setLoadingTeams(false)
    }
    fetchTeams()
  }, [activeTournament, supabase])

  const addTeam = async () => {
    if (!activeTournament || !teamName.trim()) return

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: teamName.trim(),
        tournament_id: activeTournament.id,
      })
      .select()
      .single()

    if (!error && data) {
      setTeams(prev => [...prev, data])
      setTeamName('')
    }
  }

  if (loadingTourn) return <p className="text-soft-blush">Cargando torneos…</p>

  return (
    <div className="space-y-6">
      {/* Selección de torneo */}
      <div className="bg-graphite-light p-6 rounded-xl shadow-md max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-code-cyan">Tus Torneos</h2>
        {tournaments.length === 0 && (
          <p className="text-sm text-soft-blush">No tienes torneos aún.</p>
        )}
        <ul className="space-y-2 text-soft-blush">
          {tournaments.map(t => (
            <li key={t.id} className="flex justify-between items-center">
              <span>{t.name}</span>
              <button
                onClick={() => setActiveTournament(t)}
                className="link-secondary text-sm"
              >
                Abrir
              </button>
            </li>
          ))}
        </ul>
        <hr className="border-graphite" />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nuevo nombre de torneo"
            value={tournamentName}
            onChange={e => setTournamentName(e.target.value)}
            className="flex-1 p-2 bg-night-black text-soft-blush border border-graphite rounded"
          />
          <button
            onClick={async () => {
              if (!tournamentName.trim()) return
              const user = await supabase.auth.getSession()
              const pid = await getPlayerId(user.data.session!.user.id)
              const { data, error } = await supabase
                .from('tournaments')
                .insert({ name: tournamentName.trim(), player_id: pid })
                .select()
                .single()
              if (!error && data) {
                setTournaments(prev => [...prev, data])
                setActiveTournament(data)
                setTournamentName('')
              }
            }}
            className="btn-primary"
          >
            Crear
          </button>
        </div>
      </div>

      {/* Detalle del torneo activo */}
      {activeTournament && (
        <div className="space-y-4">
          <div className="bg-graphite-light p-6 rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-code-cyan">
              {activeTournament.name}
            </h2>
            <button
              onClick={async () => {
                await supabase
                  .from('tournaments')
                  .delete()
                  .eq('id', activeTournament.id)
                setTournaments(prev =>
                  prev.filter(t => t.id !== activeTournament.id)
                )
                setActiveTournament(null)
              }}
              className="btn-secondary w-full"
            >
              Eliminar Torneo
            </button>
          </div>

          {/* Crear y listar equipos */}
          <div className="bg-graphite-light p-6 rounded-xl shadow-md max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-semibold text-code-cyan">
              Equipos
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre del equipo"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="flex-1 p-2 bg-night-black text-soft-blush border border-graphite rounded"
              />
              <button onClick={addTeam} className="btn-primary">
                Agregar
              </button>
            </div>

            {loadingTeams ? (
              <p className="text-soft-blush">Cargando equipos…</p>
            ) : teams.length === 0 ? (
              <p className="text-sm text-soft-blush">Aún no hay equipos.</p>
            ) : (
              <ul className="space-y-2 text-soft-blush text-sm">
                {teams.map(team => (
                  <li
                    key={team.id}
                    className="border-b border-graphite pb-2 flex justify-between"
                  >
                    <span>{team.name}</span>
                    <span>
                      Pts: <strong className="text-code-cyan">{team.points}</strong> | GF:{' '}
                      <strong className="text-code-cyan">{team.goals_for}</strong> | GC:{' '}
                      <strong className="text-code-cyan">{team.goals_against}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
)
}
