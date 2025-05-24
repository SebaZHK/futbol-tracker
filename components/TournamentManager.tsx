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

  // helper: player_id de session.user.id
  const getPlayerId = async (userId: string) => {
    const { data: p } = await supabase.from('players').select('id').eq('user_id', userId).single()
    if (!p) throw new Error('Player not found')
    return p.id
  }

  // Cargar torneos al inicio
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

  // Cuando cambie el torneo activo, cargar también sus equipos
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

  // Crear un nuevo equipo en la tabla teams
  const addTeam = async () => {
    if (!activeTournament || !teamName.trim()) return

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: teamName.trim(),
        tournament_id: activeTournament.id,
        // points, goals_for, goals_against tienen default 0 en la BD
      })
      .select()
      .single()

    if (!error && data) {
      setTeams(prev => [...prev, data])
      setTeamName('')
    }
  }

  if (loadingTourn) return <p>Cargando torneos…</p>

  return (
    <div className="space-y-6">
      {/* Selección de torneo */}
      <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold">Tus Torneos</h2>
        {tournaments.length === 0 && <p className="text-sm text-gray-500">No tienes torneos aún.</p>}
        <ul className="space-y-2">
          {tournaments.map(t => (
            <li key={t.id} className="flex justify-between items-center">
              <span>{t.name}</span>
              <button
                onClick={() => setActiveTournament(t)}
                className="text-blue-600 underline text-sm"
              >
                Abrir
              </button>
            </li>
          ))}
        </ul>
        <hr />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nuevo nombre de torneo"
            value={tournamentName}
            onChange={e => setTournamentName(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={async () => {
              if (!tournamentName.trim()) return
              const { data, error } = await supabase
                .from('tournaments')
                .insert({ name: tournamentName.trim(), player_id: await getPlayerId((await supabase.auth.getSession()).data.session!.user.id) })
                .select()
                .single()
              if (!error && data) {
                setTournaments(prev => [...prev, data])
                setActiveTournament(data)
                setTournamentName('')
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Crear Torneo
          </button>
        </div>
      </div>

      {/* Detalle del torneo activo */}
      {activeTournament && (
        <div>
          <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold">{activeTournament.name}</h2>
            <button
              onClick={async () => {
                await supabase.from('tournaments').delete().eq('id', activeTournament.id)
                setTournaments(prev => prev.filter(t => t.id !== activeTournament.id))
                setActiveTournament(null)
              }}
              className="bg-red-600 text-white px-4 py-2 rounded w-full"
            >
              Eliminar Torneo
            </button>
          </div>

          {/* Crear y listar equipos */}
          <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-semibold">Equipos del Torneo</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre del equipo"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <button onClick={addTeam} className="bg-green-600 text-white px-4 py-2 rounded">
                Agregar
              </button>
            </div>

            {loadingTeams ? (
              <p>Cargando equipos…</p>
            ) : teams.length === 0 ? (
              <p className="text-sm text-gray-500">Aún no hay equipos.</p>
            ) : (
              <ul className="space-y-2 text-sm text-gray-700">
                {teams.map(team => (
                  <li key={team.id} className="border-b pb-2 flex justify-between">
                    <span>{team.name}</span>
                    <span>
                      Pts: {team.points} | GF: {team.goals_for} | GC: {team.goals_against}
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
