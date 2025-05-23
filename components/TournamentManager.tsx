
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

  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [goalsA, setGoalsA] = useState(0)
  const [goalsB, setGoalsB] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('tournament')
    if (stored) setTournament(JSON.parse(stored))
  }, [])

  const createTournament = () => {
    const newTournament: Tournament = {
      name: tournamentName,
      teams: [],
    }
    setTournament(newTournament)
    localStorage.setItem('tournament', JSON.stringify(newTournament))
    setTournamentName('')
  }

  const addTeam = () => {
    if (!tournament || !teamName.trim()) return
    const newTeam: Team = {
      name: teamName.trim(),
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

  const registerMatch = () => {
    if (!tournament || teamA === teamB || !teamA || !teamB) return

    const updatedTeams = tournament.teams.map((team) => {
      const isA = team.name === teamA
      const isB = team.name === teamB
      if (!isA && !isB) return team

      const goalsFor = isA ? goalsA : goalsB
      const goalsAgainst = isA ? goalsB : goalsA
      const won = goalsFor > goalsAgainst
      const drawn = goalsFor === goalsAgainst

      return {
        ...team,
        goalsFor: team.goalsFor + goalsFor,
        goalsAgainst: team.goalsAgainst + goalsAgainst,
        points: team.points + (won ? 3 : drawn ? 1 : 0),
      }
    })

    const updated = {
      ...tournament,
      teams: updatedTeams,
    }

    setTournament(updated)
    localStorage.setItem('tournament', JSON.stringify(updated))

    setTeamA('')
    setTeamB('')
    setGoalsA(0)
    setGoalsB(0)
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

          <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Registrar Partido</h3>
            <div className="flex gap-2 mb-2">
              <select value={teamA} onChange={(e) => setTeamA(e.target.value)} className="flex-1 border p-2 rounded">
                <option value="">Equipo A</option>
                {tournament.teams.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={goalsA}
                onChange={(e) => setGoalsA(Number(e.target.value))}
                className="w-16 text-center border rounded"
                placeholder="G"
              />
            </div>

            <div className="flex gap-2 mb-2">
              <select value={teamB} onChange={(e) => setTeamB(e.target.value)} className="flex-1 border p-2 rounded">
                <option value="">Equipo B</option>
                {tournament.teams.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={goalsB}
                onChange={(e) => setGoalsB(Number(e.target.value))}
                className="w-16 text-center border rounded"
                placeholder="G"
              />
            </div>

            <button
              onClick={registerMatch}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
            >
              Registrar Resultado
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
