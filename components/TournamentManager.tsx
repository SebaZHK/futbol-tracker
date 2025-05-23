'use client'

import { useEffect, useState } from 'react'

type Team = {
  name: string
  points: number
  goalsFor: number
  goalsAgainst: number
}

type Tournament = {
  name: string
  teams: Team[]
}

export default function TournamentManager() {
  const [tournamentName, setTournamentName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [tournament, setTournament] = useState<Tournament | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('tournament')
    if (stored) setTournament(JSON.parse(stored))
  }, [])

  const addTeam = () => {
    if (!tournament) return

    const newTeam: Team = {
      name: teamName,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    }

    const updated = {
      ...tournament,
      teams: [...tournament.teams, newTeam],
    }

    setTournament(updated)
    localStorage.setItem('tournament', JSON.stringify(updated))
    setTeamName('')
  }

  const createTournament = () => {
    const newTournament: Tournament = {
      name: tournamentName,
      teams: [],
    }

    setTournament(newTournament)
    localStorage.setItem('tournament', JSON.stringify(newTournament))
    setTournamentName('')
  }

  return (
    <div className="space-y-6">
      {!tournament ? (
        <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Crear Torneo</h2>
          <input
            type="text"
            placeholder="Nombre del torneo"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={createTournament}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2">{tournament.name}</h2>
            <input
              type="text"
              placeholder="Nombre del equipo"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={addTeam}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Agregar Equipo
            </button>
          </div>

          <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">Tabla de Posiciones</h3>
            {tournament.teams.length === 0 ? (
              <p className="text-sm text-gray-500">Sin equipos aún.</p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-600">
                    <th>Equipo</th>
                    <th>Pts</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>DG</th>
                  </tr>
                </thead>
                <tbody>
                  {tournament.teams
                    .sort((a, b) => b.points - a.points)
                    .map((team) => (
                      <tr key={team.name} className="border-t">
                        <td>{team.name}</td>
                        <td>{team.points}</td>
                        <td>{team.goalsFor}</td>
                        <td>{team.goalsAgainst}</td>
                        <td>{team.goalsFor - team.goalsAgainst}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
